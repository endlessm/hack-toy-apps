/* exported GameScene */

/* global saveState, UserScope, WALL, PIT, UP, DOWN, JUMP, FORWARD
PLAYTHRUGAME, DEFAULTGAME, NONE */

function getUserFunction(code) {
    if (!code)
        return null;

    var retval = null;

    try {
        // eslint-disable-next-line no-new-func
        retval = new Function('scope', `with(scope){\n${code}\nreturn riley.moves;}`);
    } catch (e) {
        retval = null;
        if (!(e instanceof SyntaxError || e instanceof ReferenceError))
            // FIXME reflect the error in the game somehow
            console.error(e);  // eslint-disable-line no-console
    }

    return retval;
}

class obstacle {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }
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
        this.tileLength = 125;
        this.xOffset = 450;
        this.yOffset = 180;

        this.tiles = [];
        this.tilesHash = {};

        // grid length and height
        this.countX = 9;
        this.countY = 5;

        this.MAXMOVES = 7;

        // capture moves
        this.arrSpriteMoves = [];
        this.moves = [];

        // determine if riley is moving on keypress
        this.isMoving = false;
        // pressing the arrow key down only moves player once
        this.keyIsDown = false;

        // play thru game delay
        this.tick = 0;

        this.gameType = 0;

        this.isDraggable = false;

        // we are not terminating
        this.isTerminating = false;
        this.redBar = null;

        this.gameOverAnimation = 'game-over';
        this.levelCompleteAnimation = 'levelComplete';

        // few sanity checks to make sure data is coming through
        if (this.params) {
            if (this.params.level > 0)
                this.levelNumber = this.params.level;

            if (this.params.goalXLocation >= 0)
                this.goalXLocation = this.params.goalXLocation;

            if (this.params.goalYLocation >= 0)
                this.goalYLocation = this.params.goalYLocation;

            if (this.params.playerXLocation >= -1)
                this.playerXLocation = this.params.playerXLocation;

            if (this.params.playerYLocation >= 0)
                this.playerYLocation = this.params.playerYLocation;

            if (this.params.gameType >= 0)
                this.gameType = this.params.gameType;

            if (this.params.isDraggable)
                this.isDraggable = this.params.isDraggable;
        }
    }

    preload() {
        this.load.image('logo', 'assets/images/player.png');
    }

    create() {
        // create bg sprite
        const bg = this.add.sprite(0, 0, 'background');

        // change the origin to the top-left corner
        bg.setOrigin(0, 0);

        // Level text
        this.displayLevelUI();

        this.createLevel();

        // create the player
        this.player = this.add.sprite(0, 0, 'riley');

        this.player.x = this.playerXLocation * this.tileLength + this.xOffset;
        this.player.y = this.playerYLocation * this.tileLength + this.yOffset;

        // play animation if none is playing
        if (!this.player.anims.isPlaying)
            this.player.anims.play('running');

        // we are reducing the width and height by 50%
        this.player.setScale(0.5);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        /* Listen to properties changes */
        this.game.events.on('global-property-change',
            this.onGlobalPropertyChange, this);

        this.events.on('shutdown', () => {
            this.game.events.off('global-property-change',
                this.onGlobalPropertyChange, this);
        }, this);

        this.controls = this.add.sprite(120, 750,
            'controls').setOrigin(0)
.setScale(0.7);

        if (this.gameType === PLAYTHRUGAME) {
            // TODO - get rid of magic numbers. Don't like the 5* value.
            const x = this.xOffset - this.tileLength - 50;
            const y = this.countY * this.tileLength + this.yOffset + 20;

            this.controls.setVisible(false);

            this.playButton = this.add.sprite(x, y,
                'playButton').setInteractive({useHandCursor: true})
            .on('pointerdown', this.playButtonClick, this);

            this.redBar = this.add.sprite(x - this.tileLength, y, 'redBar').setVisible(false);

            // animation effect on level 6
            // TODO - animation should only happen when user first hits level 6
            // if (this.params.level === 6) {
            if (this.params.playLevel6Animation) {
                // hide the play button until animation is complete
                this.playButton.setAlpha(0);

                // play the destroy control animation
                this.controls.setVisible(true);
                this.controls.anims.play('controls');

                this.controls.on('animationcomplete', function() {
                    this.controls.setVisible(false);
                    // fade in play button
                    this.tweens.add({
                        targets: [this.playButton],
                        duration: 2000,
                        alpha: 1,
                        onComplete: () => {
                            var modalText = 'What was that?';
                            this.showModal(modalText);
                        },
                    });
                }.bind(this));
            }
        }

        /* Reset Global game state */
        globalParameters.success = false;
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

        // move Riley at gamespeed when at last tile
        if (this.playerXLocation >= this.MAXMOVES) {
            this.player.x += this.playerSpeed;
            isKeyboardPressOff = true;
            this.checkGameOver();
        } else {
            if (this.gameType === PLAYTHRUGAME) {
                isKeyboardPressOff = true;

                if (this.isMoving) {
                    this.tick++;

                    if (this.tick >= 10) {
                        this.tick = 0;
                        this.placePlayer();
                    }
                }
            }

            if (this.gameType === DEFAULTGAME) {
                if (!isKeyboardPressOff)
                    this.handleMovements();

                if (this.isMoving)
                    this.placePlayer();
            }
        }
    }

    handleMovements() {
        if (this.cursors.right.isUp && this.cursors.up.isUp &&
            this.cursors.down.isUp && this.spaceBar.isUp)
            this.keyIsDown = false;

        if (!this.keyIsDown) {
            if (this.cursors.right.isDown && this.playerXLocation < this.MAXMOVES) {
                this.moves.push(FORWARD);
                this.isMoving = true;
            }

            if (this.cursors.up.isDown && this.playerXLocation < this.MAXMOVES) {
                this.moves.push(UP);
                this.isMoving = true;
            }

            if (this.cursors.down.isDown && this.playerXLocation < this.MAXMOVES) {
                this.moves.push(DOWN);
                this.isMoving = true;
            }

            if (this.spaceBar.isDown && this.playerXLocation < this.MAXMOVES) {
                this.moves.push(JUMP);
                this.isMoving = true;
                this.player.anims.stop('running');
                this.player.anims.play('jumping');
            }
        }
    }

    checkGameOver() {
        const playerRect = this.player.getBounds();
        // const goalRect = this.goal.getBounds();

        // get wrongExits
        const wrongExits = this.wrongExits.getChildren();

        for (let i = 0; i < wrongExits.length; i++) {
        // check wrong exit overlap
            const wrongExitRect = wrongExits[i].getBounds();

            if (i !== this.goalYLocation &&
            Phaser.Geom.Intersects.RectangleToRectangle(playerRect, wrongExitRect)) {
                this.gameLost();
                return;
            }
        }

        // game won when Riley runs off screen
        if (this.player.x > this.sys.game.config.width + 100)
            this.gameWon();
    }

    playButtonClick() {
        if (!this.isMoving)
            this.isMoving = true;
    }

    getObstacles(level) {
        void this;
        let obstacles = [];
        switch (level) {
        case 1:
            obstacles = [
                new obstacle(WALL, 4, 0),
                new obstacle(WALL, 4, 0),
                new obstacle(WALL, 1, 1),
                new obstacle(WALL, 2, 1),
                new obstacle(WALL, 3, 1),
                new obstacle(WALL, 4, 1),
                new obstacle(WALL, 3, 2),
                new obstacle(WALL, 6, 2),
                new obstacle(WALL, 6, 3),
                new obstacle(WALL, 6, 4),
            ];
            break;
        case 2:
            obstacles = [
                new obstacle(WALL, 4, 0),
                new obstacle(WALL, 5, 0),
                new obstacle(WALL, 2, 1),
                new obstacle(WALL, 3, 1),
                new obstacle(WALL, 4, 1),
                new obstacle(WALL, 6, 1),
                new obstacle(WALL, 6, 2),
                new obstacle(WALL, 2, 3),
                new obstacle(WALL, 3, 3),
                new obstacle(WALL, 4, 3),
            ];
            break;
        case 3:
            obstacles = [
                new obstacle(WALL, 4, 0),
                new obstacle(WALL, 1, 1),
                new obstacle(WALL, 4, 1),
                new obstacle(WALL, 0, 2),
                new obstacle(WALL, 1, 2),
                new obstacle(WALL, 3, 2),
                new obstacle(WALL, 3, 3),
                new obstacle(WALL, 5, 2),
                new obstacle(WALL, 6, 2),
                new obstacle(WALL, 5, 3),
                new obstacle(WALL, 2, 4),
                new obstacle(WALL, 4, 4),
            ];
            break;
        case 4:
            obstacles = [
                new obstacle(PIT, 5, 0),
                new obstacle(WALL, 1, 1),
                new obstacle(WALL, 4, 1),
                new obstacle(WALL, 5, 1),
                new obstacle(PIT, 2, 2),
                new obstacle(WALL, 3, 2),
                new obstacle(PIT, 5, 2),
                new obstacle(WALL, 6, 2),
                new obstacle(WALL, 2, 3),
                new obstacle(WALL, 4, 3),
                new obstacle(WALL, 5, 3),
                new obstacle(PIT, 5, 4),
            ];
            break;
        case 5:
            obstacles = [
                new obstacle(WALL, 1, 1),
                new obstacle(PIT, 4, 1),
                new obstacle(PIT, 6, 1),
                new obstacle(WALL, 1, 2),
                new obstacle(WALL, 2, 2),
                new obstacle(PIT, 4, 2),
                new obstacle(WALL, 6, 2),
                new obstacle(PIT, 2, 3),
                new obstacle(WALL, 1, 4),
            ];
            break;
        case 6:
            obstacles = [
                new obstacle(WALL, 3, 2),
                new obstacle(WALL, 4, 2),
                new obstacle(WALL, 5, 3),
            ];
            break;
        case 7:
            obstacles = [
                new obstacle(WALL, 4, 0),
                new obstacle(WALL, 1, 1),
                new obstacle(WALL, 4, 1),
                new obstacle(WALL, 0, 2),
                new obstacle(WALL, 1, 2),
                new obstacle(WALL, 3, 2),
                new obstacle(WALL, 5, 2),
                new obstacle(WALL, 6, 2),
                new obstacle(WALL, 3, 3),
                new obstacle(WALL, 5, 3),
                new obstacle(WALL, 2, 4),
                new obstacle(WALL, 4, 4),
            ];
            break;
        case 8:
            obstacles = [
                new obstacle(WALL, 1, 0),
                new obstacle(WALL, 1, 1),
                new obstacle(WALL, 2, 1),
                new obstacle(WALL, 3, 1),
                new obstacle(PIT, 2, 2),
                new obstacle(WALL, 1, 3),
                new obstacle(WALL, 2, 3),
                new obstacle(WALL, 3, 3),
                new obstacle(PIT, 6, 3),
                new obstacle(WALL, 1, 4),
                new obstacle(PIT, 6, 4),
            ];
            break;
        case 9:
            obstacles = [
                new obstacle(WALL, 1, 0),
                new obstacle(WALL, 1, 1),
                new obstacle(WALL, 2, 1),
                new obstacle(WALL, 3, 1),
                new obstacle(PIT, 2, 2),
                new obstacle(WALL, 1, 3),
                new obstacle(WALL, 2, 3),
                new obstacle(WALL, 3, 3),
                new obstacle(PIT, 6, 3),
                new obstacle(WALL, 1, 4),
                new obstacle(PIT, 6, 4),
            ];
            break;
        case 10:
            obstacles = [
                new obstacle(PIT, 5, 0),
                new obstacle(WALL, 1, 1),
                new obstacle(WALL, 4, 1),
                new obstacle(WALL, 5, 1),
                new obstacle(PIT, 2, 2),
                new obstacle(WALL, 3, 2),
                new obstacle(PIT, 5, 2),
                new obstacle(WALL, 6, 2),
                new obstacle(WALL, 2, 3),
                new obstacle(WALL, 4, 3),
                new obstacle(WALL, 5, 3),
                new obstacle(PIT, 5, 4),
            ];
            break;
        case 11:
            obstacles = [
                new obstacle(PIT, 5, 0),
                new obstacle(WALL, 1, 1),
                new obstacle(WALL, 4, 1),
                new obstacle(WALL, 5, 1),
                new obstacle(PIT, 2, 2),
                new obstacle(WALL, 3, 2),
                new obstacle(PIT, 5, 2),
                new obstacle(WALL, 6, 2),
                new obstacle(WALL, 2, 3),
                new obstacle(WALL, 4, 3),
                new obstacle(WALL, 5, 3),
                new obstacle(PIT, 5, 4),
            ];
            break;
        case 12:
            obstacles = [
                new obstacle(PIT, 5, 0),
                new obstacle(WALL, 1, 1),
                new obstacle(WALL, 4, 1),
                new obstacle(WALL, 5, 1),
                new obstacle(PIT, 2, 2),
                new obstacle(WALL, 3, 2),
                new obstacle(PIT, 5, 2),
                new obstacle(WALL, 6, 2),
                new obstacle(WALL, 2, 3),
                new obstacle(WALL, 4, 3),
                new obstacle(WALL, 5, 3),
                new obstacle(PIT, 5, 4),
            ];
            break;
        case 13:
            obstacles = [
                new obstacle(PIT, 5, 0),
                new obstacle(WALL, 1, 1),
                new obstacle(WALL, 4, 1),
                new obstacle(WALL, 5, 1),
                new obstacle(PIT, 2, 2),
                new obstacle(WALL, 3, 2),
                new obstacle(PIT, 5, 2),
                new obstacle(WALL, 6, 2),
                new obstacle(WALL, 2, 3),
                new obstacle(WALL, 4, 3),
                new obstacle(WALL, 5, 3),
                new obstacle(PIT, 5, 4),
            ];
            break;
        case 14:
            obstacles = [
                new obstacle(WALL, 1, 1),
                new obstacle(PIT, 4, 1),
                new obstacle(PIT, 6, 1),
                new obstacle(WALL, 1, 2),
                new obstacle(WALL, 2, 2),
                new obstacle(PIT, 4, 2),
                new obstacle(WALL, 6, 2),
                new obstacle(PIT, 2, 3),
                new obstacle(WALL, 1, 4),
            ];
            break;
        default:
            break;
        }

        return obstacles;
    }

    addObstacles(obstacles) {
        if (obstacles) {
            for (var i = 0; i < obstacles.length; i++) {
                const tileKey = `${obstacles[i].x},${obstacles[i].y}`;
                this.tilesHash[tileKey].obstacleType = obstacles[i].type;
            }
        }
    }

    placePlayer() {
        this.playerXLocation++;
        let isPlayerJumping = false;

        if (this.gameType === DEFAULTGAME) {
            this.arrSpriteMoves[this.playerXLocation]
            .setFrame(this.moves[this.playerXLocation]);

            this.keyIsDown = true;
            this.isMoving = false;

            // handle up movements
            if (this.moves[this.playerXLocation] === UP && this.playerYLocation > 0)
                this.playerYLocation -= 1;

            // handle down movements
            if (this.moves[this.playerXLocation] === DOWN &&
                this.playerYLocation < this.countY - 1)
                this.playerYLocation += 1;

            if (this.moves[this.playerXLocation] === JUMP)
                isPlayerJumping = true;
        } else if (this.gameType === PLAYTHRUGAME) {
            if (this.arrSpriteMoves.length > this.playerXLocation) {
                this.player.anims.play('running');
                this.player.anims.stop('jumping');

                if (this.arrSpriteMoves[this.playerXLocation].frame.name === UP &&
                    this.playerYLocation > 0)
                    this.playerYLocation -= 1;

                // handle down movements
                if (this.arrSpriteMoves[this.playerXLocation].frame.name === DOWN &&
                    this.playerYLocation < this.countY - 1)
                    this.playerYLocation += 1;

                if (this.arrSpriteMoves[this.playerXLocation].frame.name === JUMP) {
                    this.player.anims.stop('running');
                    this.player.anims.play('jumping');
                    isPlayerJumping = true;
                }
            }
        }

        this.placeTrail();
        this.player.x = this.playerXLocation * this.tileLength + this.xOffset;
        this.player.y = this.playerYLocation * this.tileLength + this.yOffset;

        // play animation if none is playing
        if (!this.player.anims.isPlaying)
            this.player.anims.play('running');

        const tile = this.tilesHash[`${this.playerXLocation},${this.playerYLocation}`];

        if (tile && tile.obstacleType > 0) {
            if (tile.obstacleType === PIT && isPlayerJumping)
                return;

            this.gameLost();
        }
    }

    placeTrail() {
        if (this.playerXLocation > 0) {
            var trail = this.add.sprite(this.player.x, this.player.y, 'trail').setScale(0.5);

            const previousMovement = this.moves[this.playerXLocation - 1];

            if (previousMovement === FORWARD || previousMovement === JUMP) {
                if (this.moves[this.playerXLocation] === UP)
                    trail.setFrame(2);
                if (this.moves[this.playerXLocation] === DOWN)
                    trail.setFrame(1);
                if (this.moves[this.playerXLocation] === FORWARD ||
                    this.moves[this.playerXLocation] === JUMP)
                    trail.setFrame(0);
            }

            if (previousMovement === UP) {
                if (this.moves[this.playerXLocation] === UP)
                    trail.setFrame(6);
                if (this.moves[this.playerXLocation] === DOWN)
                    trail.setFrame(8);
                if (this.moves[this.playerXLocation] === FORWARD ||
                    this.moves[this.playerXLocation] === JUMP)
                    trail.setFrame(7);
            }

            if (previousMovement === DOWN) {
                if (this.moves[this.playerXLocation] === UP)
                    trail.setFrame(5);
                if (this.moves[this.playerXLocation] === DOWN)
                    trail.setFrame(3);
                if (this.moves[this.playerXLocation] === FORWARD ||
                    this.moves[this.playerXLocation] === JUMP)
                    trail.setFrame(4);
            }
        }
    }

    placeEndingTiles() {
        // TODO - get rid of magic numbers. Don't like the 160 value.
        const x = this.goalXLocation * this.tileLength + this.xOffset + 160;

        this.goal.x = x;
        this.goal.y = this.goalYLocation * this.tileLength + this.yOffset;

        const wrongExits = this.wrongExits.getChildren();

        for (var i = 0; i < wrongExits.length; i++) {
            wrongExits[i].x = x;
            wrongExits[i].y = i * this.tileLength + this.yOffset;

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
        const text = this.add.text(gameW / 2, gameH / 2, `Level ${this.levelNumber}`, {
            font: '40px Arial',
            fill: '#ffffff',
        });
        text.setOrigin(0.5, 0.5);
        text.depth = 1;

        var restartIcon = this.add.sprite(gameW / 2 + 120, gameH / 2, 'restartIcon');
        restartIcon.setScale(0.5);
        restartIcon.setDepth(2);
        restartIcon.setInteractive({useHandCursor: true});
        /* Restart level on button click and enter */
        restartIcon.on('pointerup', this.restartLevel.bind(this));


        // text background
        const textBg = this.add.graphics();
        textBg.fillStyle(0x000000, 0.7);
        textBg.fillRect(gameW / 2 - text.width / 2 - 20, gameH / 2 - text.height / 2 - 10,
            text.width + 120, text.height + 20);
    }

    createLevel() {
        // tile object
        this.Tile = function(x, y) {
            this.x = x;
            this.y = y;
            this.tileKey = `${x},${y}`;
            this.obstacleType = 0;
        };

        for (let x = 0; x < this.countX; ++x) {
            for (let y = 0; y < this.countY; ++y)

                this.tiles.push(new this.Tile(x, y));
        }

        // set hashtable for tiles
        for (let i = 0; i < this.tiles.length; i++)
            this.tilesHash[this.tiles[i].tileKey] = this.tiles[i];

        // create the exit goal
        this.goal = this.add.sprite(0, 0, 'specialTiles', 1);

        // wrong Exits
        this.wrongExits = this.add.group({
            key: 'specialTiles',
            repeat: 4,
        });

        this.obstacles = this.getObstacles(this.params.level);

        // add obstacles
        this.addObstacles(this.obstacles);

        /* Create userScope */
        this.userScope = new UserScope();

        /* Get user functions */
        this.instructionCode = getUserFunction(this.params.instructionCode);

        this.runInstruction();

        // draw tiles
        let x;
        let y;

        const minTile = 0;
        const maxTiles = 4;

        let leftWall;
        let topWall;
        let rightWall;
        let bottomWall;

        let leftTile;
        let rightTile;
        let topTile;
        let bottomTile;

        for (let i = 0; i < this.tiles.length; i++) {
            x = this.tiles[i].x * this.tileLength + this.xOffset;
            y = this.tiles[i].y * this.tileLength + this.yOffset;

            if (this.tiles[i].x < this.countX - 1)
                this.add.sprite(x, y, 'tiles', Phaser.Math.Between(minTile, maxTiles));

            if (this.tiles[i].obstacleType === WALL) {
                leftWall = false;
                topWall = false;
                rightWall = false;
                bottomWall = false;

                leftTile = this.getTile(this.tiles[i].x - 1, this.tiles[i].y);
                rightTile = this.getTile(this.tiles[i].x + 1, this.tiles[i].y);
                topTile = this.getTile(this.tiles[i].x, this.tiles[i].y - 1);
                bottomTile = this.getTile(this.tiles[i].x, this.tiles[i].y + 1);

                if (leftTile && leftTile.obstacleType === WALL)
                    leftWall = true;

                if (rightTile && rightTile.obstacleType === WALL)
                    rightWall = true;

                if (topTile && topTile.obstacleType === WALL)
                    topWall = true;

                if (bottomTile && bottomTile.obstacleType === WALL)
                    bottomWall = true;

                this.setWallFrame(leftWall, rightWall, topWall, bottomWall, x, y);
            }

            if (this.tiles[i].obstacleType === PIT)
                this.add.sprite(x, y, 'pit').setScale(0.5);
        }

        this.placeEndingTiles();

        // add the move square below the tiles
        y = this.countY * this.tileLength + this.yOffset + 20;

        for (let i = 0; i <= this.MAXMOVES; i++) {
            x = i * this.tileLength + this.xOffset;
            this.arrSpriteMoves.push(this.add.sprite(x, y, 'moveSquares', NONE));
        }

        // for playthru game types, the moves will be pre-populated
        for (let i = 0; i < this.moves.length; i++) {
            const moveSquare = this.arrSpriteMoves[i].setFrame(this.moves[i]);
            // for playthru games, check if draggable is set
            if (this.isDraggable) {
                moveSquare.setInteractive({useHandCursor: true});
                this.input.setDraggable(moveSquare);
                moveSquare.dragDistanceThreshold = 16;
            }
        }


        this.input.on('dragstart', function(pointer, gameObject) {
            gameObject.setTint(0xff0000);

            // so user can see the move they're dragging
            gameObject.setDepth(2);
        });

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;

            let index = 0;
            for (let i = 0; i < this.arrSpriteMoves.length; i++) {
                if (gameObject === this.arrSpriteMoves[i]) {
                    index = i;
                    break;
                }
            }

            this.setRedBarPosition(gameObject);

            if (index !== this.redBar.position && this.redBar.position !== index + 1)
                this.redBar.setVisible(true);
            else
                this.redBar.setVisible(false);
        }.bind(this));

        this.input.on('dragend', function(pointer, gameObject) {
            gameObject.clearTint();
            gameObject.setDepth(1);

            let index = 0;
            for (let i = 0; i < this.arrSpriteMoves.length; i++) {
                if (gameObject === this.arrSpriteMoves[i]) {
                    index = i;
                    break;
                }
            }

            if (this.redBar.visible) {
                this.arrSpriteMoves =
                    this.arrayMove(this.arrSpriteMoves, index, this.redBar.position);
                this.redBar.setVisible(false);
            }

            var instructions = '';

            // Place the draggable move squares in correct spots
            let xMoveSquare = 0;
            const yMoveSquare = this.countY * this.tileLength + this.yOffset + 20;
            for (let i = 0; i <= this.MAXMOVES; i++) {
                xMoveSquare = i * this.tileLength + this.xOffset;
                this.arrSpriteMoves[i].x = xMoveSquare;
                this.arrSpriteMoves[i].y = yMoveSquare;

                if (this.arrSpriteMoves[i].frame.name === FORWARD)
                    instructions += 'riley.forward();\n';

                if (this.arrSpriteMoves[i].frame.name === UP)
                    instructions += 'riley.up();\n';

                if (this.arrSpriteMoves[i].frame.name === DOWN)
                    instructions += 'riley.down();\n';

                if (this.arrSpriteMoves[i].frame.name === JUMP)
                    instructions += 'riley.jump();\n';
            }

            this.instructionCode = `\
                ${instructions}`;

            this.params.instructionCode = this.instructionCode;
        }.bind(this));

        // create the starting tile
        this.add.sprite(this.playerXLocation * this.tileLength + this.xOffset - 170,
            this.playerYLocation * this.tileLength + this.yOffset, 'specialTiles', 0);
    }

    setRedBarPosition(gameObject) {
        const minX = this.tileLength + this.xOffset;
        const maxX = this.MAXMOVES * this.tileLength + this.xOffset;
        const halfTilelength = this.tileLength * 0.5;

        const offset = minX - halfTilelength;

        if (gameObject.x < offset) {
            this.redBar.x = offset - this.tileLength;
            this.redBar.position = 0;
        }

        if (gameObject.x >= offset && gameObject.x < offset + this.tileLength) {
            this.redBar.x = offset;
            this.redBar.position = 1;
        }

        if (gameObject.x >= offset + this.tileLength &&
            gameObject.x < offset + this.tileLength * 2) {
            this.redBar.x = offset + this.tileLength;
            this.redBar.position = 2;
        }

        if (gameObject.x >= offset + this.tileLength * 2 &&
            gameObject.x < offset + this.tileLength * 3) {
            this.redBar.x = offset + this.tileLength * 2;
            this.redBar.position = 3;
        }

        if (gameObject.x >= offset + this.tileLength * 3 &&
            gameObject.x < offset + this.tileLength * 4) {
            this.redBar.x = offset + this.tileLength * 3;
            this.redBar.position = 4;
        }

        if (gameObject.x >= offset + this.tileLength * 4 &&
            gameObject.x < offset + this.tileLength * 5) {
            this.redBar.x = offset + this.tileLength * 4;
            this.redBar.position = 5;
        }

        if (gameObject.x >= offset + this.tileLength * 5 &&
            gameObject.x < offset + this.tileLength * 6) {
            this.redBar.x = offset + this.tileLength * 5;
            this.redBar.position = 6;
        }

        if (gameObject.x >= offset + this.tileLength * 6 &&
            gameObject.x < offset + this.tileLength * 7) {
            this.redBar.x = offset + this.tileLength * 6;
            this.redBar.position = 7;
        }

        if (gameObject.x >= maxX) {
            this.redBar.x = offset + this.tileLength * 7;
            this.redBar.position = 8;
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

    setWallFrame(leftWall, rightWall, topWall, bottomWall, x, y) {
        let boolVal = 0;
        let spriteSheetFrame = 0;

        if (leftWall)
            boolVal += 1000;

        if (rightWall)
            boolVal += 100;

        if (topWall)
            boolVal += 10;

        if (bottomWall)
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

        this.add.sprite(x, y, 'walls', spriteSheetFrame).setScale(0.5);
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
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        this.createModalBackground(width, height);

        if (this.anims.get(modalText)) {
            var animationHeader = this.add.sprite(width / 2, height / 2 - 200, modalText);
            animationHeader.anims.play(modalText);
        } else {
            this.add.text(width / 2, height / 2 - 300,
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

        if (modalText === 'game-over') {
            this.add.text(width / 2, height / 2 + 50,
                'RESTART', fontConfig).setOrigin(0.5, 0.5);

            /* Restart level on button click and enter */
            btn.on('pointerup', this.restartLevel.bind(this));
            this.input.keyboard.on('keyup_ENTER', this.restartLevel.bind(this));
            /* Goto next level on button click and enter */
        } else if (modalText === 'levelComplete') {
            this.add.text(width / 2, height / 2 + 50,
                'CONTINUE', fontConfig).setOrigin(0.5, 0.5);

            btn.on('pointerup', this.continueLevel.bind(this));
            this.input.keyboard.on('keyup_ENTER', this.continueLevel.bind(this));
        } else {
            this.add.text(width / 2, height / 2 + 50,
                'CLOSE', fontConfig).setOrigin(0.5);

            btn.on('pointerup', this.restartLevel.bind(this));
            this.input.keyboard.on('keyup_ENTER', this.restartLevel.bind(this));
        }

        /* We are not playing anymore */
        globalParameters.playing = false;
    }

    continueLevel() {
        if (globalParameters.nextLevel) {
            globalParameters.playing = true;
            this.scene.restart(levelParameters[globalParameters.nextLevel]);
        } else {
            this.scene.start('Home');
        }
    }

    restartLevel() {
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

    gameLost() {
        // initiated game over sequence
        this.isTerminating = true;

        // shake camera
        this.cameras.main.shake(500);

        // listen for event completion
        this.cameras.main.on('camerashakecomplete', function() {
            this.showModal(this.gameOverAnimation);
        }.bind(this));
    }

    gameWon() {
        // initiated game over sequence
        this.isTerminating = true;

        globalParameters.success = true;
        globalParameters.currentLevel = this.params.level;

        /* Go back to title if this was the last level */
        if (globalParameters.currentLevel < globalParameters.availableLevels)
            globalParameters.nextLevel = globalParameters.currentLevel + 1;
        else
            globalParameters.nextLevel = 0;

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
        if (property.endsWith('Code')) {
            this.instructionCode = getUserFunction(globalParameters[property]);
            this.runInstruction();
        }
    }

    /* This will be called each time something in this.params changes */
    onParametersNotify(property) {
        if (property === 'goalYLocation') {
            this.goalYLocation = this.params.goalYLocation;
        } else if (property === 'goalXLocation') {
            this.goalXLocation = this.params.goalXLocation;
        } else if (property === 'playerXLocation') {
            this.playerXLocation = this.params.playerXLocation;
        } else if (property === 'playerYLocation') {
            this.playerYLocation = this.params.playerYLocation;
        } else if (property.endsWith('Code')) {
            const func = getUserFunction(this.params[property]);
            const funcName = property.slice(0, -4);

            if (funcName in this)
                this[funcName] = func;
        }
    }

    runInstruction() {
        if (!this.instructionCode)
            return;

        var scope = this.userScope;
        var retval = null;

        try {
            retval = this.instructionCode(scope);
        } catch (e) {
            /* User function error! */
        }

        if (retval && Array.isArray(retval))

            this.moves = retval;
    }
}
