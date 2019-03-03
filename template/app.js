window.ToyApp = {
    loadNotify() {
        window.webkit.messageHandlers.ToyAppLoadNotify.postMessage({});
    },

    setHackable(state) {
        window.webkit.messageHandlers.ToyAppSetHackable.postMessage(state);
    },

    setAspectRatio(ratio) {
        window.webkit.messageHandlers.ToyAppSetAspectRatio.postMessage(ratio);
    },

    saveState(state) {
        var string = JSON.stringify(state, (key, value) => {
            return key[0] === '_' ? undefined : value;
        }, 2);
        window.webkit.messageHandlers.ToyAppSaveState.postMessage(string);
    },
};

window.Sounds = {
    play(id) {
        window.webkit.messageHandlers.playSound.postMessage(id);
    },

    playLoop(id) {
        window.webkit.messageHandlers.playSoundAsync.postMessage(id);
    },

    updateSound(id, time_ms, props) {
        window.webkit.messageHandlers.updateSound.postMessage([id, time_ms, props]);
    },

    stop(id) {
        window.webkit.messageHandlers.stopSound.postMessage(id);
    }
};

var _soundItemId = 0;
class SoundItem {
    constructor(soundEventId) {
        this.__id = _soundItemId++;
        this.__cleaned = false;
        this.name = soundEventId;
    }

    play() {
        if (this.__cleaned)
            return;
        window.webkit.messageHandlers.playSoundItem.postMessage([this.name, this.__id]);
    }

    stop() {
        if (this.__cleaned)
            return;
        window.webkit.messageHandlers.stopSoundItem.postMessage(this.__id);
    }

    clear() {
        if (this.__cleaned)
            return;
        stop();
        this.__cleaned = true;
        window.webkit.messageHandlers.clearSoundItem.postMessage(this.__id);
    }
};

window.SoundItem = SoundItem;
