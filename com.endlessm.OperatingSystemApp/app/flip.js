var globalParameters = 
{
    flipped         : false,
    clicked         : false
}

var gameState =
{
    someLockscreenActive: false
}

Object.defineProperty(gameState, 'someLockscreenActive', {
    set: function(val) {
        const isActive = Boolean(val);
        if (globalParameters.flipped && !isActive)
            Sounds.playLoop('system/background/back');
        this.val = isActive;
    }
});


//-----------------------------------------------------------------
// This function should be called from outside to tell this app
// to switch from the initial screen to the unlock screen
//-----------------------------------------------------------------
function flip()
{
    globalParameters.flipped = !globalParameters.flipped;
    if (globalParameters.flipped) {
        GameState.someLockscreenActive([
            'item.key.OperatingSystemApp.1',
            'item.key.OperatingSystemApp.2',
            'item.key.OperatingSystemApp.3'
        ]);
        Sounds.stop('system/background/front');
    } else {
        Sounds.stop('system/background/back');
        Sounds.playLoop('system/background/front');
    }
}

document.onmousedown = function(e)
{
    globalParameters.clicked = !globalParameters.clicked;
}

Sounds.playLoop('system/background/front');
