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
var globalParameters = 
{
    flipped         : false,
    clicked         : false
}


//-----------------------------------------------------------------
// This function should be called from outside to tell this app
// to switch from the initial screen to the unlock screen
//-----------------------------------------------------------------
function flip()
{
    globalParameters.flipped = !globalParameters.flipped;
    if (globalParameters.flipped) {
        Sounds.terminate('system/background/front');
        Object.keys(UI._subSystems).forEach(id => {
            Sounds.terminate(`operatingSystem/${id}`);
        });
    } else {
        Sounds.playLoop('system/background/front');
    }
}

document.onmousedown = function(e)
{
    globalParameters.clicked = !globalParameters.clicked;
}

Sounds.playLoop('system/background/front');
