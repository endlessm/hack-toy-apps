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
const clock = document.getElementById('rtc');

function clock_tick() {
    var seconds = Math.floor(Date.now()/1000);

    if (clock._seconds !== seconds) {
        var date = new Date();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();;

        var hTransform = `rotate(${h * 30 + m/2}deg)`;
        var mTransform = `rotate(${m * 6 + s/10}deg)`;
        var sTransform = `rotate(${s * 6}deg)`;

        clock._hour.style.transform = clock._hShadow.style.transform = hTransform;
        clock._minute.style.transform = clock._mShadow.style.transform = mTransform;
        clock._second.style.transform = clock._sShadow.style.transform = sTransform;

        clock._seconds = seconds;
    }

    requestAnimationFrame(clock_tick);
}

function clock_init() {
    clock._hour = clock.querySelector('#hour');
    clock._hShadow = clock.querySelector('#hour-shadow');

    clock._minute = clock.querySelector('#minute');
    clock._mShadow = clock.querySelector('#minute-shadow');

    clock._second = clock.querySelector('#second');
    clock._sShadow = clock.querySelector('#second-shadow');

    clock.style.display = 'block';

    requestAnimationFrame(clock_tick);
}

