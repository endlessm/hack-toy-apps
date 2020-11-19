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
/* exported fontConfig, game */

/*  global globalParameters, defaultLevelParameters, defaultParameters,
    BootScene, LoadingScene, GameScene, ToyApp */

const fontConfig = {
    color: 'white',
    fontSize: '38px',
    fontFamily: 'Metropolis',
    align: 'center',
    shadow: {
        color: 'black',
        fill: true,
        offsetX: 2,
        offsetY: 2,
        blur: 8,
    },
};

const loadingScene = new LoadingScene('Loading');

// our game's configuration
var config = {
    title: 'Sidetrack',
    type: Phaser.AUTO,
    transparent: true,
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        new BootScene('Boot'),
        loadingScene,
        new GameScene('Game'),
    ],
};

// create the game, and pass it the configuration
var game = new Phaser.Game(config);

/* Export one global parameter object for each level */
(function() {
    function objectNotify(obj) {
        obj._proxy = Object.create(
            Object.getPrototypeOf(obj),
            Object.getOwnPropertyDescriptors(obj)
        );

        Object.keys(obj).forEach(prop => {
            if (prop[0] === '_')
                return;

            Object.defineProperty(obj, prop, {
                get() {
                    return this._proxy[prop];
                },
                set(val) {
                    if (this._proxy[prop] !== val) {
                        this._proxy[prop] = val;
                        game.events.emit('global-property-change', obj, prop);
                    }
                },
            });
        });
    }

    /* Make object notify an event every time a property changes */
    objectNotify(globalParameters);

    for (var i = 0, n = defaultLevelParameters.length; i < n; i++) {
        /* Dup default object */
        var defaults = Object.assign({}, defaultParameters);

        /* Merge defaults with level parameters */
        var params = Object.assign(defaults, defaultLevelParameters[i]);

        /* Make object notify an event every time a property changes */
        objectNotify(params);

        /* Push to levels paramters array */
        levelParameters.push(params);

        /* And export as a global object */
        window[`globalLevel${i}Parameters`] = params;
    }
}());

/* Quests can start a level programatically */
game.events.on('global-property-change', (obj, property) => {
    if (property === 'startLevel') {
        const startLevel = globalParameters.startLevel;

        if (startLevel < 0 || startLevel > globalParameters.availableLevels)
            return;

        /* Stop all active scenes just in case */
        game.scene.getScenes(true).forEach(function(key) {
            game.scene.stop(key);
        });

        globalParameters.currentLevel = startLevel;
        globalParameters.paused = false;

        if (startLevel) {
            globalParameters.playing = true;
            game.scene.start('Game', levelParameters[startLevel]);
        }
    }
});

/* External API */

window.flip = function() {
    globalParameters.flipped = !globalParameters.flipped;

    //do not run sleep timer if in toolbox
    if(globalParameters.flipped) {
        clearSleepTimer(game.pauseToyAppTimeout);
    }

    if (globalParameters.playing)
        /* Pause game automatically when flipped, and resume
         * automatically when flipped back */
        globalParameters.paused = globalParameters.flipped;

    if (!globalParameters.flipped)
        window.saveState();
};

window.reset = function() {
    const i = globalParameters.currentLevel;

    if (i < 1 || i >= levelParameters.length)
        return;

    const defaults = Object.assign({}, defaultParameters, defaultLevelParameters[i]);
    Object.assign(levelParameters[i], defaults);
};

window.saveState = function() {
    ToyApp.saveState({
        /* Global state */
        availableLevels: globalParameters.availableLevels,
        highestAchievedLevel: globalParameters.highestAchievedLevel,
        /* Per-level parameters */
        levelParameters,
    });
};

window.loadState = function(state) {
    /* Do some sanity checks before restoring game state */
    if (typeof state === 'object' &&
        typeof state.availableLevels === 'number' &&
        typeof state.highestAchievedLevel === 'number' &&
        Array.isArray(state.levelParameters) &&
        state.levelParameters.every(obj => typeof obj === 'object')) {
        /* Restore global parameters */
        globalParameters.availableLevels = state.availableLevels;
        globalParameters.highestAchievedLevel = state.highestAchievedLevel;

        /* Restore current level parameters */
        state.levelParameters.forEach((levelState, ix) => {
            Object.assign(levelParameters[ix], levelState);
        });
    } else {
        // eslint-disable-next-line no-console
        console.error('Not loading state, because it was not present or not valid.');
    }

    loadingScene.doneLoadingState();
};

window.runningQuestChanged = function() {
    game.scene.getScene('Game').restartLevel();
}
