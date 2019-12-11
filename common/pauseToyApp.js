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

var NEED_HACK_MODAL = null;

function needHackScreen(clickCB = null) {
    if (NEED_HACK_MODAL) {
        NEED_HACK_MODAL.style.display = 'block';
        return;
    }

    NEED_HACK_MODAL = document.createElement('div');
    NEED_HACK_MODAL.classList.add('needHack');

    NEED_HACK_MODAL.innerHTML = `
        <h1>Game Over</h1>

        <p> It is not possible to continue without an associated quest. </p>

        <p>
        To play more levels of Sidetrack you should engage with Ada in the Clubhouse. Try Hack and look for
        quests related to Sidetrack.
        </p>
    `;

    if (clickCB) {
        const button = document.createElement('button');
        button.addEventListener('click', clickCB);
        button.innerHTML = 'Click here to continue';
        NEED_HACK_MODAL.append(button);
    }

    document.body.append(NEED_HACK_MODAL);
}

function hideNeedHackScreen() {
    if (NEED_HACK_MODAL)
        NEED_HACK_MODAL.style.display = 'none';
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
