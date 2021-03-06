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

/* exported LevelScene, CONFETTI_COLORS, ASTRONAUT_PARTICLE_COLORS */
/* global Ship, enemyTypes, saveState, shipTypes, powerupTypes,
    SpawnAstronautScope, SpawnEnemyScope, UpdateEnemyScope, SpawnPowerupScope,
    ActivatePowerupScope, resetGlobalCounters */

const CONFETTI_COLORS = [
    0x1500ff,
    0x93e51f,
    0xe6481c,
    0xb078fb,
    0xfde82a,
    0x00ffee,
    0xff0099,
];

const ASTRONAUT_PARTICLE_COLORS = [
    0x7cd7f7,
    0x67ccf1,
    0x00aeef,
];

const LEFT_BOUNDARY = -512;

function getUserFunction(code) {
    if (!code)
        return null;

    var retval = null;

    try {
        // eslint-disable-next-line no-new-func
        retval = new Function('scope', `with(scope){\n${code}\n;}`);
    } catch (e) {
        retval = null;
        if (!(e instanceof SyntaxError || e instanceof ReferenceError))
            // FIXME reflect the error in the game somehow
            console.error(e);  // eslint-disable-line no-console
    }

    return retval;
}

class LevelScene extends Phaser.Scene {
    init(data) {
        this.params = data;

        this.resetQuestData();

        /* Create userScope */
        this.spawnAstronautScope = new SpawnAstronautScope();
        this.spawnEnemyScope = new SpawnEnemyScope();
        this.spawnPowerupScope = new SpawnPowerupScope();
        this.activatePowerupScope = new ActivatePowerupScope();
        this.updateEnemyScope = {};

        /* Init scene variables */
        this.tick = 0;

        /* Get user functions */
        this.spawnEnemy = getUserFunction(data.spawnEnemyCode);
        this.spawnAstronaut = getUserFunction(data.spawnAstronautCode);
        this.spawnPowerup = getUserFunction(data.spawnPowerupCode);

        /* We have one global function for each enemy type */
        this.updateEnemy = {};
        for (const o of enemyTypes) {
            const capitalizedName = o.charAt(0).toUpperCase() + o.slice(1);
            this.updateEnemy[o] = getUserFunction(
                globalParameters[`update${capitalizedName}Code`]
            );
            this.updateEnemyScope[o] = new UpdateEnemyScope();
        }

        /* Global powerup function */
        this.activatePowerup = getUserFunction(globalParameters.activatePowerupCode);
    }

    preload() {
        /* Common assets */
        this.load.image('astronaut', 'assets/astronaut.png');
        this.load.image('particle', 'assets/particles/particle.png');
        this.load.image('star', 'assets/particles/star.png');
        this.load.image('dot', 'assets/particles/dot.png');
        this.load.image('blowup-particle', 'assets/particles/blowup.png');
        this.load.atlas('explosion-particles', 'assets/atlas/explosion-particles.png',
            'assets/atlas/explosion-particles.json');
        this.load.atlas('confetti-particles', 'assets/atlas/confetti-particles.png',
            'assets/atlas/confetti-particles.json');

        /* Ship assets */
        for (const ship of shipTypes)
            this.load.image(ship, `assets/ships/${ship}.png`);
        this.load.image('ship-glow', 'assets/ships/glow.png');

        /* Enemy assets */
        for (const enemy of enemyTypes)
            this.load.image(enemy, `assets/enemies/${enemy}.png`);

        /* Powerup assets */
        for (const powerup of powerupTypes)
            this.load.image(powerup, `assets/powerups/${powerup}.png`);
    }

