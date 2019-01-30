/* Gobble
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

class OverlayScene extends Phaser.Scene {

    constructor (config) {
        super(config);
    }

    init(data) {
        this.level = -1;
        this.score = -1;
    }

    preload () {
    }

    create (data) {
        const width = this.cameras.main.width;

        /* FPS counter */
        this.fps = this.add.text(width - 52, 10, '', { color: '#00ff00' });

        /* Level */
        this.levelText = this.add.text(40, 40, '', { color: 'white', fontSize: '42px' });

        /* Score */
        this.scoreText = this.add.text(40, 100, '', { color: 'white', fontSize: '42px' });

        this.updateText();
    }

    update(time, delta) {
        this.fps.setText(`${(game.loop.actualFps).toFixed(1)}`);

        this.updateText();
    }

    updateText () {
        const score = globalParameters.score + globalParameters.currentScore;
        const level = globalParameters.currentLevel + 1;

        if (this.level !== level)
            this.levelText.setText(`Level: ${level}`);

        if (this.score !== score)
            this.scoreText.setText(`Score: ${score}`);
    }
}

