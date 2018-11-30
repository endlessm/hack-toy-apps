window.ToyApp = {
    loadNotify() {
        window.webkit.messageHandlers.ToyAppLoadNotify.postMessage({});
    },

    setHackable(state) {
        window.webkit.messageHandlers.ToyAppSetHackable.postMessage(state);
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
    },
};
