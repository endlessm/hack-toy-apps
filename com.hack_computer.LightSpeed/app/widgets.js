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

/* exported LevelChooser, Logo */

class Logo extends Phaser.GameObjects.Container {
    constructor(scene, xScene, yScene) {
        super(scene, xScene, yScene);

        this.logo = new Phaser.GameObjects.Image(scene, 0, 0, 'logo');
        this.add(this.logo);

        // this.setSize(this.logo.width, this.logo.height);
        var particles = this.scene.add.particles('logo-particles');
        var {x, y} = this.getBounds();

        const emitters = [
            {x: 483, y: 20, lifespan: 1200},
            {x: 180, y: 40, lifespan: 800},
            {x: 170, y: 60, lifespan: 800},
            {x: 160, y: 130, lifespan: 800},
            {x: 625, y: 150, lifespan: 1400},
        ];

        for (var i = 0, n = emitters.length; i < n; i++) {
            particles.createEmitter({
                frame: ['logo-p1', 'logo-p2', 'logo-p3'],
                blendMode: 'ADD',
                x: x + emitters[i].x,
                y: y + emitters[i].y,
                angle: 180,
                speed: {min: 256, max: 512},
                alpha: {start: 1, end: 0},
                lifespan: emitters[i].lifespan,
                frequency: 64,
            });
        }
    }
}

class LevelChooser extends Phaser.GameObjects.Container {
    constructor(scene, prevBtn, nextBtn) {
        const spacing = 16;

        super(scene, 0, 0);

        var prev = this._prev = new Utils.Button(scene, prevBtn);
        var level = this._level = new Phaser.GameObjects.Text(scene, 0, 0, '', fontConfig);
        var next = this._next = new Utils.Button(scene, nextBtn);

        this.currentLevel = globalParameters.currentLevel;
        this.updateLevel(0);

        const lw = prev.width + spacing + level.width + spacing + next.width + 8;
        const lh = prev.height + 8;
        var levelBg = new Utils.TransparentBox(scene, lw, lh, 8);

        this.add([levelBg, prev, level, next]);

        /* FIXME: find a better way to align objects */
        levelBg.setPosition(-lw / 2, -lh / 2);
        this.setSize(lw, lh);
        Phaser.Display.Align.In.LeftCenter(prev, this, -4);
        Phaser.Display.Align.In.Center(level, this);
        Phaser.Display.Align.In.RightCenter(next, this, -4);

        prev.on('pointerup', () => {
            this.updateLevel(-1);
        }, this);

        next.on('pointerup', () => {
            this.updateLevel(1);
        }, this);
    }

    updateLevel(increment) {
        const maxLevel = globalParameters.availableLevels;
        var currentLevel = this.currentLevel + increment;

        currentLevel = Math.min(Math.max(currentLevel, 0), maxLevel);

        /* Update level text */
        this._level.setText(`Level ${currentLevel}`, fontConfig);
        this._prev.sensitive = currentLevel > 1;
        this._next.sensitive = currentLevel < maxLevel;

        if (this.currentLevel !== currentLevel) {
            this.currentLevel = currentLevel;
            this.emit('level-changed', currentLevel);
        }
    }
}
