#
# Copyright © 2020 Endless OS Foundation LLC.
#
# This file is part of hack-toy-apps
# (see https://github.com/endlessm/hack-toy-apps).
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
#
import gi
import json
import os
import sys
gi.require_version('Gdk', '3.0')  # nopep8
gi.require_version('Gtk', '3.0')  # nopep8
gi.require_version('WebKit2', '4.0')  # nopep8
from gi.repository import Gdk
from gi.repository import Gio
from gi.repository import GLib
from gi.repository import GObject
from gi.repository import Gtk
from gi.repository import WebKit2

from hackapps import HackableAppsManager
from soundserver import HackSoundServer
from gamestateservice import GameState
from clubhouse import Clubhouse
from system import Desktop

WebKit2.Settings.__gtype__
WebKit2.WebView.__gtype__

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))

TOY_APP_IFACE = '''
  <node>
    <interface name='com.hack_computer.Hackable'>
      <property name="Hackable" type="b" access="read"/>
    </interface>
  </node>
'''

def gtk_widget_fade_out(widget, duration_ms,
                        fade_out_finish_cb=None, *args, **kwargs):
    step_ms = 50
    elapsed_ms = 0
    initial_opacity = Gtk.Widget.get_opacity(widget)

    def do_fade_out():
        nonlocal elapsed_ms
        elapsed_ms += step_ms
        opacity = max(initial_opacity - elapsed_ms / duration_ms, 0)
        Gtk.Widget.set_opacity(widget, opacity)

        if elapsed_ms >= duration_ms:
            if fade_out_finish_cb:
                fade_out_finish_cb(*args, **kwargs)
            return False
        return True
    GLib.timeout_add(step_ms, do_fade_out)


def g_settings_has_key(settings, key):
    schema_source = Gio.SettingsSchemaSource.get_default()
    schema = schema_source.lookup(settings.props.schema_id, False)
    return key in schema.list_keys()


