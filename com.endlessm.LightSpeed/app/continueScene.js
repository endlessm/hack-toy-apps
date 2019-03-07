/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported ContinueScene */

class ContinueScene extends Phaser.Scene {
    init() {
        this.params = levelParameters[globalParameters.currentLevel];
        globalParameters.playing = false;
    }

    preload() {
        this.load.image('level-complete', 'assets/level-complete.png');
        this.load.image('level-complete-glow', 'assets/level-complete-glow.png');
        Utils.load_button(this, 'prev');
        Utils.load_button(this, 'next');
        Utils.load_button(this, 'button');
    }

    create(message) {
        const spacing = 48;

        var pad = this.add.zone(0, 0, 512, 400).setOrigin(0, 0);
        var levelComplete = this.add.sprite(0, 0, 'level-complete');
        this.levelCompleteGlow = this.add.sprite(0, 0, 'level-complete-glow');
        var levelText = this.add.text(0, 0, message, fontConfig).setOrigin(0.5, 0.5);
        var continueButton = new Utils.Button(this, 'button', 'CONTINUE');

        Phaser.Display.Align.In.Center(this.levelCompleteGlow, pad);
        Phaser.Display.Align.In.Center(levelComplete, this.levelCompleteGlow);
        Phaser.Display.Align.To.BottomCenter(levelText, this.levelCompleteGlow);
        Phaser.Display.Align.To.BottomCenter(continueButton, levelText, 0, spacing);

        const w = 512;
        const h = continueButton.y + continueButton.height + spacing;
        var bg = new Utils.TransparentBox(this, w, h, 16);

        this.add.container(
            (game.config.width - w) / 2, (game.config.height - h) / 2,
            [bg, pad, this.levelCompleteGlow, levelComplete, levelText, continueButton]);

        /* Continue on button click and enter */
        this.input.keyboard.on('keyup_ENTER', this.nextLevel.bind(this));
        continueButton.on('pointerup', this.nextLevel.bind(this));

        /* Play level finished sound */
        Sounds.play('lightspeed/level-complete');

        this.flickTime = 0;
    }

    update(time) {
        if (time < this.flickTime)
            return;

        this.flickTime = time + 500;
        this.levelCompleteGlow.visible = !this.levelCompleteGlow.visible;
    }

    nextLevel() {
        /* Check if next level is the title */
        if (globalParameters.nextLevel === 0) {
            this.scene.stop('level');
            this.scene.start('title');
            return;
        }

        globalParameters.currentLevel = globalParameters.nextLevel;
        globalParameters.playing = true;
        globalParameters.paused = false;
        this.scene.start('level', levelParameters[globalParameters.currentLevel]);
    }
}

