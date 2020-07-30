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

import logging

from gi.repository import Gio
from gi.repository import GLib
from gi.repository import GObject

logger = logging.getLogger(__name__)


class Clubhouse(GObject.Object):
    _INTERFACE_NAME = 'com.hack_computer.Clubhouse'
    _DBUS_PATH = '/' + _INTERFACE_NAME.replace('.', '/')
    _proxy = None
    _action_group = None

    @classmethod
    def get_proxy_async(klass, callback, *callback_args):
        def _on_proxy_ready(proxy, result):
            try:
                klass._proxy = proxy.new_finish(result)
            except GLib.Error as e:
                logger.warning("Error: Failed to get Clubhouse proxy:", e.message)
                return

            callback(klass._proxy, *callback_args)

        if klass._proxy is None:
            Gio.DBusProxy.new_for_bus(Gio.BusType.SESSION,
                                      0,
                                      None,
                                      klass._INTERFACE_NAME,
                                      klass._DBUS_PATH,
                                      klass._INTERFACE_NAME,
                                      None,
                                      _on_proxy_ready)
        else:
            callback(klass._proxy, *callback_args)

    @classmethod
    def get_action_group(klass):
        if klass._action_group is None:
            bus = Gio.bus_get_sync(Gio.BusType.SESSION, None)
            klass._action_group = Gio.DBusActionGroup.get(
                bus, klass._INTERFACE_NAME,
                klass._DBUS_PATH)
            klass._action_group.list_actions()
        return klass._action_group

    @classmethod
    def show_clubhouse(klass, character_name):
        action_group = klass.get_action_group()
        variant = GLib.Variant('s', character_name)
        action_group.activate_action('show-character', variant)

    @classmethod
    def property_connect(klass, prop_name, callback, *args):
        def _props_changed_cb(_proxy, changed_properties, _invalidated, *args):
            changed_properties_dict = changed_properties.unpack()
            if prop_name in changed_properties_dict:
                new_value = changed_properties_dict.get(prop_name)
                callback(new_value, *args)

        def _proxy_ready(proxy):
            prop = proxy.get_cached_property(prop_name)
            if prop is not None:
                callback(prop.unpack(), *args)
            proxy.connect('g-properties-changed', _props_changed_cb, *args)

        klass.get_proxy_async(_proxy_ready)
