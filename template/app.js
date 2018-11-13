window.ToyApp = {

    loadNotify() {
        window.webkit.messageHandlers.ToyAppLoadNotify.postMessage({});
    }

};

window.Sounds = {
    play(id) {
        window.webkit.messageHandlers.playSound.postMessage(id);
    },

    playAsync(id, cb) {
        cbcode = cb.toString();
        window.webkit.messageHandlers.playSoundAsync.postMessage([id, cbcode]);
    },

    stop(uuid) {
        window.webkit.messageHandlers.stopSound.postMessage(uuid);
    },
};
