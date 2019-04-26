/* exported StartScene */

class StartScene extends Phaser.Scene {
    create() {
        /* Reset Global game state */
        globalParameters.playing = false;
        globalParameters.currentLevel =
            globalParameters.nextLevel || globalParameters.availableLevels;

        this.levelParams = levelParameters[globalParameters.currentLevel];

        // game background, with active input
        this.add.sprite(0, 0, 'background').setOrigin(0);
        this.add.sprite(150, 50, 'riley').setOrigin(0);

        this.add.sprite(150, 430, 'controls').setOrigin(0);

        this.keyIsDown = false;

        // welcome text
        const gameW = this.sys.game.config.width;
        const gameH = this.sys.game.config.height;
        const text = this.add.text(gameW / 2, gameH / 2 - 350, 'Sidetrack', {
            font: '80px Arial',
            fill: '#ffffff',
        });
        text.setOrigin(0.5, 0.5);
        text.depth = 1;

        this.add.text(gameW / 2, gameH / 2 - 250, 'Select Level', {
            font: '40px Arial',
            fill: '#ffffff',
        }).setOrigin(0.5);

        const leftArrow = this.add.sprite(gameW / 2 - 220,
            gameH / 2 - 150, 'moveSquares', 7).setInteractive({useHandCursor: true});

        const rightArrow = this.add.sprite(gameW / 2 + 220,
            gameH / 2 - 150, 'moveSquares', 1).setInteractive({useHandCursor: true});

        leftArrow.on('pointerover', function() {
            leftArrow.setTint(0xff0000);
        });

        leftArrow.on('pointerout', function() {
            leftArrow.clearTint();
        });

        rightArrow.on('pointerover', function() {
            rightArrow.setTint(0xff0000);
        });

        rightArrow.on('pointerout', function() {
            rightArrow.clearTint();
        });

        leftArrow.on('pointerup', this.levelDown.bind(this));
        rightArrow.on('pointerup', this.levelUp.bind(this));

        this.cursors = this.input.keyboard.createCursorKeys();

        this.levelText = this.add.text(gameW / 2, gameH / 2 - 150, this.levelParams.level, {
            font: '120px Arial',
            fill: '#ffffff',
        });
        this.levelText.setOrigin(0.5, 0.5);
        this.levelText.depth = 1;

        // levelText background
        const textBg = this.add.graphics();
        textBg.fillStyle(0x000000, 0.7);
        textBg.fillRect(gameW / 2 - 130,
            gameH / 2 - this.levelText.height / 2 - 150,
            260,
            this.levelText.height);


        // Add Start button
        var startBtn = this.add.sprite(gameW / 2,
            gameH / 2 + 50, 'button').setInteractive({useHandCursor: true});

        startBtn.on('pointerover', function() {
            startBtn.setFrame(1);
        });

        startBtn.on('pointerout', function() {
            startBtn.setFrame(0);
        });

        this.add.text(gameW / 2, gameH / 2 + 50,
            'START', fontConfig).setOrigin(0.5);

        startBtn.on('pointerup', this.startLevel.bind(this));
        this.input.keyboard.on('keyup_ENTER', this.startLevel.bind(this));
    }

    update() {
        this.handleMovements();
    }

    levelUp() {
        let i = this.levelText.text;

        if (i >= globalParameters.availableLevels) {
            this.levelText.text = globalParameters.availableLevels;
            return;
        }

        i++;
        this.levelText.text = i;
    }

    levelDown() {
        let i = this.levelText.text;

        if (i <= 1) {
            this.levelText.text = 1;
            return;
        }

        i--;
        this.levelText.text = i;
    }

    startLevel() {
        const i = this.levelText.text;
        globalParameters.currentLevel = i;
        globalParameters.playing = true;
        globalParameters.paused = false;

        this.scene.start('Game', levelParameters[i]);
    }

    handleMovements() {
        if (this.cursors.right.isUp && this.cursors.left.isUp)
            this.keyIsDown = false;

        if (!this.keyIsDown) {
            if (this.cursors.right.isDown) {
                this.levelUp();
                this.keyIsDown = true;
            }

            if (this.cursors.left.isDown) {
                this.keyIsDown = true;
                this.levelDown();
            }
        }
    }
}
