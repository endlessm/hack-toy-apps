/* Gobble
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

const fontConfig = {
    color: 'white',
    fontSize: '38px',
    align: 'center',
    shadow: {
        color: 'black',
        fill: true,
        offsetX: 2,
        offsetY: 2,
        blur: 8
    }
};

/* Config */
var config = {
    title: 'Gobble',
    type: Phaser.AUTO,
    background: 'black',
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
    scene: [
        new TitleScene('title'),
        new LevelScene('level'),
        new StartScene('start'),
        new GameOverScene('gameover'),
        new OverlayScene({ key: 'overlay', active: true }),
    ]
};

/* Bootstrap game */
var game = new Phaser.Game(config);

