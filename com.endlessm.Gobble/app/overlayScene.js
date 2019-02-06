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
    }

    create (data) {
        /* FPS counter */
        this.fps = this.add.text(8, 8, '', { color: '#00ff00' });

        this.createGamerOverDialog();
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
}