    create() {
        /* Reset Global game state */
        globalParameters.success = false;
        globalParameters.score = 0;

        const centerY = game.config.height / 2;

        /* Fade in scene */
        this.cameras.main.fadeIn(200);

        this.scene.launch('background', this.params.shipSpeed);
        this.background = this.scene.get('background');

        /* Ship */
        this.ship = new Ship(this, this.params.shipAsset, 256, centerY);

        /* Create objects groups */
        this.astronauts = this.physics.add.group();
        this.physics.add.overlap(this.ship.attractionZone, this.astronauts,
            this.onShipAstronautOverlap, null, this);

        this.powerups = this.physics.add.group();
        this.physics.add.overlap(this.ship.attractionZone, this.powerups,
            this.onShipPowerupOverlap, null, this);

        this.enemies = {};
        for (const o of enemyTypes) {
            this.enemies[o] = this.physics.add.group();
            this.physics.add.overlap(this.ship, this.enemies[o],
                this.onShipEnemyOverlap, null, this);
        }

        /* User coordinate transformation matrix
         * It reflects on the X axis and translate by game height
         *
         * Use transformPoint() method to transform TO user space coordinates
         * Use applyInverse() method to transform FROM user space coordinates
         */
        this.userSpace = new Phaser.GameObjects.Components.TransformMatrix(
            1, 0,
            0, -1,
            0, game.config.height
        );

        /* Score Box */
        this.createScoreBox('Level: 00 Rescued: 00/00');
        this.updateScore();

        /* Create particles emitters */
        this.createParticles();

        /* Listen to properties changes */
        this.game.events.on('global-property-change',
            this.onGlobalPropertyChange, this);

        this.events.on('shutdown', () => {
            this.ship.playThrust(0);
            Sounds.stop('lightspeed/bg/level-loop1');

            this.input.keyboard.shutdown();
            this.game.events.off('global-property-change',
                this.onGlobalPropertyChange, this);
        }, this);

        this.updatePlayingState();
    }

    update() {
        /* Skip every other update */
        this.odd_tick = !this.odd_tick;

        if (this.odd_tick ||
            globalParameters.paused ||
            !globalParameters.playing)
            return;

        /* Update variables */
        this.tick++;

        /* Handle ship movement */
        this.ship.handleInput(this.params.shipAcceleration, this.params.shipDrag);

        /* Execute spawn functions */
        this.runSpawnEnemy();
        this.runSpawnAstronaut();
        this.runSpawnPowerup();
        this.runUpdateEnemy();

        this.checkAstronautPosition();
        this.checkAsteroidPosition();
        this.checkPowerUpPosition();
    }

    onFlip() {
        this.resetQuestData();
        saveState();
    }

    /* Private functions */
    destroySprite(obj) {
        void this;
        obj.disableBody(true, true);
        if (obj.emitter) {
            obj.emitter.stop();
            obj.particles.destroy();
        }
        obj.destroy();
    }

    runWithScope(func, scope, data = {}) {
        var retval = null;
        data.tick = this.tick;

        try {
            if (scope.update(data)) {
                retval = func(scope);
                scope.postUpdate(retval);
            }
        } catch (e) {
            /* User function error! */
            console.error(e);  // eslint-disable-line no-console
        }

        return retval;
    }

