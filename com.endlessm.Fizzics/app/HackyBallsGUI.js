
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

//----------------------
function HackyBallsGUI()
{    
    var _userInterface         = new UserInterface();
    var _flipped            = false;
    var _hackOverlay        = new Image();
    var _selectedSpecies    = 0;

    var _parameters;


    //--------------------------------------
    this.initialize = function( parameters )
    {
        //--------------------------------
        // grab the parameters
        //--------------------------------
        // note that "parameters" is defined globally         
        this.setParameters( parameters );
        
        //--------------------------------
        // grab the parameters
        //--------------------------------
        _hackOverlay.src = "images/hack-overlay.png";
    
        //--------------------------------
        // build the UI components
        //--------------------------------
        _userInterface.createButton( canvasID.width - 120, 20, 100,  37, "flip to hack" );
        _userInterface.createButton( canvasID.width - 120, 20, 100,  37, "flip back"    );

        var panelWidth  = 320.0;
        var panelHeight = 790.0;
        var panelMargin = 10;

        var panelLeft   = canvasID.width  - ( panelWidth  + panelMargin );
        var panelTop    = 10;

        var panelRight  = panelLeft + panelWidth;
        var panelBottom = panelTop  + panelHeight;

        _userInterface.createPanel (  panelLeft,  panelTop, panelWidth, panelHeight, "hack panel"  );

        var x = panelLeft + 20;
        var y = panelTop;
        var w = 280;
        var h = 25;

        y += 30; _userInterface.createLabel ( x, y, "Hack this Game!" );
        y += 30; _userInterface.createLabel ( x, y, "Choose a background..." );

        y += 10; _userInterface.createButton( x + 55 * 0, y, 45, 30, "bg 1" );
        y +=  0; _userInterface.createButton( x + 55 * 1, y, 45, 30, "bg 2" );
        y +=  0; _userInterface.createButton( x + 55 * 2, y, 45, 30, "bg 3" );
        //y +=  0; _userInterface.createButton( x + 55 * 3, y, 45, 30, "bg 4" );

        y += 60; _userInterface.createLabel ( x, y, "Choose which species of ball to hack..." );

        y += 10; _userInterface.createButton( x + 90 * 0, y, 80, 30, "species 1" );
        y +=  0; _userInterface.createButton( x + 90 * 1, y, 80, 30, "species 2" );
        y +=  0; _userInterface.createButton( x + 90 * 2, y, 80, 30, "species 3" );

        y += 60; _userInterface.createLabel ( x, y, "attractions/repulsions between species" );

        y += 10; _userInterface.createSlider( x, y, w, h, "0", _parameters.minSocialForce, _parameters.maxSocialForce, _parameters.socialForce_0_0 );
        y += 30; _userInterface.createSlider( x, y, w, h, "1", _parameters.minSocialForce, _parameters.maxSocialForce, _parameters.socialForce_0_1 );
        y += 30; _userInterface.createSlider( x, y, w, h, "2", _parameters.minSocialForce, _parameters.maxSocialForce, _parameters.socialForce_0_2 );

        y += 50; _userInterface.createLabel ( x, y, "physics parameters..." );

        y += 10; _userInterface.createSlider( x, y, w, h, "radius",            _parameters.minRadius,         _parameters.maxRadius,        _parameters.radius_0     );
        y += 30; _userInterface.createSlider( x, y, w, h, "gravity",           _parameters.minGravity,        _parameters.maxGravity,     _parameters.gravity_0     );
        y += 30; _userInterface.createSlider( x, y, w, h, "collision",         _parameters.mincollision,     _parameters.maxcollision,     _parameters.collision_0 );
        y += 30; _userInterface.createSlider( x, y, w, h, "air friction",    _parameters.minFriction,     _parameters.maxFriction,     _parameters.friction_0    );

        y += 50; _userInterface.createLabel ( x, y, "physics" );
        y += 10; _userInterface.createButton( x + 80 * 0, y, 70, 30, "freeze" );
        y +=  0; _userInterface.createButton( x + 80 * 1, y, 70, 30, "unfreeze" );

        y += 50; _userInterface.createLabel ( x, y, "ball image..." );
        y += 10; _userInterface.createButton( x + 60 * 0, y, 50, 30, "img 0" );
        y +=  0; _userInterface.createButton( x + 60 * 1, y, 50, 30, "img 1" );
        y +=  0; _userInterface.createButton( x + 60 * 2, y, 50, 30, "img 2" );
        
        y += 40; _userInterface.createButton( x + 60 * 0, y, 50, 30, "img 3" );
        y +=  0; _userInterface.createButton( x + 60 * 1, y, 50, 30, "img 4" );
        y +=  0; _userInterface.createButton( x + 60 * 2, y, 50, 30, "img 5" );
        
        y += 40; _userInterface.createButton( x + 60 * 0, y, 50, 30, "img 6" );
        y +=  0; _userInterface.createButton( x + 60 * 1, y, 50, 30, "img 7" );
        y +=  0; _userInterface.createButton( x + 60 * 2, y, 50, 30, "img 8" );

        y += 40; _userInterface.createButton( x + 60 * 0, y, 110, 25, "move tool on" );
        y +=  0; _userInterface.createButton( x + 60 * 2, y, 110, 25, "move tool off" );
        y += 30; _userInterface.createButton( x + 60 * 0, y, 110, 25, "fling tool on" );
        y +=  0; _userInterface.createButton( x + 60 * 2, y, 110, 25, "fling tool off" );
        y += 30; _userInterface.createButton( x + 60 * 0, y, 110, 25, "create tool on" );
        y +=  0; _userInterface.createButton( x + 60 * 2, y, 110, 25, "create tool off" );
        y += 30; _userInterface.createButton( x + 60 * 0, y, 110, 25, "delete tool on" );
        y +=  0; _userInterface.createButton( x + 60 * 2, y, 110, 25, "delete tool off" );



        _userInterface.setButtonActive( "flip to hack", true );
        _userInterface.setButtonActive( "flip back",     false );
        _userInterface.setPanelActive ( "hack panel",   false );
        _userInterface.setLabelActive ( "Hack this Game!", false );
        _userInterface.setLabelActive ( "Choose a background...", false );

        _userInterface.setButtonActive( "bg 1", false );
        _userInterface.setButtonActive( "bg 2", false );
        _userInterface.setButtonActive( "bg 3", false );
        //_userInterface.setButtonActive( "bg 4", false );

        _userInterface.setLabelActive( "Choose which species of ball to hack...", false );

        _userInterface.setButtonActive( "species 1", false );
        _userInterface.setButtonActive( "species 2", false );
        _userInterface.setButtonActive( "species 3", false );

        _userInterface.setLabelActive ( "attractions/repulsions between species", false );
        _userInterface.setSliderActive( "0",            false );
        _userInterface.setSliderActive( "1",            false );
        _userInterface.setSliderActive( "2",            false );

        _userInterface.setLabelActive ( "physics parameters...", false );
        _userInterface.setSliderActive( "radius",        false );
        _userInterface.setSliderActive( "gravity",       false );
        _userInterface.setSliderActive( "collision",     false );
        _userInterface.setSliderActive( "air friction", false );

        _userInterface.setLabelActive ( "physics", false );
        _userInterface.setButtonActive( "freeze",  false );
        _userInterface.setButtonActive( "unfreeze", false );

        _userInterface.setLabelActive ( "ball image...", false );
        
        _userInterface.setButtonActive( "img 0", false );
        _userInterface.setButtonActive( "img 1", false );
        _userInterface.setButtonActive( "img 2", false );
        _userInterface.setButtonActive( "img 3", false );
        _userInterface.setButtonActive( "img 4", false );
        _userInterface.setButtonActive( "img 5", false );
        _userInterface.setButtonActive( "img 6", false );
        _userInterface.setButtonActive( "img 7", false );
        _userInterface.setButtonActive( "img 8", false );
        
       _userInterface.setButtonActive( "move tool on",    false );
       _userInterface.setButtonActive( "move tool off",   false );
       _userInterface.setButtonActive( "fling tool on",   false );
       _userInterface.setButtonActive( "fling tool off",  false );
       _userInterface.setButtonActive( "create tool on",  false );
       _userInterface.setButtonActive( "create tool off", false );
       _userInterface.setButtonActive( "delete tool on",  false );
       _userInterface.setButtonActive( "delete tool off", false );
    }
    

    //---------------------------------------
    this.updateSliders = function( species )
    {
        if ( species == 0 )
        {
            _userInterface.setSliderValue( "gravity",         _parameters.gravity_0        );
            _userInterface.setSliderValue( "radius",         _parameters.radius_0        );
            _userInterface.setSliderValue( "collision",     _parameters.collision_0        );
            _userInterface.setSliderValue( "air friction",     _parameters.friction_0        );
            _userInterface.setSliderValue( "0",             _parameters.socialForce_0_0    );
            _userInterface.setSliderValue( "1",             _parameters.socialForce_0_1    );
            _userInterface.setSliderValue( "2",             _parameters.socialForce_0_2    );
        }
        else if ( species == 1 )
        {
            _userInterface.setSliderValue( "gravity",         _parameters.gravity_1        );
            _userInterface.setSliderValue( "radius",         _parameters.radius_1        );
            _userInterface.setSliderValue( "collision",     _parameters.collision_1        );
            _userInterface.setSliderValue( "air friction",     _parameters.friction_1        );
            _userInterface.setSliderValue( "0",             _parameters.socialForce_1_0    );
            _userInterface.setSliderValue( "1",             _parameters.socialForce_1_1    );
            _userInterface.setSliderValue( "2",             _parameters.socialForce_1_2    );
        }
        else if ( species == 2 )
        {
            _userInterface.setSliderValue( "gravity",         _parameters.gravity_2        );
            _userInterface.setSliderValue( "radius",         _parameters.radius_2        );
            _userInterface.setSliderValue( "collision",     _parameters.collision_2        );
            _userInterface.setSliderValue( "air friction",     _parameters.friction_2        );
            _userInterface.setSliderValue( "0",             _parameters.socialForce_2_0    );
            _userInterface.setSliderValue( "1",             _parameters.socialForce_2_1    );
            _userInterface.setSliderValue( "2",             _parameters.socialForce_2_2    );
        }
    }

    

    //--------------------------------------
    this.getValuesFromSliders = function()
    {    
        if ( _selectedSpecies == 0 )
        {    
            _parameters.gravity_0        = _userInterface.getSliderValue( "gravity"         );
            _parameters.radius_0        = _userInterface.getSliderValue( "radius"         );
            _parameters.collision_0        = _userInterface.getSliderValue( "collision"     );
            _parameters.friction_0        = _userInterface.getSliderValue( "air friction" );
            _parameters.socialForce_0_0    = _userInterface.getSliderValue( "0"             );
            _parameters.socialForce_0_1    = _userInterface.getSliderValue( "1"             );
            _parameters.socialForce_0_2    = _userInterface.getSliderValue( "2"             );
        }
        else if ( _selectedSpecies == 1 )
        {    
            _parameters.gravity_1        = _userInterface.getSliderValue( "gravity"         );
            _parameters.radius_1        = _userInterface.getSliderValue( "radius"         );
            _parameters.collision_1        = _userInterface.getSliderValue( "collision"     );
            _parameters.friction_1        = _userInterface.getSliderValue( "air friction" );
            _parameters.socialForce_1_0    = _userInterface.getSliderValue( "0"             );
            _parameters.socialForce_1_1    = _userInterface.getSliderValue( "1"             );
            _parameters.socialForce_1_2    = _userInterface.getSliderValue( "2"             );
        }
        else if ( _selectedSpecies == 2 )
        {    
            _parameters.gravity_2        = _userInterface.getSliderValue( "gravity"         );
            _parameters.radius_2        = _userInterface.getSliderValue( "radius"         );
            _parameters.collision_2        = _userInterface.getSliderValue( "collision"     );
            _parameters.friction_2        = _userInterface.getSliderValue( "air friction" );
            _parameters.socialForce_2_0    = _userInterface.getSliderValue( "0"             );
            _parameters.socialForce_2_1    = _userInterface.getSliderValue( "1"             );
            _parameters.socialForce_2_2    = _userInterface.getSliderValue( "2"             );
        }
    }
    
    

    //-------------------------------
    this.getParameters = function()
    {        
        return _parameters;
    }
    
    
    //-----------------------------------------
    this.setParameters = function( parameters )
    {        
        _parameters = parameters;

        _parameters.backgroundImageIndex = parameters.backgroundImageIndex;

        _parameters.radius_0            = parameters.radius_0;
        _parameters.gravity_0           = parameters.gravity_0;
        _parameters.collision_0         = parameters.collision_0;
        _parameters.friction_0          = parameters.friction_0;
        _parameters.usePhysics_0        = parameters.usePhysics_0;
        _parameters.socialForce_0_0     = parameters.socialForce_0_0;
        _parameters.socialForce_0_1     = parameters.socialForce_0_1;
        _parameters.socialForce_0_2     = parameters.socialForce_0_2;
        _parameters.socialForce_0_3     = parameters.socialForce_0_3;
        _parameters.socialForce_0_4     = parameters.socialForce_0_4;
        _parameters.touchDeath_0_0      = parameters.touchDeath_0_0;
        _parameters.touchDeath_0_1      = parameters.touchDeath_0_1;
        _parameters.touchDeath_0_2      = parameters.touchDeath_0_2;
        _parameters.touchDeath_0_3      = parameters.touchDeath_0_3;
        _parameters.touchDeath_0_4      = parameters.touchDeath_0_4;        
        _parameters.imageIndex_0        = parameters.imageIndex_0;       
        _parameters.deathVisualGood_0   = parameters.deathVisualGood_0;
        _parameters.deathVisualBad_0    = parameters.deathVisualBad_0;
        _parameters.deathSoundGood_0      = parameters.deathSoundGood_0;
        _parameters.deathSoundBad_0      = parameters.deathSoundBad_0;
        
        _parameters.radius_1            = parameters.radius_1;
        _parameters.gravity_1           = parameters.gravity_1;
        _parameters.collision_1         = parameters.collision_1;
        _parameters.friction_1          = parameters.friction_1;
        _parameters.usePhysics_1        = parameters.usePhysics_1;
        _parameters.socialForce_1_0     = parameters.socialForce_1_0;
        _parameters.socialForce_1_1     = parameters.socialForce_1_1;
        _parameters.socialForce_1_2     = parameters.socialForce_1_2;
        _parameters.socialForce_1_3     = parameters.socialForce_1_3;
        _parameters.socialForce_1_4     = parameters.socialForce_1_4;
        _parameters.touchDeath_1_0      = parameters.touchDeath_1_0;
        _parameters.touchDeath_1_1      = parameters.touchDeath_1_1;
        _parameters.touchDeath_1_2      = parameters.touchDeath_1_2;
        _parameters.touchDeath_1_3      = parameters.touchDeath_1_3;
        _parameters.touchDeath_1_4      = parameters.touchDeath_1_4;        
        _parameters.imageIndex_1        = parameters.imageIndex_1;       
        _parameters.deathVisualGood_1     = parameters.deathVisualGood_1;
        _parameters.deathVisualBad_1     = parameters.deathVisualBad_1;
        _parameters.deathSoundGood_1      = parameters.deathSoundGood_1;
        _parameters.deathSoundBad_1      = parameters.deathSoundBad_1;

        _parameters.radius_2            = parameters.radius_2;
        _parameters.gravity_2           = parameters.gravity_2;
        _parameters.collision_2         = parameters.collision_2;
        _parameters.friction_2          = parameters.friction_2;
        _parameters.usePhysics_2        = parameters.usePhysics_2;
        _parameters.socialForce_2_0     = parameters.socialForce_2_0;
        _parameters.socialForce_2_1     = parameters.socialForce_2_1;
        _parameters.socialForce_2_2     = parameters.socialForce_2_2;
        _parameters.socialForce_2_3     = parameters.socialForce_2_3;
        _parameters.socialForce_2_4     = parameters.socialForce_2_4;
        _parameters.touchDeath_2_0      = parameters.touchDeath_2_0;
        _parameters.touchDeath_2_1      = parameters.touchDeath_2_1;
        _parameters.touchDeath_2_2      = parameters.touchDeath_2_2;
        _parameters.touchDeath_2_3      = parameters.touchDeath_2_3;
        _parameters.touchDeath_2_4      = parameters.touchDeath_2_4;        
        _parameters.imageIndex_2        = parameters.imageIndex_2;       
        _parameters.deathVisualGood_2     = parameters.deathVisualGood_2;
        _parameters.deathVisualBad_2     = parameters.deathVisualBad_2;
        _parameters.deathSoundGood_2      = parameters.deathSoundGood_2;
        _parameters.deathSoundBad_2      = parameters.deathSoundBad_2;

        _parameters.radius_3            = parameters.radius_3;
        _parameters.gravity_3           = parameters.gravity_3;
        _parameters.collision_3         = parameters.collision_3;
        _parameters.friction_3          = parameters.friction_3;
        _parameters.usePhysics_3        = parameters.usePhysics_3;
        _parameters.socialForce_3_0     = parameters.socialForce_3_0;
        _parameters.socialForce_3_1     = parameters.socialForce_3_1;
        _parameters.socialForce_3_2     = parameters.socialForce_3_2;
        _parameters.socialForce_3_3     = parameters.socialForce_3_3;
        _parameters.socialForce_3_4     = parameters.socialForce_3_4;
        _parameters.touchDeath_3_0      = parameters.touchDeath_3_0;
        _parameters.touchDeath_3_1      = parameters.touchDeath_3_1;
        _parameters.touchDeath_3_2      = parameters.touchDeath_3_2;
        _parameters.touchDeath_3_3      = parameters.touchDeath_3_3;
        _parameters.touchDeath_3_4      = parameters.touchDeath_3_4;        
        _parameters.imageIndex_3        = parameters.imageIndex_3;       
        _parameters.deathVisualGood_3     = parameters.deathVisualGood_3;
        _parameters.deathVisualBad_3     = parameters.deathVisualBad_3;
        _parameters.deathSoundGood_3      = parameters.deathSoundGood_3;
        _parameters.deathSoundBad_3      = parameters.deathSoundBad_3;
        
        _parameters.radius_4            = parameters.radius_4;
        _parameters.gravity_4           = parameters.gravity_4;
        _parameters.collision_4         = parameters.collision_4;
        _parameters.friction_4          = parameters.friction_4;
        _parameters.usePhysics_4        = parameters.usePhysics_4;
        _parameters.socialForce_4_0     = parameters.socialForce_4_0;
        _parameters.socialForce_4_1     = parameters.socialForce_4_1;
        _parameters.socialForce_4_2     = parameters.socialForce_4_2;
        _parameters.socialForce_4_3     = parameters.socialForce_4_3;
        _parameters.socialForce_4_4     = parameters.socialForce_4_4;
        _parameters.touchDeath_4_0      = parameters.touchDeath_4_0;
        _parameters.touchDeath_4_1      = parameters.touchDeath_4_1;
        _parameters.touchDeath_4_2      = parameters.touchDeath_4_2;
        _parameters.touchDeath_4_3      = parameters.touchDeath_4_3;
        _parameters.touchDeath_4_4      = parameters.touchDeath_4_4;        
        _parameters.imageIndex_4        = parameters.imageIndex_4;       
        _parameters.deathVisualGood_4     = parameters.deathVisualGood_4;
        _parameters.deathVisualBad_4     = parameters.deathVisualBad_4;
        _parameters.deathSoundGood_4      = parameters.deathSoundGood_4;
        _parameters.deathSoundBad_4      = parameters.deathSoundBad_4;
    }
    
    
    
    //---------------------------------
    this.getTweakedSlider = function()
    {
        return _userInterface.getTweakedSlider();
    }
        
    //--------------------------------------
    this.clearMouseInteraction = function()
    {
        _userInterface.clearMouseInteraction();
    }



    //----------------------------------
    this.setMouseDown = function( x, y )
    {
        var nameOfButtonPressed = "-";
        
        _userInterface.setMouseDown( x, y );

        if ( _flipped )
        {
            if ( _userInterface.buttonPressed( "flip back" ) )
            {
                buttonSelected = true;
                _flipped = false;

                _userInterface.setButtonActive( "flip to hack", true  );
                _userInterface.setPanelActive ( "hack panel",     false );
                _userInterface.setButtonActive( "flip back",     false );
                _userInterface.setLabelActive ( "Hack this Game!", false );
                _userInterface.setLabelActive ( "Choose a background...", false );

                _userInterface.setButtonActive( "bg 1", false );
                _userInterface.setButtonActive( "bg 2", false );
                _userInterface.setButtonActive( "bg 3", false );
                //_userInterface.setButtonActive( "bg 4", false );

                _userInterface.setLabelActive( "Choose which species of ball to hack...", false );
                _userInterface.setButtonActive( "species 1", false );
                _userInterface.setButtonActive( "species 2", false );
                _userInterface.setButtonActive( "species 3", false );

                _userInterface.setLabelActive ( "attractions/repulsions between species", false );
                _userInterface.setSliderActive( "0",             false );
                _userInterface.setSliderActive( "1",             false );
                _userInterface.setSliderActive( "2",             false );

                _userInterface.setLabelActive ( "physics parameters...", false );
                _userInterface.setSliderActive( "radius",         false );
                _userInterface.setSliderActive( "gravity",         false );
                _userInterface.setSliderActive( "collision",     false );
                _userInterface.setSliderActive( "air friction", false );

                _userInterface.setLabelActive ( "physics", false );
                _userInterface.setButtonActive( "freeze",  false );
                _userInterface.setButtonActive( "unfreeze", false );

                _userInterface.setLabelActive ( "ball image...", false );
                _userInterface.setButtonActive( "img 0", false );
                _userInterface.setButtonActive( "img 1", false );
                _userInterface.setButtonActive( "img 2", false );
                _userInterface.setButtonActive( "img 3", false );
                _userInterface.setButtonActive( "img 4", false );
                _userInterface.setButtonActive( "img 5", false );
                _userInterface.setButtonActive( "img 6", false );
                _userInterface.setButtonActive( "img 7", false );
                _userInterface.setButtonActive( "img 8", false );
                
               _userInterface.setButtonActive( "move tool on",    false );
               _userInterface.setButtonActive( "move tool off",   false );
               _userInterface.setButtonActive( "fling tool on",   false );
               _userInterface.setButtonActive( "fling tool off",  false );
               _userInterface.setButtonActive( "create tool on",  false );
               _userInterface.setButtonActive( "create tool off", false );
               _userInterface.setButtonActive( "delete tool on",  false );
               _userInterface.setButtonActive( "delete tool off", false );
            }

            else if ( _userInterface.buttonPressed( "bg 1"         ) ) { _parameters.backgroundImageIndex = 0; }
            else if ( _userInterface.buttonPressed( "bg 2"         ) ) { _parameters.backgroundImageIndex = 1; }
            else if ( _userInterface.buttonPressed( "bg 3"         ) ) { _parameters.backgroundImageIndex = 2; }

            else if ( _userInterface.buttonPressed( "species 1" ) ) { _selectedSpecies = 0; }
            else if ( _userInterface.buttonPressed( "species 2" ) ) { _selectedSpecies = 1; }
            else if ( _userInterface.buttonPressed( "species 3" ) ) { _selectedSpecies = 2; }
            
            else if ( _userInterface.buttonPressed( "move tool on"    ) ) { _parameters.moveToolActive   = true;  }
            else if ( _userInterface.buttonPressed( "fling tool on"   ) ) { _parameters.flingToolActive  = true;  }
            else if ( _userInterface.buttonPressed( "create tool on"  ) ) { _parameters.createToolActive = true;  }
            else if ( _userInterface.buttonPressed( "delete tool on"  ) ) { _parameters.deleteToolActive = true;  }
            
            else if ( _userInterface.buttonPressed( "move tool off"   ) ) { _parameters.moveToolActive   = false; }
            else if ( _userInterface.buttonPressed( "fling tool off"  ) ) { _parameters.flingToolActive  = false; }
            else if ( _userInterface.buttonPressed( "create tool off" ) ) { _parameters.createToolActive = false; }
            else if ( _userInterface.buttonPressed( "delete tool off" ) ) { _parameters.deleteToolActive = false; }
             
        
            if ( _selectedSpecies == 0 )
            {
                     if ( _userInterface.buttonPressed( "freeze"     ) ) { _parameters.usePhysics_0 = false;    } 
                else if ( _userInterface.buttonPressed( "unfreeze"   ) ) { _parameters.usePhysics_0 = true;     } 
                else if ( _userInterface.buttonPressed( "img 0"      ) ) { _parameters.imageIndex_0 = 0;        } 
                else if ( _userInterface.buttonPressed( "img 1"      ) ) { _parameters.imageIndex_0 = 1;        } 
                else if ( _userInterface.buttonPressed( "img 2"      ) ) { _parameters.imageIndex_0 = 2;        } 
                else if ( _userInterface.buttonPressed( "img 3"      ) ) { _parameters.imageIndex_0 = 3;        } 
                else if ( _userInterface.buttonPressed( "img 4"      ) ) { _parameters.imageIndex_0 = 4;        } 
                else if ( _userInterface.buttonPressed( "img 5"      ) ) { _parameters.imageIndex_0 = 5;        } 
                else if ( _userInterface.buttonPressed( "img 6"      ) ) { _parameters.imageIndex_0 = 6;        } 
                else if ( _userInterface.buttonPressed( "img 7"      ) ) { _parameters.imageIndex_0 = 7;        } 
                else if ( _userInterface.buttonPressed( "img 8"      ) ) { _parameters.imageIndex_0 = 8;        } 
            }
            if ( _selectedSpecies == 1 )
            {
                     if ( _userInterface.buttonPressed( "freeze"     ) ) { _parameters.usePhysics_1 = false;    } 
                else if ( _userInterface.buttonPressed( "unfreeze"   ) ) { _parameters.usePhysics_1 = true;     } 
                else if ( _userInterface.buttonPressed( "img 0"      ) ) { _parameters.imageIndex_1 = 0;        } 
                else if ( _userInterface.buttonPressed( "img 1"      ) ) { _parameters.imageIndex_1 = 1;        } 
                else if ( _userInterface.buttonPressed( "img 2"      ) ) { _parameters.imageIndex_1 = 2;        } 
                else if ( _userInterface.buttonPressed( "img 3"      ) ) { _parameters.imageIndex_1 = 3;        } 
                else if ( _userInterface.buttonPressed( "img 4"      ) ) { _parameters.imageIndex_1 = 4;        } 
                else if ( _userInterface.buttonPressed( "img 5"      ) ) { _parameters.imageIndex_1 = 5;        } 
                else if ( _userInterface.buttonPressed( "img 6"      ) ) { _parameters.imageIndex_1 = 6;        } 
                else if ( _userInterface.buttonPressed( "img 7"      ) ) { _parameters.imageIndex_1 = 7;        } 
                else if ( _userInterface.buttonPressed( "img 8"      ) ) { _parameters.imageIndex_1 = 8;        } 
            }
            if ( _selectedSpecies == 2 )
            {
                     if ( _userInterface.buttonPressed( "freeze"     ) ) { _parameters.usePhysics_2 = false;    } 
                else if ( _userInterface.buttonPressed( "unfreeze"   ) ) { _parameters.usePhysics_2 = true;     } 
                else if ( _userInterface.buttonPressed( "img 0"      ) ) { _parameters.imageIndex_2 = 0;        } 
                else if ( _userInterface.buttonPressed( "img 1"      ) ) { _parameters.imageIndex_2 = 1;        } 
                else if ( _userInterface.buttonPressed( "img 2"      ) ) { _parameters.imageIndex_2 = 2;        } 
                else if ( _userInterface.buttonPressed( "img 3"      ) ) { _parameters.imageIndex_2 = 3;        } 
                else if ( _userInterface.buttonPressed( "img 4"      ) ) { _parameters.imageIndex_2 = 4;        } 
                else if ( _userInterface.buttonPressed( "img 5"      ) ) { _parameters.imageIndex_2 = 5;        } 
                else if ( _userInterface.buttonPressed( "img 6"      ) ) { _parameters.imageIndex_2 = 6;        } 
                else if ( _userInterface.buttonPressed( "img 7"      ) ) { _parameters.imageIndex_2 = 7;        } 
                else if ( _userInterface.buttonPressed( "img 8"      ) ) { _parameters.imageIndex_2 = 8;        } 
            }
        }
        else
        {
            if ( _userInterface.buttonPressed( "flip to hack" ) )
            {
                buttonSelected = true;
                _flipped = true;
                _userInterface.setButtonActive( "flip to hack", false );
                _userInterface.setPanelActive ( "hack panel",     true  );
                _userInterface.setButtonActive( "flip back",     true  );
                _userInterface.setLabelActive ( "Hack this Game!", true );
                _userInterface.setLabelActive ( "Choose a background...", true );

                _userInterface.setButtonActive( "bg 1", true );
                _userInterface.setButtonActive( "bg 2", true );
                _userInterface.setButtonActive( "bg 3", true );
                //_userInterface.setButtonActive( "bg 4", true );

                _userInterface.setLabelActive( "Choose which species of ball to hack...", true );
                _userInterface.setButtonActive( "species 1", true );
                _userInterface.setButtonActive( "species 2", true );
                _userInterface.setButtonActive( "species 3", true );

                _userInterface.setLabelActive ( "attractions/repulsions between species", true );
                _userInterface.setSliderActive( "0",             true  );
                _userInterface.setSliderActive( "1",             true  );
                _userInterface.setSliderActive( "2",             true  );

                _userInterface.setLabelActive ( "physics parameters...", true );
                _userInterface.setSliderActive( "radius",         true  );
                _userInterface.setSliderActive( "gravity",         true  );
                _userInterface.setSliderActive( "collision",     true  );
                _userInterface.setSliderActive( "air friction", true  );

                _userInterface.setLabelActive ( "physics", true );
                _userInterface.setButtonActive( "freeze",  true );
                _userInterface.setButtonActive( "unfreeze", true );

                _userInterface.setLabelActive ( "ball image...", true );
                _userInterface.setButtonActive( "img 0", true );
                _userInterface.setButtonActive( "img 1", true );
                _userInterface.setButtonActive( "img 2", true );
                _userInterface.setButtonActive( "img 3", true );
                _userInterface.setButtonActive( "img 4", true );
                _userInterface.setButtonActive( "img 5", true );
                _userInterface.setButtonActive( "img 6", true );
                _userInterface.setButtonActive( "img 7", true );
                _userInterface.setButtonActive( "img 8", true );
                
               _userInterface.setButtonActive( "move tool on",    true );
               _userInterface.setButtonActive( "move tool off",   true );
               _userInterface.setButtonActive( "fling tool on",   true );
               _userInterface.setButtonActive( "fling tool off",  true );
               _userInterface.setButtonActive( "create tool on",  true );
               _userInterface.setButtonActive( "create tool off", true );
               _userInterface.setButtonActive( "delete tool on",  true );
               _userInterface.setButtonActive( "delete tool off", true );
            }
        }        
        
        //---------------------------------------------
        // update sliders to reflect parameter values
        //---------------------------------------------
        this.updateSliders( _selectedSpecies );    
        
        return nameOfButtonPressed;
    }


    //----------------------------------
    this.setMouseMove = function( x, y )
    {
        _userInterface.setMouseMove( x, y );
        
        if ( _userInterface.getTweakedSlider() != -1 )
        {                
            this.getValuesFromSliders();
        }
    }
    
    //----------------------------------
    this.setMouseUp = function( x, y )
    {
        _userInterface.setMouseUp( x, y );
    }

    //-------------------------
    this.render = function()
    {
        if ( _flipped )
        {
            canvas.drawImage( _hackOverlay, 0, 0, canvasID.width, canvasID.height );
        }
            
        _userInterface.render();
    }
}
