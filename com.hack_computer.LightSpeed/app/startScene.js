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

/* exported StartScene */
/* global LevelChooser */

class StartScene extends Phaser.Scene {
    init() {
        void this;
    }

    preload() {
        this.load.image('confetti', 'assets/ui/confetti.png');
        this.load.image('arrow-keys', 'assets/ui/arrow_keys.png');

        Utils.load_button(this, 'prev');
        Utils.load_button(this, 'next');
        Utils.load_button(this, 'button');
    }

    create() {
        /* Reset Global game state */
        globalParameters.playing = false;
        globalParameters.currentLevel =
            globalParameters.nextLevel || globalParameters.availableLevels;

        const levelParams = levelParameters[globalParameters.currentLevel];
        const spacing = 16;

        var confetti = this.add.image(0, 0, 'confetti').setOrigin(0, 0);
        var logo = this.add.image(0, 0, 'logo').setOrigin(0.5, 0.5);
        var controlsText = this.add.text(0, 0, 'Move with', fontConfig);
        var arrowKeys = this.add.image(0, 0, 'arrow-keys');
        this.startMessage = this.add.text(0, 0, levelParams.description, fontConfig)
            .setOrigin(0.5, 0.5);
        this.levelChooser = new LevelChooser(this, 'prev', 'next');
        var startButton = new Utils.Button(this, 'button', 'START');

        logo.setScale(0.4);

        Phaser.Display.Align.In.Center(logo, confetti);
        Phaser.Display.Align.To.BottomCenter(controlsText, confetti, 0, spacing * 2);
        Phaser.Display.Align.To.BottomCenter(arrowKeys, controlsText, 0, spacing);
        Phaser.Display.Align.To.BottomCenter(this.startMessage, arrowKeys, 0, spacing);
        Phaser.Display.Align.To.BottomCenter(this.levelChooser, this.startMessage, 0, spacing);
        Phaser.Display.Align.To.BottomCenter(startButton, this.levelChooser, 0, spacing * 2);

        const w = confetti.width;
        const h = startButton.y + startButton.height + spacing;
        var bg = new Utils.TransparentBox(this, w, h, 16);

        this.add.container(
            (game.config.width - w) / 2, (game.config.height - h) / 2,
            [bg, confetti, logo, controlsText, arrowKeys, this.startMessage,
                this.levelChooser, startButton]);

        this.levelChooser.on('level-changed', level => {
            this.startMessage.setText(levelParameters[level].description);
        });

        /* Start level on button click and enter */
        startButton.on('pointerup', this.startLevel.bind(this));
        this.input.keyboard.on('keyup_ENTER', this.startLevel.bind(this));

        /* Start current level */
        this.scene.launch('level', levelParams);

        this.events.on('shutdown', () => {
            this.input.keyboard.shutdown();
            Sounds.stop('lightspeed/bg/zarathustra-whale');
        }, this);

        Sounds.playLoop('lightspeed/bg/zarathustra-whale');
    }

    startLevel() {
        const i = this.levelChooser.currentLevel;

        globalParameters.currentLevel = i;
        globalParameters.playing = true;
        globalParameters.paused = false;
        this.scene.start('level', levelParameters[i]);
    }
}

