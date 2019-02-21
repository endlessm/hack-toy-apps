/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported LevelScene */
/* global obstacleTypes, shipTypes */

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

        /* Reset Global game state */
        globalParameters.success = false;
        globalParameters.score = 0;

        /* Reset obstacle counters */
        for (let i = 0, n = obstacleTypes.length; i < n; i++) {
            globalParameters[`obstacleType${i}SpawnedCount`] = 0;
            globalParameters[`obstacleType${i}MinY`] = +Infinity;
            globalParameters[`obstacleType${i}MaxY`] = -Infinity;
        }

        /* Init scene variables */
        this.tick = 0;

        /* Get user functions */
        this.setParams = getUserFunction(data.setParamsCode);
        this.spawnObstacle = getUserFunction(data.spawnObstacleCode);
        this.spawnAstronaut = getUserFunction(data.spawnAstronautCode);

        /* We have one function for each obstacle type */
        this.updateObstacle = {};
        for (const o of obstacleTypes) {
            this.updateObstacle[o] = getUserFunction(
                data[`update${o.charAt(0).toUpperCase()}${o.slice(1)}Code`]
            );
        }

        /* Let user initialize the level parameters */
        this.runSetParams();
    }

    preload() {
        /* Common assets */
        this.load.image('background', 'assets/background.jpg');
        this.load.image('particle', 'assets/particle.png');
        this.load.image('astronaut', 'assets/astronaut.png');

        /* Ship assets */
        for (const ship of shipTypes)
            this.load.image(ship, `assets/ships/${ship}.png`);

        /* Obstacles assets */
        for (const obstacle of obstacleTypes)
            this.load.image(obstacle, `assets/obstacles/${obstacle}.png`);
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

        this.obstacles = {};
        for (const o of obstacleTypes) {
            this.obstacles[o] = this.physics.add.group();
            this.physics.add.overlap(this.ship, this.obstacles[o],
                this.onShipObstacleOverlap, null, this);
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
        this.createScoreBox('Level: 00 Rescued: 00');
        this.updateScore();

        /* Update user functions when they change */
        this.game.events.on('global-property-change', (obj, property) => {
            if (Object.is(this.params, obj) && property.endsWith('Code')) {
                const func = getUserFunction(obj[property]);
                const funcName = property.slice(0, -4);
                var member;

                if (property.startsWith('update') &&
                    (member = funcName.slice(6).toLowerCase()) &&
                    obstacleTypes.indexOf(member) >= 0)
                    this.updateObstacle[member] = func;
                else if (funcName in this)
                    this[funcName] = func;
            }
        });

        /* Pause game on space bar press */
        this.input.keyboard.on('keyup_SPACE', () => {
            if (globalParameters.playing)
                globalParameters.paused = true;
        });

        /* Go back to title screen */
        this.input.keyboard.on('keyup_ESC', () => {
            if (globalParameters.playing)
                this.scene.start('title');
        });
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
                this.scene.launch('pause');
                this.physics.pause();
            }
            return;
        } else if (this.physics.world.isPaused) {
            this.scene.stop('pause');
            this.physics.resume();
        }

        /* Input */
        var cursors = this.input.keyboard.createCursorKeys();

        const accel = this.params.shipAcceleration;

        if (cursors.up.isDown) {
            if (this.ship.body.velocity.y > 0)
                this.ship.setVelocityY(0);
            this.ship.setAccelerationY(-accel);
        } else if (cursors.down.isDown) {
            if (this.ship.body.velocity.y < 0)
                this.ship.setVelocityY(0);
            this.ship.setAccelerationY(accel);
        } else {
            this.ship.setAccelerationY(0);
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
        this.runSpawnObstacle();
        this.runSpawnAstronaut();
        this.runUpdateObstacle();

        this.updateQuestData();
    }

    /* Private functions */

    updateQuestData() {
        obstacleTypes.forEach((type, ix) => {
            const obj = this.obstacles[type][0];
            if (obj) {
                const {y} = this.userSpace.transformPoint(0, obj.y);

                globalParameters[`obstacleType${ix}MinY`] =
                    Math.min(y, globalParameters[`obstacleType${ix}MinY`]);
                globalParameters[`obstacleType${ix}MaxY`] =
                    Math.max(y, globalParameters[`obstacleType${ix}MaxY`]);
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
    }

    createObstacle(type, position, scale) {
        /* Create obstacle object */
        var obj = this.physics.add.sprite(position.x, position.y, type);

        /* Add to obstacle group */
        this.obstacles[type].add(obj);

        /* Set depth */
        obj.depth = 1;

        /* Set a scale */
        const s = scale ? scale / 100 : 1;

        if (scale)
            obj.setScale(s);

        /* FIXME: improve obstacle shape handling */
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
            if (!this.firstType2Object)
                this.firstType2Object = obj;
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
        const level = `${globalParameters.currentLevel}`.padStart(2, ' ');
        const score = `${globalParameters.score}`.padStart(2, ' ');

        this.scoreText.setText(`Level: ${level} Rescued: ${score}`);
    }

    createScoreBox(text) {
        this.scoreText = this.add.text(16, 8, text, fontConfig);
        const w = this.scoreText.width + 32;
        const h = this.scoreText.height + 16;

        this.scoreBox = this.add.container(
            (game.config.width - w) / 2, 4,
            [new Utils.TransparentBox(this, w, h), this.scoreText]);

        this.scoreBox.depth = 100;
    }

    getScope() {
        return {
            tick: this.tick,
            time: this.tick * 0.33,
            width: game.config.width,
            height: game.config.height,
            shipTypes,
            obstacleTypes,

            random: (min, max) => Math.random() * (max - min) + min,
        };
    }

    checkLevelDone() {
        if (globalParameters.score >= this.params.scoreTarget) {
            globalParameters.success = true;

            /* Limit current level to available one */
            if (globalParameters.currentLevel + 1 >= globalParameters.availableLevel) {
                globalParameters.currentLevel = 0;
                this.scene.start('title');
            } else {
                this.scene.launch('continue',
                    `Level ${globalParameters.currentLevel + 1} Complete!`);
                this.scene.pause();
            }
        }
    }

    runSetParams() {
        if (!this.setParams)
            return;

        var scope = this.getScope();

        try {
            scope.level = globalParameters.currentLevel;
            scope.config = this.params;
            this.setParams(scope);
        } catch (e) {
            /* User function error! */
        }
    }

    runSpawnObstacle() {
        if (!this.spawnObstacle)
            return;

        var retval = null;
        var scope = this.getScope();

        try {
            retval = this.spawnObstacle(scope);
        } catch (e) {
            /* User function error! */
        }

        if (retval) {
            var type = retval.type || 'asteroid';
            var pos = this.userSpace.applyInverse(
                retval.x || scope.width + scope.random(100, 400),
                retval.y || scope.random(0, scope.height)
            );

            /* Make sure type is a valid obstacle */
            if (!obstacleTypes.includes(type))
                type = 'asteroid';
            var obstacleTypeIndex = obstacleTypes.indexOf(retval.type);

            var obj = this.createObstacle(type, pos, retval.scale);

            /* Increment global counter */
            globalParameters[`obstacleType${obstacleTypeIndex}SpawnedCount`]++;

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

    runSpawnAstronaut() {
        if (!this.spawnAstronaut)
            return;

        var retval = null;

        try {
            retval = this.spawnAstronaut(this.getScope());
        } catch (e) {
            /* User function error! */
        }

        if (retval) {
            var pos = this.userSpace.applyInverse(retval.x, retval.y);
            var obj = this.physics.add.sprite(pos.x, pos.y, 'astronaut');
            this.astronauts.add(obj);
            obj.depth = 1;
            obj.setVelocityX(-this.params.shipSpeed);
            obj.setScale(this.params.astronautSize / 100);

            /* FIXME: improve colission shape */
            obj.body.setAllowRotation(true);
            obj.body.setAngularVelocity(Phaser.Math.RND.integerInRange(-90, 90));
        }
    }

    callUpdateObstacle(updateObstacle, scope, obj) {
        const vx = obj.body.velocity.x + this.params.shipSpeed;
        const vy = -obj.body.velocity.y;

        var obstacle = {
            position: this.userSpace.transformPoint(obj.x, obj.y),
            velocity: {x: vx, y: vy},
        };

        try {
            scope.obstacle = obstacle;
            updateObstacle(scope);
        } catch (e) {
            /* User function error! */
        }

        /* Transform back from user space coordinates */
        const position = this.userSpace.applyInverse(obstacle.position.x,
            obstacle.position.y);

        /* Update position */
        if (obj.x !== position.x)
            obj.x = position.x;

        if (obj.y !== position.y)
            obj.y = position.y;

        /* Update velocity */
        if (vx !== obstacle.velocity.x)
            obj.setVelocityX(-this.params.shipSpeed + obstacle.velocity.x);
        if (vy !== obstacle.velocity.y)
            obj.setVelocityY(-obstacle.velocity.y);
    }

    runUpdateObstacle() {
        var scope = this.getScope();

        /* Iterate over obstacle types */
        for (const o of obstacleTypes) {
            const updateObstacle = this.updateObstacle[o];

            if (!updateObstacle)
                continue;

            /* Iterate over obstacles */
            const children = this.obstacles[o].getChildren();
            for (const obj of children)
                this.callUpdateObstacle(updateObstacle, scope, obj);
        }
    }

    onShipObstacleOverlap() {
        if (!globalParameters.playing)
            return;

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
    }
}

