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
        Sounds.terminate('operatingSystem/background-music');
        // Object.keys(UI._subSystems).forEach(id => {
        //     Sounds.terminate(`operatingSystem/${id}`);
        // });
    } else {
        Sounds.playLoop('operatingSystem/background-music');
    }
}

document.onmousedown = function(e)
{
    globalParameters.clicked = !globalParameters.clicked;
}

Sounds.playLoop('operatingSystem/background-music');
