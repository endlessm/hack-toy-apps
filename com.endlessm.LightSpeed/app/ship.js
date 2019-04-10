/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported Ship */

const UPGRADE_COLOR = 0x6dff36;
const INVULNERABLE_COLOR = 0xffea5f;

class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, type, x, y) {
        super(scene, x, y);

        /* Engine upgrade multiplier */
        this.engineBoost = 1;

        /* Timer events  */
        this._timers = {};

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setAllowDrag(true);
        this.depth = 100;

        this.cursors = scene.input.keyboard.createCursorKeys();

        /* Glow */
        this.glow = scene.add.image(x, y, 'ship-glow');
        this.glow.visible = false;
        this.glow.depth = 99;

        /* Attraction zone */
        this.attractionZone = scene.add.zone(x, y);
        scene.physics.world.enable(this.attractionZone);

        /* Particles */
        this.particles = {};
        var particleShape = new Phaser.Geom.Circle(0, 0, 200);

        /* Stars */
        this.particles.stars = scene.add.particles('star');
        this.particles.stars.emitter = this.particles.stars.createEmitter({
            emitZone: { type: 'random', source: particleShape },
            scale: { start: 0.8, end: 0.2 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
        }).startFollow(this);
        this.particles.stars.emitter.stop();

        /* Dots */
        this.particles.dots = scene.add.particles('dot');
        this.particles.dots.emitter = this.particles.dots.createEmitter({
            emitZone: { type: 'random', source: particleShape },
            scale: { start: 0.8, end: 0.2 },
            alpha: { start: 1, end: 0 },
            lifespan: 800   ,
        }).startFollow(this);
        this.particles.dots.emitter.stop();

        /* Finaly set ship type */
        this.setType(type);

        /* Cleanup on destroy event */
        this.on('destroy', () => {
            Object.keys(this.particles).forEach(prop => {
                this.particles[prop].emitter.stop();
                this.particles[prop].destroy();
            });

            Object.keys(this._timers).forEach(prop => {
                this._timers[prop].destroy();
            });

            this.attractionZone.destroy();
            this.glow.destroy();
        }, this);
    }

    preUpdate() {
        /* Update attraction zone position */
        this.attractionZone.setPosition(this.x, this.y);
        this.glow.setPosition(this.x, this.y);
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
            this.setAccelerationY(-accel * this.engineBoost);
        } else if (this.cursors.down.isDown) {
            this.playThrust(1);

            if (this.body.velocity.y < 0)
                this.setVelocityY(0);
            this.setAccelerationY(accel * this.engineBoost);
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
        this.attractionZone.setScale(scale);
        this.glow.setScale(scale);

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

        /* Update attraction zone size */
        const radius = this.body.width * 0.8;
        this.attractionZone.body.setCircle(radius, -radius, -radius);

        /* Update world bounds to allow half the ship to be outside */
        this.scene.physics.world.setBounds(
            0,
            -(ship_box_height * scale) / 2,
            game.config.width,
            game.config.height + ship_box_height * scale
        );
    }

    enableGlow(tint) {
        this.glow.tint = tint;
        this.glow.visible = true;
        this.glow.alpha = 0;
        this.scene.tweens.add({
            targets: this.glow,
            alpha: 0.32,
            duration: 100,
        });
    }

    disableGlow() {
        this.scene.tweens.add({
            targets: this.glow,
            alpha: 0,
            duration: 100,
            onComplete: () => {
                this.glow.visible = false;
            },
        });
    }

    enableUpgrade(color) {
        this.enableGlow(color);
        this.particles.dots.emitter.start();
        Sounds.play('lightspeed/powerup/upgrade');
        Sounds.playLoop('lightspeed/bg/powerup/upgrade');
    }

    disableUpgrade() {
        this.disableGlow();
        this.particles.dots.emitter.stop();
        Sounds.stop('lightspeed/bg/powerup/upgrade');
    }

    shrink(delay) {
        globalParameters.shrinkUpgradeActivateCount++;

        /* Reset old event */
        if (this._timers.shrink) {
            this._timers.shrink.elapsed = 0;
            return;
        }

        this.scene.tweens.add({
            targets: this,
            scaleX: 0.2,
            scaleY: 0.2,
            duration: 700,
            ease: 'Elastic',
            easeParams: [1.4, 0.6],
        });
        this.enableUpgrade(UPGRADE_COLOR);

        /* Restore ship size */
        this._timers.shrink = this.scene.time.delayedCall(delay, () => {
            const scale = this.scene.params.shipSize / 100;
            this.scene.tweens.add({
                targets: this,
                scaleX: scale,
                scaleY: scale,
                duration: 700,
                ease: 'Elastic',
                easeParams: [1.4, 0.6],
            });
            this.disableUpgrade();
            delete this._timers.shrink;
        }, null, this);
    }

    increaseAttraction(delay, scale) {
        globalParameters.attractionUpgradeActivateCount++;

        /* Reset old event */
        if (this._timers.attraction) {
            this._timers.attraction.elapsed = 0;
            return;
        }

        const shipScale = this.scene.params.shipSize / 100;
        this.attractionZone.setScale(shipScale * scale);
        this.enableUpgrade(UPGRADE_COLOR);

        /* Restore ship attraction size */
        this._timers.attraction = this.scene.time.delayedCall(delay, () => {
            this.attractionZone.setScale(shipScale);
            this.disableUpgrade();
            delete this._timers.attraction;
        }, null, this);
    }

    engineUpgrade(delay, boost) {
        globalParameters.engineUpgradeActivateCount++;

        /* Reset old event */
        if (this._timers.engine) {
            this._timers.engine.elapsed = 0;
            return;
        }

        this.engineBoost = boost;
        this.enableUpgrade(UPGRADE_COLOR);

        /* Restore engine boost */
        this._timers.engine = this.scene.time.delayedCall(delay, () => {
            this.engineBoost = 1;
            this.disableUpgrade();
            delete this._timers.engine;
        }, null, this);
    }

    invulnerable(delay) {
        globalParameters.invulnerablePowerupActivateCount++;

        /* Reset old event */
        if (this._timers.invulnerable) {
            this._timers.invulnerable.elapsed = 0;
            return;
        }

        Sounds.play('lightspeed/powerup/invulnerable');
        Sounds.playLoop('lightspeed/bg/powerup/invulnerable');

        this.isInvulnerable = true;
        this.enableGlow(INVULNERABLE_COLOR);
        this.particles.stars.emitter.start();

        this._timers.invulnerable = this.scene.time.delayedCall(delay, () => {
            this.isInvulnerable = false;
            this.particles.stars.emitter.stop();
            this.disableGlow();
            Sounds.stop('lightspeed/bg/powerup/invulnerable');
            delete this._timers.invulnerable;
        }, null, this);
    }
}

