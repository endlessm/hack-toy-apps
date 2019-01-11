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
from gi.repository import Gtk
from gi.repository import WebKit2

from soundserver import HackSoundServer
from gamestateservice import GameStateService

WebKit2.Settings.__gtype__
WebKit2.WebView.__gtype__

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))

TOY_APP_IFACE = '''
  <node>
    <interface name='com.endlessm.Hackable'>
      <property name="Hackable" type="b" access="read"/>
    </interface>
  </node>
'''


@Gtk.Template(filename=os.path.join(SCRIPT_PATH, 'app.ui'))
class ToyAppWindow(Gtk.ApplicationWindow):
    __gtype_name__ = "ToyAppWindow"

    revealer = Gtk.Template.Child()
    splash = Gtk.Template.Child()
    view = Gtk.Template.Child()
    settings = Gtk.Template.Child()

    def __init__(self, application, metadata):
        super(ToyAppWindow, self).__init__()

        app_id = application.get_application_id()
        app_info = Gio.DesktopAppInfo.new(app_id + '.desktop')
        decorated = metadata.get('decorated', True)
        use_load_notify = metadata.get('use-load-notify', False)

        self._played_async_sounds = {}
        self.connect('destroy', self._on_destroy)

        self.set_application(application)
        self.set_title(app_info.get_name())
        self.set_decorated(decorated)
        self.maximize()

        if GLib.getenv('TOY_APP_ENABLE_INSPECTOR'):
            self.settings.set_enable_developer_extras(True)
        else:
            # menu should only be visible when using the inspector
            self.view.connect('context-menu', self._on_context_menu)

        self._setup_splash(app_id)
        self._setup_js()

        # Check if toy app will notify us manually when it finished loading
        # otherwise we fallback to load-changed signal
        if not use_load_notify:
            self.view.connect('load-changed', self._on_view_load_changed)

        # Finally load html app index
        self.view.load_uri('file://%s/app/index.html' % SCRIPT_PATH)

    def _on_destroy(self, window):
        for sound_id in self._played_async_sounds:
            HackSoundServer.stop(self._played_async_sounds[sound_id])

    def _manager_add_msg_handler(self, manager, msg, callback):
        manager.register_script_message_handler(msg)
        manager.connect('script-message-received::%s' % msg, callback)

    def _setup_js(self):
        manager = self.view.get_user_content_manager()

        # Register message handlers

        self._manager_add_msg_handler(manager, 'ToyAppLoadNotify', self._on_load_notify)
        self._manager_add_msg_handler(manager, 'ToyAppSetHackable', self._on_set_hackable)
        # hack-sound-server
        self._manager_add_msg_handler(manager, 'playSound', self._on_play_sound)
        self._manager_add_msg_handler(manager, 'playSoundAsync', self._on_play_sound_async)
        self._manager_add_msg_handler(manager, 'updateSound', self._on_update_sound)
        self._manager_add_msg_handler(manager, 'stopSound', self._on_stop_sound)
        # hack-game-state-service
        self._manager_add_msg_handler(manager, 'someLockscreenActive',
            self._on_some_lockscreen_active)

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

    def _setup_splash(self, app_id):
        # Check if we can use the splash screen as a temporary background while
        # the webview loads
        splash = Gio.File.new_for_path('/app/share/eos-shell-content/splash/%s.jpg' % app_id)

        if splash.query_exists():
            provider = Gtk.CssProvider()
            provider.load_from_data(bytes(
                """
toy-app-window,
toy-app-window > overlay > revealer > frame {
    background: white, url('%s') no-repeat center;
}
                """ % splash.get_path(), 'UTF8'))
            Gtk.StyleContext.add_provider_for_screen(
                Gdk.Screen.get_default(),
                provider,
                Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
            )
            self.revealer.set_reveal_child(True)
        else:
            self.revealer.hide()

    def _view_show(self):
        self.revealer.connect('notify::child-revealed', self._on_child_revealed)
        self.revealer.set_transition_type(Gtk.RevealerTransitionType.CROSSFADE)
        self.revealer.set_reveal_child(False)

    def _on_child_revealed(self, revealer, pspec):
        if not self.revealer.get_child_revealed():
            self.revealer.destroy()

    def _on_context_menu(self, webview, context, event, hit):
        return Gtk.true()

    def _on_load_notify(self, manager, result):
        self._view_show()

    def _on_set_hackable(self, manager, result):
        val = result.get_js_value()
        self.get_application().send_hackable(val.to_string() == 'true')

    def _on_view_load_changed(self, view, event):
        if event == WebKit2.LoadEvent.FINISHED:
            self._view_show()

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

    def _on_some_lockscreen_active(self, manager, result):
        val = result.get_js_value()
        if not val.is_array():
            raise ValueError('arg should be array')
        length = val.object_get_property('length').to_int32()

        active = False
        for i in range(length):
            js_strval = val.object_get_property_at_index(i)
            if not js_strval.is_string():
                raise ValueError('array item at pos %d should be string' % i)
            strval = js_strval.to_string()
            try:
                active = bool(GameStateService().get(strval))
            except:
                active = False
            if active:
                break
        template = 'gameState.someLockscreenActive = {};'
        self.view.run_javascript(template.format(str(active).lower()))

    def _on_stop_sound(self, manager, result):
        val = result.get_js_value()
        if not val.is_string():
            raise ValueError('arg should be string')
        uuid = self._played_async_sounds.get(val.to_string(), None)
        if uuid is None:
            return
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

class Application(Gtk.Application):

    def __init__(self, application_id):
        super().__init__(application_id=application_id)
        self._window = None
        self._hackable = True

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

    def _flip_action_activated_cb(self, action, param):
        self._window.view.run_javascript('if(typeof flip !== "undefined"){flip();}');

    def _reset_action_activated_cb(self, action, param):
        self._window.view.run_javascript('if(typeof reset !== "undefined"){reset();}')

    def _quit_action_activated_cb(self, action, param):
        self.quit()

    def _window_destroy_cb(self, window):
        self._window = None

    def do_startup(self):
        Gtk.Application.do_startup(self)
        self._setup_actions()

        provider = Gtk.CssProvider()
        provider.load_from_path(os.path.join(SCRIPT_PATH, 'app.css'))
        Gtk.StyleContext.add_provider_for_screen(
            Gdk.Screen.get_default(),
            provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )

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
        variant = GLib.Variant.new_tuple(GLib.Variant('s', 'com.endlessm.Hackable'),
                                         GLib.Variant('a{sv}', changed_props),
                                         GLib.Variant('as', []))
        self.get_dbus_connection().emit_signal(None,
                                               self.get_dbus_object_path(),
                                               'org.freedesktop.DBus.Properties',
                                               'PropertiesChanged',
                                               variant)


if __name__ == "__main__":
    # argv is /path/to/script.py $APP_ID $ARGUMENTS, but
    # we can't pass sys.argv[2:] directly since GApplication.run()
    # expects argv[0] to be the program name
    args = sys.argv[2:]
    args.insert(0, sys.argv[0])
    app = Application(sys.argv[1])
    app.run(args)