@Gtk.Template(filename=os.path.join(SCRIPT_PATH, 'app.ui'))
class ToyAppWindow(Gtk.ApplicationWindow):
    __gtype_name__ = "ToyAppWindow"

    overlay = Gtk.Template.Child()
    revealer = Gtk.Template.Child()
    splash = Gtk.Template.Child()
    view = Gtk.Template.Child()
    settings = Gtk.Template.Child()
    provider = None

    def __init__(self, application, metadata):
        super(ToyAppWindow, self).__init__()

        self.app = application
        self.app_id = application.get_application_id()
        app_info = Gio.DesktopAppInfo.new(self.app_id + '.desktop')
        decorated = metadata.get('decorated', True)
        hack_mode_properties = metadata.get('hack-mode-properties', {})
        self.show_topbar = hack_mode_properties.get('topbar', False)
        use_load_notify = metadata.get('use-load-notify', False)
        self._scale_content = metadata.get('scale-content', False)
        self._scale_design_width = metadata.get('scale-design-width', 1920)
        maximize = metadata.get('maximize', True)
        self._set_geometry_hints(metadata.get('geometry-hints'))

        self._played_async_sounds = {}
        self.connect('destroy', self._on_destroy)
        self.connect('size-allocate', self._on_size_changed)

        self.set_application(application)
        self.set_title(app_info.get_name())
        self.set_decorated(decorated)
        if self.app_id == "com.hack_computer.HackUnlock":
            Desktop.minimize_all()

        if maximize:
            self.maximize()

        self.topbar = ToyAppTopbar(self.app)
        self.topbar.props.no_show_all = True
        self.topbar.props.visible = self.show_topbar
        self.overlay.add_overlay(self.topbar)

        if GLib.getenv('TOY_APP_ENABLE_INSPECTOR'):
            self.settings.set_enable_developer_extras(True)
        else:
            # menu should only be visible when using the inspector
            self.view.connect('context-menu', self._on_context_menu)

        self._setup_splash()
        self._setup_js()

        # Check if toy app will notify us manually when it finished loading
        # otherwise we fallback to load-changed signal
        if not use_load_notify:
            self.view.connect('load-changed', self._on_view_load_changed)

        # Finally load html app index
        self.view.load_uri('file://%s/app/index.html' % SCRIPT_PATH)

    def _on_size_changed(self, window, allocation):
        if self._hints is not None and self._scale_content:
            self.view.set_zoom_level(allocation.width / self._scale_design_width)

    def _on_destroy(self, window):
        for sound_id in self._played_async_sounds:
            HackSoundServer.stop(self._played_async_sounds[sound_id])

    def _manager_add_msg_handler(self, manager, msg, callback, *args):
        manager.register_script_message_handler(msg)
        manager.connect('script-message-received::%s' % msg, callback, *args)

    def _setup_js(self):
        manager = self.view.get_user_content_manager()

        # Register message handlers
        self._manager_add_msg_handler(manager, 'ToyAppHideToolbox', self._on_hide_toolbox)
        self._manager_add_msg_handler(manager, 'ToyAppRequestState', self._on_request_state)
        self._manager_add_msg_handler(manager, 'ToyAppLoadNotify', self._on_load_notify)
        self._manager_add_msg_handler(manager, 'ToyAppSetHackable', self._on_set_hackable)
        self._manager_add_msg_handler(manager, 'ToyAppSetAspectRatio', self._on_set_aspect_ratio)
        self._manager_add_msg_handler(manager, 'ToyAppSaveState', self._on_save_state)
        self._manager_add_msg_handler(manager, 'ToyAppQuit', self._on_quit)
        self._manager_add_msg_handler(manager, 'ToyAppShowClubhouse', self._on_show_clubhouse)
        self._manager_add_msg_handler(manager, 'playSound', self._on_play_sound)
        self._manager_add_msg_handler(manager, 'playSoundAsync', self._on_play_sound_async)
        self._manager_add_msg_handler(manager, 'updateSound', self._on_update_sound)
        self._manager_add_msg_handler(manager, 'stopSound', self._on_stop_sound)
        self._manager_add_msg_handler(manager, 'terminateSound', self._on_stop_sound, True)

        # Inject custom JS on every page
        manager.add_script(
            WebKit2.UserScript.new(
                open(os.path.join(SCRIPT_PATH, 'app.js'), 'r').read(),
                WebKit2.UserContentInjectedFrames.TOP_FRAME,
                WebKit2.UserScriptInjectionTime.START,
                None,
                None
            )
        )

    def _setup_splash(self):
        # Check if we can use the splash screen as a temporary background while
        # the webview loads
        splash = Gio.File.new_for_path('/app/share/eos-shell-content/splash/%s.jpg' % self.app_id)

        if splash.query_exists():
            self.provider = Gtk.CssProvider()
            self.provider.load_from_data(bytes(
                """
toy-app-window,
toy-app-window > overlay > revealer > frame {
    background: white, url('%s') no-repeat center;
}
                """ % splash.get_path(), 'UTF8'))
            Gtk.StyleContext.add_provider_for_screen(
                Gdk.Screen.get_default(),
                self.provider,
                Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
            )
            self.revealer.set_reveal_child(True)
        else:
            self.revealer.hide()

    def _set_geometry_hints(self, hints):
        self._hints = None

        if hints is None:
            return

        h = Gdk.Geometry()
        mask = 0

        if 'min-width' in hints and 'min-height' in hints:
            h.min_width = hints['min-width']
            h.min_height = hints['min-height']
            mask |= Gdk.WindowHints.MIN_SIZE

        if 'max-width' in hints and 'max-height' in hints:
            h.max_width = hints['max-width']
            h.max_height = hints['max-height']
            mask |= Gdk.WindowHints.MAX_SIZE

        if 'base-width' in hints and 'base-height' in hints:
            h.base_width = hints['base-width']
            h.base_height = hints['base-height']
            mask |= Gdk.WindowHints.BASE_SIZE

        if 'width-inc' in hints and 'height-inc' in hints:
            h.width_inc = hints['width-inc']
            h.height_inc = hints['height-inc']
            mask |= Gdk.WindowHints.RESIZE_INC

        if 'min-aspect' in hints and 'max-aspect' in hints:
            h.min_aspect = hints['min-aspect']
            h.max_aspect = hints['max-aspect']
            mask |= Gdk.WindowHints.ASPECT

        self.set_geometry_hints(None, h, Gdk.WindowHints(mask))
        self._hints = h

    def _view_show(self):
        self.revealer.connect('notify::child-revealed', self._on_child_revealed)
        self.revealer.set_transition_type(Gtk.RevealerTransitionType.CROSSFADE)
        self.revealer.set_reveal_child(False)

    def _on_child_revealed(self, revealer, pspec):
        if not self.revealer.get_child_revealed():
            self.revealer.destroy()
            Gtk.StyleContext.remove_provider_for_screen(
                Gdk.Screen.get_default(),
                self.provider
            )
            if self.show_topbar:
                self.topbar.show()

    def _on_context_menu(self, webview, context, event, hit):
        return Gtk.true()

    def _on_request_state(self, manager, result):
        GameState.get('%s.State' % self.app_id, self._on_load_state_finish)

    def _on_hide_toolbox(self, manager, result):
        app = HackableAppsManager.get_hackable_app(self.app_id)
        if app:
            app.toolbox_visible = False

    def _on_load_notify(self, manager, result):
        self._view_show()

    def _on_set_hackable(self, manager, result):
        val = result.get_js_value()
        self.get_application().send_hackable(val.to_string() == 'true')

    def _on_set_aspect_ratio(self, manager, result):
        val = result.get_js_value()
        if val.is_undefined():
            raise ValueError('needs ratio argument')

        if not val.is_number():
            raise ValueError('ratio arg should be number')

        hint = Gdk.Geometry()
        hint.min_aspect = hint.max_aspect = val.to_double()
        self.set_geometry_hints(None, hint, Gdk.WindowHints.ASPECT)

    def _on_save_state(self, manager, result):
        val = result.get_js_value()
        if val.is_undefined():
            raise ValueError('needs state argument')

        if not val.is_string():
            raise ValueError('state arg should be string')

        GameState.set('%s.State' % self.app_id,
                      GLib.Variant('s', val.to_string()))

    def _on_quit(self, manager, result):
        val = result.get_js_value()
        if val.is_undefined():
            raise ValueError('needs ratio argument')

        if not val.is_number():
            raise ValueError('ratio arg should be number')

        fade_out_ms = val.to_double()

        if fade_out_ms == 0:
            self.app.quit()
        else:
            gtk_widget_fade_out(self, fade_out_ms, self.app.quit)

    def _on_show_clubhouse(self, manager, result):
        val = result.get_js_value()
        if val.is_undefined():
            raise ValueError('needs character argument')

        if not val.is_string():
            raise ValueError('character arg should be string')

        character_name = val.to_string()
        Clubhouse.show_clubhouse(character_name)

    def _on_load_state_finish(self, proxy, result, user_data):
        val = None;

        try:
            val = proxy.call_finish(result)
        except GLib.Error as err:
            if (Gio.dbus_error_get_remote_error(err) !=
                    'com.hack_computer.GameStateService.KeyError'):
                print("Error loading game state: %s" % err.message)

        if val is not None:
            json = GLib.strescape(val.unpack()[0])
            js = 'if(typeof loadState === "function"){loadState(JSON.parse("%s"));}' % json
            self.view.run_javascript(js);
        else:
            self.view.run_javascript('if(typeof loadState === "function"){loadState();}')

        Clubhouse.property_connect('RunningQuest', self._on_running_quest_change)

    def _on_running_quest_change(self, new_value):
        self.view.run_javascript(f'ToyApp.runningQuest = "{new_value}";')
        js = 'if(typeof runningQuestChanged === "function"){runningQuestChanged();}'
        self.view.run_javascript(js)

    def _on_view_load_changed(self, view, event):
        if event == WebKit2.LoadEvent.FINISHED:
            self._view_show()
            GameState.get('%s.State' % self.app_id, self._on_load_state_finish)

    def _on_play_sound(self, manager, result):
        val = result.get_js_value()
        if not val.is_string():
            raise ValueError('arg should be string')
        HackSoundServer.play(val.to_string())

    def _on_play_sound_async(self, manager, result):
        val = result.get_js_value()
        if not val.is_string():
            raise ValueError('arg should be string')
        HackSoundServer.play(val.to_string(), user_data=val.to_string(),
                             result_handler=self._on_play_sound_finish)

    def _on_play_sound_finish(self, proxy, result, sound_id):
        if isinstance(result, Exception):
            raise result
        # be sure to stop the previous one so we don't lose track of it
        uuid = self._played_async_sounds.get(sound_id, None)
        if uuid is not None:
            HackSoundServer.stop(uuid)
        self._played_async_sounds[sound_id] = result

    def _on_stop_sound(self, manager, result, terminate=False):
        val = result.get_js_value()
        if not val.is_string():
            raise ValueError('arg should be string')
        uuid = self._played_async_sounds.get(val.to_string(), None)
        if uuid is None:
            return
        if terminate:
            HackSoundServer.terminate(uuid)
        else:
            HackSoundServer.stop(uuid)
        del self._played_async_sounds[val.to_string()]

    def _on_update_sound(self, manager, result):
        val = result.get_js_value()
        if (not val.is_array() or
                val.object_get_property('length').to_int32() != 3):
            raise ValueError('there should be 3 args')
        id_val = val.object_get_property_at_index(0)
        time_ms_val = val.object_get_property_at_index(1)
        props_val = val.object_get_property_at_index(2)
        if not id_val.is_string():
            raise ValueError('first arg should be string')
        if not time_ms_val.is_number():
            raise ValueError('second arg should be number')
        if not props_val.is_object():
            raise ValueError('third arg should be dict')

        props = {}
        if props_val.object_has_property('volume'):
            volume_val = props_val.object_get_property('volume')
            if not volume_val.is_number():
                raise ValueError('volume should be number')
            props['volume'] = GLib.Variant('d', volume_val.to_double())
        if props_val.object_has_property('rate'):
            rate_val = props_val.object_get_property('rate')
            if not rate_val.is_number():
                raise ValueError('rate should be number')
            props['rate'] = GLib.Variant('d', rate_val.to_double())

        try:
            uuid = self._played_async_sounds[id_val.to_string()]
        except KeyError:
            return  # sound did not exist, or already stopped
        HackSoundServer.update_properties(uuid, time_ms_val.to_int32(), props)


