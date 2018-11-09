window.ToyApp = {

    loadNotify() {
        window.webkit.messageHandlers.ToyAppLoadNotify.postMessage({});
    }

};
