/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported PauseScene */

class PauseScene extends Phaser.Scene {
    create() {
        var text = this.add.text(16, 8, 'PAUSED', fontConfig);
        const w = text.width + 32;
        const h = text.height + 16;
        var bg = new Utils.TransparentBox(this, w, h);

        this.add.container(
            (game.config.width - w) / 2,
            (game.config.height - h) / 2,
            [bg, text]
        );

        this.input.keyboard.on('keyup_SPACE', this.unpause.bind(this));
    }

    unpause() {
        globalParameters.paused = false;
        this.scene.stop();
    }
}

