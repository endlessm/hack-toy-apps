
//---------------------------
function TEMPSoundAPI()
{
    var moveFling    = new Audio( "sounds/Slingshot_Grab.wav"       ); 
    var pullFling    = new Audio( "sounds/Slingshot_Pull_Loop.wav"  );
    var fling        = new Audio( "sounds/Slingshot_Release.wav"    ); 
    var tooManyBalls = new Audio( "sounds/too-many.wav"             ); 
    var trash        = new Audio( "sounds/Tool_Trash.wav"           ); 
    var grab         = new Audio( "sounds/Tool_Grab.wav"            ); 
    var death0       = new Audio( "sounds/Death-0.wav"              ); 
    var death1       = new Audio( "sounds/Death-1.wav"              ); 
    var death2       = new Audio( "sounds/Death-2.wav"              ); 
    var death3       = new Audio( "sounds/Death-3.wav"              ); 
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
    var delete0      = new Audio( "sounds/Delete_Species1.wav"      ); 
    var delete1      = new Audio( "sounds/Delete_Species2.wav"      ); 
    var delete2      = new Audio( "sounds/Delete_Species3.wav"      ); 
    var delete3      = new Audio( "sounds/Delete_Species4.wav"      ); 
    var delete4      = new Audio( "sounds/Delete_Species5.wav"      ); 
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
    
    //-------------------------------
    this.playLoop = function( name )
    {    
        this.play( name );   
    }
    
    //----------------------------
    this.play = function( name )
    {    
        var soundID = this.getID( name );
        soundID.pause();
        soundID.currentTime = 0; 
        soundID.play(); 
    }
    
    //-------------------------------
    this.stop = function( name )
    {    
        var soundID = this.getID( name );
        soundID.pause();
        soundID.currentTime = 0; 
    }

    //----------------------------
    this.getID = function( name )
    {        
        var ID = moveFling;
        
             if ( name == "moveFling"    ) { ID = moveFling;    }
        else if ( name == "pullFling"    ) { ID = pullFling;    }
        else if ( name == "fling"        ) { ID = fling;        }
        else if ( name == "tooManyBalls" ) { ID = tooManyBalls; }
        else if ( name == "trash"        ) { ID = trash;        }
        else if ( name == "grab"         ) { ID = grab;         }
        else if ( name == "death0"       ) { ID = death0;       }
        else if ( name == "death1"       ) { ID = death1;       }
        else if ( name == "death2"       ) { ID = death2;       }
        else if ( name == "death3"       ) { ID = death3;       }
        else if ( name == "death4"       ) { ID = death4;       }
        else if ( name == "create0"      ) { ID = create0;      }
        else if ( name == "create1"      ) { ID = create1;      }
        else if ( name == "create2"      ) { ID = create2;      }
        else if ( name == "create3"      ) { ID = create3;      }
        else if ( name == "create4"      ) { ID = create4;      }
        else if ( name == "fly0"         ) { ID = fly0;         }
        else if ( name == "fly1"         ) { ID = fly1;         }
        else if ( name == "fly2"         ) { ID = fly2;         }
        else if ( name == "fly3"         ) { ID = fly3;         }
        else if ( name == "fly4"         ) { ID = fly4;         }
        else if ( name == "delete0"      ) { ID = delete0;      }
        else if ( name == "delete1"      ) { ID = delete1;      }
        else if ( name == "delete2"      ) { ID = delete2;      }
        else if ( name == "delete3"      ) { ID = delete3;      }
        else if ( name == "delete4"      ) { ID = delete4;      }
        else if ( name == "success0"     ) { ID = delete0;      }
        else if ( name == "success1"     ) { ID = delete1;      }
        else if ( name == "success2"     ) { ID = delete2;      }
        else if ( name == "success3"     ) { ID = delete3;      }
        else if ( name == "success4"     ) { ID = delete4;      }
        else if ( name == "tool0"        ) { ID = tool0;        }
        else if ( name == "tool1"        ) { ID = tool1;        }
        else if ( name == "tool2"        ) { ID = tool2;        }
        else if ( name == "tool3"        ) { ID = tool3;        }
        else if ( name == "tool4"        ) { ID = tool4;        }   
         
        return ID;
    }
}