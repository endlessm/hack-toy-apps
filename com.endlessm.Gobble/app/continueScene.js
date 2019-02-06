/* Gobble
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

class ContinueScene extends Phaser.Scene {

    constructor (config) {
        super(config);
    }

    init(data) {
    }

    preload () {
        this.load.image('confetti-full', 'assets/ui/confetti_full.png');
        Utils.load_button(this, 'prev');
        Utils.load_button(this, 'next');
        Utils.load_button(this, 'button');
    }

    create (message) {
        const spacing = 32;

        var confetti = this.add.sprite(0, 0, 'confetti-full').setOrigin(0,0);
        var ship = this.add.image(0, 0, 'ship').setOrigin(0.5, 0.5);
        var levelText = this.add.text(0, 0, message, fontConfig).setOrigin(0.5,0.5);
        var continueButton = new Utils.Button(this, 'button', 'CONTINUE');

        ship.rotation = Math.PI * 1.5;
        ship.setScale(0.32);
        this.tweens.add({
            targets: ship,
            scaleX: 0.64,
            scaleY: 0.64,
            duration: 600,
            ease: 'Sine',
            yoyo: true,
            repeat: -1
        });

        Phaser.Display.Align.In.Center(ship, confetti, 0, 30);
        Phaser.Display.Align.To.BottomCenter(levelText, confetti, 0, spacing);
        Phaser.Display.Align.To.BottomCenter(continueButton, levelText, 0, spacing);

        const w = confetti.width;
        const h = continueButton.y + continueButton.height + spacing;
        var bg = new Utils.TransparentBox(this, w, h, 16);

        this.add.container(
            (game.config.width - w)/2, (game.config.height - h)/2,
            [ bg, confetti, ship, levelText, continueButton ]
        );

        continueButton.on('pointerup', function () {
            globalParameters.currentLevel++;
            this.scene.start('level', levelParameters[globalParameters.currentLevel]);
        }, this);
    }
}

