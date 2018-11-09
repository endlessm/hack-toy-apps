var globalParameters = 
{
    flipped         : false
}


//-----------------------------------------------------------------
// This function should be called from outside to tell this app
// to switch from the initial screen to the unlock screen
//-----------------------------------------------------------------
function flip()
{
    globalParameters.flipped = !globalParameters.flipped;
}