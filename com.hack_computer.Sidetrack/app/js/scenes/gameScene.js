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
/* exported GameScene */

/* global saveState, UserInstructionsCodeScope, UserLevelCodeScope,
WALL, PIT, UP, DOWN, JUMP, FORWARD, PUSH, ERROR,
PLAYTHRUGAME, DEFAULTGAME, NONE, ROBOTA, ROBOTB, Button */

function getUserFunction(code) {
    if (!code)
        return null;

    var retval = null;

    try {
        // eslint-disable-next-line no-new-func
        retval = new Function('scope', `with(scope){\n${code}\n}`);
    } catch (e) {
        retval = null;
        if (!(e instanceof SyntaxError || e instanceof ReferenceError))
            // FIXME reflect the error in the game somehow
            console.error(e);  // eslint-disable-line no-console
    }

    return retval;
}

class GameScene extends Phaser.Scene {
    init(data) {
        globalParameters.playing = false;
        this.params = data;

        this.levelNumber = 0;

        // only used when Riley is on right-most tile
        this.playerSpeed = 5;

        // goal location
        this.goalXLocation = 8;
        this.goalYLocation = 2;

        // player location
        this.playerXLocation = -1;
        this.playerYLocation = 0;

        // sprite tile placement
        this.tileLength = 128;
        this.xOffset = 448;
        this.yOffset = 116;

        this.tiles = [];
        this.tilesHash = {};

        // array of explosion sprite for destroyed obstacles
        this.explosions = [];
        this.obstacles = [];

        // grid length and height
        this.countX = 9;
        this.countY = 5;

        this.MAXMOVES = 7;

        this.RILEYPUSHFRAME = 18;
        this.RILEYWINFRAME = 19;

        // capture moves
        this.arrSpriteMoves = [];
        this.queue = [];

        this.badPropertyNames = [];

        // capture tiles player was on
        this.arrTileHistory = [];

        this.pushTrails = [];

        // determine if riley is moving on keypress
        this.isMoving = false;

        // play thru game delay
        this.tickReset = 60;
        this.tick = this.tickReset;

        // to calculate which frame to use for the move arrows spritesheet
        // if images added or removed, this value needs to be updated
        this.moveSquareOffset = 7;

        this.stepTextHighlighter = null;

        this.gameType = 0;

        // we are not terminating
        this.isTerminating = false;
        this.separator = null;

        this.gameOverAnimation = 'game-over';
        this.levelCompleteAnimation = 'levelComplete';

        this.robotADirection = 'down';
        this.robotBDirection = 'up';

        this.isAnimating = false;

        this.playerYOffset = -24;
        this.nextLevel = globalParameters.highestAchievedLevel;

        // updating instructions from toolbox restarts level
        // draging instructions should in game should not restart
        this.isInGameInstructionUpdate = false;

        // few sanity checks to make sure data is coming through
        if (this.params) {
            if (this.params.level > 0)
                this.levelNumber = this.params.level;

            if (this.params.gameType >= 0)
                this.gameType = this.params.gameType;

            if (this.params.level >= 0)
                globalParameters.currentLevel = this.params.level;

            this.robotADirection =
                GameScene.getRobotDirection(this.params.robotADirection, ROBOTA);
            this.robotBDirection =
                GameScene.getRobotDirection(this.params.robotBDirection, ROBOTB);
        }
    }

    create() {
        Sounds.stop('sidetrack/bg/lobby_loop');
        // create bg sprite and add background audio
        const bgTag = document.querySelector('.bg');
        bgTag.style.backgroundSize = '100% 100%';
        if (globalParameters.currentLevel >= 40) {
            Sounds.playLoop('sidetrack/bg/bonus_mode');
            bgTag.style.backgroundImage = 'url("assets/images/background3.jpg")';
        } else if (globalParameters.currentLevel >= 14) {
            Sounds.playLoop('sidetrack/bg/auto_mode');
            bgTag.style.backgroundImage = 'url("assets/images/background2.jpg")';
        } else {
            Sounds.playLoop('sidetrack/bg/manual_mode');
            bgTag.style.backgroundImage = 'url("assets/images/background1.jpg")';
        }

        this.displayLevelUI();

        this.createLevel();

        // create the player
        this.player = this.add.sprite(0, 0, 'riley').setOrigin(0).setDepth(1);

        this.setSpritePosition(this.player, this.playerXLocation,
            this.playerYLocation, 0, this.playerYOffset);

        this.player.anims.play('running');

        this.setKeyboardKeys();

        /* Listen to properties changes */
        this.game.events.on('global-property-change',
            this.onGlobalPropertyChange, this);

        this.events.on('shutdown', () => {
            this.game.events.off('global-property-change',
                this.onGlobalPropertyChange, this);
        }, this);

        if (this.gameType === PLAYTHRUGAME) {
            this.playButton = new Button(this, 0, 0, 'playButton', 0, 1, 3,
                1, 1, this.playButtonClick.bind(this)).setOrigin(0);

            this.setSpritePosition(this.playButton, -2, this.countY, -20, -10);

            const x = 0;
            const y = this.countY * this.tileLength + this.yOffset - 10;

            this.separator = this.add.sprite(x - this.tileLength, y,
                'separator').setVisible(false).setOrigin(0);
        } else {
            const scaleX = 1;
            const scaleY = 1;

            this.fowardKeyButton = new Button(this, 0, 0, 'moveSquares', 1,
                this.moveSquareOffset, 27, scaleX, scaleY, () => {
                    if (!this.isMoving) {
                        this.isMoving = true;
                        this.queue.push(FORWARD);
                    }
                }).setOrigin(0);

            this.upKeyButton = new Button(this, 0, 0, 'moveSquares', 2,
                this.moveSquareOffset, 27, scaleX, scaleY, () => {
                    if (!this.isMoving) {
                        this.isMoving = true;
                        this.queue.push(UP);
                    }
                }).setOrigin(0);

            this.downKeyButton = new Button(this, 0, 0, 'moveSquares', 3,
                this.moveSquareOffset, 27, scaleX, scaleY, () => {
                    if (!this.isMoving) {
                        this.isMoving = true;
                        this.queue.push(DOWN);
                    }
                }).setOrigin(0);

            this.spacebarButton = new Button(this, 0, 0, 'spaceBar', 0, 1, 2,
                scaleX, scaleY, () => {
                    if (!this.isMoving) {
                        this.isMoving = true;
                        this.queue.push(JUMP);
                        this.player.anims.stop('running');
                        this.player.anims.play('jumping');
                    }
                }).setOrigin(0);

            this.setSpritePosition(this.fowardKeyButton, -2, this.countY - 1, -20, -10);
            this.setSpritePosition(this.upKeyButton, -2, this.countY - 2, -20, -10);
            this.setSpritePosition(this.downKeyButton, -2, this.countY, -20, -10);
            this.setSpritePosition(this.spacebarButton, -3, this.countY - 1, -20, -10);
        }

        if (globalParameters.currentLevel === 26 && globalParameters.showHackdex) {
            this.hackdex = this.add.sprite(0, 0, 'hackdex').setOrigin(0);
            this.setSpritePosition(this.hackdex, this.goalXLocation, this.goalYLocation);
        }

        /* Reset Global game state */
        globalParameters.success = true;
        globalParameters.score = 0;

        if (window.ToyApp)
            window.ToyApp.loadNotify();

        globalParameters.playing = true;
    }

