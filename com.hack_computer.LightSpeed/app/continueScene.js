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

/* exported ContinueScene */

class ContinueScene extends Phaser.Scene {
    init() {
        void this;
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

        this.params = levelParameters[globalParameters.currentLevel];
        globalParameters.playing = false;

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

        this.events.on('shutdown', () => {
            this.input.keyboard.shutdown();
        }, this);

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

