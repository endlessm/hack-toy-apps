/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

class GameOverScene extends Phaser.Scene {

    constructor (config) {
        super(config);
    }

    init(data) {
        globalParameters.playing = false;
    }

    preload () {
        this.load.image('game-over', 'assets/game-over.png');
        this.load.image('explosion', 'assets/ui/explosion.png');
    }

    create (data) {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        var gameOver = this.add.image(centerX, centerY, 'game-over');
        gameOver.setScale(0.6);
        this.tweens.add({
            targets: gameOver,
            scaleX: 0.32,
            scaleY: 0.8,
            duration: 600,
            ease: 'Sine',
            yoyo: true,
            repeat: -1
        });

        var particles = this.add.particles('particle');
        var emitter = particles.createEmitter({
            speed: 128,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            tint: [ 0xffee00, 0xff2900, 0xff8a00, 0xff6600 ],
            lifespan: 3000
        });
        emitter.startFollow(gameOver);

        const levelParams = levelParameters[globalParameters.currentLevel];
        const spacing = 32;

        var pad = this.add.zone(0, 0, 512, 310).setOrigin(0,0);
        var explosion = this.add.image(0, 0, 'explosion').setOrigin(0,0);
        this.startMessage = this.add.text(0, 0, levelParams.description, fontConfig).setOrigin(0.5,0.5);
        this.levelChooser = new LevelChooser(this, 'prev', 'next');
        var restartButton = new Utils.Button(this, 'button', 'RESTART');

        Phaser.Display.Align.In.Center(explosion, pad);
        Phaser.Display.Align.In.Center(gameOver, explosion);
        Phaser.Display.Align.To.BottomCenter(this.startMessage, explosion, 0, spacing);
        Phaser.Display.Align.To.BottomCenter(this.levelChooser, this.startMessage, 0, spacing);
        Phaser.Display.Align.To.BottomCenter(restartButton, this.levelChooser, 0, spacing);

        const w = pad.width;
        const h = restartButton.y + restartButton.height + spacing;
        var bg = new Utils.TransparentBox(this, w, h, 16);

        this.add.container(
            (game.config.width - w)/2, (game.config.height - h)/2,
            [ bg, pad, explosion, particles, gameOver, this.startMessage, this.levelChooser, restartButton ]
        );

        this.levelChooser.on('level-changed', (level) => {
            this.startMessage.setText(levelParameters[level].description);
        });

        restartButton.on('pointerup', function () {
            const i = this.levelChooser.currentLevel;
            globalParameters.currentLevel = i;
            globalParameters.playing = true;
            this.scene.get('level').scene.restart(levelParameters[i]);
            this.scene.stop();
        }, this);
    }
}

