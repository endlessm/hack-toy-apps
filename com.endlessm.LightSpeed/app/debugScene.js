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
        this.debugText = this.add.text(8, 0, '', {
            color: '#00ff00',
            shadow: {
                color: 'black',
                fill: true,
                offsetX: 1,
                offsetY: 1,
            },
        });
        this.debugText.visible = false;

        /* TODO: find a way to enable debug draw at runtime */
        this.input.keyboard.on('keyup_D', () => {
            this.debugText.visible = !this.debugText.visible;
        }, this);
    }

    update() {
        if (this.debugText.visible) {
            const i = globalParameters.currentLevel;

            this.debugText.setText(`
fps: ${game.loop.actualFps.toFixed(1)}

globalParameters = {
${DebugScene.object2string(globalParameters)}
}

levelParameters[${i}] = {
${DebugScene.object2string(levelParameters[i])}
}`
            );
        }
    }

    static object2string(obj) {
        return Object.entries(obj).map(([key, value]) => `\t${key}: ${value}`)
            .join('\n');
    }
}

