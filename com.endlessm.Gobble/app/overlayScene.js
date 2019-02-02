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

    init(data) {
    }

    preload () {
        this.load.image('game-over', 'assets/game-over.png');

        this.load.image('confetti', 'assets/ui/confetti.png');
        this.load.image('arrow-keys', 'assets/ui/arrow_keys.png');
        this.load.image('explosion', 'assets/ui/explosion.png');

        Utils.load_button(this, 'prev');
        Utils.load_button(this, 'next');
        Utils.load_button(this, 'button');
    }

    create (data) {
        /* FPS counter */
        this.fps = this.add.text(8, 8, '', { color: '#00ff00' });

        this.createGamerOverDialog();
        this.createStartDialog();
    }

    update(time, delta) {
        this.fps.setText(`${(game.loop.actualFps).toFixed(1)}`);
    }

    createGamerOverDialog () {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        var box = this.gameOverDialog = this.add.container();
        /* Astronaut particles */
        var particles = this.add.particles('particle');

        /* Logo */
        var gameOver = this.add.image(centerX, centerY, 'game-over');
        this.tweens.add({
            targets: gameOver,
            scaleX: 0.8,
            scaleY: 1.6,
            duration: 600,
            ease: 'Sine',
            yoyo: true,
            repeat: -1
        });
        var emitter = particles.createEmitter({
            speed: 128,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 5000
        });
        emitter.startFollow(gameOver);

        /* Bottom text */
        var text = this.add.text(0, 0, 'Press enter to continue', fontConfig);
        Phaser.Display.Align.In.BottomCenter(text, gameOver, 0, 256);
        this.tweens.add({
            targets: text,
            alpha: 0.16,
            duration: 600,
            ease: 'Sine',
            yoyo: true,
            repeat: -1
        });

        box.add([particles, gameOver, text]);

        box.visible = false;

        this.input.keyboard.on('keyup', (event) => {
            if(this.gameOverDialog.visible &&
               event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                const i = globalParameters.currentLevel;
                var level = this.scene.get('level');

                this.gameOverDialog.visible = false;
                level.scene.restart(levelParameters[i]);
            }
        }, this);
    }

    updateLevel (prev, next, levelText, level) {
        levelText.setText(`Level ${this.currentLevel + 1}`, fontConfig);
        prev.sensitive = this.currentLevel > 0;
        next.sensitive = this.currentLevel < globalParameters.availableLevels-1;
    }

    createStartDialog () {
        const spacing = 16;

        var confetti = this.add.image(0, 0, 'confetti').setOrigin(0,0);
        var logo = this.add.image(0, 0, 'logo').setOrigin(0.5,0.5);
        var controlsText = this.add.text(0, 0, 'Move with', fontConfig);
        var arrowKeys = this.add.image(0, 0, 'arrow-keys');
        this.startMessage = this.add.text(0, 0, '\n\n', fontConfig).setOrigin(0.5,0.5);

        var prev = new Utils.Button(this, 'prev');
        var level = this.add.text(0, 0, '', fontConfig);
        var next = new Utils.Button(this, 'next');

        this.currentLevel = globalParameters.currentLevel;
        this.updateLevel(prev, next, level);

        const lw = prev.width + spacing + level.width + spacing + next.width + 8;
        const lh = prev.height + 8;
        var levelBg = new Utils.TransparentBox(this, lw, lh, 8);
        var levelBox = new Phaser.GameObjects.Container(this, 0, 0, [levelBg, prev, level, next]);

        /* FIXME: find a better way to align objects */
        levelBg.setPosition(-lw/2, -lh/2);
        levelBox.setSize(lw, lh);
        Phaser.Display.Align.In.LeftCenter(prev, levelBox, -4);
        Phaser.Display.Align.In.Center(level, levelBox);
        Phaser.Display.Align.In.RightCenter(next, levelBox, -4);

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
        Phaser.Display.Align.To.BottomCenter(levelBox, this.startMessage, 0, spacing);
        Phaser.Display.Align.To.BottomCenter(startButton, levelBox, 0, spacing * 2);

        const w = confetti.width;
        const h = startButton.y + startButton.height + spacing;

        var bg = new Utils.TransparentBox(this, w, h, 16);

        this.startDialog = this.add.container(
            (game.config.width - w)/2, (game.config.height - h)/2,
            [ bg, confetti, logo, controlsText, arrowKeys, this.startMessage, levelBox, startButton ]
        );

        startButton.on('pointerup', function () {
            this.startDialog.visible = false;

            if (globalParameters.currentLevel !== this.currentLevel) {
                globalParameters.currentLevel = this.currentLevel;
                this.scene.launch('level', levelParameters[this.currentLevel]);
            }
            else {
                this.scene.get('level').scene.resume();
            }
        }, this);

        prev.on('pointerup', function () {
            this.currentLevel--;
            this.updateLevel(prev, next, level);

        }, this);

        next.on('pointerup', function () {
            this.currentLevel++;
            this.updateLevel(prev, next, level);
        }, this);

        this.startDialog.visible = false;
    }

    showStartDialog (message) {
        this.startMessage.setText(message);
        this.startDialog.visible = true;
    }
}

