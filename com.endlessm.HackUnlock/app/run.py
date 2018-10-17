#!/bin/env python3

import gi, os, sys
gi.require_version('Gtk', '3.0')
#gi.require_version('WebtKit2', '4.0')
from gi.repository import Gio, Gtk, GLib, WebKit2

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))

WELCOME_APP_NAME = 'com.endlessm.WelcomeApp'
WELCOME_APP_PATH = '/com/endlessm/WelcomeApp'
WELCOME_APP_IFACE = WELCOME_APP_NAME

WelcomeAppIface = ('<node>'
                   '<interface name="com.endlessm.WelcomeApp">'
                   '<method name="RunApp">'
                   '</method>'
                   '<property name="Finished" type="b" access="read"/>'
                   '</interface>'
                   '</node>')


class View(WebKit2.WebView):

    def __init__(self):
        WebKit2.WebView.__init__(self)
        settings = self.get_settings()
        settings.set_enable_webgl(True)
        settings.set_enable_accelerated_2d_canvas(True)
        settings.set_allow_universal_access_from_file_urls(True)
        settings.set_enable_write_console_messages_to_stdout(True)


class Application(Gtk.Application):

    APP_HTML = 'unlock'

    def __init__(self):
        super().__init__(application_id="com.endlessm.WelcomeApp")
        self._is_finished = False
        self._invocations = []

    def _setup_ui(self):
        view = View()
        view.load_uri('file://%s/index.html' % SCRIPT_PATH)

        self.window = Gtk.ApplicationWindow()
        self.window.set_application(self)
        self.window.maximize()
        self.window.add(view)

        self.add_window(self.window)

    def do_activate(self):
        Gtk.Application.do_activate(self)
        self.window.show_all()

    def do_startup (self):
        Gtk.Application.do_startup(self)
        self._setup_ui()

    def handle_method_call(self, connection, sender, object_path, interface_name,
                           method_name, parameters, invocation):
        args = parameters.unpack()
        if not hasattr(self, method_name):
            invocation.return_dbus_error("org.gtk.GDBus.Failed",
                                         "This method is not implemented")
            return

        getattr(self, method_name)(invocation, *args)

    def handle_get_property(self, connection, sender, object_path,
                            interface, key):
        if key == 'Finished':
            return GLib.Variant('b', self._is_finished)
        return None

    def do_dbus_register(self, connection, path):
        self._dbus_connection = connection

        introspection_data = Gio.DBusNodeInfo.new_for_xml(WelcomeAppIface)
        connection.register_object(path,
                                   introspection_data.interfaces[0],
                                   self.handle_method_call,
                                   self.handle_get_property)
        return Gtk.Application.do_dbus_register(self, connection, path)

    def _set_finish(self):
        self._is_finished = True
        changed_props = {'Finished': GLib.Variant('b', self._is_finished)}
        variant = GLib.Variant.new_tuple(GLib.Variant('s', WELCOME_APP_IFACE),
                                         GLib.Variant('a{sv}', changed_props),
                                         GLib.Variant('as', []))
        self._dbus_connection.emit_signal(None,
                                          WELCOME_APP_PATH,
                                          'org.freedesktop.DBus.Properties',
                                          'PropertiesChanged',
                                          variant)

    def on_quit(self, action, param):
        for invocation in self._invocations:
            invocation.return_value(None)
        self._invocations = []
        self.quit()

    def RunApp(self, invocation):
        self._invocations.append(invocation)
        self.activate()


if __name__ == "__main__":
    app = Application()
    app.run()
