
//---------------------------
function FallbackSoundAPI()
{
    var background1  = new Audio( "sounds/BG_1.wav"                 ); 
    var background2  = new Audio( "sounds/BG_2.wav"                 ); 
    var background3  = new Audio( "sounds/BG_3.wav"                 ); 
    var moveFling    = new Audio( "sounds/Slingshot_Grab.wav"       ); 
    var unGrab       = new Audio( "sounds/Slingshot_Ungrab.wav"     ); 
    var pullFling    = new Audio( "sounds/Slingshot_Pull_Loop.wav"  );
    var fling        = new Audio( "sounds/Slingshot_Release.wav"    ); 
    var tooManyBalls = new Audio( "sounds/Too_Many_Balls.wav"       ); 
    var trashTool    = new Audio( "sounds/Tool_Trash.wav"           ); 
    var moveTool     = new Audio( "sounds/Tool_Move.wav"            ); 
    var createTool   = new Audio( "sounds/Tool_Create.wav"          ); 
    var flingTool    = new Audio( "sounds/Tool_Fling.wav"           ); 
    var noGrab       = new Audio( "sounds/Cannot_Grab.wav"          ); 
    var collision    = new Audio( "sounds/Collision.wav"            ); 
    var buttonClick  = new Audio( "sounds/ButtonClick.wav"          ); 
    var death0       = new Audio( "sounds/Death_1.wav"              ); 
    var death1       = new Audio( "sounds/Death_2.wav"              ); 
    var death2       = new Audio( "sounds/Death_3.wav"              ); 
    var death3       = new Audio( "sounds/Death_4.wav"              ); 
    var create0      = new Audio( "sounds/CreateBall_Species1.wav"  ); 
    var create1      = new Audio( "sounds/CreateBall_Species2.wav"  ); 
    var create2      = new Audio( "sounds/CreateBall_Species3.wav"  ); 
    var create3      = new Audio( "sounds/CreateBall_Species4.wav"  ); 
    var create4      = new Audio( "sounds/CreateBall_Species5.wav"  ); 
    var fly0         = new Audio( "sounds/Fly_Species1.wav"         ); 
    var fly1         = new Audio( "sounds/Fly_Species2.wav"         ); 
    var fly2         = new Audio( "sounds/Fly_Species3.wav"         ); 
    var fly3         = new Audio( "sounds/Fly_Species4.wav"         ); 
    var fly4         = new Audio( "sounds/Fly_Species5.wav"         ); 
    var delete0      = new Audio( "sounds/Death_Species1.wav"       ); 
    var delete1      = new Audio( "sounds/Death_Species2.wav"       ); 
    var delete2      = new Audio( "sounds/Death_Species3.wav"       ); 
    var delete3      = new Audio( "sounds/Death_Species4.wav"       ); 
    var delete4      = new Audio( "sounds/Death_Species5.wav"       ); 
    var success0     = new Audio( "sounds/Success_Species1.wav"     ); 
    var success1     = new Audio( "sounds/Success_Species2.wav"     ); 
    var success2     = new Audio( "sounds/Success_Species3.wav"     ); 
    var success3     = new Audio( "sounds/Success_Species4.wav"     ); 
    var success4     = new Audio( "sounds/Success_Species5.wav"     ); 
    var tool0        = new Audio( "sounds/Tool_Species1.wav"        ); 
    var tool1        = new Audio( "sounds/Tool_Species2.wav"        ); 
    var tool2        = new Audio( "sounds/Tool_Species3.wav"        ); 
    var tool3        = new Audio( "sounds/Tool_Species4.wav"        ); 
    var tool4        = new Audio( "sounds/Tool_Species5.wav"        ); 
    var select1a     = new Audio( "sounds/Select_Species1_a.wav"    ); 
    var select1b     = new Audio( "sounds/Select_Species1_b.wav"    ); 
    var select1c     = new Audio( "sounds/Select_Species1_c.wav"    ); 
    var select2a     = new Audio( "sounds/Select_Species2_a.wav"    ); 
    var select2b     = new Audio( "sounds/Select_Species2_b.wav"    ); 
    var select2c     = new Audio( "sounds/Select_Species2_c.wav"    ); 
    var select3a     = new Audio( "sounds/Select_Species3_a.wav"    ); 
    var select3b     = new Audio( "sounds/Select_Species3_b.wav"    ); 
    var select3c     = new Audio( "sounds/Select_Species3_c.wav"    ); 
    var select4a     = new Audio( "sounds/Select_Species4_a.wav"    ); 
    var select4b     = new Audio( "sounds/Select_Species4_b.wav"    ); 
    var select4c     = new Audio( "sounds/Select_Species4_c.wav"    ); 
    var select5a     = new Audio( "sounds/Select_Species5_a.wav"    ); 
    var select5b     = new Audio( "sounds/Select_Species5_b.wav"    ); 
    var select5c     = new Audio( "sounds/Select_Species5_c.wav"    ); 
    
    //-------------------------------
    this.playLoop = function( name )
    {    
        this.play( name );   
    }
    
    //----------------------------
    this.play = function( name )
    {    
        var truncatedName = name.replace( "fizzics/", "" );
        //console.log( truncatedName );
        
        var soundID = this.getID( truncatedName );
        soundID.pause();
        soundID.currentTime = 0; 
        soundID.play(); 
    }
    
    //-------------------------------
    this.stop = function( name )
    {    
        var truncatedName = name.replace( "fizzics/", "" );
        //console.log( truncatedName );
    
        var soundID = this.getID( truncatedName );
        soundID.pause();
        soundID.currentTime = 0; 
    }

    //----------------------------
    this.getID = function( name )
    {        
        return eval( name );
    }
}

