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

_logger = logging.getLogger(__name__)

class GameStateService:

    proxy = None

    def __init__(self):
        self.proxy = Gio.DBusProxy.new_for_bus_sync(
                Gio.BusType.SESSION, 0, None,
                'com.hack_computer.GameStateService',
                '/com/hack_computer/GameStateService',
                'com.hack_computer.GameStateService',
                None)

    def _ignore_cb(self, _proxy, _result, user_data=None):
        pass

    def set(self, key, value):
        """
        Save a key/value pair in the Game State Service.

        Args:
            key (str): The key to save.
            value (GLib.Variant): The value to store.
        """
        try:
            self.proxy.call('Set', GLib.Variant('(sv)', [key, value]), 0, -1,
                            None, self._ignore_cb, None)
        except GLib.Error as err:
            _logger.error("Error setting '%s' value: %s", key, err.message)


    def get(self, key, result_handler=None, user_data=None):
        """
        Get a value from the Game State Service.

        Args:
            key (str): The key to get.

        Returns:
            GLib.Variant: The value of key.
        """
        if result_handler is None:
            result_handler = self._ignore_cb
        try:
            self.proxy.call('Get', GLib.Variant('(s)', [key]), 0, -1, None,
                            result_handler, user_data)
        except GLib.Error as err:
            _logger.error("Error getting '%s' value: %s", key, err.message)

GameState = GameStateService()
