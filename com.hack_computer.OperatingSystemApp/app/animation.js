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
const Animations = [];

function step(timestamp) {

    Animations.forEach(function(element) {
        var img = element._currentFrame;

        if (!element.classList.contains("current") && !UI.isAnimationRunning)
            return;

        if (!element._lastUpdated)
            element._lastUpdated = timestamp;

        var elapsed = timestamp - element._lastUpdated;

        if (elapsed >= img._delay) {
            img.style.visibility = 'hidden';

            /* Show next frame */
            var next = img.nextElementSibling ? img.nextElementSibling : element.firstElementChild;

            next.style.visibility = 'visible';
            element._lastUpdated = timestamp;

            element._currentFrame = next;
        }
    });

    requestAnimationFrame(step);
}

function animation_bootstrap(finishCallback)
{
    var elements = document.querySelectorAll( "div.Animation" );
    var images_needed = 0, images_loaded = 0;

    /* Initialize all animation */
    elements.forEach(function(element) {
        var frameTiming = JSON.parse(element.attributes['data-frames'].value);

        for (var i = 1, n = frameTiming.length; i <= n; i++) {
            var img = document.createElement ('img');

            img._delay = frameTiming[i-1];
            img.src = `images/${element.id}/${i}.png`;
            img.style.visibility = i === 1 ? 'visible' : 'hidden';

            element.appendChild(img);

            images_needed++;
            img.addEventListener("load", function() {
                images_loaded++;

                 /* Notify ToyApp we just finished loading everything */
                if (images_needed === images_loaded)
                    finishCallback();
            });
        }

        element._currentFrame = element.firstElementChild;

        Animations.push(element);
    });

    requestAnimationFrame(step);
}

