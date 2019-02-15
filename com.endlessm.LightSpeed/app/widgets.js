/* Phaser UI elements
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported LevelChooser */

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
