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
