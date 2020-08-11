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
/* exported Button */

class Button extends Phaser.GameObjects.Sprite {
    constructor(_scene, x, y, spritesheet, defaultFrame, spritesheetOffset, maxFrames,
        scaleX, scaleY, callback) {
        super(_scene, x, y, spritesheet, defaultFrame, spritesheetOffset, maxFrames);

        this.x = x;
        this.y = y;
        this.defaultFrame = defaultFrame;
        this.spritesheetOffset = spritesheetOffset;
        this.maxFrames = maxFrames;
        this.myCallback = callback;
        this.myScope = _scene;

        this.disabled = false;

        this.setInteractive({useHandCursor: true});
        this.setScale(scaleX, scaleY);
        this.on('pointerup', this.pointerUp, this);
        this.on('pointerdown', this.pointerDown, this);
        this.on('pointerover', this.pointerOver, this);
        this.on('pointerout', this.pointerOut, this);

        _scene.add.existing(this);
    }

    pointerUp() {
        if (this.disabled)
            return;

        this.setFrame(this.defaultFrame);
        this.myCallback();
    }

    pointerDown() {
        if (this.disabled)
            return;

        let frame = this.defaultFrame + this.spritesheetOffset * 2;
        if (frame > this.maxFrames)
            frame = this.defaultFrame;
        this.setFrame(frame);
    }

    pointerOver() {
        if (this.disabled)
            return;

        let frame = this.defaultFrame + this.spritesheetOffset;
        if (frame > this.maxFrames)
            frame = this.defaultFrame;

        this.setFrame(frame);
    }

    pointerOut() {
        if (this.disabled)
            return;

        this.setFrame(this.defaultFrame);
    }
}
