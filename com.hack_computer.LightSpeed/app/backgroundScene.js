/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported BackgroundScene */

class BackgroundScene extends Phaser.Scene {
    preload() {
        this.load.image('background', 'assets/background.jpg');
        this.load.atlas('background-particles', 'assets/atlas/background-particles.png',
            'assets/atlas/background-particles.json');
    }

    create(speed) {
        const width = game.config.width;
        const height = game.config.height;
        var screen = new Phaser.Geom.Rectangle(-50, 0, width + 100, height);
        var offscreen = new Phaser.Geom.Line(width + 50, 0, width + 50, height);
        const v = speed / 20;

        this.cameras.main.fadeIn(200);

        /* Background */
        this.bgA = this.physics.add.image(0, 0, 'background');
        this.bgB = this.physics.add.image(this.bgA.width, 0, 'background');

        this.bgA.setOrigin(0, 0);
        this.bgB.setOrigin(0, 0);
        this.bgB.flipX = true;

        this.bgA.setVelocityX(-v);
        this.bgB.setVelocityX(-v);

        this.backgrounds = [this.bgA, this.bgB];

        /* Create Particles */
        var bg = {
            emitZone: {source: screen},
            deathZone: {source: screen, type: 'onLeave'},
            scale: {max: 1, min: 0.3},
            lifespan: 100000,
            blendMode: 'ADD',
        };

        var background = this.add.particles('background-particles');
        this.bg1 = background.createEmitter(Object.assign(bg, {
            frame: ['bg-p1', 'bg-p2', 'bg-p3', 'bg-p4'],
            frequency: 500,
            speedX: {min: v * -1.1, max: v * -1.4},
        }));
        this.bg2 = background.createEmitter(Object.assign(bg, {
            frame: ['bg-p5', 'bg-p6'],
            frequency: 700,
            speedX: {min: v * -1.5, max: v * -2},
        }));

        this.bg1.emitParticle(96);
        this.bg1.setEmitZone({source: offscreen});

        this.bg2.emitParticle(24);
        this.bg2.setEmitZone({source: offscreen});


        this.events.on('shutdown', () => {
            this.input.keyboard.shutdown();
        }, this);
    }

    update() {
        for (let i = 0, n = this.backgrounds.length; i < n; i++) {
            const bg = this.backgrounds[i];

            if (bg.width + bg.x <= 0)
                bg.x += bg.width * n;
        }
    }

    setSpeed(speed) {
        const v = speed / 20;

        /* Update Backgrounds speed */
        for (let i = 0, n = this.backgrounds.length; i < n; i++)
            this.backgrounds[i].setVelocityX(-v);

        /* Update Particles speed */
        this.bg1.setSpeedX({min: v * -1.1, max: v * -1.4});
        this.bg2.setSpeedX({min: v * -1.5, max: v * -2});

        const _velocity = this._velocity || v;

        this.bg1.forEachAlive(p => {
            p.velocityX = v * p.velocityX / _velocity;
        });
        this.bg2.forEachAlive(p => {
            p.velocityX = v * p.velocityX / _velocity;
        });

        this._velocity = v;
    }
}

