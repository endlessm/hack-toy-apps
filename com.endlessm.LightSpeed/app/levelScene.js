/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported LevelScene */
/* global enemyTypes, saveState, shipTypes, SpawnAstronautScope,
SpawnEnemyScope, UpdateEnemyScope */

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

        /* Init scene variables */
        this.tick = 0;

        /* Create userScope */
        this.spawnAstronautScope = new SpawnAstronautScope();
        this.spawnEnemyScope = new SpawnEnemyScope();
        this.updateEnemyScope = {};

        /* Get user functions */
        this.spawnEnemy = getUserFunction(data.spawnEnemyCode);
        this.spawnAstronaut = getUserFunction(data.spawnAstronautCode);

        /* We have one global function for each enemy type */
        this.updateEnemy = {};
        for (const o of enemyTypes) {
            const capitalizedName = o.charAt(0).toUpperCase() + o.slice(1);
            this.updateEnemy[o] = getUserFunction(
                globalParameters[`update${capitalizedName}Code`]
            );
            this.updateEnemyScope[o] = new UpdateEnemyScope();
        }
    }

    preload() {
        /* Common assets */
        this.load.image('background', 'assets/background.jpg');
        this.load.image('particle', 'assets/particle.png');
        this.load.image('astronaut', 'assets/astronaut.png');

        /* Ship assets */
        for (const ship of shipTypes)
            this.load.image(ship, `assets/ships/${ship}.png`);

        /* Enemy assets */
        for (const enemy of enemyTypes)
            this.load.image(enemy, `assets/enemies/${enemy}.png`);
    }

    create() {
        const {centerX, centerY} = this.cameras.main;

        /* Background */
        this.add.image(centerX, centerY, 'background');

        /* Fade in scene */
        this.cameras.main.fadeIn(200);

        /* Ship */
        this.createShip(256, centerY);

        /* Create objects groups */
        this.astronauts = this.physics.add.group();
        this.physics.add.overlap(this.ship, this.astronauts,
            this.onShipAstronautOverlap, null, this);

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

        /* Listen to properties changes */
        this.game.events.on('global-property-change', (obj, property) => {
            if (Object.is(globalParameters, obj))
                this.onGlobalParametersNotify(property);
            else if (Object.is(this.params, obj))
                this.onParametersNotify(property);
        });

        /* Go back to title screen */
        this.input.keyboard.on('keyup_ESC', () => {
            if (globalParameters.playing)
                this.scene.start('title');
        });

        this.cameras.main.on('camerafadeincomplete', () => {
            if (globalParameters.playing) {
                Sounds.play('lightspeed/timpani-start-win');
                Sounds.playLoop('lightspeed/bg/level-loop1');
            } else {
                this.scene.pause();
            }
        });

        this.events.on('pause', () => {
            this.playThrust(0);
            Sounds.stop('lightspeed/bg/level-loop1');
        }, this);

        this.events.on('shutdown', () => {
            Sounds.stop('lightspeed/bg/level-loop1');
        }, this);

        /* Reset Global game state */
        globalParameters.success = false;
        globalParameters.score = 0;
    }

    update() {
        /* Skip every other update */
        this.odd_tick = !this.odd_tick;

        if (this.odd_tick)
            return;

        /* Pause scene if param changed */
        if (globalParameters.paused) {
            /* Pause the physics engine instead of the scene to keep sprites
             * updates working
             */
            if (!this.physics.world.isPaused) {
                if (this._playingThrustUp)
                    Sounds.updateSound('lightspeed/thrust-up', 500, {volume: 0});
                if (this._playingThrustDown)
                    Sounds.updateSound('lightspeed/thrust-down', 500, {volume: 0});
                this.scene.launch('pause');
                this.physics.pause();
            }
            return;
        } else if (this.physics.world.isPaused) {
            Sounds.play('lightspeed/timpani-start-win');
            if (this._playingThrustUp)
                Sounds.updateSound('lightspeed/thrust-up', 500, {volume: 1});
            if (this._playingThrustDown)
                Sounds.updateSound('lightspeed/thrust-down', 500, {volume: 1});
            this.scene.stop('pause');
            this.physics.resume();
        }

        /* Input */
        var cursors = this.input.keyboard.createCursorKeys();

        const accel = this.params.shipAcceleration;

        if (cursors.up.isDown) {
            this.playThrust(-1);

            if (this.ship.body.velocity.y > 0)
                this.ship.setVelocityY(0);
            this.ship.setAccelerationY(-accel);
        } else if (cursors.down.isDown) {
            this.playThrust(1);

            if (this.ship.body.velocity.y < 0)
                this.ship.setVelocityY(0);
            this.ship.setAccelerationY(accel);
        } else {
            this.playThrust(0);

            this.ship.setAccelerationY(0);
            this.ship.body.setDrag(0, this.params.shipDrag);
        }

        /* Update variables */
        this.tick++;

        /* Update any graphics that might have been changed by the toolbox */
        if (this.ship.key !== this.params.shipAsset) {
            this.ship.setTexture(this.params.shipAsset);
            this._setShipCollisionBox();
        }
        this.ship.setScale(this.params.shipSize / 100);
        this.astronauts.getChildren().forEach(astronaut => {
            astronaut.setScale(this.params.astronautSize / 100);
        });

        /* Check target score and time limit in case they were hacked */
        this.checkLevelDone();

        /* Execute spawn functions */
        this.runSpawnEnemy();
        this.runSpawnAstronaut();
        this.runUpdateEnemy();

        this.checkAstronautPosition();
        this.checkAsteroidPosition();

        this.updateQuestData();
    }

    onFlip() {
        this.resetQuestData();
        saveState();
    }

    /* Private functions */

    resetQuestData() {
        /* Reset enemy counters */
        this.firstObjectOfType = [];
        for (let i = 0, n = enemyTypes.length; i < n; i++) {
            globalParameters[`enemyType${i}SpawnedCount`] = 0;
            globalParameters[`enemyType${i}MinY`] = +1e9;
            globalParameters[`enemyType${i}MaxY`] = -1e9;
            this.firstObjectOfType[i] = null;
        }
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

    /* This will be called each time something in globalParameters changes */
    onGlobalParametersNotify(property) {
        if (property === 'score') {
            this.updateScore();
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
        } else if (property.endsWith('Code')) {
            const func = getUserFunction(this.params[property]);
            const funcName = property.slice(0, -4);

            if (funcName in this)
                this[funcName] = func;
        }
    }

    updateQuestData() {
        enemyTypes.forEach((type, ix) => {
            const obj = this.firstObjectOfType[ix];
            if (obj) {
                const {y} = this.userSpace.transformPoint(0, obj.y);

                globalParameters[`enemyType${ix}MinY`] =
                    Math.min(y, globalParameters[`enemyType${ix}MinY`]);
                globalParameters[`enemyType${ix}MaxY`] =
                    Math.max(y, globalParameters[`enemyType${ix}MaxY`]);
            }
        });
    }

    _setShipCollisionBox() {
        /* Make collision box smaller so that asteroids don't collide on the
         * outer corners of the box where no ship is */
        const scale = this.params.shipSize / 100;
        this.ship.setScale(scale);

        let ship_box_height;

        switch (this.params.shipAsset) {
        case 'spaceship':
            ship_box_height = 264;
            this.ship.setSize(326, ship_box_height).setOffset(132, 64);
            break;
        case 'daemon':
            ship_box_height = 512;
            this.ship.setCircle(256, 0, 0);
            break;
        case 'unicorn':
            ship_box_height = 256;
            this.ship.setSize(300, ship_box_height).setOffset(200, 128);
            break;
        default:
            // FIXME add a "missing image" asset, TBD however we decide to
            // indicate a runtime error in code
            // eslint-disable-next-line no-console
            console.error(`unexpected ship type ${this.params.shipAsset}`);
            ship_box_height = 100;
        }

        /* Update world bounds to allow half the ship to be outside */
        this.physics.world.setBounds(
            0,
            -(ship_box_height * scale) / 2,
            game.config.width,
            game.config.height + ship_box_height * scale
        );
    }

    createShip(x, y) {
        this.ship = this.physics.add.sprite(x, y, this.params.shipAsset);
        this._setShipCollisionBox();
        this.ship.setCollideWorldBounds(true);
        this.ship.depth = 100;
        this.ship.body.setAllowDrag(true);
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

    checkLevelDone() {
        if (globalParameters.score >= this.params.scoreTarget) {
            globalParameters.success = true;

            /* Go back to title if this was the last level */
            if (globalParameters.currentLevel < globalParameters.availableLevels)
                globalParameters.nextLevel = globalParameters.currentLevel + 1;
            else
                globalParameters.nextLevel = 0;

            /* Save game state when level is finished */
            saveState();

            this.scene.launch('continue',
                `Level ${globalParameters.currentLevel} Complete!`);
            this.scene.pause();
        }
    }

    runSpawnEnemy() {
        if (!this.spawnEnemy)
            return;

        var scope = this.spawnEnemyScope;
        var retval = null;

        try {
            scope.update(this.tick);
            retval = this.spawnEnemy(scope);
            scope.postUpdate(retval);
        } catch (e) {
            /* User function error! */
        }

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
            var pos = this.userSpace.applyInverse(
                retval.x || scope.width + scope.random(100, 400),
                retval.y || scope.random(0, scope.height)
            );

            var enemyTypeIndex = enemyTypes.indexOf(retval.type);

            var scale = (retval.scale) ? retval.scale : scope.random(20, 80);
            var obj = this.createEnemy(type, pos, scale);

            /* Increment global counter */
            if (this.firstObjectOfType[enemyTypeIndex] === null)
                this.firstObjectOfType[enemyTypeIndex] = obj;
            globalParameters[`enemyType${enemyTypeIndex}SpawnedCount`]++;

            /* Set object velocity */
            if (retval.velocity && retval.velocity.x) {
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
        var retval = null;

        try {
            scope.update(this.tick);
            retval = this.spawnAstronaut(scope);
            scope.postUpdate(retval);
        } catch (e) {
            /* User function error! */
        }

        if (retval) {
            var pos = this.userSpace.applyInverse(retval.x, retval.y);
            var obj = this.physics.add.sprite(pos.x, pos.y, 'astronaut');
            this.astronauts.add(obj);
            obj.depth = 1;
            var speedFactor = 0.5 + 0.5 * Phaser.Math.RND.frac();
            obj.setVelocityX(-this.params.shipSpeed * speedFactor);
            obj.setScale(this.params.astronautSize / 100);

            /* FIXME: improve colission shape */
            obj.body.setAllowRotation(true);
            obj.body.setAngularVelocity(Phaser.Math.RND.integerInRange(-90, 90));
        }
    }

    callUpdateEnemy(updateEnemy, scope, obj) {
        const vx = obj.body.velocity.x + this.params.shipSpeed;
        const vy = -obj.body.velocity.y;

        var retval = null;
        var enemy = {
            position: this.userSpace.transformPoint(obj.x, obj.y),
            velocity: {x: vx, y: vy},
            data: obj.userData,
        };
        var playerShip = {
            position: this.userSpace.transformPoint(this.ship.x, this.ship.y),
        };

        try {
            scope.update(this.tick, playerShip, enemy);
            retval = updateEnemy(scope);
            scope.postUpdate(retval);
        } catch (e) {
            /* User function error! */
        }

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
            for (const obj of children)
                this.callUpdateEnemy(updateEnemy, scope, obj);
        }
    }

    onShipEnemyOverlap() {
        if (!globalParameters.playing)
            return;

        Sounds.play('lightspeed/asteroid-crash');
        this.scene.launch('gameover');
        this.scene.pause();
    }

    onShipAstronautOverlap(ship, astronaut) {
        if (!globalParameters.playing)
            return;

        /* Update Score */
        globalParameters.score++;
        this.updateScore();

        /* Remove astronaut from collistion group */
        this.astronauts.remove(astronaut);

        /* Make it move to the ship */
        this.physics.moveToObject(astronaut, ship, 300);

        /* while making it smaller and transparent */
        this.tweens.add({
            targets: astronaut,
            alpha: 0,
            scaleX: 0.2,
            scaleY: 0.2,
            duration: 500,
            onComplete: () => {
                /* Disable collected astronaut */
                astronaut.disableBody(true, true);

                /* Check if we finished the level */
                this.checkLevelDone();
            },
        });

        /* Play thank you sound */
        Sounds.play('lightspeed/astronaut-thanks');
    }
}

