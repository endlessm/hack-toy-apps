/*
 * Copyright © 2020 Endless OS Foundation LLC.
 *
 * This file is part of hack-toy-apps
 * (see https://github.com/endlessm/hack-toy-apps).
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
window.ToyApp = {
    isHackMode: false,
    runningQuest: '',

    hideToolbox() {
        window.webkit.messageHandlers.ToyAppHideToolbox.postMessage({});
    },

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

    quit(msFadeOut = 0) {
        window.webkit.messageHandlers.ToyAppQuit.postMessage(msFadeOut);
    },

    showClubhouse(characterName = 'ada') {
        window.webkit.messageHandlers.ToyAppShowClubhouse.postMessage(characterName);
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
