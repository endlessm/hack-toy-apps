window.ToyApp = {

    loadNotify() {
        window.webkit.messageHandlers.ToyAppLoadNotify.postMessage({});
    }

};

window.Sounds = {
    play(id) {
        window.webkit.messageHandlers.playSound.postMessage(id);
    },

    playLoop(id) {
        window.webkit.messageHandlers.playSoundAsync.postMessage(id);
    },

    stop(id) {
        window.webkit.messageHandlers.stopSound.postMessage(id);
    },
};
