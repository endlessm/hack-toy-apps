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
//-------------------------------------------------------
// Canvas Optimizations
//-------------------------------------------------------
CanvasRenderingContext2D.prototype.drawImageCached = function (image, dx, dy, dWidth, dHeight)
{
    // No-Op if the image is not loaded
    if (image.tagName === 'IMG' && !image.complete)
        return;

    const t = this.getTransform() || this.currentTransform || this.webkitCurrentTransform;
    if (t === undefined)
    {
        this.drawImage(image, dx, dy, dWidth, dHeight);
        return;
    }

    dWidth = Math.round(dWidth);
    dHeight = Math.round(dHeight);

    var off = image._off;
    if (!off || off.canvas.width !== dWidth || off.canvas.height !== dHeight ||
        off._t.a !== t.a || off._t.d !== t.d)
    {
        if (!off)
            image._off = off = document.createElement('canvas').getContext('2d');

        off._t = t;
        off.scale(t.a, t.d);
        off.canvas.width = dWidth;
        off.canvas.height = dHeight;
        off.drawImage(image, 0, 0, dWidth, dHeight);
    }

    this.drawImage(off.canvas, dx, dy);
};

