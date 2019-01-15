/* Gobble
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* Scenes */
var scenes = new Array();

/* Create title screen scene */
scenes.push(new TitleScene('title'));

/* Create a level scene for each parameter */
for (var i = 0; i < nLevels; i++)
    scenes.push(new LevelScene(`level_${i}`));

scenes.push(new GameOverScene('gameover'));

/* Config */
var config = {
    title: 'Gobble',
    type: Phaser.AUTO,
    background: 'black',
    fps: {
        target: 30
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1004
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: scenes
};

/* Bootstrap game */
var game = new Phaser.Game(config);

