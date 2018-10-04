import gi, os
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, WebKit2

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))

class View(WebKit2.WebView):

    def __init__(self):
        WebKit2.WebView.__init__(self)
        settings = self.get_settings()
        settings.set_enable_webgl(True)
        settings.set_enable_accelerated_2d_canvas(True)
        settings.set_allow_universal_access_from_file_urls(True)
        settings.set_enable_write_console_messages_to_stdout(True)


class Application(Gtk.Application):

    def __init__(self):
        super().__init__(application_id="com.endlessm.Webview")

    def _setup_ui(self):
        view = View()
        view.load_uri('file://%s/index.html' % SCRIPT_PATH)

        window = Gtk.ApplicationWindow()
        window.set_application(self)
        window.maximize()
        window.add(view)
        window.show_all()

        self.add_window(window)

    def do_activate(self):
        self._setup_ui()


if __name__ == "__main__":
    app = Application()
    app.run()