    createParticles() {
        this.particles = {};

        /* Explosion */
        var explosion = this.add.particles('explosion-particles');
        this.particles.explosion = explosion.createEmitter({
            frame: ['explosion-p1', 'explosion-p2', 'explosion-p3'],
            speed: {min: -800, max: 800},
            angle: {min: 0, max: 360},
            scale: {start: 2, end: 0},
            blendMode: 'SCREEN',
            lifespan: 800,
        });
        this.particles.explosion.stop();
        explosion.depth = 101;

        /* Blowup Explosion */
        var blowup = this.add.particles('blowup-particle');
        this.particles.blowup = blowup.createEmitter({
            speed: {min: -800, max: 800},
            angle: {min: 0, max: 360},
            scale: {start: 2, end: 0},
            blendMode: 'SCREEN',
            lifespan: 800,
        });
        this.particles.blowup.stop();
        blowup.depth = 101;

        /* Confetti */
        var confetti = this.add.particles('confetti-particles');
        this.particles.confetti = confetti.createEmitter({
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
        this.particles.confetti.stop();
    }

    resetQuestData() {
        /* Reset counters */
        resetGlobalCounters();

        this.firstObjectOfType = [];
        for (let i = 0, n = enemyTypes.length; i < n; i++)
            this.firstObjectOfType[i] = null;
    }

    updatePausedState() {
        if (globalParameters.paused) {
            /* Pause the physics engine instead of the scene to keep sprites
             * updates working
             */
            this.scene.launch('pause');
            this.physics.pause();

            this.ship.playThrust(0);
            Sounds.stop('lightspeed/bg/level-loop1');
        } else {
            this.physics.resume();
            Sounds.playLoop('lightspeed/bg/level-loop1');
        }
    }

    updatePlayingState() {
        if (globalParameters.playing) {
            this.physics.resume();
            Sounds.play('lightspeed/timpani-start-win');
            Sounds.playLoop('lightspeed/bg/level-loop1');
        } else {
            this.physics.pause();

            this.ship.playThrust(0);
            Sounds.stop('lightspeed/timpani-start-win');
            Sounds.stop('lightspeed/bg/level-loop1');
        }
    }

    onGlobalPropertyChange(obj, property) {
        if (Object.is(globalParameters, obj))
            this.onGlobalParametersNotify(property);
        else if (Object.is(this.params, obj))
            this.onParametersNotify(property);
    }

    /* This will be called each time something in globalParameters changes */
    onGlobalParametersNotify(property) {
        if (property === 'score') {
            this.updateScore();
        } else if (property === 'paused') {
            this.updatePausedState();
        } else if (property === 'playing') {
            this.updatePlayingState();
        } else if (property === 'activatePowerupCode') {
            this.activatePowerup = getUserFunction(globalParameters.activatePowerupCode);
        } else if (property.endsWith('Code')) {
            const func = getUserFunction(globalParameters[property]);
            const enemyName = property.slice(6, -4).toLowerCase();

            if (enemyTypes.includes(enemyName))
                this.updateEnemy[enemyName] = func;
        }
    }

    /* This will be called each time something in this.params changes */
    onParametersNotify(property) {
        if (property === 'scoreTarget') {
            this.updateScore();
        } else if (property === 'shipAsset') {
            this.ship.setType(this.params.shipAsset);
        } else if (property === 'shipSize') {
            this.ship.setScale(this.params.shipSize / 100);
        } else if (property === 'shipSpeed') {
            this.background.setSpeed(this.params.shipSpeed);
        } else if (property === 'astronautSize') {
            this.astronauts.getChildren().forEach(astronaut => {
                astronaut.setScale(this.params.astronautSize / 100);
            });
        } else if (property.endsWith('Code')) {
            const func = getUserFunction(this.params[property]);
            const funcName = property.slice(0, -4);

            if (funcName in this)
                this[funcName] = func;
        }
    }

    createEnemy(type, position, scale) {
        /* Create enemy object */
        var obj = this.physics.add.sprite(position.x, position.y, type);

        obj.enemyType = type;

        /* Add user data object to use in update function */
        obj.userData = {};

        /* Add to enemy group */
        this.enemies[type].add(obj);

        /* Set depth */
        obj.depth = 1;

        /* Set a scale */
        const s = scale ? scale / 100 : 1;

        if (scale)
            obj.setScale(s);

        /* FIXME: improve enemy shape handling */
        if (type === 'asteroid') {
            obj.setCircle(230, 28, 28);
        } else if (type === 'spinner') {
            obj.setCircle(161, 94, 94);
            obj.body.setAllowRotation(true);
            const v = Phaser.Math.RND.integerInRange(-3, 3) || 1;
            obj.body.setAngularVelocity(v * 128);
        } else if (type === 'squid') {
            obj.setSize(390, 150).setOffset(26, 60);
            this.tweens.add({
                targets: obj,
                scaleX: s * 0.7,
                duration: 600,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
            });
        } else if (type === 'beam') {
            obj.setSize(78, 334).setOffset(112, 86);
            this.tweens.add({
                targets: obj,
                scaleY: s * 0.6,
                duration: 600,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
            });
        }

        return obj;
    }

    updateScore() {
        const level = globalParameters.currentLevel;
        const score = globalParameters.score;
        const target = this.params.scoreTarget;

        this.scoreText.setText(`Level: ${level} Rescued: ${score}/${target}`);

        /* Update position */
        this.scoreText.x = (this.scoreBox.width - this.scoreText.width) / 2;

        /* Check target score and time limit in case they were hacked */
        this.checkLevelDone();
    }

    createScoreBox(text) {
        this.scoreText = this.add.text(16, 8, text, fontConfig);
        const w = this.scoreText.width + 32;
        const h = this.scoreText.height + 16;

        this.scoreBox = this.add.container(
            (game.config.width - w) / 2, 4,
            [new Utils.TransparentBox(this, w, h), this.scoreText]);
        this.scoreBox.setSize(w, h);

        this.scoreBox.depth = 100;
    }

    checkAstronautPosition() {
        const children = this.astronauts.getChildren();
        const shipCenter = this.ship.body.center;
        const x = this.ship.x;

        for (const astronaut of children) {
            /* FIXME: use a zone behind the ship to check if we missed the
             * astronaut or not.
             */
            if (!astronaut._missed && x > astronaut.x &&
                shipCenter.distance(astronaut.body.center) > astronaut.height) {
                Sounds.play('lightspeed/astronaut-missed');
                astronaut._missed = true;
            }

            /* Destroy astronauts that are lost to prevent slowdown */
            if (astronaut.x + astronaut.displayWidth < LEFT_BOUNDARY)
                this.destroySprite(astronaut);
        }
    }

    checkAsteroidPosition() {
        const children = this.enemies.asteroid.getChildren();
        const x = this.ship.x;

        for (const asteroid of children) {
            /* FIXME: use a zone that follows the ship to test if the asteroid
             * is near by the ship.
             */
            if (!asteroid._passed && x > asteroid.x + asteroid.displayWidth / 2) {
                Sounds.play('lightspeed/asteroid-passing');
                asteroid._passed = true;
            }
        }
    }

    checkPowerUpPosition() {
        const children = this.powerups.getChildren();

        for (const powerup of children) {
            /* Destroy powerup that are lost to prevent slowdown */
            if (powerup.x + powerup.displayWidth < LEFT_BOUNDARY)
                this.destroySprite(powerup);
        }
    }

    checkLevelDone() {
        if (!globalParameters.playing ||
            globalParameters.score < this.params.scoreTarget)
            return;

        globalParameters.success = true;
        globalParameters.playing = false;

        /* Go back to title if this was the last level */
        if (globalParameters.currentLevel < globalParameters.availableLevels)
            globalParameters.nextLevel = globalParameters.currentLevel + 1;
        else
            globalParameters.nextLevel = 0;

        /* Save game state when level is finished */
        saveState();

        this.scene.launch('continue',
            `Level ${globalParameters.currentLevel} Complete!`);
    }

    runSpawnEnemy() {
        if (!this.spawnEnemy)
            return;

        var scope = this.spawnEnemyScope;
        var retval = this.runWithScope(this.spawnEnemy, scope);

        /*
         * Retval can be a string that defines the enemy type or an
         * object with the following members:
         *
         * {
         *   type: string
         *   x: int
         *   y: int
         *   scale: 0-100
         *   velocity: { x: int, y: int }
         * }
         */
        if (retval) {
            if (typeof retval === 'string')
                retval = {type: retval};

            var type = retval.type;
            /* Make sure type is a valid enemy */
            if (!enemyTypes.includes(type))
                return;

            // eslint-disable-next-line no-undefined
            if (retval.x === undefined)
                retval.x = scope.width + scope.random(100, 400);

            // eslint-disable-next-line no-undefined
            if (retval.y === undefined)
                retval.y = scope.random(0, scope.height);

            // eslint-disable-next-line no-undefined
            if (retval.scale === undefined)
                retval.scale = scope.random(20, 80);

            var pos = this.userSpace.applyInverse(retval.x, retval.y);
            var obj = this.createEnemy(type, pos, retval.scale);

            /* Increment global counter */
            var enemyTypeIndex = enemyTypes.indexOf(type);
            if (this.firstObjectOfType[enemyTypeIndex] === null) {
                this.firstObjectOfType[enemyTypeIndex] = obj;
                obj.enemyTypeIndex = enemyTypeIndex;
                obj.isFirstOne = true;
            }

            globalParameters[`enemyType${enemyTypeIndex}SpawnedCount`]++;

            /* Set object velocity */
            // eslint-disable-next-line no-undefined
            if (retval.velocity && retval.velocity.x !== undefined) {
                obj.setVelocityX(-this.params.shipSpeed + retval.velocity.x);
            } else {
                var speedFactor = 0.5 + Phaser.Math.RND.frac();
                obj.setVelocityX(-this.params.shipSpeed * speedFactor);
            }

            if (retval.velocity && retval.velocity.y)
                obj.setVelocityY(-retval.velocity.y);
        }
    }

    spawnedSomeEnemy() {
        void this;
        for (let i = 0, n = enemyTypes.length; i < n; i++) {
            if (globalParameters[`enemyType${i}SpawnedCount`] > 0)
                return true;
        }
        return false;
    }

    runSpawnAstronaut() {
        if (!this.spawnAstronaut)
            return;

        if (!this.spawnedSomeEnemy())
            return;

        var scope = this.spawnAstronautScope;
        var retval = this.runWithScope(this.spawnAstronaut, scope);

        if (retval) {
            var pos = this.userSpace.applyInverse(retval.x, retval.y);
            var obj = this.physics.add.sprite(pos.x, pos.y, 'astronaut');
            this.astronauts.add(obj);
            obj.depth = 1;

            /* Set object velocity */
            // eslint-disable-next-line no-undefined
            if (retval.velocity && retval.velocity.x !== undefined) {
                obj.setVelocityX(-(this.params.shipSpeed + retval.velocity.x));
            } else {
                var speedFactor = 0.5 + 0.5 * Phaser.Math.RND.frac();
                obj.setVelocityX(-this.params.shipSpeed * speedFactor);
            }

            var scale = retval.scale || this.params.astronautSize;
            obj.setScale(scale / 100);

            /* FIXME: improve colission shape */
            obj.body.setAllowRotation(true);
            obj.body.setAngularVelocity(Phaser.Math.RND.integerInRange(-90, 90));

            obj.particles = this.add.particles('particle');
            obj.emitter = obj.particles.createEmitter({
                speed: 100,
                scale: {start: 0.6, end: 0},
                blendMode: 'ADD',
                lifespan: 1000,
                tint: ASTRONAUT_PARTICLE_COLORS,
            }).startFollow(obj);
        }
    }

    runSpawnPowerup() {
        if (!this.spawnPowerup ||
            !this.spawnedSomeEnemy())
            return;

        var scope = this.spawnPowerupScope;
        var retval = this.runWithScope(this.spawnPowerup, scope);

        if (retval && powerupTypes.indexOf(retval) >= 0) {
            const x = scope.width + scope.random(100, 400);
            const y = scope.random(0, scope.height);

            var obj = this.physics.add.sprite(x, y, retval);
            this.powerups.add(obj);
            obj.depth = 1;
            var speedFactor = 0.5 + 0.5 * Phaser.Math.RND.frac();
            obj.setVelocityX(-this.params.shipSpeed * speedFactor);
            obj.setScale(0.25);

            if (retval === 'invulnerable') {
                obj.particles = this.add.particles('star');
                obj.emitter = obj.particles.createEmitter({
                    speed: 100,
                    angle: {min: 0, max: 360},
                    scale: {start: 1, end: 0},
                    blendMode: 'SCREEN',
                    lifespan: 1200,
                }).startFollow(obj);
            }

            /* Increment powerup count */
            globalParameters[`${retval}PowerupSpawnCount`]++;
        }
    }

    callUpdateEnemy(updateEnemy, scope, obj) {
        const vx = obj.body.velocity.x + this.params.shipSpeed;
        const vy = -obj.body.velocity.y;

        var enemy = {
            position: this.userSpace.transformPoint(obj.x, obj.y),
            velocity: {x: vx, y: vy},
            data: obj.userData,
        };
        var playerShip = {
            position: this.userSpace.transformPoint(this.ship.x, this.ship.y),
        };

        this.runWithScope(updateEnemy, scope, {
            playerShip,
            enemy,
        });

        /* Transform back from user space coordinates */
        const position = this.userSpace.applyInverse(enemy.position.x,
            enemy.position.y);

        /* Update position */
        if (obj.x !== position.x)
            obj.x = position.x;

        if (obj.y !== position.y)
            obj.y = position.y;

        /* Update velocity */
        if (vx !== enemy.velocity.x)
            obj.setVelocityX(-this.params.shipSpeed + enemy.velocity.x);
        if (vy !== enemy.velocity.y)
            obj.setVelocityY(-enemy.velocity.y);
    }

    runUpdateEnemy() {
        /* Iterate over enemy types */
        for (const o of enemyTypes) {
            const updateEnemy = this.updateEnemy[o];

            if (!updateEnemy)
                continue;

            var scope = this.updateEnemyScope[o];

            /* Iterate over enemies */
            const children = this.enemies[o].getChildren();
            for (const obj of children) {
                this.callUpdateEnemy(updateEnemy, scope, obj);

                if (obj.isFirstOne) {
                    const index = obj.enemyTypeIndex;
                    const {y} = this.userSpace.transformPoint(obj.x, obj.y);

                    /* Update enemy type min/max globals */
                    globalParameters[`enemyType${index}MinY`] =
                        Math.min(y, globalParameters[`enemyType${index}MinY`]);
                    globalParameters[`enemyType${index}MaxY`] =
                        Math.max(y, globalParameters[`enemyType${index}MaxY`]);

                    /* Destroy particles if object it out of screen */
                    if (obj.emitter && obj.x + obj.displayWidth < 0) {
                        obj.emitter.stop();
                        obj.particles.destroy();
                        delete obj.emitter;
                        delete obj.particles;
                    }
                } else if (obj.x + obj.displayWidth < 0) {
                    /* Destroy enemies that left the screen! */
                    this.destroySprite(obj);
                }
            }
        }
    }

    onShipEnemyOverlap(attractionZone, enemy) {
        if (!globalParameters.playing || this.ship.isInvulnerable)
            return;

        globalParameters.playing = false;
        Sounds.play('lightspeed/asteroid-crash');
        this.scene.launch('gameover');

        /* Make ship explode! */
        this.particles.explosion.explode(768, (this.ship.x + enemy.x) / 2,
            (this.ship.y + enemy.y) / 2);
        this.ship.destroy();
    }

    onShipAstronautOverlap(attractionZone, astronaut) {
        if (!globalParameters.playing)
            return;

        /* Update Score */
        globalParameters.score++;
        this.updateScore();

        /* Remove astronaut from collistion group */
        this.astronauts.remove(astronaut);

        /* Make it move to the ship */
        this.physics.moveToObject(astronaut, this.ship, 300);

        /* while making it smaller and transparent */
        this.tweens.add({
            targets: astronaut,
            alpha: 0,
            scaleX: 0.2,
            scaleY: 0.2,
            duration: 500,
            onComplete: () => {
                /* Confetti! */
                this.particles.confetti.explode(256, astronaut.x, astronaut.y);
                this.destroySprite(astronaut);
            },
        });

        /* Play thank you sound */
        Sounds.play('lightspeed/astronaut-thanks');
    }

    destroyEnemies() {
        globalParameters.blowupPowerupActivateCount++;

        Sounds.play('lightspeed/powerup/blowup');

        /* Iterate over enemy types */
        for (const o of enemyTypes) {
            /* Iterate over enemies */
            const children = this.enemies[o].getChildren();
            for (const obj of children)
                this.particles.blowup.explode(768, obj.x, obj.y);

            this.enemies[o].clear(true, true);
        }

        this._blowUpEnemies = false;
    }

    runActivatePowerup(powerUpType) {
        if (!globalParameters.playing)
            return;

        /* Increment powerup pickup count */
        globalParameters[`${powerUpType}PowerupPickedCount`]++;

        if (!this.activatePowerup)
            return;

        var scope = this.activatePowerupScope;

        this.runWithScope(this.activatePowerup, scope, {
            shipPosition: this.userSpace.transformPoint(this.ship.x, this.ship.y),
            powerUpType,
        });

        /* Check if we need to destroy enemies */
        if (scope._blowUpEnemies)
            this.destroyEnemies();

        /* Make ship invulnerable */
        if (scope.ship.invulnerableTimer)
            this.ship.invulnerable(scope.ship.invulnerableTimer * 1000);

        /* Shrink ship */
        if (scope.ship.shrinkTimer)
            this.ship.shrink(scope.ship.shrinkTimer * 1000);

        /* Make attraction zone bigger */
        if (scope.ship.attractTimer)
            this.ship.increaseAttraction(scope.ship.attractTimer * 1000, 2);

        /* Enable engine boost */
        if (scope.ship.engineTimer)
            this.ship.engineUpgrade(scope.ship.engineTimer * 1000, 2);
    }

    onShipPowerupOverlap(attractionZone, powerup) {
        if (!globalParameters.playing)
            return;

        this.powerups.remove(powerup);
        this.physics.moveToObject(powerup, this.ship, 300);

        this.tweens.add({
            targets: powerup,
            alpha: 0,
            scaleX: 0.2,
            scaleY: 0.2,
            duration: 500,
            onComplete: () => {
                this.runActivatePowerup(powerup.texture.key);
                this.destroySprite(powerup);
            },
        });
    }
}

