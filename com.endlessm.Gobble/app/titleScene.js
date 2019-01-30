/* Gobble
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

const kcode = [ 38, 38, 40, 40, 37, 39, 37, 39, 65, 66 ];

class TitleScene extends Phaser.Scene {

    constructor (config) {
        super(config);
    }

    init(data) {
    }

    preload () {
        /* Images */
        this.load.image('space', 'assets/space.jpg');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('particle', 'assets/particle.png');
        this.load.image('astronaut', 'assets/astronaut.png');
        this.load.image('tch', 'assets/tch.png');
        this.load.image('ship', 'assets/ship.png');
    }

    create (data) {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        /* Reset Camera FX */
        this.cameras.main.resetFX();

        /* Background */
        var bg = this.add.image(centerX, centerY, 'space');

        /* Bottom text */
        var text = this.add.text(0, 0,
            'Press any key to start',
            { color: 'white', fontSize: '42px' }
        );
        Phaser.Display.Align.In.BottomCenter(text, bg, 0, -128);
        this.tweens.add({
            targets: text,
            alpha: 0.16,
            duration: 600,
            ease: 'Sine',
            yoyo: true,
            repeat: -1
        });

        /* Ship */
        this.ship = this.physics.add.image(-500, Phaser.Math.RND.integerInRange(0, centerY*2), 'ship');
        this.ship.setVelocityX(Phaser.Math.RND.integerInRange(32, 256));

        /* Astronaut particles */
        var particles = this.add.particles('particle');

        /* Logo */
        var logo = this.add.image(centerX, centerY/2, 'logo');
        this.tweens.add({
            targets: logo,
            scaleX: 0.8,
            scaleY: 1.6,
            duration: 600,
            ease: 'Sine',
            yoyo: true,
            repeat: -1
        });

        /* Astronaut */
        this.astronaut = this.physics.add.image(centerX, centerY, 'astronaut');
        this.astronaut.setVelocity(Phaser.Math.RND.integerInRange(16, 128),
                                   Phaser.Math.RND.integerInRange(16, 128));
        this.astronaut.setBounce(1, 1);
        this.astronaut.setCollideWorldBounds(true);
        this.tweens.add({
            targets: this.astronaut,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 8000,
            ease: 'Sine',
            yoyo: true,
            repeat: -1
        });

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 3000
        });
        emitter.startFollow(this.astronaut);

        /* FPS */
        this.fps = this.add.text(40, 40, '', { color: '#00ff00' });

        /* Fade in scene */
        this.cameras.main.fadeIn(200);

        var combo = this.input.keyboard.createCombo(kcode, { resetOnMatch: true });
        this.input.keyboard.on('keycombomatch', (event) => {
            this.astronaut.setTexture('tch');
            combo.tch = true;
        }, this);

        /* Fade out when any key is released */
        this.input.keyboard.on('keyup', (event) => {
            if (!combo.tch && combo.index === 0)
                this.cameras.main.fadeOut(200);

            delete combo.tch;
        }, this);

        /* Switch to current level after fading is done */
        this.cameras.main.on('camerafadeoutcomplete', () => {
            const i = globalParameters.currentLevel;
            this.scene.start(`level_${i}`, levelParameters[i]);
        }, this);

        this.events.on('shutdown', () => {
            this.input.keyboard.shutdown();
        }, this);
    }

    update(time, delta) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.fps.setText(`FPS: ${(game.loop.actualFps).toFixed(1)}`);

        const ship = this.ship;
        const ship_delta = Math.abs(ship.x - width);
        const ship_vx = ship.body.velocity.x;

        if ((ship_vx > 0 && ship.x > width+500) ||
            (ship_vx < 0 && ship.x < -500)) {
            ship.y  = Phaser.Math.RND.integerInRange(0, height);

            ship.scaleX = ship.scaleY = Phaser.Math.RND.realInRange(0.32, 1.0);

            if (ship_vx > 0) {
                ship.setVelocityX(Phaser.Math.RND.integerInRange(-32, -256));
                ship.flipX = true;
            } else {
                ship.setVelocityX(Phaser.Math.RND.integerInRange(32, 256));
                ship.flipX = false;
            }
        }

        /* make astronaut spin */
        this.astronaut.rotation += 0.006;
    }
}

