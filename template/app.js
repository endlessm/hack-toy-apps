var __toyAppGetStateId = 0;
var __toyAppGetStateReturnValues = {};

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

    async getState(key) {
        const i = __toyAppGetStateId++;
        window.webkit.messageHandlers.ToyAppGetState.postMessage([i, key]);

        __toyAppGetStateReturnValues[i] = {};
        const waitForState = new Promise(resolve => {
	        Object.defineProperty(__toyAppGetStateReturnValues, i, {
		        set: value => {
			        if (value) {
                        delete __toyAppGetStateReturnValues[i];
				        resolve(value);
                    }
		        }
	        });
        });

        const timeout = new Promise(resolve => {
            setTimeout(() => {
                if (__toyAppGetStateReturnValues[i])
                    delete __toyAppGetStateReturnValues[i];
			    resolve();
            } , 1500);
        });

        const state = await Promise.race([waitForState, timeout]);
        if (!state)
            throw Error('Timeout reached');
        return state;
    }
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
