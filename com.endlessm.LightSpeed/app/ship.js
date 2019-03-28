/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported Ship */
/* global CONFETTI_COLORS */

class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, type, x, y) {
        super(scene, x, y);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setAllowDrag(true);
        this.depth = 100;

        this.cursors = scene.input.keyboard.createCursorKeys();

        /* Explosion */
        var explosion = scene.add.particles('explosion-particles');
        this.explosionEmitter = explosion.createEmitter({
            frame: ['explosion-p1', 'explosion-p2', 'explosion-p3'],
            speed: {min: -800, max: 800},
            angle: {min: 0, max: 360},
            scale: {start: 2, end: 0},
            blendMode: 'SCREEN',
            lifespan: 800,
        });
        this.explodeCount = 3;
        this.explosionEmitter.stop();
        explosion.depth = 101;

        /* Confetti */
        var confetti = scene.add.particles('confetti-particles');
        this.confettiEmitter = confetti.createEmitter({
            frame: ['confetti-p1', 'confetti-p2', 'confetti-p3', 'confetti-p4',
                'confetti-p5', 'confetti-p6'],
            rotate: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130,
                140, 150, 160, 180, 190, 200, 210, 220, 240, 250, 260, 270, 280,
                290, 300, 310, 320, 330, 340, 350],
            tint: CONFETTI_COLORS,
            speed: {min: -500, max: 500},
            angle: {min: 0, max: 360},
            scale: {start: 1, end: 0.32},
            lifespan: 600,
        });
        this.confettiEmitter.stop();

        this.setType(type);
    }

    playThrust(direction) {
        if (direction < 0) {
            if (!this._playingThrustUp) {
                Sounds.stop('lightspeed/thrust-down');
                this._playingThrustDown = false;
                Sounds.playLoop('lightspeed/thrust-up');
                this._playingThrustUp = true;
            }
        } else if (direction > 0) {
            if (!this._playingThrustDown) {
                Sounds.stop('lightspeed/thrust-up');
                this._playingThrustUp = false;
                Sounds.playLoop('lightspeed/thrust-down');
                this._playingThrustDown = true;
            }
        } else if (this._playingThrustUp) {
            Sounds.stop('lightspeed/thrust-up');
            this._playingThrustUp = false;
        } else if (this._playingThrustDown) {
            Sounds.stop('lightspeed/thrust-down');
            this._playingThrustDown = false;
        }
    }

    handleInput(accel, drag) {
        if (this.cursors.up.isDown) {
            this.playThrust(-1);

            if (this.body.velocity.y > 0)
                this.setVelocityY(0);
            this.setAccelerationY(-accel);
        } else if (this.cursors.down.isDown) {
            this.playThrust(1);

            if (this.body.velocity.y < 0)
                this.setVelocityY(0);
            this.setAccelerationY(accel);
        } else {
            this.playThrust(0);

            this.setAccelerationY(0);
            this.body.setDrag(0, drag);
        }
    }

    setType(type) {
        this.setTexture(type);

        /* Make collision box smaller so that asteroids don't collide on the
         * outer corners of the box where no ship is */
        const scale = this.scene.params.shipSize / 100;
        this.setScale(scale);

        let ship_box_height;

        switch (type) {
        case 'spaceship':
            ship_box_height = 264;
            this.setSize(326, ship_box_height).setOffset(132, 64);
            break;
        case 'daemon':
            ship_box_height = 512;
            this.setCircle(256, 0, 0);
            break;
        case 'unicorn':
            ship_box_height = 256;
            this.setSize(300, ship_box_height).setOffset(200, 128);
            break;
        default:
            // FIXME add a "missing image" asset, TBD however we decide to
            // indicate a runtime error in code
            // eslint-disable-next-line no-console
            console.error(`unexpected ship type ${type}`);
            ship_box_height = 100;
        }

        /* Update world bounds to allow half the ship to be outside */
        this.scene.physics.world.setBounds(
            0,
            -(ship_box_height * scale) / 2,
            game.config.width,
            game.config.height + ship_box_height * scale
        );
    }

    explode(x, y) {
        this.explosionEmitter.explode(768, x, y);
        this.explodeCount--;

        if (this.explodeCount <= 0) {
            this.explodeCount = 3;
            return;
        }

        this.scene.time.delayedCall(Phaser.Math.RND.integerInRange(128, 512),
            this.explode, [x, y], this);
    }
}

