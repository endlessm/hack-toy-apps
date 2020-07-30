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

/* global globalParameters, defaultLevelParameters, defaultParameters,
    levelParameters, resetGlobalUserCode, ContinueScene, DebugScene,
    GameOverScene, LevelScene, StartScene, TitleScene, BackgroundScene,
    ToyApp */

const fontConfig = {
    color: 'white',
    fontSize: '38px',
    align: 'center',
    shadow: {
        color: 'black',
        fill: true,
        offsetX: 2,
        offsetY: 2,
        blur: 8,
    },
};

const titleScene = new TitleScene('title');

/* Config */
var config = {
    title: 'LightSpeed',
    type: Phaser.AUTO,
    background: 'black',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1004,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [
        titleScene,
        new BackgroundScene('background'),
        new LevelScene('level'),
        new StartScene('start'),
        new GameOverScene('gameover'),
        new ContinueScene('continue'),
        new DebugScene({key: 'debug', active: true}),
    ],
};

/* Bootstrap game */
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
    if (Object.is(globalParameters, obj) && property === 'startLevel') {
        const startLevel = globalParameters.startLevel;

        if (startLevel < 0 || startLevel > globalParameters.availableLevels)
            return;

        /* Stop all active scenes just in case */
        game.scene.getScenes(true).forEach(function(scene) {
            if (scene instanceof DebugScene)
                return;

            game.scene.stop(scene);
        });

        globalParameters.currentLevel = startLevel;
        globalParameters.paused = false;

        if (startLevel) {
            globalParameters.playing = true;
            game.scene.start('level', levelParameters[startLevel]);
        } else {
            globalParameters.playing = false;
            game.scene.start('title');
        }
    }
});

/* External API */

window.flip = function() {
    globalParameters.flipped = !globalParameters.flipped;

    // do not run sleep timer if in toolbox
    if (globalParameters.flipped) {
        clearSleepTimer(game.pauseToyAppTimeout);
    }

    if (globalParameters.playing)
        /* Pause game automatically when flipped, and resume
         * automatically when flipped back */
        globalParameters.paused = globalParameters.flipped;

    if (!globalParameters.flipped)
        game.scene.getScene('level').onFlip();
};

window.reset = function() {
    resetGlobalUserCode();

    const i = globalParameters.currentLevel;

    if (i < 0 || i >= levelParameters.length)
        return;

    const defaults = Object.assign({}, defaultParameters, defaultLevelParameters[i]);
    Object.assign(levelParameters[i], defaults);
};

window.saveState = function() {
    ToyApp.saveState({
        /* Global state */
        availableLevels: globalParameters.availableLevels,
        nextLevel: globalParameters.nextLevel,
        /* Global user functions */
        updateAsteroidCode: globalParameters.updateAsteroidCode,
        updateSpinnerCode: globalParameters.updateSpinnerCode,
        updateSquidCode: globalParameters.updateSquidCode,
        updateBeamCode: globalParameters.updateBeamCode,
        activatePowerupCode: globalParameters.activatePowerupCode,
        /* Per-level parameters */
        levelParameters,
    });
};

window.loadState = function(state) {
    /* Do some sanity checks before restoring game state */
    if (typeof state === 'object' &&
        typeof state.availableLevels === 'number' &&
        typeof state.nextLevel === 'number' &&
        Array.isArray(state.levelParameters) &&
        state.levelParameters.every(obj => typeof obj === 'object') &&
        state.nextLevel < state.availableLevels) {
        /* Restore global parameters */
        globalParameters.availableLevels = state.availableLevels;
        globalParameters.nextLevel = state.nextLevel;
        globalParameters.updateAsteroidCode = state.updateAsteroidCode;
        globalParameters.updateSpinnerCode = state.updateSpinnerCode;
        globalParameters.updateSquidCode = state.updateSquidCode;
        globalParameters.updateBeamCode = state.updateBeamCode;
        globalParameters.activatePowerupCode = state.activatePowerupCode;

        /* Restore current level parameters */
        state.levelParameters.forEach((levelState, ix) => {
            Object.assign(levelParameters[ix], levelState);
        });
    } else {
        // eslint-disable-next-line no-console
        console.error('Not loading state, because it was not present or not valid.');
    }

    titleScene.doneLoadingState();
};

