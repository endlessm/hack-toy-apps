/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported GameOverScene */

class GameOverScene extends Phaser.Scene {
    init() {
        void this;
    }

    preload() {
        this.load.image('game-over', 'assets/game-over.png');
        this.load.image('game-over-glow', 'assets/game-over-glow.png');

        Utils.load_button(this, 'button');
    }

    create() {
        const {centerX, centerY} = this.cameras.main;

        this.gameOverGlow = this.add.image(centerX, centerY, 'game-over-glow');
        var gameOver = this.add.image(centerX, centerY, 'game-over');

        const levelParams = levelParameters[globalParameters.currentLevel];
        const spacing = 32;

        var pad = this.add.zone(0, 0, 512, 310).setOrigin(0, 0);
        this.startMessage = this.add.text(0, 0, levelParams.description, fontConfig)
            .setOrigin(0.5, 0.5);
        var restartButton = new Utils.Button(this, 'button', 'RESTART');

        Phaser.Display.Align.In.Center(this.gameOverGlow, pad);
        Phaser.Display.Align.In.Center(gameOver, pad);
        Phaser.Display.Align.To.BottomCenter(this.startMessage, gameOver, 0, spacing);
        Phaser.Display.Align.To.BottomCenter(restartButton, this.startMessage, 0, spacing);

        const w = pad.width;
        const h = restartButton.y + restartButton.height + spacing;
        var bg = new Utils.TransparentBox(this, w, h, 16);

        this.add.container(
            (game.config.width - w) / 2, (game.config.height - h) / 2,
            [bg, pad, this.gameOverGlow, gameOver, this.startMessage,
                restartButton]);

        /* Restart level on button click and enter */
        restartButton.on('pointerup', this.restartLevel.bind(this));
        this.input.keyboard.on('keyup_ENTER', this.restartLevel.bind(this));

        this.events.on('shutdown', () => {
            this.input.keyboard.shutdown();
            Sounds.stop('lightspeed/bg/zarathustra-whale');
        }, this);

        Sounds.playLoop('lightspeed/bg/zarathustra-whale');

        /* Current flick end time */
        this.flickTime = 0;

        /* Rapid flickering effect end time */
        this.flickerTime = 0;

        /* We are not playing anymore */
        globalParameters.playing = false;
    }

    update(time) {
        if (time < this.flickTime)
            return;

        var offset;

        if (time > this.flickerTime) {
            this.flickerTime = time + Phaser.Math.RND.integerInRange(300, 500);

            if (this.gameOverGlow.visible)
                offset = Phaser.Math.RND.integerInRange(40, 100);
            else
                offset = Phaser.Math.RND.integerInRange(600, 1500);
        } else {
            offset = Phaser.Math.RND.integerInRange(40, 100);
        }

        this.flickTime = time + offset;
        this.gameOverGlow.visible = !this.gameOverGlow.visible;
    }

    restartLevel() {
        const i = globalParameters.currentLevel;
        globalParameters.playing = true;
        this.scene.get('level').scene.restart(levelParameters[i]);
        this.scene.stop();
    }
}

