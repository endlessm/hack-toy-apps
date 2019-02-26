/**
 * player
 *
 * Plays an audio according to the given link
 *
 * @param   {Object} options - the audio object with settings
 * @return  {Object} a collection of functions to control the background audio
 */
UI.player = function(options) {
  /** @var {Object} */
  var settings = {};
  /** @var {Object} __audio - the audio object to manipulate in JavaScript */
  var __audio = new Audio();
  /** @var {Mixed} __timer - the setTimeout id for the delay*/
  var __timer;
  /** @var {Mixed} defaults */
  var defaults = {
    /** @property {String} - the audio source path */
    src: "",
    /** @property {Number} - the amount of volume of the audio */
    volume: 100,
    /** @property {Bool} - set the audio in a loop */
    loop: false,
    /** @property {Bool} - autoplay at startup */
    autoplay: false,
    /** @property {Number} - add delay to playback */
    delay: 0,
    /** @property {Function} onended - */
    onended: $.noop
  };

  var _fadeOutAudio, _fadeInAudio;

  /**
   * Setup the Background_sound
   *
   * @return void
   */
  var __init = function() {
    settings = $.extend(true, defaults, options);

    if (settings.src !== "") {
      __audio.src = settings.src;
      __audio.load();
      __audio.loop = settings.loop;
      __setvolume();

      if (settings.autoplay) {
        __playback = __audio.play();
      }
    }
  };

  var __setvolume = function(volume) {
    volume = volume || settings.volume;
    return (__audio.volume = volume * 0.01);
  };

  __init();

  /**
   * Onended handler
   */
  __audio.onended = function() {
    settings.onended();
    clearTimeout(__timer);
  }

  return {
    /**
     * Stop playback and rewind
     *
     * @return void
     */
    stop: function() {
      __audio.pause();
      __audio.currentTime = 0;
    },

    /**
     * Play Audio
     *
     * @return void
     */
    play: function() {
      __timer = setTimeout(function() {
        __audio.play();
      }, settings.delay);
    },

    /**
     * Defines the volume of the audio
     *
     * @param {int} volume
     * @return The volume property
     */
    volume: function(volume) {
      clearInterval(this._fadeOutAudio);
      return __setvolume(volume);
    },

    /**
     * Defines the volume of the audio
     *
     * @param {int} volume
     * @return The volume property
     */
    mute: function() {
      if (__audio.volume <= 0) {
        return __setvolume();
      } else {
        return (__audio.volume = 0);
      }
    },

    fadeInAudio: function() {
      var InT = 0;
      var setvolume = settings.volume * 0.01;
      var speed = 0.04;
      __audio.volume = InT;
      var self = this;
      clearInterval(this._fadeInAudio);
      this._fadeInAudio = setInterval(function() {
        InT += speed;

        if (InT >= setvolume) {
          InT = setvolume;
        } else if (InT >= 1) {
          InT = setvolume;
        }

        __audio.volume = InT.toFixed(1);

        if (InT.toFixed(1) >= setvolume) {
          clearInterval(self._fadeInAudio);
        }
      }, 50);
    },

    fadeOutAudio: function() {
      var InT = 0.75;
      var setvolume = 0;
      var speed = 0.04;
      __audio.volume = InT;
      var self = this;
      clearInterval(self._fadeOutAudio);
      this._fadeOutAudio = setInterval(function() {
        InT -= speed;
        if (InT <= 0) {
          InT = 0;
        }
        __audio.volume = InT.toFixed(1);

        if (InT.toFixed(1) <= setvolume) {
          clearInterval(self._fadeOutAudio);
        }
      }, 50);
    }
  };
};

// background sound
UI.whole = UI.player({
  src: "sounds/system-whole.wav",
  loop: true,
  autoplay: true,
  volume: 75
});

// close subsystem sound
UI.close = UI.player({src: "sounds/subsystem-close.wav"});

// open subsystem sound
UI.open = UI.player({
  src: "sounds/subsystem-open.wav",
  delay: 1250
});

// element select sound
UI.select = UI.player({src: "sounds/element-select.wav"});

// bubble writing sound
UI.writing = UI.player({src: "sounds/speech-bubble-writing.wav"});

// bubble land sound
UI.land = UI.player({src: "sounds/speech-bubble-land.wav"});

// daemons sound
UI.daemons = UI.player({
  src: "sounds/daemons.wav",
  volume: 75
});

// kernel sound
UI.kernel = UI.player({
  src: "sounds/system-clock.wav",
  loop: true,
  volume: 75
});

// clock sound
UI.clock = UI.player({
  src: "sounds/system-clock.wav",
  loop: true,
  volume: 75
});

// cursor sound
UI.cursor = UI.player({
  src: "sounds/system-cursor.wav",
  loop: true,
  volume: 75
});

// file manager sound
UI.file = UI.player({
  src: "sounds/system-files.wav",
  loop: true,
  volume: 75
});

// memory sound
UI.memory = UI.player({
  src: "sounds/system-memory.wav",
  loop: true,
  volume: 75
});

// dev/null sound
UI.dev = UI.player({
  src: "sounds/system-null.wav",
  loop: true,
  volume: 75
});

// window manager sound
UI.window = UI.player({
  src: "sounds/system-window.wav",
  loop: true,
  volume: 75
});

// operating system sound
UI.system = UI.player({
  src: "sounds/system-whole.wav",
  loop: true,
  volume: 75
});
