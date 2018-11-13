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

import soundserver

WebKit2.Settings.__gtype__
WebKit2.WebView.__gtype__

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))

@Gtk.Template(filename=os.path.join(SCRIPT_PATH, 'app.ui'))
class ToyAppWindow(Gtk.ApplicationWindow):
    __gtype_name__ = "ToyAppWindow"

    stack = Gtk.Template.Child()
    splash = Gtk.Template.Child()
    view = Gtk.Template.Child()
    settings = Gtk.Template.Child()

    def __init__(self, application, metadata):
        super(ToyAppWindow, self).__init__()

        app_id = application.get_application_id()
        app_info = Gio.DesktopAppInfo.new(app_id + '.desktop')
        decorated = metadata.get('decorated', True)
        use_load_notify = metadata.get('use-load-notify', False)

        self._sounds = soundserver.HackSoundServer()

        self.set_application(application)
        self.set_title(app_info.get_name())
        self.set_decorated(decorated)
        self.maximize()

        if GLib.getenv('TOY_APP_ENABLE_INSPECTOR'):
            self.settings.set_enable_developer_extras(True)

        self._setup_splash(app_id)
        self._setup_js()

        # Check if toy app will notify us manually when it finished loading
        # otherwise we fallback to load-changed signal
        if not use_load_notify:
            self.view.connect('load-changed', self._on_view_load_changed)

        # Disable right click context menu!
        self.view.connect('context-menu', Gtk.true)

        # Finally load html app index
        self.view.load_uri('file://%s/app/index.html' % SCRIPT_PATH)

    def _setup_js(self):
        manager = self.view.get_user_content_manager()

        # Register message hanlders
        manager.register_script_message_handler("ToyAppLoadNotify")
        manager.register_script_message_handler('playSound')
        manager.register_script_message_handler('playSoundAsync')
        manager.register_script_message_handler('stopSound')

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

        manager.connect('script-message-received::ToyAppLoadNotify',
                        self._on_load_notify)
        manager.connect('script-message-received::playSound',
                        self._on_play_sound)
        manager.connect('script-message-received::playSoundAsync',
                        self._on_play_sound_async)
        manager.connect('script-message-received::stopSound',
                        self._on_stop_sound)

    def _setup_splash(self, app_id):
        # Check if we can use the splash screen as a temporary background while
        # the webview loads
        splash = Gio.File.new_for_path('/app/share/eos-shell-content/splash/%s.jpg' % app_id)

        if splash.query_exists():
            provider = Gtk.CssProvider()
            provider.load_from_data(bytes(
                """
toy-app-window > stack > frame {
    background: white, url('%s') no-repeat center;
}
                """ % splash.get_path(), 'UTF8'))
            Gtk.StyleContext.add_provider_for_screen(
                Gdk.Screen.get_default(),
                provider,
                Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
            )
            self.stack.set_visible_child(self.splash)
        else:
            self.stack.set_visible_child(self.view)

    def _view_show(self):
        self.stack.set_visible_child(self.view)

    def _on_load_notify(self, manager, result):
        self._view_show()

    def _on_view_load_changed(self, view, event):
        if event == WebKit2.LoadEvent.FINISHED:
            self._view_show()

    def _on_play_sound(self, manager, result):
        val = result.get_js_value()
        if not val.is_string():
            raise ValueError('arg should be string')
        self._sounds.play(val.to_string())

    def _on_play_sound_async(self, manager, result):
        val = result.get_js_value()
        if not val.is_array():
            raise ValueError('value should be array')
        idval = val.object_get_property_at_index(0)
        if not idval.is_string():
            raise ValueError('first arg should be string')
        cbval = val.object_get_property_at_index(1)
        if not cbval.is_string():
            raise ValueError('second arg should be string')
        self._sounds.play(idval.to_string(), user_data=cbval.to_string(),
                          result_handler=self._on_play_sound_finish)

    def _on_play_sound_finish(self, proxy, result, cbcode):
        if isinstance(result, Exception):
            self.run_javascript('({})(null, {});'.format(cbcode, str(result)))
        else:
            self.run_javascript('({})("{}");'.format(cbcode, result))

    def _on_stop_sound(self, manager, result):
        val = result.get_js_value()
        if not val.is_string():
            raise ValueError('arg should be string')
        self._sounds.stop(val.to_string())


class Application(Gtk.Application):

    def __init__(self, application_id):
        super().__init__(application_id=application_id)
        self._window = None

    def _setup_actions(self):
        flip = Gio.SimpleAction(name='flip',
                                parameter_type=GLib.VariantType('b'))
        flip.connect('activate', self._flip_action_activated_cb)
        self.add_action(flip)

        quit = Gio.SimpleAction(name='quit')
        quit.connect('activate', self._quit_action_activated_cb)
        self.add_action(quit)

    def _flip_action_activated_cb(self, action, param):
        self._window.view.run_javascript('if(typeof flip !== "undefined"){flip();}');

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


if __name__ == "__main__":
    # argv is /path/to/script.py $APP_ID $ARGUMENTS, but
    # we can't pass sys.argv[2:] directly since GApplication.run()
    # expects argv[0] to be the program name
    args = sys.argv[2:]
    args.insert(0, sys.argv[0])
    app = Application(sys.argv[1])
    app.run(args)
