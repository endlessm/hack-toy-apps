window.ToyApp = {
    requestState() {
        window.webkit.messageHandlers.ToyAppRequestState.postMessage({});
    },

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

    quit() {
        window.webkit.messageHandlers.ToyAppQuit.postMessage({});
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

    terminate(id) {
        window.webkit.messageHandlers.terminateSound.postMessage(id);
    },
};
