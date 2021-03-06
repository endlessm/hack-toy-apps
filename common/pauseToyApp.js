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
// wake all states that were in sleep mode
function wakeScenes() {
  if (game) {
     for (var j = 0; j < game.scene.scenes.length; j++) {
         if (game.scene.isSleeping(game.scene.scenes[j]))
             game.scene.wake(game.scene.scenes[j]);
     }
     game.canvas.style.display = '';
     document.body.className = document.body.className.replace("bgImage", "");
  }
}

// put to sleep all scenes that are active
// this will stop update and render calls
// hide the canvas so html bg will show, rather than blank white screen
function sleepScenes() {
  if (game) {
    for (var j = 0; j < game.scene.scenes.length; j++) {
      if (game.scene.isActive(game.scene.scenes[j]))
          game.scene.sleep(game.scene.scenes[j]);
    }

      document.body.classList.add("bgImage");
      game.canvas.style.display = 'none';
  }
}

var NEED_HACK_OVERLAY = null;
var NEED_HACK_MODAL = null;

function needHackScreen(content, clickCB = null) {
    if (NEED_HACK_MODAL) {
        NEED_HACK_MODAL.style.display = 'block';
        NEED_HACK_OVERLAY.style.display = 'block';
        return;
    }

    NEED_HACK_OVERLAY = document.createElement('div');
    NEED_HACK_OVERLAY.classList.add('needHackOverlay');
    NEED_HACK_MODAL = document.createElement('div');
    NEED_HACK_MODAL.classList.add('needHack');

    NEED_HACK_MODAL.innerHTML = content;

    if (clickCB) {
        const button = document.createElement('button');
        button.addEventListener('click', clickCB);
        button.innerHTML = 'Click here to continue';
        NEED_HACK_MODAL.append(button);
    }

    document.body.append(NEED_HACK_OVERLAY);
    document.body.append(NEED_HACK_MODAL);
}

function hideNeedHackScreen() {
    if (NEED_HACK_MODAL) {
        NEED_HACK_MODAL.style.display = 'none';
        NEED_HACK_OVERLAY.style.display = 'none';
    }
}

// Enter sleep or wake mode when visibility changes
// i.e user minimizes toy app
document.addEventListener('visibilitychange', () => {
    if (document.hidden)
        sleepScenes();
    else
        wakeScenes();
});

window.game.events.on('blur', () => {
    // Enter sleep mode if app is not in focus for 10 seconds
    if(game)
      game.pauseToyAppTimeout = setTimeout(sleepScenes, 10000);
});

window.game.events.on('focus', () => {
    // clear timeout to sleep mode if toy app is back in focus
   if (game)
      clearSleepTimer(game.pauseToyAppTimeout);
   
   wakeScenes();
});

function clearSleepTimer(timeout) {
  if (timeout)
       clearTimeout(timeout);
}
