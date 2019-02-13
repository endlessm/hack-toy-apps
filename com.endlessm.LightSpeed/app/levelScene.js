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
        globalParameters.obstacleType0SpawnedCount = 0;
        globalParameters.obstacleType1SpawnedCount = 0;
        globalParameters.obstacleType2SpawnedCount = 0;
        globalParameters.obstacleType3SpawnedCount = 0;
        globalParameters.obstacleType1MinY = +1000;
        globalParameters.obstacleType1MaxY = -1000;
        globalParameters.success = false;
        globalParameters.score = 0;

        /* Init scene variables */
        this.tick = 0;
        this.shipTypes = [
            'spaceship',
        ];
        this.obstacleTypes = [
            'asteroid',
            'spinner',
            'beam',
            'squid',
        ];
        
        // Internal variables for checking quest state
        this.firstType1Object = null;

        /* Get user functions */
        this.setParams = getUserFunction(data.setParamsCode);
        this.spawnObstacle = getUserFunction(data.spawnObstacleCode);
        this.spawnAstronaut = getUserFunction(data.spawnAstronautCode);

        /* We have one function for each obstacle type */
        this.updateObstacle = {};
        for (const o of this.obstacleTypes)
            this.updateObstacle[o] = getUserFunction(
                data[`update${o.charAt(0).toUpperCase()}${o.slice(1)}Code`]
            );
    }

    preload() {
        /* Common assets */
        this.load.image('background', 'assets/background.jpg');
        this.load.image('particle', 'assets/particle.png');
        this.load.image('astronaut', 'assets/astronaut.png');

        /* Ship assets */
        for (const ship of this.shipTypes)
            this.load.image(ship, `assets/ships/${ship}.png`);

        /* Obstacles assets */
        for (const obstacle of this.obstacleTypes)
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
        this.obstacles = this.physics.add.group();
        this.astronauts = this.physics.add.group();

        /* Detect collisions */
        this.physics.add.overlap(this.ship, this.obstacles,
            this.onShipObstacleOverlap, null, this);
        this.physics.add.overlap(this.ship, this.astronauts,
            this.onShipAstronautOverlap, null, this);

        /* Score Box */
        this.createScoreBox('Level: 00 Rescued: 00');
        this.updateScore();

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

        /* Execute spawn functions */
        this.runSpawnObstacle();
        this.runSpawnAstronaut();
        this.runUpdateObstacle();
        
        this.updateQuestData();
    }

    /* Private functions */
    
    
    updateQuestData() {
        // Track the first type 1 object
        if (this.firstType1Object == null) {
            for (const obj of this.obstacles.getChildren()) {
                if (obj.texture.key == 'spinner') {
                    this.firstType1Object = obj;
                }
            }
        }
        else
        {
            var y = game.config.height - this.firstType1Object.y;
            globalParameters.obstacleType1MinY = Math.min(y, globalParameters.obstacleType1MinY);
            globalParameters.obstacleType1MaxY = Math.max(y, globalParameters.obstacleType1MaxY);
        }
    }

    _setShipCollisionBox(shipAsset) {
        /* Make collision box smaller so that asteroids don't collide on the
         * outer corners of the box where no ship is */
        const scale = this.params.shipSize / 100;
        this.ship.setScale(scale);

        let ship_box_height;

        switch (shipAsset) {
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
            console.error(`unexpected ship type ${shipAsset}`);
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
        this.ship = this.physics.add.sprite(x, y, 'spaceship');
        this._setShipCollisionBox('spaceship');
        this.ship.setCollideWorldBounds(true);
        this.ship.depth = 100;
    }

    createObstacle(type, x, y, scale) {
        /* Create obstacle object */
        var obj = this.physics.add.sprite(x, y, type);

        /* Add to obstacle group */
        this.obstacles.add(obj);
        obj.depth = 1;

        /* Set a scale */
        const s = scale ? scale / 100 : 1;

        if (scale)
            obj.setScale(s);

        /* FIXME: improve obstacle shape handling */
        if (type === 'asteroid')
            obj.setCircle(230, 28, 28);
        else if (type === 'spinner') {
            obj.setCircle(161, 94, 94);
            obj.body.setAllowRotation(true);
            const v = Phaser.Math.RND.integerInRange(-3, 3) || 1;
            obj.body.setAngularVelocity(v * 128);
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
        }

        return obj;
    }

    updateScore() {
        const level = `${globalParameters.currentLevel + 1}`.padStart(2, ' ');
        const score = `${globalParameters.score}`.padStart(2, ' ');
        this.scoreText.setText(`Level: ${level.padStart(2, ' ')} Rescued: ${score.padStart(2, ' ')}`);
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
        const i = globalParameters.currentLevel;
        return {
            level: i,
            config: levelParameters[i],
            tick: this.tick,
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            shipTypes: this.shipTypes,
            obstacleTypes: this.obstacleTypes,

            random: (min, max) => Math.random() * (max - min) + min,
        };
    }

    checkLevelDone() {
        if (globalParameters.score >= this.params.scoreTarget) {
            globalParameters.score = 0;
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
            const x = retval.x || scope.width + scope.random(100, 400);
            const y = retval.y || scope.random(0, scope.height);

            /* Make sure type is a valid obstacle */
            var obstacleTypeIndex = this.obstacleTypes.indexOf(retval.type);
            if (retval.type && obstacleTypeIndex >= 0)
                type = retval.type;

            var obj = this.createObstacle(type, x, y, retval.scale);

            /* Increment global counter */
            switch (obstacleTypeIndex)
            {
            case 0: globalParameters.obstacleType0SpawnedCount++; break;
            case 1: globalParameters.obstacleType1SpawnedCount++; break;
            case 2: globalParameters.obstacleType2SpawnedCount++; break;
            case 3: globalParameters.obstacleType3SpawnedCount++; break;
            default: break;
            }

            /* Set object velocity */
            if (retval.velocity && retval.velocity.x)
                obj.setVelocityX(-this.params.shipSpeed + retval.velocity.x);
            else
                obj.setVelocityX(-this.params.shipSpeed);

            if (retval.velocity && retval.velocity.y)
                obj.setVelocityY(retval.velocity.y);
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
            var obj = this.physics.add.sprite(retval.x, retval.y, 'astronaut');
            this.astronauts.add(obj);
            obj.depth = 1;
            obj.setVelocityX(-this.params.shipSpeed);
            obj.setScale(this.params.astronautSize / 100);

            /* FIXME: improve colission shape */
            obj.body.setAllowRotation(true);
            obj.body.setAngularVelocity(Phaser.Math.RND.integerInRange(-90, 90));
        }
    }

    runUpdateObstacle() {
        if (!this.updateObstacle)
            return;

        const height = game.config.height;
        var scope = this.getScope();

        for (const obj of this.obstacles.getChildren()) {
            const updateObstacle = this.updateObstacle[obj.texture.key];

            if (!updateObstacle)
                continue;

            const x = obj.x;
            const y = height - obj.y;
            const vx = obj.body.velocity.x + this.params.shipSpeed;
            const vy = obj.body.velocity.y * -1;

            var obstacle = {
                position: {x: x, y: y},
                velocity: {x: vx, y: vy},
            };

            try {
                scope.obstacle = obstacle;
                updateObstacle(scope);
            } catch (e) {
                /* User function error! */
            }

            /* Update position */
            if (x !== obstacle.position.x)
                obj.x = obstacle.position.x;

            if (y !== obstacle.position.y)
                obj.y = height - obstacle.position.y;

            /* Update velocity */
            if (vx !== obstacle.velocity.x)
                obj.setVelocityX(-this.params.shipSpeed + obstacle.velocity.x);
            if (vy !== obstacle.velocity.y)
                obj.setVelocityY(obstacle.velocity.y * -1);
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