ToyAppWindow.set_css_name('toy-app-window')


@Gtk.Template(filename=os.path.join(SCRIPT_PATH, 'topbar.ui'))
class ToyAppTopbar(Gtk.EventBox):
    __gtype_name__ = "ToyAppTopbar"

    def __init__(self, application):
        super(ToyAppTopbar, self).__init__()
        self.app = application
        self._style()

    def _style(self):
        css = b'ToyAppTopbar { background-color: rgba(6, 20, 39, 0.80); }'
        provider = Gtk.CssProvider()
        provider.load_from_data(css)
        self.get_style_context().add_provider(
            provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )

    @Gtk.Template.Callback()
    def _on_close_button_clicked(self, button):
        self.app.quit()


ToyAppTopbar.set_css_name('ToyAppTopbar')


class Application(Gtk.Application):
    _hack_proxy = None
    _HACK_DBUS = 'com.hack_computer.hack'
    _HACK_OBJECT_PATH = '/com/hack_computer/hack'

    def __init__(self, application_id):
        super().__init__(application_id=application_id)
        self._window = None
        self._hackable = True

        self._gtk_settings = Gtk.Settings.get_default()
        self._gtk_settings.props.gtk_application_prefer_dark_theme = True

    def _setup_actions(self):
        flip = Gio.SimpleAction(name='flip',
                                parameter_type=GLib.VariantType('b'))
        flip.connect('activate', self._flip_action_activated_cb)
        self.add_action(flip)

        reset = Gio.SimpleAction(name='reset', parameter_type=None)
        reset.connect('activate', self._reset_action_activated_cb)
        self.add_action(reset)

        quit = Gio.SimpleAction(name='quit')
        quit.connect('activate', self._quit_action_activated_cb)
        self.add_action(quit)

    def _on_flip_js_finished(self, view, result):
        retval = view.run_javascript_finish(result).get_js_value()
        app_id = self.props.application_id
        if self._window.show_topbar and app_id == "com.hack_computer.HackUnlock":
            # globalParameters.mode is 0 when in first screen and puzzle is not
            # solved
            if retval.to_double() == 0.0:
                self._window.topbar.show()
            else:
                self._window.topbar.hide()

    def _flip_action_activated_cb(self, action, param):
        js = 'if(typeof flip !== "undefined"){flip();}; globalParameters.mode'
        self._window.view.run_javascript(js, None, self._on_flip_js_finished)

    def _reset_action_activated_cb(self, action, param):
        self._window.view.run_javascript('if(typeof reset !== "undefined"){reset();}')

    def _quit_action_activated_cb(self, action, param):
        self.quit()

    def _window_destroy_cb(self, window):
        self._window = None

    def do_startup(self):
        Gtk.Application.do_startup(self)
        self._setup_actions()

        try:
            with open(os.path.join(SCRIPT_PATH, 'metadata.json')) as metadata_file:
                self._metadata = json.load(metadata_file)
        except IOError:
            self._metadata = {}

    def do_activate(self):
        if not self._window:
            self._window = ToyAppWindow(self, self._metadata)
            self._window.connect('destroy', self._window_destroy_cb)
            self._window.show_all()
        self._window.present()

    def do_dbus_register(self, connection, path):
        introspection_data = Gio.DBusNodeInfo.new_for_xml(TOY_APP_IFACE)
        connection.register_object(path,
                                   introspection_data.interfaces[0],
                                   None,
                                   self._on_get_property)
        return Gtk.Application.do_dbus_register(self, connection, path)

    def _on_get_property(self, connection, sender, object_path, interface, key):
        if key == 'Hackable':
            return GLib.Variant('b', self._hackable)
        return None

    def send_hackable(self, hackable):
        if hackable == self._hackable:
            return

        self._hackable = hackable
        changed_props = {'Hackable': GLib.Variant('b', self._hackable)}
        variant = GLib.Variant.new_tuple(GLib.Variant('s', 'com.hack_computer.Hackable'),
                                         GLib.Variant('a{sv}', changed_props),
                                         GLib.Variant('as', []))
        self.get_dbus_connection().emit_signal(None,
                                               self.get_dbus_object_path(),
                                               'org.freedesktop.DBus.Properties',
                                               'PropertiesChanged',
                                               variant)

    @classmethod
    def _get_hack_properties_proxy(klass):
        if klass._hack_proxy is None:
            klass._hack_proxy = Gio.DBusProxy.new_for_bus_sync(
                Gio.BusType.SESSION,
                0,
                None,
                klass._HACK_DBUS,
                klass._HACK_OBJECT_PATH,
                'org.freedesktop.DBus.Properties',
                None,
            )

        return klass._hack_proxy

    @classmethod
    def get_hack_property(klass, prop_name):
        variant = GLib.Variant('(ss)', (klass._HACK_DBUS, prop_name))
        value = klass._get_hack_properties_proxy().call_sync('Get', variant,
                                                             Gio.DBusCallFlags.NONE, -1, None)
        if value is None:
            print(f"Failed to get '{prop_name}' property from {klass._HACK_DBUS}")
            return None
        return value.unpack()[0]


if __name__ == "__main__":
    # argv is /path/to/script.py $APP_ID $ARGUMENTS, but
    # we can't pass sys.argv[2:] directly since GApplication.run()
    # expects argv[0] to be the program name
    args = sys.argv[2:]
    args.insert(0, sys.argv[0])
    app = Application(sys.argv[1])
    app.run(args)
