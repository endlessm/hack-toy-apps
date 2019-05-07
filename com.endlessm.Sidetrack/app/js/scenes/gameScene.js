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
        this.xOffset = 450;
        this.yOffset = 180;

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

        // determine if riley is moving on keypress
        this.isMoving = false;
        // pressing the arrow key down only moves player once
        this.keyIsDown = false;

        // play thru game delay
        this.tickReset = 120;
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

        // few sanity checks to make sure data is coming through
        if (this.params) {
            if (this.params.level > 0)
                this.levelNumber = this.params.level;

            if (this.params.gameType >= 0)
                this.gameType = this.params.gameType;

            if (this.params.level >= 0)
                globalParameters.currentLevel = this.params.level;

            this.robotADirection =
                this.getRobotDirection(this.params.robotADirection, ROBOTA);
            this.robotBDirection =
                this.getRobotDirection(this.params.robotBDirection, ROBOTB);
        }
    }

    preload() {
        this.load.image('logo', 'assets/images/player.png');
    }

    create() {
        Sounds.stop('sidetrack/bg/lobby_loop');
        // create bg sprite and add background audio
        let bg;
        if (globalParameters.currentLevel >= 40) {
            Sounds.playLoop('sidetrack/bg/bonus_mode');
            bg = this.add.sprite(0, 0, 'background3'); // for final and bonus level
        }
        else if (globalParameters.currentLevel >= 14) {
            Sounds.playLoop('sidetrack/bg/auto_mode');
            bg = this.add.sprite(0, 0, 'background2'); // auto mode levels
        }
        else {
            Sounds.playLoop('sidetrack/bg/manual_mode');
            bg = this.add.sprite(0, 0, 'background1'); // manual and default
        }

        // change the origin to the top-left corner
        bg.setOrigin(0, 0);

        // Level text
        this.displayLevelUI();

        this.createLevel();

        // create the player
        this.player = this.add.sprite(0, 0, 'riley');
        this.player.setDepth(1);

        this.setSpritePosition(this.player, this.playerXLocation, this.playerYLocation);

        this.player.anims.play('running');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        /* Listen to properties changes */
        this.game.events.on('global-property-change',
            this.onGlobalPropertyChange, this);

        this.events.on('shutdown', () => {
            this.game.events.off('global-property-change',
                this.onGlobalPropertyChange, this);
        }, this);

        if (this.gameType === PLAYTHRUGAME) {
            this.playButton = new Button(this, 0, 0, 'playButton', 0, 1,
                1, 1, this.playButtonClick.bind(this));

            this.setSpritePosition(this.playButton, -1, this.countY, -75, 20);

            const x = this.xOffset - this.tileLength - 50;
            const y = this.countY * this.tileLength + this.yOffset + 20;

            this.separator = this.add.sprite(x - this.tileLength, y,
                'separator').setVisible(false);

            // TODO: animation should only happen when FelixNet appears
            // if (this.params.level === 14) {
            if (this.params.felixNetAppearsAnimation) {
                // hide the play button until animation is complete
                this.playButton.setAlpha(0);

                // TODO: add animation when assets received

                // this.controls = this.add.sprite(120,
                // 750, 'controls').setOrigin(0).setScale(0.7);
                // play the destroy control animation
                // this.controls.setVisible(true);
                // this.controls.anims.play('controls');

                // this.controls.on('animationcomplete', function() {
                //     this.controls.setVisible(false);
                //     // fade in play button
                //     this.tweens.add({
                //         targets: [this.playButton],
                //         duration: 2000,
                //         alpha: 1,
                //         onComplete: () => {
                //             var modalText = 'What was that?';
                //             this.showModal(modalText);
                //         },
                //     });
                // }.bind(this));
            }
        } else {
            const scaleX = 0.5;
            const scaleY = 0.5;

            this.fowardKeyButton = new Button(this, 0, 0, 'moveSquares', 1,
                this.moveSquareOffset, scaleX, scaleY, () => {
                    if (!this.isMoving) {
                        this.isMoving = true;
                        this.queue.push(FORWARD);
                    }
                });

            this.upKeyButton = new Button(this, 0, 0, 'moveSquares', 2,
                this.moveSquareOffset, scaleX, scaleY, () => {
                    if (!this.isMoving) {
                        this.isMoving = true;
                        this.queue.push(UP);
                    }
                });

            this.downKeyButton = new Button(this, 0, 0, 'moveSquares', 3,
                this.moveSquareOffset, scaleX, scaleY, () => {
                    if (!this.isMoving) {
                        this.isMoving = true;
                        this.queue.push(DOWN);
                    }
                });

            this.spacebarButton = new Button(this, 0, 0, 'spaceBar', 0, 1,
                scaleX, scaleY, () => {
                    if (!this.isMoving) {
                        this.isMoving = true;
                        this.queue.push(JUMP);
                        this.player.anims.stop('running');
                        this.player.anims.play('jumping');
                    }
                });

            this.setSpritePosition(this.fowardKeyButton, -1, this.countY, 0, 50);
            this.setSpritePosition(this.upKeyButton, -1, this.countY, 0, -20);
            this.setSpritePosition(this.downKeyButton, -1, this.countY, 0, 120);
            this.setSpritePosition(this.spacebarButton, -1, this.countY, -100, 50);
        }

        /* Reset Global game state */
        globalParameters.success = true;
        globalParameters.score = 0;
    }

    update() {
        // don't execute if we are terminating
        if (this.isTerminating || globalParameters.paused ||
            !globalParameters.playing)
            return;

        // forbids keyboard presses if true
        // only happens if player is in last column or game type is playthrough
        let isKeyboardPressOff = false;

        if (!isKeyboardPressOff)
            this.handleMovements();

        // move Riley at gamespeed when at last tile
        if (this.playerXLocation >= this.MAXMOVES) {
            this.player.x += this.playerSpeed;
            isKeyboardPressOff = true;
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

    handleMovementAudio(moveType) {
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

    handleMovements() {
        if (this.gameType === PLAYTHRUGAME) {
            if (this.enterKey.isDown && !this.isMoving) {
                this.isMoving = true;
                this.playButton.setFrame(3);
            }
        } else {
            if (this.cursors.right.isUp && this.cursors.up.isUp &&
                this.cursors.down.isUp && this.spaceBar.isUp)
                this.keyIsDown = false;

            if (!this.keyIsDown) {
                if (this.cursors.right.isDown && this.playerXLocation < this.MAXMOVES) {
                    this.queue.push(FORWARD);
                    this.isMoving = true;
                }

                if (this.cursors.up.isDown && this.playerXLocation < this.MAXMOVES) {
                    this.queue.push(UP);
                    this.isMoving = true;
                }

                if (this.cursors.down.isDown && this.playerXLocation < this.MAXMOVES) {
                    this.queue.push(DOWN);
                    this.isMoving = true;
                }

                if (this.spaceBar.isDown && this.playerXLocation < this.MAXMOVES) {
                    this.queue.push(JUMP);
                    this.isMoving = true;
                    this.player.anims.stop('running');
                    this.player.anims.play('jumping');
                }
            }
        }
    }

    checkGameOver() {
        const tmpObstacle = this.getObstacle(this.playerXLocation, this.playerYLocation);
        const isJumping = this.arrSpriteMoves[this.playerXLocation].moveType === JUMP;
        const isPushing = this.arrSpriteMoves[this.playerXLocation].moveType === PUSH;

        // If player has reached final column
        if (this.playerXLocation >= this.MAXMOVES) {
            if (this.playerYLocation !== this.goalYLocation)
                this.gameLost();

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
    }

    addExplosionSprite(obstacle) {
        obstacle.isDestroyed = true;
        const explosion = this.add.sprite(obstacle.sprite.x,
            obstacle.sprite.y, 'explosion').setDepth(2);
        this.explosions.push(explosion);
    }

    removeAllExplosions() {
        for (var i = 0; i < this.explosions.length; i++)
            this.explosions[i].destroy();
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

    getObstacleCountOnTile(x, y) {
        let obstacleCount = 0;
        for (var i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].xPosition === x &&
                this.obstacles[i].yPosition === y)
                obstacleCount++;
        }
        return obstacleCount;
    }

    placeRobots() {
        let xPosition;
        let yPosition;

        let isRobotType = false;
        let robotDirection = '';

        for (var i = 0; i < this.obstacles.length; i++) {
            isRobotType = false;

            if (this.obstacles[i].type === ROBOTA) {
                isRobotType = true;
                robotDirection = this.robotADirection;
            }

            if (this.obstacles[i].type === ROBOTB) {
                isRobotType = true;
                robotDirection = this.robotBDirection;
            }

            if (isRobotType) {
                if (robotDirection === 'up') {
                    if (this.obstacles[i].yPosition <= 0)
                        yPosition = this.countY - 1;
                    else
                        yPosition = this.obstacles[i].yPosition - 1;
                }

                if (robotDirection === 'down') {
                    if (this.obstacles[i].yPosition >= this.countY - 1)
                        yPosition = 0;
                    else
                        yPosition = this.obstacles[i].yPosition + 1;
                }

                xPosition = this.obstacles[i].xPosition;
                this.obstacles[i].yPosition = yPosition;
                this.setSpritePosition(this.obstacles[i].sprite, xPosition, yPosition);
            }
        }

        // play robot sound only once
        if(isRobotType)
            Sounds.play('sidetrack/sfx/robot');

    }

    checkRobotCollisions() {
        // check if obstacle exists in new position
        let obstacleCount;

        for (var i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].type === ROBOTA ||
                this.obstacles[i].type === ROBOTB) {
                obstacleCount = this.getObstacleCountOnTile(this.obstacles[i].xPosition,
                    this.obstacles[i].yPosition);

                if (obstacleCount > 1)
                    this.addExplosionSprite(this.obstacles[i]);
            }
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

    getRobotDirection(direction, type) {
        let defaultDirection = '';

        if (type === ROBOTA)
            defaultDirection = 'down';

        if (type === ROBOTB)
            defaultDirection = 'up';

        if (direction === 'up' || direction === 'down')
            return direction;
        else
            return defaultDirection;
    }

    placePlayer() {
        this.removeObstacle();
        this.removeAllExplosions();
        this.placeRobots();
        this.checkRobotCollisions();
        this.playerXLocation++;

        const rileyMove = this.arrSpriteMoves[this.playerXLocation];

        if (this.gameType === DEFAULTGAME) {
            rileyMove.setFrame(this.queue[this.playerXLocation]);
            rileyMove.moveType = this.queue[this.playerXLocation];

            this.player.anims.stop('jumping');
            this.player.anims.play('running');

            this.keyIsDown = true;
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
                    this.playerXLocation * this.tileLength + this.xOffset;
                this.stepTextHighlighter.y = this.countY * this.tileLength + this.yOffset + 120;
            }
        }

        this.handleMovementAudio(rileyMove.moveType);

        this.placeTrail();
        this.setSpritePosition(this.player, this.playerXLocation, this.playerYLocation);

        // place the final trail
        if (this.playerXLocation === this.MAXMOVES)
            this.placeTrail(true);

        this.checkGameOver();
    }

    placeTrail(isFinalTrail = false) {
        var trail = this.add.sprite(this.player.x, this.player.y, 'trail');
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

            // added this condition because starting location is a tile
            if (this.tiles[i].x < this.countX - 1 && this.tiles[i].x >= 0)
                this.add.sprite(x, y, 'tiles', Phaser.Math.Between(minTile, maxTiles));
        }
    }

    addDragInputs() {
        this.input.on('dragstart', (pointer, gameObject) => {
            Sounds.play('sidetrack/sfx/instruction_grab');
            const gameObjectFrame = gameObject.moveType + this.moveSquareOffset * 2;

            // so user can see the move they're dragging
            gameObject.setDepth(2);
            gameObject.setFrame(gameObjectFrame);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;

            let index = 0;
            for (let i = 0; i < this.arrSpriteMoves.length; i++) {
                if (gameObject === this.arrSpriteMoves[i]) {
                    index = i;
                    break;
                }
            }

            this.setSeparatorPosition(gameObject);

            if (index !== this.separator.position && this.separator.position !== index + 1) {
                this.separator.setVisible(true);
                Sounds.play('sidetrack/sfx/instruction_drag');
            }
            else
                this.separator.setVisible(false);
        });

        this.input.on('dragend', (pointer, gameObject) => {
            Sounds.play('sidetrack/sfx/instruction_drop');
            gameObject.setFrame(gameObject.moveType);
            gameObject.setDepth(1);

            const index = this.arrSpriteMoves.indexOf(gameObject);

            if (this.separator.visible) {
                this.arrSpriteMoves =
                    this.arrayMove(this.arrSpriteMoves, index, this.separator.position);
                this.separator.setVisible(false);
            }

            var instructions = [];

            // Place the draggable move squares in correct spots
            for (let i = 0; i <= this.MAXMOVES; i++) {
                this.setSpritePosition(this.arrSpriteMoves[i], i, this.countY, 0, 20);

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

            this.params.instructionCode = instructions.join('\n ');
        });
    }

    placeMoveSquares() {
        // add the move square below the tiles
        let sprite;

        for (let i = 0; i <= this.MAXMOVES; i++) {
            sprite = this.add.sprite(0, 0, 'moveSquares', NONE);
            this.setSpritePosition(sprite, i, this.countY, 0, 20);
            this.arrSpriteMoves.push(sprite);
        }

        // for playthru game types, the moves will be pre-populated
        for (let i = 0; i < this.queue.length; i++) {
            // sets the initial sprite frame
            const moveSquare = this.arrSpriteMoves[i].setFrame(this.queue[i]);

            // stores the moveType since sprite frames will change
            moveSquare.moveType = this.queue[i];

            // for playthru games, check if draggable is set
            if (this.gameType === PLAYTHRUGAME) {
                moveSquare.on('pointerover', () =>
                    moveSquare.setFrame(moveSquare.moveType + this.moveSquareOffset));
                moveSquare.on('pointerout', () => moveSquare.setFrame(moveSquare.moveType));

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
        const goal = this.add.sprite(0, 0, 'specialTiles', 1);

        // wrong Exits
        var wrongExitGroup = this.add.group({
            key: 'specialTiles',
            repeat: 4,
        });

        this.setSpritePosition(goal, this.MAXMOVES,
            this.goalYLocation, 160, 0);

        const wrongExits = wrongExitGroup.getChildren();

        for (var i = 0; i < wrongExits.length; i++) {
            this.setSpritePosition(wrongExits[i], this.MAXMOVES, i, 160);

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
        const gameH = 100;

        this.nextLevelButton = new Button(this, gameW / 2 + 145, gameH / 2,
            'next', 1, 1, 1, 1, () => {
                if (globalParameters.currentLevel + 1 <= globalParameters.highestAchievedLevel)
                    this.scene.restart(levelParameters[globalParameters.currentLevel + 1]);
            });

        this.previousLevelButton = new Button(this, gameW / 2 - 145, gameH / 2,
            'previous', 1, 1, 1, 1, () => {
                if (globalParameters.currentLevel > 1)
                    this.scene.restart(levelParameters[globalParameters.currentLevel - 1]);
            });

        this.nextLevelButton.setDepth(1);
        this.previousLevelButton.setDepth(1);

        const txtLevel = this.add.text(gameW / 2 - 30, gameH / 2, `Level ${this.levelNumber}`, {
            font: 'bold 30pt Metropolis',
            fill: '#ffffff',
        });
        txtLevel.setOrigin(0.5, 0.5);
        txtLevel.depth = 1;

        if (this.gameType === DEFAULTGAME) {
            const txtSpace = this.add.text(220, 910, 'space', {
                font: '18pt Metropolis-Medium',
                fill: '#def9ff',
            });

            txtSpace.setOrigin(0.5, 0.5);
            txtSpace.depth = 1;
        }

        var restartIcon = new Button(this, gameW / 2 + 80, gameH / 2,
            'restartIcon', 1, 1, 1, 1, () => {
                if (globalParameters.currentLevel > 1)
                    this.scene.restart(levelParameters[globalParameters.currentLevel - 1]);
            });

        restartIcon.setDepth(2);
        /* Restart level on button click and enter */
        restartIcon.on('pointerup', this.restartLevel.bind(this));

        // text background
        this.add.sprite(gameW / 2, gameH / 2, 'levelSelectBackground');

        const yStepNumber = this.countY * this.tileLength + this.yOffset + 120;
        let xStepNumber;
        for (let i = 0; i <= this.MAXMOVES; i++) {
            xStepNumber = i * this.tileLength + this.xOffset;
            this.add.text(xStepNumber, yStepNumber, i, {
                font: '30pt Metropolis-Medium',
                fill: '#53edf9',
            }).setOrigin(0.5);
        }

        this.stepTextHighlighter = this.add.sprite(0, 0, 'circleHighlight');
        this.stepTextHighlighter.setVisible(false).alpha = 0.4;
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
                sprite = this.add.sprite(0, 0, 'walls', 0);

            if (this.obstacles[i].type === PIT)
                sprite = this.add.sprite(0, 0, 'pit');

            if (this.obstacles[i].type === ROBOTA) {
                sprite = this.add.sprite(0, 0, 'robots', 0).setDepth(1);
                if (this.robotADirection === 'up')
                    sprite.setFrame(1);
            }

            if (this.obstacles[i].type === ROBOTB) {
                sprite = this.add.sprite(0, 0, 'robots', 2).setDepth(1);
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
        this.setSpritePosition(this.add.sprite(0, 0, 'specialTiles', 0),
            this.playerXLocation, this.playerYLocation, -170);
    }

    setSeparatorPosition(gameObject) {
        const minX = this.tileLength + this.xOffset;
        const maxX = this.MAXMOVES * this.tileLength + this.xOffset;
        const halfTilelength = this.tileLength * 0.5;

        const offset = minX - halfTilelength + 2;

        if (gameObject.x < offset) {
            this.separator.x = offset - this.tileLength;
            this.separator.position = 0;
        }

        if (gameObject.x >= offset && gameObject.x < offset + this.tileLength) {
            this.separator.x = offset;
            this.separator.position = 1;
        }

        if (gameObject.x >= offset + this.tileLength &&
            gameObject.x < offset + this.tileLength * 2) {
            this.separator.x = offset + this.tileLength;
            this.separator.position = 2;
        }

        if (gameObject.x >= offset + this.tileLength * 2 &&
            gameObject.x < offset + this.tileLength * 3) {
            this.separator.x = offset + this.tileLength * 2;
            this.separator.position = 3;
        }

        if (gameObject.x >= offset + this.tileLength * 3 &&
            gameObject.x < offset + this.tileLength * 4) {
            this.separator.x = offset + this.tileLength * 3;
            this.separator.position = 4;
        }

        if (gameObject.x >= offset + this.tileLength * 4 &&
            gameObject.x < offset + this.tileLength * 5) {
            this.separator.x = offset + this.tileLength * 4;
            this.separator.position = 5;
        }

        if (gameObject.x >= offset + this.tileLength * 5 &&
            gameObject.x < offset + this.tileLength * 6) {
            this.separator.x = offset + this.tileLength * 5;
            this.separator.position = 6;
        }

        if (gameObject.x >= offset + this.tileLength * 6 &&
            gameObject.x < offset + this.tileLength * 7) {
            this.separator.x = offset + this.tileLength * 6;
            this.separator.position = 7;
        }

        if (gameObject.x >= maxX) {
            this.separator.x = offset + this.tileLength * 7;
            this.separator.position = 8;
        }
    }

    arrayMove(arr, old_index, new_index) {
        void this;

        if (new_index >= arr.length)
            arr.push(arr.splice(old_index, 1)[0]);
        else
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

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

    // sets spritesheet frame for walls and pits
    static setSpritesheetFrame(obstacle) {
        let boolVal = 0;
        let spriteSheetFrame = 0;

        if (obstacle.sameLeftObstacle)
            boolVal += 1000;

        if (obstacle.sameRightObstacle)
            boolVal += 100;

        if (obstacle.sameTopObstacle)
            boolVal += 10;

        if (obstacle.sameBottomObstacle)
            boolVal += 1;

        switch (boolVal) {
        case 1111:
            spriteSheetFrame = 15;
            break;
        case 1101:
            spriteSheetFrame = 14;
            break;
        case 1011:
            spriteSheetFrame = 13;
            break;
        case 111:
            spriteSheetFrame = 12;
            break;
        case 1110:
            spriteSheetFrame = 11;
            break;
        case 1001:
            spriteSheetFrame = 10;
            break;
        case 101:
            spriteSheetFrame = 9;
            break;
        case 110:
            spriteSheetFrame = 8;
            break;
        case 1010:
            spriteSheetFrame = 7;
            break;
        case 11:
            spriteSheetFrame = 6;
            break;
        case 1100:
            spriteSheetFrame = 5;
            break;
        case 100:
            spriteSheetFrame = 4;
            break;
        case 1000:
            spriteSheetFrame = 3;
            break;
        case 1:
            spriteSheetFrame = 2;
            break;
        case 10:
            spriteSheetFrame = 1;
            break;
        default:
            spriteSheetFrame = 0;
            break;
        }

        obstacle.sprite.setFrame(spriteSheetFrame);
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
        this.playLobbyLoopMusic();
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
        if (globalParameters.nextLevel) {
            globalParameters.playing = true;
            this.scene.restart(levelParameters[globalParameters.nextLevel]);
        } else {
            this.scene.restart(levelParameters[globalParameters.highestAchievedLevel]);
        }
    }

    restartLevel() {
        Sounds.play('sidetrack/sfx/start_chime');
        globalParameters.playing = true;
        globalParameters.currentLevel = this.params.level;
        this.scene.restart(levelParameters[globalParameters.currentLevel]);
    }

    createModalBackground(width, height) {
        this.modal = this.add.graphics();

        this.modal.fillStyle(0x00000, 1);
        this.modal.setAlpha(0.8);
        this.modal.fillRoundedRect(width / 2 - 270, height / 2 - 350, 512, 510, 8);
    }

    playControlsCutscene() {
        // TODO: https://phabricator.endlessm.com/T26461
        // For now, just wait for 5 seconds
        setTimeout(() => {
            // These should actually be set by the quest script.
            globalParameters.currentLevel = 14;
            globalParameters.availableLevels = 40;

            this.scene.restart(levelParameters[globalParameters.currentLevel]);
            globalParameters.controlsCutscene = false;
        }, 5000);
    }

    playEscapeCutscene() {
        // TODO: https://phabricator.endlessm.com/T26445
        // For now, just wait for 5 seconds
        setTimeout(() => {
            // These should actually be set by the quest script.
            globalParameters.currentLevel = 41;
            globalParameters.availableLevels = 50;

            this.scene.restart(levelParameters[globalParameters.currentLevel]);
            globalParameters.escapeCutscene = false;
        }, 5000);
    }

    playLobbyLoopMusic() {
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

        globalParameters.success = true;

        this.player.anims.stop('jumping');
        this.player.anims.stop('running');

        Sounds.play('sidetrack/sfx/success');

        this.player.setFrame(this.RILEYWINFRAME);

        /* Go back to title if this was the last level */
        if (globalParameters.currentLevel < globalParameters.availableLevels)
            globalParameters.nextLevel = globalParameters.currentLevel + 1;
        else
            globalParameters.nextLevel = 0;

        if (globalParameters.nextLevel > globalParameters.highestAchievedLevel)
            globalParameters.highestAchievedLevel = globalParameters.nextLevel;

        saveState();

        this.showModal(this.levelCompleteAnimation);
    }

    onGlobalPropertyChange(obj, property) {
        if (Object.is(globalParameters, obj))
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
    }

    /* This will be called each time something in this.params changes */
    onParametersNotify(property) {
        if (property === 'instructionCode') {
            this.instructionCode = getUserFunction(this.params.instructionCode);
            this.runInstruction();
        } else if (property === 'levelCode') {
            this.levelCode = getUserFunction(this.params.levelCode);
            this.runObstacles();
        } else if (property === 'robotADirection') {
            this.robotADirection = this.getRobotDirection(this.params.robotADirection, ROBOTA);
            this.setRobotsFrame();
        } else if (property === 'robotBDirection') {
            this.robotBDirection = this.getRobotDirection(this.params.robotBDirection, ROBOTB);
            this.setRobotsFrame();
        }
    }

    runInstruction() {
        if (!this.instructionCode)
            return;

        var scope = this.userInstructionsCodeScope;

        try {
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
