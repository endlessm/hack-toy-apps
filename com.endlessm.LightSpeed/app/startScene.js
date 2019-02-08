/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

class StartScene extends Phaser.Scene {

    constructor (config) {
        super(config);
    }

    init(data) {
        globalParameters.playing = false;
    }

    preload () {
        this.load.image('confetti', 'assets/ui/confetti.png');
        this.load.image('arrow-keys', 'assets/ui/arrow_keys.png');

        Utils.load_button(this, 'prev');
        Utils.load_button(this, 'next');
        Utils.load_button(this, 'button');
    }

    create (data) {
        const levelParams = levelParameters[globalParameters.currentLevel];
        const spacing = 16;

        var confetti = this.add.image(0, 0, 'confetti').setOrigin(0,0);
        var logo = this.add.image(0, 0, 'logo').setOrigin(0.5,0.5);
        var controlsText = this.add.text(0, 0, 'Move with', fontConfig);
        var arrowKeys = this.add.image(0, 0, 'arrow-keys');
        this.startMessage = this.add.text(0, 0, levelParams.description, fontConfig).setOrigin(0.5,0.5);
        this.levelChooser = new LevelChooser(this, 'prev', 'next');
        var startButton = new Utils.Button(this, 'button', 'START');

        logo.setScale(0.4);
        this.tweens.add({
            targets: logo,
            scaleX: 0.32,
            scaleY: 0.64,
            duration: 600,
            ease: 'Sine',
            yoyo: true,
            repeat: -1
        });

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
            (game.config.width - w)/2, (game.config.height - h)/2,
            [ bg, confetti, logo, controlsText, arrowKeys, this.startMessage, this.levelChooser, startButton ]
        );

        this.levelChooser.on('level-changed', (level) => {
            this.startMessage.setText(levelParameters[level].description);
        });

        /* Start level on button click and enter */
        startButton.on('pointerup', this.startLevel.bind(this));
        this.input.keyboard.on('keyup_ENTER', this.startLevel.bind(this));

        /* Start current level */
        this.scene.launch('level', levelParams);
    }

    startLevel () {
        const i = this.levelChooser.currentLevel;

        globalParameters.currentLevel = i;
        globalParameters.playing = true;
        this.scene.start('level', levelParameters[i]);
    }
}

