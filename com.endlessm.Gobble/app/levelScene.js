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
        this.tick = 0;

        this.setParams = this.getUserFunction(data.setParamsCode);
        this.updateEnemy = this.getUserFunction(data.updateEnemyCode);
        this.spawnObstacle = this.getUserFunction(data.spawnObstacleCode);
        this.spawnAstronaut = this.getUserFunction(data.spawnAstronautCode);
    }

    preload () {
        this.load.image('space', 'assets/space.jpg');
        this.load.image('particle', 'assets/particle.png');
        this.load.image('astronaut', 'assets/astronaut.png');
        this.load.image('asteroid', 'assets/asteroid.png');
        this.load.image('ship', 'assets/ship.png');
    }

    create (data) {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        /* Background */
        this.add.image(centerX, centerY, 'space');

        /* Fade in scene */
        this.cameras.main.fadeIn(200);

        /* Ship */
        this.ship = this.physics.add.sprite(256, centerY, 'ship');
        this.ship.setCollideWorldBounds(true);
        this.ship.setScale(this.params.shipSize/100);
        this.ship.depth = 100;

        /* Create objects groups */
        this.obstacles = this.physics.add.group();
        this.astronauts = this.physics.add.group();

        /* Detect collisions */
        this.physics.add.overlap(this.ship, this.obstacles, this.onShipObstacleOverlap, null, this);
        this.physics.add.overlap(this.ship, this.astronauts, this.onShipAstronautOverlap, null, this);

        /* Go back to title screen */
        this.input.keyboard.on('keyup', (event) => {
            if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.ESC) {
                this.nextScene = 'title';
                this.cameras.main.fadeOut(200);
            }
        }, this);

        /* Switch to tile screen after the fading is done */
        this.cameras.main.on('camerafadeoutcomplete', () => {
            this.scene.start(this.nextScene);
        }, this);

        globalParameters.success = false;

        /* Score */
        globalParameters.score = 0;
        this.scoreText = this.add.text(40, 40, '', { color: 'white', fontSize: '42px' });
        this.scoreText.setText(`Level: ${globalParameters.currentLevel+1}\nScore: ${globalParameters.score}`);
        this.scoreText.depth = 100;

        /* FPS counter */
        this.fps = this.add.text(width - 100, height - 40, '', { color: '#00ff00' });
        this.fps.depth = 100;
    }

    update(time, delta) {
        this.fps.setText(`FPS: ${(game.loop.actualFps).toFixed(1)}`);

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

    getScope () {
        return {
            level: levelIndex,
            config: levelParameters[levelIndex],
            tick: this.tick,
            width: this.cameras.main.width,
            height: this.cameras.main.height,

            random: (min, max) => {
                return Math.random() * (max - min) + min;
            }
        }
    }

    runSpawnObstacle () {
        if (!this.spawnObstacle)
            return;

        var retval = null;

        try {
            retval = this.spawnObstacle(this.getScope());
        } catch (e){
            /* User function error! */
        }

        if (retval) {
            const type = retval.type || 'asteroid';

            var obj = this.physics.add.sprite(retval.x, retval.y, type);
            this.obstacles.add(obj);
            obj.depth = 1;

            if (type === 'asteroid')
                obj.setCircle(250);

            if (retval.scale)
                obj.setScale(retval.scale/100);

            obj.setVelocityX(-this.params.shipSpeed);
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
            obj.body.setAllowRotation(true);
            obj.body.setAngularVelocity(Phaser.Math.RND.integerInRange(-90, 90));
        }
    }

    onShipObstacleOverlap (ship, object) {
        this.nextScene = 'gameover';
        this.cameras.main.fadeOut(200);
    }

    onShipAstronautOverlap (ship, astronaut) {
        /* Update Score */
        globalParameters.score++;
        this.scoreText.setText(`Level: ${globalParameters.currentLevel+1}\nScore: ${globalParameters.score}`);

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
            }
        });
    }
}