    update() {
        // don't execute if we are terminating
        if (this.isTerminating || globalParameters.paused || this.isAnimating ||
            !globalParameters.playing)
            return;

        // move Riley at gamespeed when at last tile
        if (this.playerXLocation >= this.MAXMOVES) {
            this.player.x += this.playerSpeed;
            this.checkGameOver();
        } else {
            if (this.gameType === PLAYTHRUGAME) {
                if (this.isMoving) {
                    this.playButton.setFrame(2);
                    this.tick++;

                    if (this.tick >= this.tickReset) {
                        this.tick = 0;
                        this.placePlayer();
                    }
                }
            }

            if (this.gameType === DEFAULTGAME) {
                if (this.isMoving)
                    this.placePlayer();
            }
        }
    }

    setKeyboardKeys() {
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.enterKey.on('up', () => {
            if (!this.isMoving) {
                this.isMoving = true;
                if (this.playButton) {
                    this.playButton.setFrame(3);
                }
            }
        }, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.cursors.up.on('up', () => {
            if (!this.isMoving && this.playerXLocation < this.MAXMOVES) {
                this.isMoving = true;
                this.queue.push(UP);
            }
        });

        this.cursors.down.on('up', () => {
            if (!this.isMoving && this.playerXLocation < this.MAXMOVES) {
                this.isMoving = true;
                this.queue.push(DOWN);
            }
        });

        this.cursors.right.on('up', () => {
            if (!this.isMoving && this.playerXLocation < this.MAXMOVES) {
                this.isMoving = true;
                this.queue.push(FORWARD);
            }
        });

        this.spaceBar.on('up', () => {
            if (!this.isMoving && this.playerXLocation < this.MAXMOVES) {
                this.isMoving = true;
                this.queue.push(JUMP);
                this.player.anims.stop('running');
                this.player.anims.play('jumping');
            }
        });

        this.spaceBar.enabled = false;
        this.cursors.right.enabled = false;
        this.cursors.up.enabled = false;
        this.cursors.down.enabled = false;
        this.enterKey.enabled = false;

        if (this.gameType === PLAYTHRUGAME)
            this.enterKey.enabled = true;

        if (this.gameType === DEFAULTGAME) {
            this.spaceBar.enabled = true;
            this.cursors.right.enabled = true;
            this.cursors.up.enabled = true;
            this.cursors.down.enabled = true;
        }
    }

    static handleMovementAudio(moveType) {
        Sounds.stop('sidetrack/sfx/start_chime');
        Sounds.stop('sidetrack/sfx/move_fwd');
        Sounds.stop('sidetrack/sfx/move_up');
        Sounds.stop('sidetrack/sfx/move_down');
        Sounds.stop('sidetrack/sfx/move_jump');
        Sounds.stop('sidetrack/sfx/push_default');
        Sounds.stop('sidetrack/sfx/failure');

        if (moveType === FORWARD)
            Sounds.play('sidetrack/sfx/move_fwd');


        if (moveType === UP)
            Sounds.play('sidetrack/sfx/move_up');


        if (moveType === DOWN)
            Sounds.play('sidetrack/sfx/move_down');


        if (moveType === JUMP)
            Sounds.play('sidetrack/sfx/move_jump');


        if (moveType === PUSH)
            Sounds.play('sidetrack/sfx/push_default');


        if (moveType === ERROR || moveType === NONE)
            Sounds.play('sidetrack/sfx/failure');
    }

    handlePlaythruAnimations(moveType) {
        this.player.anims.stop('jumping');
        this.player.anims.stop('running');
        this.player.anims.stop('glitch');

        if (moveType === FORWARD || moveType === UP ||
            moveType === DOWN)
            this.player.anims.play('running');

        if (moveType === ERROR || moveType === NONE)
            this.player.anims.play('glitch');

        if (moveType === JUMP)
            this.player.anims.play('jumping');
    }

    checkGameOver() {
        const tmpObstacle = this.getObstacle(this.playerXLocation, this.playerYLocation);
        const isJumping = this.arrSpriteMoves[this.playerXLocation].moveType === JUMP;
        const isPushing = this.arrSpriteMoves[this.playerXLocation].moveType === PUSH;

        // If player has reached final column
        if (this.playerXLocation >= this.MAXMOVES) {
            if (this.playerYLocation !== this.goalYLocation)
                this.gameLost();

            // check collisions with obstacles on final square
            if (tmpObstacle) {
                if (tmpObstacle.type !== PIT)
                    this.gameLost();
                else if (!isJumping)
                    this.gameLost();
            }

            // game won when Riley runs to last square
            if (this.player.x > this.goalXLocation * this.tileLength + this.xOffset) {
                if (this.playerYLocation === this.goalYLocation)
                    this.gameWon();
            }
        } else if (tmpObstacle) {
            if (tmpObstacle.type === PIT && isJumping)
                return;

            if (isPushing && tmpObstacle.type !== PIT) {
                const tmpNextObstacle =
                    this.getObstacle(this.playerXLocation + 1, this.playerYLocation);

                // cannot be an obstacle next to the obstacle you're pushing
                if (tmpObstacle && !tmpNextObstacle) {
                    this.pushObstacle(tmpObstacle);
                    return;
                }
                // unless that obstacle is a pit
                if (tmpNextObstacle.type === PIT) {
                    this.pushObstacle(tmpObstacle);
                    return;
                }
            }

            this.gameLost();
        }
    }

    pushObstacle(pushedObstacle) {
        var nextObstacle;

        for (var i = pushedObstacle.xPosition + 1; i <= this.MAXMOVES; i++) {
            nextObstacle = this.getObstacle(i, pushedObstacle.yPosition);
            if (nextObstacle)
                break;
        }

        if (nextObstacle) {
            if (nextObstacle.type === PIT) {
                // push obstacle into PIT
                pushedObstacle.xPosition = nextObstacle.xPosition;
                this.setSpritePosition(pushedObstacle.sprite,
                    pushedObstacle.xPosition, pushedObstacle.yPosition);
                this.addExplosionSprite(pushedObstacle);
            } else {
                pushedObstacle.xPosition = nextObstacle.xPosition - 1;
                this.setSpritePosition(pushedObstacle.sprite,
                    pushedObstacle.xPosition, pushedObstacle.yPosition);
            }
        // obstacle pushed to last tile
        } else {
            pushedObstacle.xPosition = this.MAXMOVES;
            this.setSpritePosition(pushedObstacle.sprite,
                pushedObstacle.xPosition, pushedObstacle.yPosition);
        }

        const halfTileLength = this.tileLength * 0.5;
        let pushArrow;

        // add push trails sprites
        for (var j = this.playerXLocation + 1; j < pushedObstacle.xPosition; j++) {
            pushArrow = this.add.sprite(0, 0, 'pushTrail');
            this.setSpritePosition(pushArrow, j,
                pushedObstacle.yPosition, halfTileLength, halfTileLength);
            this.pushTrails.push(pushArrow);
        }
    }

    addExplosionSprite(obstacle) {
        obstacle.isDestroyed = true;
        const explosion = this.add.sprite(0, 0, 'explosion').setOrigin(0).setDepth(2);
        this.setSpritePosition(explosion, obstacle.xPosition,
            obstacle.yPosition, -10, -10);
        this.explosions.push(explosion);
    }

    removeAllExplosions() {
        for (var i = 0; i < this.explosions.length; i++)
            this.explosions[i].destroy();

        this.explosions = [];
    }

    removeObstacle() {
        for (var i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].isDestroyed) {
                this.obstacles[i].sprite.destroy();
                this.obstacles.splice(i, 1);
                i--;
            }
        }
    }

    setSpritePosition(sprite, x, y, xPadding = 0, yPadding = 0) {
        sprite.x = x * this.tileLength + this.xOffset + xPadding;
        sprite.y = y * this.tileLength + this.yOffset + yPadding;
    }

    playButtonClick() {
        if (!this.isMoving) {
            this.isMoving = true;
            this.playButton.setFrame(3);
            this.playButton.disabled = true;
        }
    }

    getObstacle(x, y) {
        let tmpObstacle = null;
        for (var i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].xPosition === x &&
                this.obstacles[i].yPosition === y) {
                tmpObstacle = this.obstacles[i];
                break;
            }
        }
        return tmpObstacle;
    }

    hasRobotCollided(x, y) {
        let isCollision = false;

        // if obstacles in x and y coords are not robots, there is a collision
        for (var i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].xPosition === x && this.obstacles[i].yPosition === y) {
                if (this.obstacles[i].type !== ROBOTA && this.obstacles[i].type !== ROBOTB) {
                    isCollision = true;
                    break;
                }
            }
        }
        return isCollision;
    }

    placeRobots() {
        let xPosition;
        let yPosition;
        let robotDirection = '';

        const robots = this.obstacles.filter(({type}) => [ROBOTA, ROBOTB].includes(type));

        for (var i = 0; i < robots.length; i++) {
            if (robots[i].type === ROBOTA)
                robotDirection = this.robotADirection;

            if (robots[i].type === ROBOTB)
                robotDirection = this.robotBDirection;

            if (robotDirection === 'up') {
                if (robots[i].yPosition <= 0)
                    yPosition = this.countY - 1;
                else
                    yPosition = robots[i].yPosition - 1;
            }

            if (robotDirection === 'down') {
                if (robots[i].yPosition >= this.countY - 1)
                    yPosition = 0;
                else
                    yPosition = robots[i].yPosition + 1;
            }

            xPosition = robots[i].xPosition;
            robots[i].yPosition = yPosition;
            this.setSpritePosition(robots[i].sprite, xPosition, yPosition);
        }

        // play robot sound only once
        if (robots.length)
            Sounds.play('sidetrack/sfx/robot');
    }

    checkRobotCollisions() {
        let hasRobotCollided = false;

        // TODO: find better way to code this so it's not O(n²)
        const robots = this.obstacles.filter(({type}) => [ROBOTA, ROBOTB].includes(type));

        for (var j = 0; j < robots.length; j++) {
            hasRobotCollided = this.hasRobotCollided(robots[j].xPosition, robots[j].yPosition);

            if (hasRobotCollided)
                this.addExplosionSprite(robots[j]);
        }
    }

    setRobotsFrame() {
        for (var i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].type === ROBOTA) {
                if (this.robotADirection === 'down')
                    this.obstacles[i].sprite.setFrame(0);
                else
                    this.obstacles[i].sprite.setFrame(1);
            }

            if (this.obstacles[i].type === ROBOTB) {
                if (this.robotBDirection === 'down')
                    this.obstacles[i].sprite.setFrame(3);
                else
                    this.obstacles[i].sprite.setFrame(2);
            }
        }
    }

    static getRobotDirection(direction, type) {
        let defaultDirection = '';

        if (type === ROBOTA)
            defaultDirection = 'down';

        if (type === ROBOTB)
            defaultDirection = 'up';

        if (direction === 'up' || direction === 'down')
            return direction;
        return defaultDirection;
    }

    placePlayer() {
        this.removeObstacle();
        this.removeAllExplosions();
        this.placeRobots();
        this.checkRobotCollisions();

        this.playerXLocation++;

        // destroy all push trails on move
        for (var j = 0; j < this.pushTrails.length; j++)
            this.pushTrails[j].destroy();

        this.pushTrails = [];

        const rileyMove = this.arrSpriteMoves[this.playerXLocation];

        if (this.gameType === DEFAULTGAME) {
            rileyMove.setFrame(this.queue[this.playerXLocation]);
            rileyMove.moveType = this.queue[this.playerXLocation];

            this.player.anims.stop('jumping');
            this.player.anims.play('running');

            this.isMoving = false;

            // handle up movements
            if (this.queue[this.playerXLocation] === UP && this.playerYLocation > 0)
                this.playerYLocation -= 1;

            // handle down movements
            if (this.queue[this.playerXLocation] === DOWN &&
                this.playerYLocation < this.countY - 1)
                this.playerYLocation += 1;

            if (this.queue[this.playerXLocation] === JUMP) {
                this.player.anims.stop('running');
                this.player.anims.play('jumping');
            }
        } else if (this.gameType === PLAYTHRUGAME) {
            for (var i = 0; i < this.playerXLocation; i++)
                this.arrSpriteMoves[i].setFrame(this.arrSpriteMoves[i].moveType);

            // highlight the move Riley is on
            const highlightedSquare = rileyMove.moveType + this.moveSquareOffset * 3;

            if (this.arrSpriteMoves.length > this.playerXLocation) {
                this.handlePlaythruAnimations(rileyMove.moveType);

                if (rileyMove.moveType === UP &&
                    this.playerYLocation > 0)
                    this.playerYLocation -= 1;

                if (rileyMove.moveType === DOWN &&
                    this.playerYLocation < this.countY - 1)
                    this.playerYLocation += 1;

                if (rileyMove.moveType === PUSH)
                    this.player.setFrame(this.RILEYPUSHFRAME);

                rileyMove.setFrame(highlightedSquare);

                this.stepTextHighlighter.setVisible(true);
                this.stepTextHighlighter.x =
                    this.playerXLocation * this.tileLength + this.xOffset + 43;
                this.stepTextHighlighter.y = this.countY * this.tileLength + this.yOffset + 168;
            }
        }

        GameScene.handleMovementAudio(rileyMove.moveType);

        this.placeTrail();
        this.setSpritePosition(this.player, this.playerXLocation, this.playerYLocation,
            0, this.playerYOffset);

        // place the final trail
        if (this.playerXLocation === this.MAXMOVES)
            this.placeTrail(true);

        if (this.explosions.length > 0) {
            Sounds.play('sidetrack/sfx/explosion');
        }
        
        this.checkGameOver();
    }

    placeTrail(isFinalTrail = false) {
        var trail = this.add.sprite(this.player.x, this.player.y - this.playerYOffset,
            'trail').setOrigin(0);
        this.arrTileHistory.push(this.getTile(this.playerXLocation, this.playerYLocation));

        let currentYLocation = this.arrTileHistory[this.playerXLocation].y;
        const newYLocation = this.arrTileHistory[this.playerXLocation + 1].y;

        let isMovementForward = currentYLocation === newYLocation;
        let isMovementUp = currentYLocation > newYLocation;
        let isMovementDown = currentYLocation < newYLocation;

        if (this.playerXLocation === 0) {
            if (isMovementUp)
                trail.setFrame(2);
            else if (isMovementDown)
                trail.setFrame(1);
            else
                // default move forward
                trail.setFrame(0);

            return;
        }

        let prevYLocation = this.arrTileHistory[this.playerXLocation - 1].y;

        if (isFinalTrail) {
            isMovementForward = true;
            isMovementUp = false;
            isMovementDown = false;
            currentYLocation = this.arrTileHistory[this.playerXLocation + 1].y;
            prevYLocation = this.arrTileHistory[this.playerXLocation].y;
        }

        const isPreviousMovementForward = prevYLocation === currentYLocation;
        const isPreviousMovementUp = prevYLocation > currentYLocation;
        const isPreviousMovementDown = prevYLocation < currentYLocation;

        if (isMovementForward) {
            if (isPreviousMovementForward)
                trail.setFrame(0);
            if (isPreviousMovementUp)
                trail.setFrame(7);
            if (isPreviousMovementDown)
                trail.setFrame(4);
        }

        if (isMovementUp) {
            if (isPreviousMovementForward)
                trail.setFrame(2);
            if (isPreviousMovementUp)
                trail.setFrame(6);
            if (isPreviousMovementDown)
                trail.setFrame(5);
        }

        if (isMovementDown) {
            if (isPreviousMovementForward)
                trail.setFrame(1);
            if (isPreviousMovementUp)
                trail.setFrame(8);
            if (isPreviousMovementDown)
                trail.setFrame(3);
        }
    }

    drawTiles() {
        const minTile = 0;
        const maxTiles = 9;

        let x;
        let y;

        for (let i = 0; i < this.tiles.length; i++) {
            x = this.tiles[i].x * this.tileLength + this.xOffset;
            y = this.tiles[i].y * this.tileLength + this.yOffset;

            // do not draw starting or final tiles
            if (this.tiles[i].x < this.countX - 2 && this.tiles[i].x >= 0) {
                this.add.sprite(x, y, 'tiles',
                    Phaser.Math.Between(minTile, maxTiles)).setOrigin(0);
            }
        }
    }

    addDragInputs() {
        this.input.on('dragstart', (pointer, gameObject) => {
            if (this.isMoving)
                return;

            Sounds.play('sidetrack/sfx/instruction_grab');
            const gameObjectFrame = gameObject.moveType + this.moveSquareOffset * 2;

            // determine if instruction is dragged left or right
            gameObject.defaultX = gameObject.x;

            // so user can see the move they're dragging
            gameObject.setDepth(2);
            gameObject.setFrame(gameObjectFrame);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (this.isMoving)
                return;

            gameObject.x = dragX;
            gameObject.y = dragY;

            let index = 0;
            for (let i = 0; i < this.arrSpriteMoves.length; i++) {
                if (gameObject === this.arrSpriteMoves[i]) {
                    index = i;
                    break;
                }
            }

            const sp = this.separator.position;

            this.setSeparatorPosition(gameObject);

            if (index !== this.separator.position && this.separator.position !== index + 1) {
                this.separator.setVisible(true);

                if (sp !== this.separator.position)
                    Sounds.play('sidetrack/sfx/instruction_drag');
            } else {
                this.separator.setVisible(false);
            }
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (this.isMoving)
                return;

            Sounds.play('sidetrack/sfx/instruction_drop');
            gameObject.setFrame(gameObject.moveType);
            gameObject.setDepth(1);

            const index = this.arrSpriteMoves.indexOf(gameObject);

            if (this.separator.visible) {
                this.arrSpriteMoves = this.reorderInstructions(this.arrSpriteMoves,
                    index, this.separator.position);
                this.separator.setVisible(false);
            }

            var instructions = [];

            // Place the draggable move squares in correct spots
            for (let i = 0; i <= this.MAXMOVES; i++) {
                this.setSpritePosition(this.arrSpriteMoves[i], i, this.countY, -15, 16);

                if (this.arrSpriteMoves[i].moveType === FORWARD)
                    instructions.push('riley.forward();');

                if (this.arrSpriteMoves[i].moveType === UP)
                    instructions.push('riley.up();');

                if (this.arrSpriteMoves[i].moveType === DOWN)
                    instructions.push('riley.down();');

                if (this.arrSpriteMoves[i].moveType === JUMP)
                    instructions.push('riley.jump();');

                if (this.arrSpriteMoves[i].moveType === PUSH)
                    instructions.push('riley.push();');

                if (this.arrSpriteMoves[i].frame.name === ERROR)
                    instructions.push(`riley.${this.arrSpriteMoves[i].badPropertyName}();`);
            }

            // this is kind of a hack to add proper indentation in toolbox
            const indent = '    ';
            for (var j = 0; j < instructions.length; j++)
                instructions[j] = indent + instructions[j];

            this.isInGameInstructionUpdate = true;
            this.params.instructionCode = instructions.join('\n');
        });
    }

    placeMoveSquares() {
        // add the move square below the tiles
        let sprite;

        for (let i = 0; i <= this.MAXMOVES; i++) {
            sprite = this.add.sprite(0, 0, 'moveSquares', NONE).setOrigin(0);
            this.setSpritePosition(sprite, i, this.countY, -15, 16);
            this.arrSpriteMoves.push(sprite);
        }

        if (this.gameType === PLAYTHRUGAME) {
            for (let i = 0; i < this.queue.length; i++) {
                // sets the initial sprite frame
                const moveSquare = this.arrSpriteMoves[i].setFrame(this.queue[i]);

                // stores the moveType since sprite frames will change
                moveSquare.moveType = this.queue[i];

                moveSquare.on('pointerover', () => {
                    if (!this.isMoving)
                        moveSquare.setFrame(moveSquare.moveType + this.moveSquareOffset);
                });

                moveSquare.on('pointerout', () => {
                    if (!this.isMoving)
                        moveSquare.setFrame(moveSquare.moveType);
                });

                moveSquare.setInteractive({useHandCursor: true});
                this.input.setDraggable(moveSquare);
                moveSquare.dragDistanceThreshold = 16;

                if (this.queue[i] === ERROR)
                    moveSquare.badPropertyName = this.badPropertyNames.shift() || 'error';
            }
        }
    }

    placeEndingTiles() {
        // create the exit goal
        const goal = this.add.sprite(0, 0, 'specialTiles', 1).setOrigin(0);

        // wrong Exits
        var wrongExitGroup = this.add.group({
            key: 'specialTiles',
            repeat: 4,
        });

        this.setSpritePosition(goal, this.MAXMOVES,
            this.goalYLocation, 0, 0);

        const wrongExits = wrongExitGroup.getChildren();

        for (var i = 0; i < wrongExits.length; i++) {
            wrongExits[i].setOrigin(0);
            this.setSpritePosition(wrongExits[i], this.MAXMOVES, i, 0);

            // wrong exit sprite sheet frame
            wrongExits[i].setFrame(2);

            // place ending exits on top of other tiles
            // wrongExits[i].setDepth(1);

            if (i === this.goalYLocation)
                wrongExits[i].visible = false;
        }
    }

    displayLevelUI() {
        const gameW = this.sys.game.config.width;
        const gameH = 76;

        this.nextLevelButton = new Button(this, gameW / 2 + 150, gameH / 2 + 5,
            'next', 1, 1, 2, 1, 1, this.startNextLevel.bind(this));

        this.previousLevelButton = new Button(this, gameW / 2 - 151, gameH / 2 + 5,
            'previous', 1, 1, 2, 1, 1, this.startPreviousLevel.bind(this));

        this.nextLevelButton.setDepth(1);
        this.previousLevelButton.setDepth(1);

        this.enableLevelSelectors(globalParameters.levelSelectorsEnabled && globalParameters.playing);

        const txtLevel = this.add.text(gameW / 2 - 27, gameH / 2 + 4,
            `Level ${this.levelNumber}`, {
                font: 'bold 30pt Metropolis',
                fill: '#ffffff',
            });
        txtLevel.setOrigin(0.5);
        txtLevel.depth = 1;

        if (this.gameType === DEFAULTGAME) {
            const txtSpace = this.add.text(120, 770, 'Spacebar', {
                font: '18pt Metropolis',
                fill: '#def9ff',
            });

            txtSpace.setOrigin(0.5, 0.5);
            txtSpace.depth = 1;
        }

        var restartIcon = new Button(this, gameW / 2 + 90, gameH / 2 + 5,
            'restartIcon', 1, 1, 1, 1, 1, this.restartLevel.bind(this));

        restartIcon.setDepth(2);

        // text background
        this.add.sprite(gameW / 2, gameH / 2, 'levelSelectBackground');

        const yStepNumber = this.countY * this.tileLength + this.yOffset + 190;
        let xStepNumber;
        for (let i = 0; i <= this.MAXMOVES; i++) {
            xStepNumber = i * this.tileLength + this.xOffset + 65;
            this.add.text(xStepNumber, yStepNumber, i, {
                font: 'bold 30pt Metropolis',
                fill: '#53edf9',
            }).setOrigin(0.5);
        }

        this.stepTextHighlighter = this.add.sprite(0, 0, 'circleHighlight').setOrigin(0);
        this.stepTextHighlighter.setVisible(false);
    }

    createLevel() {
        // tile object
        this.Tile = function(x, y) {
            this.x = x;
            this.y = y;
            this.tileKey = `${x},${y}`;
            this.obstacleType = 0;
        };

        this.userInstructionsCodeScope = new UserInstructionsCodeScope();
        this.userLevelCodeScope = new UserLevelCodeScope();

        /* Get user functions */
        this.instructionCode = getUserFunction(this.params.instructionCode);
        this.runInstruction();

        this.levelCode = getUserFunction(this.params.levelCode);
        this.runObstacles();

        // starting tile
        this.tiles.push(new this.Tile(this.playerXLocation, this.playerYLocation));
        this.arrTileHistory.push(this.tiles[0]);

        for (let x = 0; x < this.countX; ++x) {
            for (let y = 0; y < this.countY; ++y)

                this.tiles.push(new this.Tile(x, y));
        }

        // set hashtable for tiles
        for (let i = 0; i < this.tiles.length; i++)
            this.tilesHash[this.tiles[i].tileKey] = this.tiles[i];

        this.drawTiles();
        this.placeEndingTiles();

        let sprite;

        // add obstacles
        for (var i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].type === WALL)
                sprite = this.add.sprite(0, 0, 'walls', 0).setOrigin(0);

            if (this.obstacles[i].type === PIT)
                sprite = this.add.sprite(0, 0, 'pit').setOrigin(0);

            if (this.obstacles[i].type === ROBOTA) {
                sprite = this.add.sprite(0, 0, 'robots', 0).setDepth(1).setOrigin(0);
                if (this.robotADirection === 'up')
                    sprite.setFrame(1);
            }

            if (this.obstacles[i].type === ROBOTB) {
                sprite = this.add.sprite(0, 0, 'robots', 2).setDepth(1).setOrigin(0);
                if (this.robotBDirection === 'down')
                    sprite.setFrame(3);
            }

            this.obstacles[i].sprite = sprite;
            this.setSpritePosition(this.obstacles[i].sprite, this.obstacles[i].xPosition,
                this.obstacles[i].yPosition);

            // set wall and pit spritesheet frame
            if (this.obstacles[i].type === WALL) {
                this.setNeighboringObstacles(this.obstacles[i]);
                GameScene.setSpritesheetFrame(this.obstacles[i]);
            }
        }

        this.placeMoveSquares();
        this.addDragInputs();

        // create the starting tile
        const startingTile = this.add.sprite(0, 0, 'specialTiles', 0).setOrigin(0);
        this.setSpritePosition(startingTile, this.playerXLocation, this.playerYLocation, -352);

        // Show need hack modal after level 14 to ensure that following levels
        // are played only with quests. If the level is greater than 23 the quest
        // is done so the user knows about the FtH to continue
        if (ToyApp.runningQuest) {
            hideNeedHackScreen();
        } else {
            if (this.levelNumber < 14 || globalParameters.highestAchievedLevel >= 23) {
                hideNeedHackScreen();
            } else {
                const content = `
                    <h1>Game Over</h1>

                    <p> It is not possible to continue without an associated quest. </p>

                    <p>
                    To play more levels of Sidetrack you should engage with Ada
                    in the Clubhouse. Try Hack and look for quests related to
                    Sidetrack.
                    </p>
                `;
                needHackScreen(content, () => {
                    ToyApp.showClubhouse('ada');
                });
            }
        }
    }

    setSeparatorPosition(gameObject) {
        const halfTilelength = this.tileLength * 0.5;
        const separatorOffset = this.xOffset + halfTilelength + 30;
        let offset;

        // find direction the instruction is dragged
        // to determine what part of gameObject we want to use measure
        if (gameObject.x > gameObject.defaultX)
            offset = this.xOffset - halfTilelength;
        else
            offset = this.xOffset + 32;

        if (gameObject.x < offset) {
            this.separator.x = separatorOffset - this.tileLength;
            this.separator.position = 0;
        }

        if (gameObject.x >= offset && gameObject.x < offset + this.tileLength) {
            this.separator.x = separatorOffset;
            this.separator.position = 1;
        }

        if (gameObject.x >= offset + this.tileLength &&
            gameObject.x < offset + this.tileLength * 2) {
            this.separator.x = separatorOffset + this.tileLength;
            this.separator.position = 2;
        }

        if (gameObject.x >= offset + this.tileLength * 2 &&
            gameObject.x < offset + this.tileLength * 3) {
            this.separator.x = separatorOffset + this.tileLength * 2;
            this.separator.position = 3;
        }

        if (gameObject.x >= offset + this.tileLength * 3 &&
            gameObject.x < offset + this.tileLength * 4) {
            this.separator.x = separatorOffset + this.tileLength * 3;
            this.separator.position = 4;
        }

        if (gameObject.x >= offset + this.tileLength * 4 &&
            gameObject.x < offset + this.tileLength * 5) {
            this.separator.x = separatorOffset + this.tileLength * 4;
            this.separator.position = 5;
        }

        if (gameObject.x >= offset + this.tileLength * 5 &&
            gameObject.x < offset + this.tileLength * 6) {
            this.separator.x = separatorOffset + this.tileLength * 5;
            this.separator.position = 6;
        }

        if (gameObject.x >= offset + this.tileLength * 6 &&
            gameObject.x < offset + this.tileLength * 7) {
            this.separator.x = separatorOffset + this.tileLength * 6;
            this.separator.position = 7;
        }

        if (gameObject.x >= offset + this.tileLength * 7) {
            this.separator.x = separatorOffset + this.tileLength * 7;
            this.separator.position = 8;
        }
    }

    reorderInstructions(arr, old_index, new_index) {
        void this;
        let index = new_index;
        if (old_index < new_index)
            index--;

        if (new_index >= arr.length)
            arr.push(arr.splice(old_index, 1)[0]);
        else
            arr.splice(index, 0, arr.splice(old_index, 1)[0]);

        return arr;
    }

    setNeighboringObstacles(obstacle) {
        const leftObstacle = this.getObstacle(obstacle.xPosition - 1,
            obstacle.yPosition);
        const rightObstacle = this.getObstacle(obstacle.xPosition + 1,
            obstacle.yPosition);
        const topObstacle = this.getObstacle(obstacle.xPosition,
            obstacle.yPosition - 1);
        const bottomObstacle = this.getObstacle(obstacle.xPosition,
            obstacle.yPosition + 1);

        if (leftObstacle && leftObstacle.type === obstacle.type)
            obstacle.sameLeftObstacle = true;

        if (rightObstacle && rightObstacle.type === obstacle.type)
            obstacle.sameRightObstacle = true;

        if (topObstacle && topObstacle.type === obstacle.type)
            obstacle.sameTopObstacle = true;

        if (bottomObstacle && bottomObstacle.type === obstacle.type)
            obstacle.sameBottomObstacle = true;
    }

    // sets spritesheet frame for walls
    static setSpritesheetFrame(obstacle) {
        const SPRITESHEET_ORDER = [0, 2, 1, 6, 4, 9, 8, 12, 3, 10, 7, 13, 5, 14, 11, 15];
        const spritesheetIndex = +!!obstacle.sameLeftObstacle << 3 |
            +!!obstacle.sameRightObstacle << 2 |
            +!!obstacle.sameTopObstacle << 1 |
            +!!obstacle.sameBottomObstacle;

        const spritesheetFrame = SPRITESHEET_ORDER[spritesheetIndex];
        obstacle.sprite.setFrame(spritesheetFrame);
    }

    getTile(x, y) {
        if (x < 0 || x > 7)
            return null;

        if (y < 0 || y > 4)
            return null;

        const tileKey = `${x},${y}`;
        return this.tilesHash[tileKey];
    }

    showModal(modalText) {
        GameScene.playLobbyLoopMusic();
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        this.createModalBackground(width, height);
        let modalTitle;

        if (this.anims.get(modalText)) {
            modalTitle = this.add.sprite(width / 2, height / 2 - 200, modalText);
            modalTitle.anims.play(modalText);
        } else {
            modalTitle = this.add.text(width / 2, height / 2 - 300,
                modalText, fontConfig).setOrigin(0.5, 0.5);
        }

        /* Add restart button */
        var btn = this.add.sprite(width / 2, height / 2 + 50,
            'button').setInteractive({useHandCursor: true});

        btn.on('pointerover', function() {
            btn.setFrame(1);
        });

        btn.on('pointerout', function() {
            btn.setFrame(0);
        });

        let btnText;

        if (modalText === 'game-over') {
            btnText = this.add.text(width / 2, height / 2 + 50,
                'RESTART', fontConfig).setOrigin(0.5, 0.5);

            /* Restart level on button click and enter */
            btn.on('pointerup', this.restartLevel.bind(this));
            this.input.keyboard.on('keyup_ENTER', this.restartLevel.bind(this));
            /* Goto next level on button click and enter */
        } else if (modalText === 'levelComplete') {
            btnText = this.add.text(width / 2, height / 2 + 50,
                'CONTINUE', fontConfig).setOrigin(0.5, 0.5);

            btn.on('pointerup', this.continueLevel.bind(this));
            this.input.keyboard.on('keyup_ENTER', this.continueLevel.bind(this));
        } else {
            btnText = this.add.text(width / 2, height / 2 + 50,
                'CLOSE', fontConfig).setOrigin(0.5);

            btn.on('pointerup', this.restartLevel.bind(this));
            this.input.keyboard.on('keyup_ENTER', this.restartLevel.bind(this));
        }

        this.modal.setDepth(2);
        modalTitle.setDepth(2);
        btn.setDepth(2);
        btnText.setDepth(2);

        /* We are not playing anymore */
        globalParameters.playing = false;
    }

    continueLevel() {
        Sounds.play('sidetrack/sfx/start_chime');
        this.scene.restart(levelParameters[this.nextLevel]);
    }

    restartLevel() {
        if (this.isAnimating)
            return;

        Sounds.play('sidetrack/sfx/start_chime');
        globalParameters.currentLevel = this.params.level;
        this.scene.restart(levelParameters[globalParameters.currentLevel]);
    }

    startPreviousLevel() {
        if (this.isAnimating || globalParameters.currentLevel <= 1)
            return;
        this.scene.restart(levelParameters[globalParameters.currentLevel - 1]);
    }

    startNextLevel() {
        if (this.isAnimating ||
            globalParameters.currentLevel >= globalParameters.highestAchievedLevel)
            return;
        this.scene.restart(levelParameters[globalParameters.currentLevel + 1]);
    }

    createModalBackground(width, height) {
        this.modal = this.add.graphics();

        this.modal.fillStyle(0x00000, 1);
        this.modal.setAlpha(0.8);
        this.modal.fillRoundedRect(width / 2 - 270, height / 2 - 350, 512, 510, 8);
    }

    playControlsCutscene() {
        this.isAnimating = true;
        game.input.keyboard.enabled = false;
        this.playButton.setAlpha(0);
        Sounds.play('sidetrack/sfx/felix_smash');

        this.controls = this.add.sprite(0, 0, 'controlsDestroyed').setOrigin(0);
        this.setSpritePosition(this.controls, -3, this.countY - 2, -50, -30);

        // play the destroy control animation
        this.controls.anims.play('controlsDestroyed');

        this.controls.on('animationcomplete', function() {
            this.controls.setVisible(false);
            // fade in play button
            this.tweens.add({
                targets: [this.playButton],
                duration: 1000,
                alpha: 1,
                onComplete: () => {
                    globalParameters.controlsCutscene = false;
                    this.isAnimating = false;
                    game.input.keyboard.enabled = true;
                },
            });
        }.bind(this));
    }

    playEscapeCutscene() {
        this.isAnimating = true;
        this.felix = this.add.sprite(0, 0, 'felixnet').setOrigin(0);

        this.setSpritePosition(this.felix, this.goalXLocation - 3, this.goalYLocation);
        this.felix.setDepth(5);
        this.felix.anims.play('felixnet');

        this.felix.on('animationcomplete', function() {
            globalParameters.escapeCutscene = false;
            this.isAnimating = false;
            this.showModal(this.levelCompleteAnimation);
        }.bind(this));
    }

    enableLevelSelectors(isEnabled) {
        if (isEnabled) {
            this.nextLevelButton.disabled = false;
            this.previousLevelButton.disabled = false;
            this.nextLevelButton.setFrame(1);
            this.previousLevelButton.setFrame(1);

            // disable previous button if level 1
            if (globalParameters.currentLevel <= 1) {
                this.previousLevelButton.disabled = true;
                this.previousLevelButton.setFrame(0);
            }

            // disable next button if reached highest level
            if (globalParameters.highestAchievedLevel <= globalParameters.currentLevel) {
                this.nextLevelButton.disabled = true;
                this.nextLevelButton.setFrame(0);
            }
        } else {
            this.nextLevelButton.disabled = true;
            this.previousLevelButton.disabled = true;
            this.previousLevelButton.setFrame(0);
            this.nextLevelButton.setFrame(0);
        }
    }

    static playLobbyLoopMusic() {
        Sounds.stop('sidetrack/bg/manual_mode');
        Sounds.stop('sidetrack/bg/auto_mode');
        Sounds.stop('sidetrack/bg/bonus_mode');
        Sounds.playLoop('sidetrack/bg/lobby_loop');
    }

    gameLost() {
        // initiated game over sequence
        this.isTerminating = true;
        globalParameters.success = false;

        Sounds.play('sidetrack/sfx/failure');

        // shake camera
        this.cameras.main.shake(500);

        // play glitch animation
        this.player.anims.stop('running');
        this.player.anims.stop('jumping');
        this.player.anims.play('glitch');

        // listen for event completion
        this.cameras.main.on('camerashakecomplete', function() {
            this.showModal(this.gameOverAnimation);
        }.bind(this));
    }

    gameWon() {
        // initiated game over sequence
        this.isTerminating = true;
        this.player.anims.stop('jumping');
        this.player.anims.stop('running');

        Sounds.play('sidetrack/sfx/success');

        this.player.setFrame(this.RILEYWINFRAME);

        if (globalParameters.currentLevel < globalParameters.availableLevels)
            this.nextLevel = globalParameters.currentLevel + 1;
        else
            this.nextLevel = globalParameters.highestAchievedLevel;

        if (this.nextLevel > globalParameters.highestAchievedLevel)
            globalParameters.highestAchievedLevel = this.nextLevel;

        saveState();

        // pick up hackdex
        if (globalParameters.currentLevel === 26 && globalParameters.showHackdex) {
            this.hackdex.setVisible(false);
            globalParameters.showHackdex = false;
        }

        // felix escape cutscene
        if (globalParameters.currentLevel === 40 &&
            globalParameters.willPlayFelixEscapeAnimation) {
            this.player.anims.play('running');

            this.tweens.add({
                targets: [this.player],
                duration: 2000,
                x: this.sys.game.config.width,
                onComplete: () => {
                    // set to false so quest knows to fire felix cutscene
                    globalParameters.willPlayFelixEscapeAnimation = false;
                },
            });
        } else {
            globalParameters.success = true;
            this.showModal(this.levelCompleteAnimation);
        }
    }

    onGlobalPropertyChange(obj, property) {
        if ('currentLevel' in obj)
            this.onGlobalParametersNotify(property);
        else if (Object.is(this.params, obj))
            this.onParametersNotify(property);
    }

    /* This will be called each time something in globalParameters changes */
    onGlobalParametersNotify(property) {
        if (property === 'controlsCutscene' && globalParameters.controlsCutscene)
            this.playControlsCutscene();
        else if (property === 'escapeCutscene' && globalParameters.escapeCutscene)
            this.playEscapeCutscene();
        else if (property === 'playing')
            this.enableLevelSelectors(globalParameters.levelSelectorsEnabled && globalParameters.playing);
        else if (property === 'levelSelectorsEnabled')
            this.enableLevelSelectors(globalParameters.levelSelectorsEnabled && globalParameters.playing);
    }

    /* This will be called each time something in this.params changes */
    onParametersNotify(property) {
        if (property === 'instructionCode') {
            if (this.isInGameInstructionUpdate) {
                this.isInGameInstructionUpdate = false;
                return;
            }
            this.instructionCode = getUserFunction(this.params.instructionCode);
            this.runInstruction();
            this.scene.restart(levelParameters[globalParameters.currentLevel]);
        } else if (property === 'levelCode') {
            this.levelCode = getUserFunction(this.params.levelCode);
            this.runObstacles();
            this.scene.restart(levelParameters[globalParameters.currentLevel]);
        } else if (property === 'robotADirection') {
            this.robotADirection = GameScene.getRobotDirection(this.params.robotADirection,
                ROBOTA);
            this.setRobotsFrame();
        } else if (property === 'robotBDirection') {
            this.robotBDirection = GameScene.getRobotDirection(this.params.robotBDirection,
                ROBOTB);
            this.setRobotsFrame();
        }
    }

    runInstruction() {
        if (this.gameType === DEFAULTGAME) {
            this.queue = [];
            return;
        }

        var scope = this.userInstructionsCodeScope;

        try {
            if (this.instructionCode)
                this.instructionCode(scope);

            // handle none instructions
            for (var i = 0; i <= this.MAXMOVES; i++) {
                if (i < scope.riley.queue.length)
                    this.queue.push(scope.riley.queue[i]);
                else
                    this.queue.push(NONE);
            }

            this.badPropertyNames = scope.riley._badPropertyNames;
        } catch (e) {
            /* User function error! */
            console.error(e);  // eslint-disable-line no-console
        }
    }

    runObstacles() {
        if (!this.levelCode)
            return;

        var scope = this.userLevelCodeScope;

        try {
            this.levelCode(scope);
            this.obstacles = scope.obstacles;
            this.playerYLocation = scope.rileyPosition;
            this.goalYLocation = scope.goalPosition;
        } catch (e) {
            /* User function error! */
            console.error(e);  // eslint-disable-line no-console
        }
    }
}
