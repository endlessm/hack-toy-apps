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
    if (globalParameters.flipped)
        Sounds.stop('system/background/front');
    else
        Sounds.playLoop('system/background/front');
}

document.onmousedown = function(e)
{
    globalParameters.clicked = !globalParameters.clicked;
}

Sounds.playLoop('system/background/front');
