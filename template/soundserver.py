import logging
from gi.repository import Gio
from gi.repository import GLib
from gi.repository import GObject


_logger = logging.getLogger(__name__)


class HackSoundServer(GObject.GObject):
    def __init__(self):
        self._proxy = \
            Gio.DBusProxy.new_for_bus_sync(Gio.BusType.SESSION,
                                           0,
                                           None,
                                           'com.endlessm.HackSoundServer',
                                           '/com/endlessm/HackSoundServer',
                                           'com.endlessm.HackSoundServer',
                                           None)

    def play(self, sound_event_id, result_handler=None, user_data=None):
        """
        Plays a sound asynchronously.
        By default, it "fires and forgets": no return value.

        Args:
            sound_event_id (str): The sound event id to play.

        Optional keyword arguments:
            result_handler: A function that is invoked when the async call
                finishes. The function's arguments are the following:
                proxy_object, result and user_data.
            data: The user data passed to the result_handler function.
        """
        self._play(sound_event_id, result_handler=result_handler,
                   user_data=user_data)

    def play_sync(self, sound_event_id):
        """
        Plays a sound synchronously.

        Args:
            sound_event_id (str): The sound event id to play.

        Returns:
            str: The uuid of the new played sound.
        """
        return self._play(sound_event_id, async=False)

    def _play(self, sound_event_id, async=True, result_handler=None,
              user_data=None):
        if result_handler is None:
            result_handler = self.__black_hole
        try:
            if async:
                self._proxy.PlaySound("(s)", sound_event_id,
                                      result_handler=result_handler,
                                      user_data=user_data)
            else:
                return self._proxy.PlaySound("(s)", sound_event_id)
        except GLib.Error as err:
            _logger.error("Error playing sound '%s'" % sound_event_id)

    def stop(self, uuid, result_handler=None, user_data=None):
        """
        Stops a sound asynchronously.

        Args:
            sound_event_id (str): The sound event id to play.

        Optional keyword arguments:
            result_handler: A function that is invoked when the async call
                finishes. The function's arguments are the following:
                proxy_object, result and user_data.
            data: The user data passed to the result_handler function.
        """
        if result_handler is None:
            result_handler = self.__black_hole
        try:
            self._proxy.StopSound("(s)", uuid, result_handler=result_handler,
                                  user_data=user_data)
        except GLib.Error as err:
            _logger.error("Error stopping sound '%s'" % uuid)

    @classmethod
    def __black_hole(cls, proxy, result, user_data=None):
        pass
