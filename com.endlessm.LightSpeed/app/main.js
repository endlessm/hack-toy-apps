/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported fontConfig, game */

/* global globalParameters, defaultLevelParameters, defaultParameters,
    levelParameters, ContinueScene, DebugScene, GameOverScene, LevelScene,
    PauseScene, StartScene, TitleScene */

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
        new TitleScene('title'),
        new LevelScene('level'),
        new StartScene('start'),
        new GameOverScene('gameover'),
        new PauseScene('pause'),
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
    if (Object.is(globalParameters, obj) && property === 'startLevel' &&
        globalParameters.currentLevel !== globalParameters.startLevel) {
        const i = globalParameters.startLevel;

        /* Stop all active scenes just in case */
        game.scene.getScenes(true).forEach(function(key) {
            game.scene.stop(key);
        });

        globalParameters.currentLevel = i;
        globalParameters.playing = true;
        globalParameters.paused = false;
        game.scene.start('level', levelParameters[i]);
    }
});

/* External API */

window.flip = function() {
    globalParameters.flipped = !globalParameters.flipped;

    /* Pause game automatically when flipped */
    if (globalParameters.flipped && globalParameters.playing)
        globalParameters.paused = true;
};

window.reset = function() {
    const i = globalParameters.currentLevel;

    if (i < 0 || i > levelParameters.length)
        return;

    Object.assign(levelParameters[i], defaultParameters);
    Object.assign(levelParameters[i], defaultLevelParameters[i]);
};

window.loadState = function(state) {
    /* Do some sanity checks before restoring game state */
    if (typeof state === 'object' &&
        typeof state.availableLevels === 'number' &&
        typeof state.nextLevel === 'number' &&
        typeof state.level === 'number' &&
        typeof state.parameters === 'object' &&
        state.nextLevel < state.availableLevels &&
        state.level >= 0 && state.level <= state.availableLevels) {
        /* Restore global parameters */
        globalParameters.availableLevels = state.availableLevels;
        globalParameters.nextLevel = state.nextLevel;

        /* Restore current level parameters */
        Object.assign(levelParameters[state.level], state.parameters);
    }
};

