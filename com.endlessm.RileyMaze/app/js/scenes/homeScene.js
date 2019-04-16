/* exported HomeScene */

class HomeScene extends Phaser.Scene {
    create() {
        // game background, with active input
        const bg = this.add.sprite(0, 0, 'background').setInteractive();
        bg.setOrigin(0, 0);

        // welcome text
        const gameW = this.sys.game.config.width;
        const gameH = this.sys.game.config.height;
        const text = this.add.text(gameW / 2, gameH / 2, 'Riley Maze', {
            font: '40px Arial',
            fill: '#ffffff',
        });
        text.setOrigin(0.5, 0.5);
        text.depth = 1;


        this.add.text(gameW / 2, gameH / 2 + 100, 'Press ENTER to start', {
            font: '40px Arial',
            fill: '#ffffff',
        }).setOrigin(0.5, 0.5);

        // text background
        const textBg = this.add.graphics();
        textBg.fillStyle(0x000000, 0.7);
        textBg.fillRect(gameW / 2 - text.width / 2 - 10,
            gameH / 2 - text.height / 2 - 10,
            text.width + 20,
            text.height + 20);

        this.input.keyboard.on('keyup_ENTER', () => {
            this.scene.start('Start');
        });
    }
}
