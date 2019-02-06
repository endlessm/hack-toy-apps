/* Gobble
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

class LevelScene extends Phaser.Scene {

    constructor (config) {
        super(config);
    }

    getUserFunction (code) {
        if (!code)
            return null;

        var retval = null;

        try {
            retval = new Function('scope', `with(scope){\n${code}\n;}`);
        } catch (e) {
            retval = null;
            if (!(e instanceof SyntaxError || e instanceof ReferenceError))
                console.error(e);
        }

        return retval;
    }

    init(data) {
        this.params = data;

        this.setParams = this.getUserFunction(data.setParamsCode);
        this.updateEnemy = this.getUserFunction(data.updateEnemyCode);
        this.spawnObstacle = this.getUserFunction(data.spawnObstacleCode);
        this.spawnAstronaut = this.getUserFunction(data.spawnAstronautCode);

        /* Reset Global game state */
        globalParameters.obstacleSpawnedCount = 0;
        globalParameters.playing = true;
        globalParameters.success = false;
        globalParameters.score = 0;

        /* Init scene variables */
        this.tick = 0;
    }

    preload () {
        this.load.image('background', 'assets/background.jpg');
        this.load.image('particle', 'assets/particle.png');
        this.load.image('astronaut', 'assets/astronaut.png');
        this.load.image('asteroid', 'assets/asteroid.png');
        this.load.image('ship', 'assets/spaceship.png');
    }

    create (data) {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

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
        this.physics.add.overlap(this.ship, this.obstacles, this.onShipObstacleOverlap, null, this);
        this.physics.add.overlap(this.ship, this.astronauts, this.onShipAstronautOverlap, null, this);

        /* Score Box */
        this.createScoreBox('Level: 00 Rescued: 00');
        this.updateScore();

        /* Go back to title screen */
        this.input.keyboard.on('keyup', (event) => {
            if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.ESC) {
                this.switchToTitle();
            }
        }, this);

        /* Switch to tile screen after the fading is done */
        this.cameras.main.on('camerafadeoutcomplete', () => {
            this.scene.start(this.nextScene);
            this.nextScene = null;
        }, this);
    }

    update(time, delta) {

        /* Skip every other update */
        this.odd_tick = !this.odd_tick;

        if (this.odd_tick)
            return;

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
    }

    /* Private functions */

    createShip (x, y) {
        this.ship = this.physics.add.sprite(x, y, 'ship');
        const scale = this.params.shipSize/100;
        const ship_box_height = 264;

        this.ship.setScale(scale);

        /* Make colission box smaller */
        this.ship.setSize(326, ship_box_height).setOffset(132, 64);

        /* Update world bounds to allow half the ship to be outside */
        this.physics.world.setBounds(
            0,
            -((ship_box_height*scale)/2),
            game.config.width,
            game.config.height + ship_box_height*scale
        );

        this.ship.setCollideWorldBounds(true);
        this.ship.depth = 100;
    }

    updateScore () {
        const level = globalParameters.currentLevel + 1 + '';
        const score = globalParameters.score + '';

        this.scoreText.setText(`Level: ${level.padStart(2, ' ')} Rescued: ${score.padStart(2, ' ')}`);
    }

    createScoreBox (text) {
        this.scoreText = this.add.text(16, 8, text, fontConfig);
        const w = this.scoreText.width + 32;
        const h = this.scoreText.height + 16;

        this.scoreBox = this.add.container(
            (game.config.width - w) / 2, 4,
            [new Utils.TransparentBox(this, w, h), this.scoreText]
        );

        this.scoreBox.depth = 100;
    }

    getScope () {
        const i = globalParameters.currentLevel;
        return {
            level: i,
            config: levelParameters[i],
            tick: this.tick,
            width: this.cameras.main.width,
            height: this.cameras.main.height,

            random: (min, max) => {
                return Math.random() * (max - min) + min;
            }
        }
    }

    switchToTitle (name) {
        this.nextScene = 'title';
        this.cameras.main.fadeOut(200);
        globalParameters.playing = false;
    }

    checkLevelDone () {
        if (globalParameters.score >= this.params.scoreTarget) {
            globalParameters.score = 0;
            globalParameters.success = true;

            /* Limit current level to available one */
            if (globalParameters.currentLevel+1 >= globalParameters.availableLevel) {
                globalParameters.currentLevel = 0;
                this.switchToTitle();
            } else {
                this.scene.launch('continue', `Level ${globalParameters.currentLevel+1} Complete!`);
                globalParameters.playing = false;
                this.scene.pause();
            }
        }
    }

    runSpawnObstacle () {
        if (!this.spawnObstacle)
            return;

        var retval = null;
        var scope = this.getScope();

        try {
            retval = this.spawnObstacle(scope);
        } catch (e){
            /* User function error! */
        }

        if (retval) {
            const type = retval.type || 'asteroid';
            const x = retval.x || scope.width + scope.random(100, 400);
            const y = retval.y || scope.random(0, scope.height);

            /* Create obstacle object */
            var obj = this.physics.add.sprite(x, y, type);

            /* Add to obstacle group */
            this.obstacles.add(obj);
            obj.depth = 1;

            /* Increment global counter */
            globalParameters.obstacleSpawnedCount++;

            /* FIXME: improve obstacle shape handling */
            if (type === 'asteroid')
                obj.setCircle(230, 28, 28);

            /* Set a scale */
            if (retval.scale)
                obj.setScale(retval.scale/100);

            /* FIXME: split group and obstacle velocity in order to easily
             * implement changing the ship speed.
             */
            var speedFactor = 0.5 + Phaser.Math.RND.frac();
            obj.setVelocityX(-this.params.shipSpeed*speedFactor);
        }
    }

    runSpawnAstronaut () {
        if (!this.spawnAstronaut)
            return;

        var retval = null;

        try {
            retval = this.spawnAstronaut(this.getScope());
        } catch (e){
            /* User function error! */
        }

        if (retval) {
            var obj = this.physics.add.sprite(retval.x, retval.y, 'astronaut');
            this.astronauts.add(obj);
            obj.depth = 1;
            obj.setVelocityX(-this.params.shipSpeed);
            obj.setScale(this.params.astronautSize/100);

            /* FIXME: improve colission shape */
            obj.body.setAllowRotation(true);
            obj.body.setAngularVelocity(Phaser.Math.RND.integerInRange(-90, 90));
        }
    }

    onShipObstacleOverlap (ship, object) {
        if (this.inDemo)
            return;

        this.scene.launch('gameover');
        globalParameters.playing = false;
        this.scene.pause();
    }

    onShipAstronautOverlap (ship, astronaut) {
        if (this.inDemo)
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
            }
        });
    }
}

