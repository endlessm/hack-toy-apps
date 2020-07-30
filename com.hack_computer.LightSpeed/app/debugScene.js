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

