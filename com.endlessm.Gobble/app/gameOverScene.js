/* Gobble
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

class GameOverScene extends Phaser.Scene {

    constructor (config) {
        super(config);
    }

    init(data) {
    }

    preload () {
        /* Images */
        this.load.image('space', 'assets/space.jpg');
        this.load.image('game-over', 'assets/game-over.png');
        this.load.image('particle', 'assets/particle.png');
    }

    create (data) {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        /* Background */
        this.add.image(centerX, centerY, 'space');

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
        var text = this.add.text(0, 0,
            'Press any key to continue',
            { color: 'white', fontSize: '42px' }
        );
        Phaser.Display.Align.In.BottomCenter(text, gameOver, 0, 128);
        this.tweens.add({
            targets: text,
            alpha: 0.16,
            duration: 600,
            ease: 'Sine',
            yoyo: true,
            repeat: -1
        });

        /* Fade out when any key is released */
        this.input.keyboard.on('keyup', (event) => {
            this.cameras.main.fadeOut(200);
        }, this);

        /* Switch to level after fading is done */
        this.cameras.main.on('camerafadeoutcomplete', () => {
            const i = globalParameters.currentLevel;
            this.scene.start(`level_${i}`, levelParameters[i]);
        }, this);

        this.events.on('shutdown', () => {
            this.input.keyboard.shutdown();
        }, this);
    }

    update(time, delta) {

    }
}

