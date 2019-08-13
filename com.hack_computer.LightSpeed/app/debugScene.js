/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported DebugScene */

class DebugScene extends Phaser.Scene {
    create() {
        /* FPS counter */
        this.debugText1 = this.add.text(8, 0, '', {
            color: '#00ff00',
            shadow: {
                color: 'black',
                fill: true,
                offsetX: 1,
                offsetY: 1,
            },
        });
        this.debugText1.visible = false;

        this.debugText2 = this.add.text(game.config.width / 2, 48, '', {
            color: '#00ff00',
            shadow: {
                color: 'black',
                fill: true,
                offsetX: 1,
                offsetY: 1,
            },
        });
        this.debugText2.visible = false;

        /* TODO: find a way to enable debug draw at runtime */
        this.input.keyboard.on('keyup_D', () => {
            this.debugText1.visible = !this.debugText1.visible;
            this.debugText2.visible = this.debugText1.visible;
        }, this);

        this.events.on('shutdown', () => {
            this.input.keyboard.shutdown();
        }, this);
    }

    update() {
        if (this.debugText1.visible) {
            const i = globalParameters.currentLevel;

            this.debugText1.setText(`
fps: ${game.loop.actualFps.toFixed(1)}

globalParameters = {
${DebugScene.object2string(globalParameters)}
}`
            );

            this.debugText2.setText(`
levelParameters[${i}] = {
${DebugScene.object2string(levelParameters[i])}
}`
            );
        }
    }

    static object2string(obj) {
        return Object.entries(obj).filter(([key]) => key[0] !== '_')
            .map(([key, value]) => `\t${key}: ${value}`)
            .join('\n');
    }
}

