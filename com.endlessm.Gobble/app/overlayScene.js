/* Gobble
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

class OverlayScene extends Phaser.Scene {

    constructor (config) {
        super(config);
    }

    create (data) {
        /* FPS counter */
        this.fps = this.add.text(8, 8, '', { color: '#00ff00' });
    }

    update(time, delta) {
        this.fps.setText(`${(game.loop.actualFps).toFixed(1)}`);
    }
}

