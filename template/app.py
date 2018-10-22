import gi
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

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))


class View(WebKit2.WebView):

    def __init__(self):
        WebKit2.WebView.__init__(self)
        settings = self.get_settings()
        settings.set_enable_webgl(True)
        settings.set_enable_accelerated_2d_canvas(True)
        settings.set_allow_universal_access_from_file_urls(True)
        settings.set_enable_write_console_messages_to_stdout(True)
        if GLib.getenv('TOY_APP_ENABLE_INSPECTOR'):
            settings.set_enable_developer_extras(True)
        self.load_uri('file://%s/app/index.html' % SCRIPT_PATH)
        self.set_name('view')


class Application(Gtk.Application):

    def __init__(self, application_id):
        super().__init__(application_id=application_id)
        self._window = None
        self._application_id = application_id

    def _get_app_name(self):
        info = Gio.DesktopAppInfo.new(self._application_id + '.desktop')
        return info.get_name()

    def _setup_ui(self):
        builder = Gtk.Builder()
        builder.add_from_file(os.path.join(SCRIPT_PATH, 'app.ui'))

        self._view = View()
        self._view.props.expand = True

        container = builder.get_object('game_container')
        container.add(self._view)

        self._window = builder.get_object('app_window')
        self._window.set_application(self)
        self._window.set_title(self._get_app_name())
        self._window.maximize()
        self._window.show_all()

    def _setup_actions(self):
        flip = Gio.SimpleAction(name='flip',
                                parameter_type=GLib.VariantType('b'))
        flip.connect('activate', self._flip_action_activated_cb)
        self.add_action(flip)

        quit = Gio.SimpleAction(name='quit')
        quit.connect('activate', self._quit_action_activated_cb)
        self.add_action(quit)

    def _flip_action_activated_cb(self, action, param):
        self._view.run_javascript('if(typeof flip !== "undefined"){flip();}');

    def _quit_action_activated_cb(self, action, param):
        self.quit()

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

    def do_activate(self):
        if not self._window:
            self._setup_ui()
        self._window.present()


if __name__ == "__main__":
    app = Application(sys.argv[1])
    app.run()
