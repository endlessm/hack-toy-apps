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
}

document.onmousedown = function(e)
{
    globalParameters.clicked = !globalParameters.clicked;
}
