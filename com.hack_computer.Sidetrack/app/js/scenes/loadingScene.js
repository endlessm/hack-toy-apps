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
/* exported LoadingScene */

class LoadingScene extends Phaser.Scene {
    constructor(...args) {
        super(...args);
        this._loadedState = false;
        this._loadedAssets = false;
    }

    preload() {
        // load assets
        this.load.image('background1', 'assets/images/background1.jpg');
        this.load.image('background2', 'assets/images/background2.jpg');
        this.load.image('background3', 'assets/images/background3.jpg');
        this.load.image('levelSelectBackground', 'assets/images/levelSelectBackground.png');
        this.load.image('hackdex', 'assets/images/hackdex.png');
        this.load.image('pit', 'assets/images/pit.png');
        this.load.image('separator', 'assets/images/separator.png');
        this.load.image('explosion', 'assets/images/explosion.png');
        this.load.image('circleHighlight', 'assets/images/circleHighlight.png');
        this.load.image('pushTrail', 'assets/images/pushTrail.png');

        this.load.spritesheet('previous', 'assets/images/previous.png', {
            frameWidth: 63,
            frameHeight: 54,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('next', 'assets/images/next.png', {
            frameWidth: 63,
            frameHeight: 54,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('restartIcon', 'assets/images/restartIcon.png', {
            frameWidth: 53,
            frameHeight: 54,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('spaceBar', 'assets/images/spaceBar.png', {
            frameWidth: 156,
            frameHeight: 156,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('playButton', 'assets/images/playButton.png', {
            frameWidth: 219,
            frameHeight: 219,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('robots', 'assets/images/robots.png', {
            frameWidth: 128,
            frameHeight: 128,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('trail', 'assets/images/trail.png', {
            frameWidth: 128,
            frameHeight: 128,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('game-over', 'assets/images/game-over.png', {
            frameWidth: 652,
            frameHeight: 390,
            margin: 0,
            spacing: 0,
        });

        this.load.spritesheet('levelComplete', 'assets/images/levelComplete.png', {
            frameWidth: 1046,
            frameHeight: 360,
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
            frameHeight: 128,
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
            frameWidth: 128,
            frameHeight: 128,
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
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                }),
                frameRate: 12,
                repeat: -1,
            });
        }

        // jumping animation
        if (!this.anims.get('jumping')) {
            this.anims.create({
                key: 'jumping',
                frames: this.anims.generateFrameNames('riley', {
                    frames: [12, 13, 14, 15, 16, 17],
                }),
                frameRate: 12,
                yoyo: true,
                repeat: -1,
            });
        }

        // glitch animation
        if (!this.anims.get('glitch')) {
            this.anims.create({
                key: 'glitch',
                frames: this.anims.generateFrameNames('riley', {
                    frames: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
                }),
                frameRate: 12,
                yoyo: true,
                repeat: -1,
            });
        }

        // game over animation
        if (!this.anims.get('game-over')) {
            this.anims.create({
                key: 'game-over',
                frames: this.anims.generateFrameNames('game-over', {
                    frames: [0, 1, 2],
                }),
                yoyo: true,
                frameRate: 10,
                repeat: -1,
            });
        }

        // game over animation
        if (!this.anims.get('levelComplete')) {
            this.anims.create({
                key: 'levelComplete',
                frames: this.anims.generateFrameNames('levelComplete', {
                    frames: [0, 1, 2],
                }),
                yoyo: true,
                frameRate: 8,
                repeat: -1,
            });
        }

        // felixnet escapes animation
        if (!this.anims.get('felixnet')) {
            this.anims.create({
                key: 'felixnet',
                frames: this.anims.generateFrameNames('felixnet', {
                    frames: [1, 2, 3, 0, 4, 0, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
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

        this.doneLoadingAssets();
    }

    doneLoadingAssets() {
        this._loadedAssets = true;
        if (this._loadedState)
            this.startLevel();
    }

    doneLoadingState() {
        this._loadedState = true;
        if (this._loadedAssets)
            this.startLevel();
    }

    startLevel() {
        globalParameters.currentLevel = globalParameters.highestAchievedLevel;
        globalParameters.playing = true;
        globalParameters.paused = false;

        this.scene.start('Game', levelParameters[globalParameters.currentLevel]);
    }
}
