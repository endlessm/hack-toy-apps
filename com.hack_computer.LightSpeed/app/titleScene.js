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

/* exported TitleScene */
/* global Logo, shipTypes, ASTRONAUT_PARTICLE_COLORS */

const kcode = [38, 38, 40, 40, 37, 39, 37, 39, 65, 66];

class TitleScene extends Phaser.Scene {
    constructor(...args) {
        super(...args);
        this._loadedState = false;
        this._playerReady = false;
    }

    preload() {
        /* Images */
        this.load.image('logo', 'assets/logo.png');
        this.load.image('particle', 'assets/particles/particle.png');
        this.load.image('astronaut', 'assets/astronaut.png');
        this.load.image('tch', 'assets/tch.png');

        this.load.atlas('logo-particles', 'assets/atlas/logo-particles.png',
            'assets/atlas/logo-particles.json');

        /* Ship assets */
        for (const ship of shipTypes)
            this.load.image(ship, `assets/ships/${ship}.png`);
    }

    create() {
        const {centerX, centerY} = this.cameras.main;

        /* Reset Camera FX */
        this.cameras.main.resetFX();

        this.scene.launch('background', levelParameters[0].shipSpeed);
        this.scene.moveDown('background');

        /* Bottom text */
        var text = this.add.text(0, 0, 'Press ENTER to start.', fontConfig);
        text.setOrigin(0.5, 0.5);
        text.setPosition(centerX, centerY * 1.8);
        this.tweens.add({
            targets: text,
            alpha: 0.16,
            duration: 600,
            ease: 'Sine',
            yoyo: true,
            repeat: -1,
        });

        /* Ship */
        this.ship = this.physics.add.image(-500,
            Phaser.Math.RND.integerInRange(0, centerY * 2), 'spaceship');
        this.ship.setVelocityX(Phaser.Math.RND.integerInRange(32, 256));
        this.ship.setScale(0.5);

        /* Astronaut particles */
        var particles = this.add.particles('particle');

        /* Logo */
        this.add.existing(new Logo(this, centerX, centerY - centerY / 3));

        /* Astronaut */
        this.astronaut = this.physics.add.image(centerX, centerY, 'astronaut');
        this.astronaut.setVelocity(Phaser.Math.RND.integerInRange(16, 96),
            Phaser.Math.RND.integerInRange(16, 96));
        this.astronaut.setBounce(1, 1);
        this.astronaut.setCollideWorldBounds(true);
        this.astronaut.setScale(0.3);
        this.tweens.add({
            targets: this.astronaut,
            scaleX: 1,
            scaleY: 1,
            duration: 8000,
            ease: 'Sine',
            yoyo: true,
            repeat: -1,
        });

        var emitter = particles.createEmitter({
            speed: 100,
            scale: {start: 1, end: 0},
            blendMode: 'ADD',
            lifespan: 3000,
            tint: ASTRONAUT_PARTICLE_COLORS,
        });
        emitter.startFollow(this.astronaut);

        /* Fade in scene */
        this.cameras.main.fadeIn(200);

        var combo = this.input.keyboard.createCombo(kcode, {resetOnMatch: true});
        this.input.keyboard.on('keycombomatch', () => {
            this.astronaut.setTexture('tch');
            combo.tch = true;
        });

        /* Fade out when enter key is released */
        this.input.keyboard.on('keyup_ENTER', () => {
            this.playerIsReady();
        });

        this.events.on('shutdown', () => {
            this.input.keyboard.shutdown();
            Sounds.stop('lightspeed/bg/2001-hardcore');
        }, this);

        Sounds.playLoop('lightspeed/bg/2001-hardcore');

        /* Reset Global game state */
        globalParameters.currentLevel = 0;
        globalParameters.playing = false;
        globalParameters.paused = false;
    }

    update() {
        const {width, height} = this.cameras.main;

        const {ship} = this;
        const ship_vx = ship.body.velocity.x;

        if (ship_vx > 0 && ship.x > width + 500 ||
            ship_vx < 0 && ship.x < -500) {
            ship.y = Phaser.Math.RND.integerInRange(0, height);

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

    doneLoadingState() {
        this._loadedState = true;
        if (this._playerReady)
            this.scene.start('start');
    }

    playerIsReady() {
        this._playerReady = true;
        if (this._loadedState)
            this.scene.start('start');
    }
}

