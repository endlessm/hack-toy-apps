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
            debug: true,
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

/* Export one global parameter object for each level */
(function() {
    for (var i = 0, n = defaultLevelParameters.length; i < n; i++) {
        /* Dup default object */
        var defaults = Object.assign({}, defaultParameters);

        var params = Object.assign(defaults, defaultLevelParameters[i]);

        levelParameters.push(params);

        /* Merge defaults with level parameters */
        window[`globalLevel${i}Parameters`] = params;
    }
}());

/* Bootstrap game */
var game = new Phaser.Game(config);

/* External API */

window.flip = function() {
    globalParameters.flipped = !globalParameters.flipped;

    /* Pause game automatically when flipped */
    if (globalParameters.flipped)
        globalParameters.paused = true;
};

window.reset = function() {
    const i = globalParameters.currentLevel;

    if (i < 0 || i > levelParameters.length)
        return;

    Object.assign(window[`globalLevel${i}Parameters`], levelParameters[i]);
};

