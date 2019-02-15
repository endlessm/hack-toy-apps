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

        this.setParams = getUserFunction(data.setParamsCode);
        this.updateObstacle = getUserFunction(data.updateObstacleCode);
        this.spawnObstacle = getUserFunction(data.spawnObstacleCode);
        this.spawnAstronaut = getUserFunction(data.spawnAstronautCode);

        /* Reset Global game state */
        globalParameters.obstacleSpawnedCount = 0;
        globalParameters.success = false;
        globalParameters.score = 0;

        /* Init scene variables */
        this.tick = 0;
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
    }

    /* Private functions */

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
        const i = globalParameters.currentLevel;
        return {
            level: i,
            config: levelParameters[i],
            tick: this.tick,
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            shipTypes,
            obstacleTypes,

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
            const type = retval.type || 'asteroid';
            const x = retval.x || scope.width + scope.random(100, 400);
            const y = retval.y || scope.random(0, scope.height);

            /* Make sure type is a valid obstacle */
            if (retval.type && this.obstacleTypes.indexOf(retval.type) >= 0)
                type = retval.type;

            var obj = this.createObstacle(type, x, y, retval.scale);

            /* Increment global counter */
            globalParameters.obstacleSpawnedCount++;

            /* FIXME: split group and obstacle velocity in order to easily
             * implement changing the ship speed.
             */
            var speedFactor = 0.5 + Phaser.Math.RND.frac();
            obj.setVelocityX(-this.params.shipSpeed * speedFactor);
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

        var scope = this.getScope();

        for (const obj of this.obstacles.getChildren()) {
            var retval = null;

            try {
                scope.obstacle = {
                    type: obj.texture.key,
                    x: obj.x,
                    y: obj.y
                };
                retval = this.updateObstacle(scope);
            } catch (e) {
                /* User function error! */
            }

            if (retval) {
                if (retval.x !== undefined)
                    obj.x = retval.x;
                if (retval.y !== undefined)
                    obj.y = retval.y;
            }
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

