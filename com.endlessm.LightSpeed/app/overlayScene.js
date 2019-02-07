/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported OverlayScene */

class OverlayScene extends Phaser.Scene {
    create() {
        /* FPS counter */
        this.fps = this.add.text(8, 8, '', {color: '#00ff00'});
    }

    update() {
        this.fps.setText(game.loop.actualFps.toFixed(1));
    }
}

