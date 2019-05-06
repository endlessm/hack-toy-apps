/* exported LoadingScene */

class LoadingScene extends Phaser.Scene {
    preload() {
        // show logo
        this.add.sprite(this.sys.game.config.width / 2, 250, 'logo');

        // progress bar background
        const bgBar = this.add.graphics();

        const barW = 150;
        const barH = 30;

        bgBar.setPosition(this.sys.game.config.width / 2 - barW / 2,
            this.sys.game.config.height / 2 - barH / 2);
        bgBar.fillStyle(0xF5F5F5, 1);
        bgBar.fillRect(0, 0, barW, barH);

        // progress bar
        const progressBar = this.add.graphics();
        progressBar.setPosition(this.sys.game.config.width / 2 - barW / 2,
            this.sys.game.config.height / 2 - barH / 2);

        // listen to the "progress" event
        this.load.on('progress', function(value) {
            // clearing progress bar (so we can draw it again)
            progressBar.clear();

            // set style
            progressBar.fillStyle(0x9AD98D, 1);

            // draw rectangle
            progressBar.fillRect(0, 0, value * barW, barH);
        }, this);

        // load assets
        this.load.image('background', 'assets/images/background.png');
        this.load.image('pit', 'assets/images/pit.png');
        this.load.image('separator', 'assets/images/separator.png');
        this.load.image('restartIcon', 'assets/images/restartIcon.png');
        this.load.image('explosion', 'assets/images/explosion.png');
        this.load.image('circleHighlight', 'assets/images/circleHighlight.png');

        this.load.spritesheet('spaceBar', 'assets/images/spaceBar.png', {
            frameWidth: 268,
            frameHeight: 168,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('playButton', 'assets/images/playButton.png', {
            frameWidth: 179,
            frameHeight: 177,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('robots', 'assets/images/robots.png', {
            frameWidth: 49,
            frameHeight: 89,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('trail', 'assets/images/trail.png', {
            frameWidth: 128,
            frameHeight: 128,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('controls', 'assets/images/controls.png', {
            frameWidth: 400,
            frameHeight: 400,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('game-over', 'assets/images/game-over.png', {
            frameWidth: 629,
            frameHeight: 283,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('levelComplete', 'assets/images/levelComplete.png', {
            frameWidth: 695,
            frameHeight: 325,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('button', 'assets/images/button.png', {
            frameWidth: 210,
            frameHeight: 65,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('moveSquares', 'assets/images/moveSquares.png', {
            frameWidth: 159,
            frameHeight: 158,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('walls', 'assets/images/walls.png', {
            frameWidth: 128,
            frameHeight: 144,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('tiles', 'assets/images/tiles.png', {
            frameWidth: 128,
            frameHeight: 128,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('specialTiles', 'assets/images/specialTiles.png', {
            frameWidth: 480,
            frameHeight: 128,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('riley', 'assets/images/riley.png', {
            frameWidth: 191,
            frameHeight: 258,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('felixnet', 'assets/images/felixnetEscape.png', {
            frameWidth: 631,
            frameHeight: 128,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('controlsDestroyed', 'assets/images/controlsDestroyed.png', {
            frameWidth: 448,
            frameHeight: 524,
            margin: 0,
            spacing: 0,
        });
    }

    create() {
        // running animation
        if (!this.anims.get('running')) {
            this.anims.create({
                key: 'running',
                frames: this.anims.generateFrameNames('riley', {
                    frames: [0, 1, 2, 3],
                }),
                frameRate: 12,
                yoyo: true,
                repeat: -1,
            });
        }

        // jumping animation
        if (!this.anims.get('jumping')) {
            this.anims.create({
                key: 'jumping',
                frames: this.anims.generateFrameNames('riley', {
                    frames: [4, 5],
                }),
                frameRate: 12,
                yoyo: true,
                repeat: 0,
            });
        }

        // game over animation
        if (!this.anims.get('game-over')) {
            this.anims.create({
                key: 'game-over',
                frames: this.anims.generateFrameNames('game-over', {
                    frames: [0, 1],
                }),
                frameRate: 12,
                yoyo: true,
                repeat: -1,
            });
        }

        // game over animation
        if (!this.anims.get('levelComplete')) {
            this.anims.create({
                key: 'levelComplete',
                frames: this.anims.generateFrameNames('levelComplete', {
                    frames: [0, 1],
                }),
                frameRate: 12,
                yoyo: true,
                repeat: -1,
            });
        }

        // felixnet escapes animation
        if (!this.anims.get('felixnet')) {
            this.anims.create({
                key: 'felixnet',
                frames: this.anims.generateFrameNames('felixnet', {
                    frames: [1, 2, 3, 0, 4, 0, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],
                }),
                frameRate: 10,
                yoyo: false,
                repeat: 0,
            });
        }

        // garbled controls animation
        if (!this.anims.get('controlsDestroyed')) {
            this.anims.create({
                key: 'controlsDestroyed',
                frames: this.anims.generateFrameNames('controlsDestroyed', {
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                }),
                frameRate: 4,
                yoyo: false,
                repeat: 0,
            });
        }

        this.startLevel();
    }

    startLevel() {
        globalParameters.currentLevel = globalParameters.highestAchievedLevel;
        globalParameters.playing = true;
        globalParameters.paused = false;

        this.scene.start('Game', levelParameters[globalParameters.currentLevel]);
    }
}
