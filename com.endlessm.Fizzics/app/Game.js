var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";


var QUEST_FIZZICS1 =  1000;
var QUEST_FIZZICS2 =  1001;

var FONT_SIZE_SCALE = 0.45;
var FONT_Y_SCALE    = 0.65;
var UI_SCALE        = 0.4;

var GAME_ACTION_NULL        = -1;
var GAME_ACTION_RESET_LEVEL =  0;
var GAME_ACTION_NEXT_LEVEL  =  1;
var GAME_ACTION_PREV_LEVEL  =  2;


//--------------------------
function Game()
{
    var SUCCESS_BALL_RADIUS = 100.0;
    
    function UIElement()
    {    
        this.image         = new Image();
        this.imageHover    = new Image();
        this.imageDisabled = new Image();
        this.width   = 0;
        this.height  = 0;
        this.x       = 0;
        this.y       = 0;
        this.hover   = false;
        this.enabled = false;
    }
    
    var _level           = 0;
    var _score           = 0;
    var _ballDied        = false;
    var _ballReachedGoal = false;
    var _levelboard      = new UIElement();
    var _previousButton  = new UIElement();
    var _resetButton     = new UIElement();
    var _nextButton      = new UIElement();
    var _scoreboard      = new UIElement();
    var _flingboard      = new UIElement();
    var _successScreen   = new UIElement();
    var _levelData       = null;
    var _sucessBall      = new Image();
    
    this.setBallDied = function()
    {
        _ballDied = true;
        globalParameters.ballDied = true;
    }

    this.setBallReachedGoal = function()
    {
        _ballReachedGoal = true;
    }

    //----------------------------------------
    this.setLevelData = function( levelData )
    {                
        _levelData = levelData;
    }	


    
    //-------------------------------------------
    this.getMouseMoveAction = function( x, y )
    {
        //-----------------------------------
        // reset button
        //-----------------------------------
        if ( _resetButton.enabled )
        {
            if (( x > _resetButton.x )
            &&  ( x < _resetButton.x + _resetButton.width )
            &&  ( y > _resetButton.y )
            &&  ( y < _resetButton.y + _resetButton.height ))
            {
                if ( !_resetButton.hover )
                {
                    _resetButton.hover = true;
                }    
            }
            else if ( _resetButton.hover )
            {
                _resetButton.hover = false;
            }
        }

        //-----------------------------------
        // next button
        //-----------------------------------
        if ( _nextButton.enabled )
        {
            if (( x > _nextButton.x )
            &&  ( x < _nextButton.x + _nextButton.width )
            &&  ( y > _nextButton.y )
            &&  ( y < _nextButton.y + _nextButton.height ))
            {
                if ( !_nextButton.hover )
                {
                    _nextButton.hover = true;
                }
            }
            else if ( _nextButton.hover )
            {
                _nextButton.hover = false;
            }
        }

        //-----------------------------------
        // previous button
        //-----------------------------------
        if ( _previousButton.enabled )
        {
            if (( x > _previousButton.x )
            &&  ( x < _previousButton.x + _previousButton.width )
            &&  ( y > _previousButton.y )
            &&  ( y < _previousButton.y + _previousButton.height ))
            {
                if ( !_previousButton.hover )
                {
                    _previousButton.hover = true;
                }
            }
            else if ( _previousButton.hover )
            {
                _previousButton.hover = false;
            }
        }
    }
    
    
    //-------------------------------------------
    this.getMouseDownAction = function( x, y )
    {
        var action = GAME_ACTION_NULL;
        
        if (( x > _successScreen.x )
        &&  ( x < _successScreen.x + _successScreen.width )
        &&  ( y > _successScreen.y )
        &&  ( y < _successScreen.y + _successScreen.height ))
        {
            if ( gameState.success )
            {
                action = GAME_ACTION_NEXT_LEVEL;
            }    
        }
        
        //-----------------------------------
        // reset button
        //-----------------------------------
        if ( _resetButton.enabled )
        {
            if (( x > _resetButton.x )
            &&  ( x < _resetButton.x + _resetButton.width )
            &&  ( y > _resetButton.y )
            &&  ( y < _resetButton.y + _resetButton.height ))
            {
                action = GAME_ACTION_RESET_LEVEL;   
            }
        }
                
        //-----------------------------------
        // previous button
        //-----------------------------------
        if ( _previousButton.enabled )
        {
            if (( x > _previousButton.x )
            &&  ( x < _previousButton.x + _previousButton.width )
            &&  ( y > _previousButton.y )
            &&  ( y < _previousButton.y + _previousButton.height ))
            {
                action = GAME_ACTION_PREV_LEVEL;    
            }
        }

        //-----------------------------------
        // next button
        //-----------------------------------
        if ( _nextButton.enabled )
        {
            if (( x > _nextButton.x )
            &&  ( x < _nextButton.x + _nextButton.width )
            &&  ( y > _nextButton.y )
            &&  ( y < _nextButton.y + _nextButton.height ))
            {
                action = GAME_ACTION_NEXT_LEVEL;    
            }
        }
                
        return action;
    }
    
    
    //----------------------------------------
    this.initializeUserInterface = function()
    {                
        //-------------------------------------------
        // set up UI layout
        //-------------------------------------------
        _levelboard.width      = 668  * UI_SCALE;
        _levelboard.height     = 138  * UI_SCALE;

        _resetButton.width     = 106  * UI_SCALE;
        _resetButton.height    = 106  * UI_SCALE;

        _previousButton.width  = 126  * UI_SCALE;
        _previousButton.height = 106  * UI_SCALE;

        _nextButton.width      = 126  * UI_SCALE;
        _nextButton.height     = 106  * UI_SCALE;

        _scoreboard.width      = 264  * UI_SCALE;
        _scoreboard.height     = 138  * UI_SCALE;

        _flingboard.width      = 306  * UI_SCALE;
        _flingboard.height     = 138  * UI_SCALE;

        _successScreen.width   =  908 * UI_SCALE;
        _successScreen.height  = 1494 * UI_SCALE;
        
        var buttonHeight = _levelboard.y + _levelboard.height * 0.1;

        var left = canvasID.width * ONE_HALF - ( _levelboard.width + _scoreboard.width + _flingboard.width ) * ONE_HALF;
        var top = 0;
        
        _levelboard.x = left;
        _scoreboard.x = _levelboard.x + _levelboard.width;
        _flingboard.x = _scoreboard.x + _scoreboard.width;

        _previousButton.x = _levelboard.x + _levelboard.width * 0.02;
        _resetButton.x    = _levelboard.x + _levelboard.width * 0.65;
        _nextButton.x     = _levelboard.x + _levelboard.width * 0.8;
        
        _levelboard.y = top;
        _scoreboard.y = top;
        _flingboard.y = top;

        _previousButton.y = buttonHeight;
        _resetButton.y    = buttonHeight;
        _nextButton.y     = buttonHeight;
        
        _successScreen.x = canvasID.width  * ONE_HALF - _successScreen.width  * ONE_HALF;
        _successScreen.y = canvasID.height * ONE_HALF - _successScreen.height * ONE_HALF;
        
        _levelboard.hover     = false;
        _resetButton.hover    = false;
        _previousButton.hover = false;
        _nextButton.hover     = false;
        _scoreboard.hover     = false;
        _flingboard.hover     = false;
        _successScreen.hover  = false;        

        _levelboard.enabled     = true;
        _resetButton.enabled    = true;
        _previousButton.enabled = true;
        _nextButton.enabled     = true;
        _scoreboard.enabled     = true;
        _flingboard.enabled     = true;
        _successScreen.enabled  = true;        
        
        _levelboard.image.src             = "images/level_background.png";

        _resetButton.image.src            = "images/reset_enabled.png";
        _resetButton.imageDisabled.src    = "images/reset_disabled.png";
        _resetButton.imageHover.src       = "images/reset_hover.png";

        _previousButton.image.src         = "images/prev_enabled.png";
        _previousButton.imageDisabled.src = "images/prev_disabled.png";
        _previousButton.imageHover.src    = "images/prev_hover.png";

        _nextButton.image.src             = "images/next_enabled.png";
        _nextButton.imageDisabled.src     = "images/next_disabled.png";
        _nextButton.imageHover.src        = "images/next_hover.png";

        _scoreboard.image.src             = "images/score_background.png";
        _flingboard.image.src             = "images/flings_background.png";
        _successScreen.image.src          = "images/success-screen.png";
    }
    
    
    //----------------------------------------------------------------------------------
    this.setLevel = function( parent, levelID, collisionBalls, ballsWithSomeCollision )
    {                
        _level = levelID;
        if (_level < QUEST_FIZZICS1)
            localStorage.furthestLevel = Math.max(_level, localStorage.furthestLevel);

        _score = 0;
        _ballDied = false;
        
        gameState.numFlings = 0;
        gameState.numBonus  = 0;
        gameState.running   = true; 
        gameState.success   = false; 
        _successScreen.enabled = false;
        

        if (_level >= QUEST_FIZZICS1)
        {
            this.setPreviousButtonEnabled(false);
            this.setNextButtonEnabled(false);
        }
        else
        {
            this.setPreviousButtonEnabled(_level > 0);
            this.setNextButtonEnabled(_level < localStorage.furthestLevel);
        }

        if (_level < _levelData.levels.length)
        {
            this.applyLevel( _levelData.levels[_level], parent );
        }        
  
        else if ( _level == QUEST_FIZZICS1 )
        {        
            var r = 300;
            this.createBallCircle( parent, 0.5 * canvasID.width, 0.5 * canvasID.height, 1, r, 20 );

            var period = 50; // how many time steps are used to run this test?
            this.initializeGameState( period, 0, 0, collisionBalls, ballsWithSomeCollision  );
        }

        else if ( _level == QUEST_FIZZICS2 )
        {
            posX = 1200;
            parent.createBall( posX, WINDOW_HEIGHT * ONE_HALF, 1 );
            
            var num = 10;
            for (var i=0; i<num; i++)
            {
                var a = ( i / num ) * PI2;
                var r = 150.0 + 130.0 * Math.random();
                var x = posX + r * Math.sin(a);
                var y = WINDOW_HEIGHT * ONE_HALF + r * Math.cos(a);
                parent.createBall( x, y, 0 );
            }

            //------------------------------------------------------------------------
            // set up the game state to detect collisions between species...
            //------------------------------------------------------------------------
            var period = 5;             // how many time steps are used to run this test?   
            var collisionSpecies = 0;   // which species of balls do we care about for collisions?
            var numCollisionsGoal = 10;     // how many unique balls do we want to test for collisions?
            this.initializeGameState( period, collisionSpecies, numCollisionsGoal, collisionBalls, ballsWithSomeCollision );
        }
    }

    
    
      
    //-------------------------------------------
    this.applyLevel = function( level, parent )
    {
        globalParameters.backgroundImageIndex = parseInt( level.background );
        
        for (var b=0; b<level.balls.length; b++ )
        {
            parent.createBall
            ( 
                parseInt  ( level.balls[b].x       ), 
                parseInt  ( level.balls[b].y       ), 
                parseInt  ( level.balls[b].species )
            );         
        }
                    
        gameState.testSpecies       = parseInt( level.testSpecies       );
        gameState.collisionSpecies  = parseInt( level.collisionSpecies  );
        gameState.numCollisionsGoal = parseInt( level.numCollisionsGoal );
        gameState.numCollisions     = parseInt( level.numCollisions     );
    }

    this.getLevelCount = function()
    {
        return _levelData.levels.length;
    }
      

    this.setLevelGlobalParams = function( levelID )
    {                
        if ( levelID == QUEST_FIZZICS1 )
        {
            globalParameters.backgroundImageIndex = 0;

            globalParameters.radius_0       = 30.0;
            globalParameters.gravity_0      = 100.0;
            globalParameters.collision_0        = 0.2;
            globalParameters.friction_0         = 1.0;
            globalParameters.usePhysics_0       = true;
            globalParameters.imageIndex_0       = 0;
            globalParameters.socialForce_0_0    = 0.0;
            globalParameters.socialForce_0_1    = 0.0;
            globalParameters.socialForce_0_2    = 0.0;
            globalParameters.touchDeath_0_0     = false;
            globalParameters.touchDeath_0_1     = false;
            globalParameters.touchDeath_0_2     = false;
            globalParameters.deathEffect_0_0    = 0;
            globalParameters.deathEffect_0_1    = 0;
            globalParameters.deathEffect_0_2    = 0;

            // parameters for species 1 balls
            globalParameters.radius_1       = 70.0;
            globalParameters.gravity_1      = 100.0;
            globalParameters.collision_1        = 0.2;
            globalParameters.friction_1         = 5;
            globalParameters.usePhysics_1       = true;
            globalParameters.imageIndex_1       = 1;
            globalParameters.socialForce_1_0    = 0.0;
            globalParameters.socialForce_1_1    = 0.0;
            globalParameters.socialForce_1_2    = 0.0;
            globalParameters.touchDeath_1_0     = false;
            globalParameters.touchDeath_1_1     = false;
            globalParameters.touchDeath_1_2     = false;
            globalParameters.deathEffect_1_0    = 0;
            globalParameters.deathEffect_1_1    = 0;
            globalParameters.deathEffect_1_2    = 0;

            // parameters for species 2 balls
            globalParameters.radius_2       = 10.0;
            globalParameters.gravity_2      = 100.0;
            globalParameters.collision_2        = 0.2;
            globalParameters.friction_2         = 1.0;
            globalParameters.usePhysics_2       = true;
            globalParameters.imageIndex_2       = 2;
            globalParameters.socialForce_2_0    = 0.0;
            globalParameters.socialForce_2_1    = 0.0;
            globalParameters.socialForce_2_2    = 0.0;
            globalParameters.touchDeath_2_0     = false;
            globalParameters.touchDeath_2_1     = false;
            globalParameters.touchDeath_2_2     = false;
            globalParameters.deathEffect_2_0    = 0;
            globalParameters.deathEffect_2_1    = 0;
            globalParameters.deathEffect_2_2    = 0;
            
            // parameters for species 3 balls
            globalParameters.radius_3             = 30.0;
            globalParameters.gravity_3             = 0.0;
            globalParameters.collision_3         = 0.2;
            globalParameters.friction_3         = 2.0;
            globalParameters.usePhysics_3         = true;
            globalParameters.imageIndex_3        = 3;
            globalParameters.socialForce_3_0     = -10.0;
            globalParameters.socialForce_3_1     =  0.0;
            globalParameters.socialForce_3_2     =  0.0;
            globalParameters.touchDeath_3_0     = false;
            globalParameters.touchDeath_3_1     = false;
            globalParameters.touchDeath_3_2     = false;
            globalParameters.deathEffect_3_0     = 2;
            globalParameters.deathEffect_3_1     = 2;
            globalParameters.deathEffect_3_2    = 2;
                    
            // parameters for species 4 balls
            globalParameters.radius_4             = 30.0;
            globalParameters.gravity_4             = 0.0;
            globalParameters.collision_4         = 0.2;
            globalParameters.friction_4         = 2.0;
            globalParameters.usePhysics_4         = true;
            globalParameters.imageIndex_4        = 4;
            globalParameters.socialForce_4_0     = -10.0;
            globalParameters.socialForce_4_1     =  0.0;
            globalParameters.socialForce_4_2     =  0.0;
            globalParameters.touchDeath_4_0     = false;
            globalParameters.touchDeath_4_1     = false;
            globalParameters.touchDeath_4_2     = false;
            globalParameters.deathEffect_4_0     = 2;
            globalParameters.deathEffect_4_1     = 2;
            globalParameters.deathEffect_4_2    = 2;
        }

        else if ( levelID == QUEST_FIZZICS2 )
        {
            globalParameters.backgroundImageIndex = 0;

            globalParameters.radius_0           = 30.0;
            globalParameters.gravity_0          = 100.0;
            globalParameters.collision_0        = 0.2;
            globalParameters.friction_0         = 1.0;
            globalParameters.usePhysics_0       = true;
            globalParameters.imageIndex_0       = 0;
            globalParameters.socialForce_0_0    = 0.0;
            globalParameters.socialForce_0_1    = 0.0;
            globalParameters.socialForce_0_2    = 0.0;
            globalParameters.touchDeath_0_0     = false;
            globalParameters.touchDeath_0_1     = false;
            globalParameters.touchDeath_0_2     = false;
            globalParameters.deathEffect_0_0    = 0;
            globalParameters.deathEffect_0_1    = 0;
            globalParameters.deathEffect_0_2    = 0;

            // parameters for species 1 balls
            globalParameters.radius_1           = 50.0;
            globalParameters.gravity_1          = 100.0;
            globalParameters.collision_1        = 0.2;
            globalParameters.friction_1         = 1.0;
            globalParameters.usePhysics_1       = true;
            globalParameters.imageIndex_1       = 1;
            globalParameters.socialForce_1_0    =  0.0;
            globalParameters.socialForce_1_1    =  0.0;
            globalParameters.socialForce_1_2    =  0.0;
            globalParameters.touchDeath_1_0     = false;
            globalParameters.touchDeath_1_1     = false;
            globalParameters.touchDeath_1_2     = false;
            globalParameters.deathEffect_1_0    = 0;
            globalParameters.deathEffect_1_1    = 0;
            globalParameters.deathEffect_1_2    = 0;

            // parameters for species 2 balls
            globalParameters.radius_2           = 10.0;
            globalParameters.gravity_2          = 0.0;
            globalParameters.collision_2        = 0.0;
            globalParameters.friction_2         = 0.0;
            globalParameters.usePhysics_2       = false;
            globalParameters.imageIndex_2       = 0;
            globalParameters.socialForce_2_0    = 0.0;
            globalParameters.socialForce_2_1    = 0.0;
            globalParameters.socialForce_2_2    = 0.0;
            globalParameters.touchDeath_2_0     = false;
            globalParameters.touchDeath_2_1     = false;
            globalParameters.touchDeath_2_2     = false;
            globalParameters.deathEffect_2_0    = 0;
            globalParameters.deathEffect_2_1    = 0;
            globalParameters.deathEffect_2_2    = 0;
        }

        else
        {
            var level = _levelData.levels[levelID];

            if (level.species)
            {
                var species = level.species[0];
                globalParameters.usePhysics_0       =           ( species.physics == "true" );
                globalParameters.radius_0           = parseFloat( species.radius       );
                globalParameters.gravity_0          = parseFloat( species.gravity      );
                globalParameters.collision_0        = parseFloat( species.collision    );
                globalParameters.friction_0         = parseFloat( species.friction     );
                globalParameters.imageIndex_0       = parseInt  ( species.imageIndex   );
                globalParameters.socialForce_0_0    = parseFloat( species.socialForce0 );
                globalParameters.socialForce_0_1    = parseFloat( species.socialForce1 );
                globalParameters.socialForce_0_2    = parseFloat( species.socialForce2 );
                globalParameters.socialForce_0_3    = parseFloat( species.socialForce3 );
                globalParameters.socialForce_0_4    = parseFloat( species.socialForce4 );
                globalParameters.touchDeath_0_0     = parseInt  ( species.touchDeath0  );
                globalParameters.touchDeath_0_1     = parseInt  ( species.touchDeath1  );
                globalParameters.touchDeath_0_2     = parseInt  ( species.touchDeath2  );
                globalParameters.touchDeath_0_3     = parseInt  ( species.touchDeath3  );
                globalParameters.touchDeath_0_4     = parseInt  ( species.touchDeath4  );
                globalParameters.deathVisualGood_0  = parseInt  ( species.deathVisual0 );
                globalParameters.deathVisualBad_0   = parseInt  ( species.deathVisual1 );
                globalParameters.deathSoundGood_0   = parseInt  ( species.deathSound0  );
                globalParameters.deathSoundBad_0    = parseInt  ( species.deathSound1  );
                 
                species = level.species[1];
                globalParameters.usePhysics_1       =           ( species.physics == "true" );
                globalParameters.radius_1           = parseFloat( species.radius       );
                globalParameters.gravity_1          = parseFloat( species.gravity      );
                globalParameters.collision_1        = parseFloat( species.collision    );
                globalParameters.friction_1         = parseFloat( species.friction     );
                globalParameters.imageIndex_1       = parseInt  ( species.imageIndex   );
                globalParameters.socialForce_1_0    = parseFloat( species.socialForce0 );
                globalParameters.socialForce_1_1    = parseFloat( species.socialForce1 );
                globalParameters.socialForce_1_2    = parseFloat( species.socialForce2 );
                globalParameters.socialForce_1_3    = parseFloat( species.socialForce3 );
                globalParameters.socialForce_1_4    = parseFloat( species.socialForce4 );
                globalParameters.touchDeath_1_0     = parseInt  ( species.touchDeath0  );
                globalParameters.touchDeath_1_1     = parseInt  ( species.touchDeath1  );
                globalParameters.touchDeath_1_2     = parseInt  ( species.touchDeath2  );
                globalParameters.touchDeath_1_3     = parseInt  ( species.touchDeath3  );
                globalParameters.touchDeath_1_4     = parseInt  ( species.touchDeath4  );
                globalParameters.deathVisualGood_1  = parseInt  ( species.deathVisual0 );
                globalParameters.deathVisualBad_1   = parseInt  ( species.deathVisual1 );
                globalParameters.deathSoundGood_1   = parseInt  ( species.deathSound0  );
                globalParameters.deathSoundBad_1    = parseInt  ( species.deathSound1  );

                species = level.species[2];
                globalParameters.usePhysics_2       =           ( species.physics == "true" );
                globalParameters.radius_2           = parseFloat( species.radius       );
                globalParameters.gravity_2          = parseFloat( species.gravity      );
                globalParameters.collision_2        = parseFloat( species.collision    );
                globalParameters.friction_2         = parseFloat( species.friction     );
                globalParameters.imageIndex_2       = parseInt  ( species.imageIndex   );
                globalParameters.socialForce_2_0    = parseFloat( species.socialForce0 );
                globalParameters.socialForce_2_1    = parseFloat( species.socialForce1 );
                globalParameters.socialForce_2_2    = parseFloat( species.socialForce2 );
                globalParameters.socialForce_2_3    = parseFloat( species.socialForce3 );
                globalParameters.socialForce_2_4    = parseFloat( species.socialForce4 );
                globalParameters.touchDeath_2_0     = parseInt  ( species.touchDeath0  );
                globalParameters.touchDeath_2_1     = parseInt  ( species.touchDeath1  );
                globalParameters.touchDeath_2_2     = parseInt  ( species.touchDeath2  );
                globalParameters.touchDeath_2_3     = parseInt  ( species.touchDeath3  );
                globalParameters.touchDeath_2_4     = parseInt  ( species.touchDeath4  );
                globalParameters.deathVisualGood_2  = parseInt  ( species.deathVisual0 );
                globalParameters.deathVisualBad_2   = parseInt  ( species.deathVisual1 );
                globalParameters.deathSoundGood_2   = parseInt  ( species.deathSound0  );
                globalParameters.deathSoundBad_2    = parseInt  ( species.deathSound1  );

                species = level.species[3];
                globalParameters.usePhysics_3       =           ( species.physics == "true" );
                globalParameters.radius_3           = parseFloat( species.radius       );
                globalParameters.gravity_3          = parseFloat( species.gravity      );
                globalParameters.collision_3        = parseFloat( species.collision    );
                globalParameters.friction_3         = parseFloat( species.friction     );
                globalParameters.imageIndex_3       = parseInt  ( species.imageIndex   );
                globalParameters.socialForce_3_0    = parseFloat( species.socialForce0 );
                globalParameters.socialForce_3_1    = parseFloat( species.socialForce1 );
                globalParameters.socialForce_3_2    = parseFloat( species.socialForce2 );
                globalParameters.socialForce_3_3    = parseFloat( species.socialForce3 );
                globalParameters.socialForce_3_4    = parseFloat( species.socialForce4 );
                globalParameters.touchDeath_3_0     = parseInt  ( species.touchDeath0  );
                globalParameters.touchDeath_3_1     = parseInt  ( species.touchDeath1  );
                globalParameters.touchDeath_3_2     = parseInt  ( species.touchDeath2  );
                globalParameters.touchDeath_3_3     = parseInt  ( species.touchDeath3  );
                globalParameters.touchDeath_3_4     = parseInt  ( species.touchDeath4  );
                globalParameters.deathVisualGood_3  = parseInt  ( species.deathVisual0 );
                globalParameters.deathVisualBad_3   = parseInt  ( species.deathVisual1 );
                globalParameters.deathSoundGood_3   = parseInt  ( species.deathSound0  );
                globalParameters.deathSoundBad_3    = parseInt  ( species.deathSound1  );

                species = level.species[4];
                globalParameters.usePhysics_4       =           ( species.physics == "true" );
                globalParameters.radius_4           = parseFloat( species.radius       );
                globalParameters.gravity_4          = parseFloat( species.gravity      );
                globalParameters.collision_4        = parseFloat( species.collision    );
                globalParameters.friction_4         = parseFloat( species.friction     );
                globalParameters.imageIndex_4       = parseInt  ( species.imageIndex   );
                globalParameters.socialForce_4_0    = parseFloat( species.socialForce0 );
                globalParameters.socialForce_4_1    = parseFloat( species.socialForce1 );
                globalParameters.socialForce_4_2    = parseFloat( species.socialForce2 );
                globalParameters.socialForce_4_3    = parseFloat( species.socialForce3 );
                globalParameters.socialForce_4_4    = parseFloat( species.socialForce4 );
                globalParameters.touchDeath_4_0     = parseInt  ( species.touchDeath0  );
                globalParameters.touchDeath_4_1     = parseInt  ( species.touchDeath1  );
                globalParameters.touchDeath_4_2     = parseInt  ( species.touchDeath2  );
                globalParameters.touchDeath_4_3     = parseInt  ( species.touchDeath3  );
                globalParameters.touchDeath_4_4     = parseInt  ( species.touchDeath4  );
                globalParameters.deathVisualGood_4  = parseInt  ( species.deathVisual0 );
                globalParameters.deathVisualBad_4   = parseInt  ( species.deathVisual1 );
                globalParameters.deathSoundGood_4   = parseInt  ( species.deathSound0  );
                globalParameters.deathSoundBad_4    = parseInt  ( species.deathSound1  );
            }
            else
            {
                // TODO: Check for level.preset later
                globalParameters.usePhysics_0       = true;
                globalParameters.radius_0           = 50;
                globalParameters.gravity_0          = 0.0
                globalParameters.collision_0        = 0.9;
                globalParameters.friction_0         = 5;
                globalParameters.imageIndex_0       = 6;
                globalParameters.socialForce_0_0    = 0;
                globalParameters.socialForce_0_1    = 0;
                globalParameters.socialForce_0_2    = 0;
                globalParameters.socialForce_0_3    = 0;
                globalParameters.socialForce_0_4    = 0;
                globalParameters.touchDeath_0_0     = 0;
                globalParameters.touchDeath_0_1     = 1;
                globalParameters.touchDeath_0_2     = 2;
                globalParameters.touchDeath_0_3     = 0;
                globalParameters.touchDeath_0_4     = 0;
                globalParameters.deathVisualGood_0  = 0;
                globalParameters.deathVisualBad_0   = 1;
                globalParameters.deathSoundGood_0   = 4;
                globalParameters.deathSoundBad_0    = 6;

                globalParameters.usePhysics_1       = false;
                globalParameters.radius_1           = 60;
                globalParameters.gravity_1          = 0.0
                globalParameters.collision_1        = 0.2;
                globalParameters.friction_1         = 10;
                globalParameters.imageIndex_1       = 8;
                globalParameters.socialForce_1_0    = 0;
                globalParameters.socialForce_1_1    = 0;
                globalParameters.socialForce_1_2    = 0;
                globalParameters.socialForce_1_3    = 0;
                globalParameters.socialForce_1_4    = 0;
                globalParameters.touchDeath_1_0     = 0;
                globalParameters.touchDeath_1_1     = 0;
                globalParameters.touchDeath_1_2     = 0;
                globalParameters.touchDeath_1_3     = 0;
                globalParameters.touchDeath_1_4     = 0;
                globalParameters.deathVisualGood_1  = 0;
                globalParameters.deathVisualBad_1   = 0;
                globalParameters.deathSoundGood_1   = 0;
                globalParameters.deathSoundBad_1    = 0;

                globalParameters.usePhysics_2       = false;
                globalParameters.radius_2           = 60;
                globalParameters.gravity_2          = 0.0
                globalParameters.collision_2        = 0.5;
                globalParameters.friction_2         = 10;
                globalParameters.imageIndex_2       = 1;
                globalParameters.socialForce_2_0    = 0;
                globalParameters.socialForce_2_1    = 0;
                globalParameters.socialForce_2_2    = 0;
                globalParameters.socialForce_2_3    = 0;
                globalParameters.socialForce_2_4    = 0;
                globalParameters.touchDeath_2_0     = 0;
                globalParameters.touchDeath_2_1     = 0;
                globalParameters.touchDeath_2_2     = 0;
                globalParameters.touchDeath_2_3     = 0;
                globalParameters.touchDeath_2_4     = 0;
                globalParameters.deathVisualGood_2  = 0;
                globalParameters.deathVisualBad_2   = 0;
                globalParameters.deathSoundGood_2   = 0;
                globalParameters.deathSoundBad_2    = 0;

                globalParameters.usePhysics_3       = false;
                globalParameters.radius_3           = 60;
                globalParameters.gravity_3          = 0.0
                globalParameters.collision_3        = 0.2;
                globalParameters.friction_3         = 10;
                globalParameters.imageIndex_3       = 9;
                globalParameters.socialForce_3_0    = 0;
                globalParameters.socialForce_3_1    = 0;
                globalParameters.socialForce_3_2    = 0;
                globalParameters.socialForce_3_3    = 0;
                globalParameters.socialForce_3_4    = 0;
                globalParameters.touchDeath_3_0     = 0;
                globalParameters.touchDeath_3_1     = 0;
                globalParameters.touchDeath_3_2     = 0;
                globalParameters.touchDeath_3_3     = 0;
                globalParameters.touchDeath_3_4     = 0;
                globalParameters.deathVisualGood_3  = 0;
                globalParameters.deathVisualBad_3   = 0;
                globalParameters.deathSoundGood_3   = 0;
                globalParameters.deathSoundBad_3    = 0;

                globalParameters.usePhysics_4       = true;
                globalParameters.radius_4           = 35;
                globalParameters.gravity_4          = 0.0
                globalParameters.collision_4        = 0.2;
                globalParameters.friction_4         = 10;
                globalParameters.imageIndex_4       = 10;
                globalParameters.socialForce_4_0    = 0;
                globalParameters.socialForce_4_1    = 0;
                globalParameters.socialForce_4_2    = 0;
                globalParameters.socialForce_4_3    = 0;
                globalParameters.socialForce_4_4    = 0;
                globalParameters.touchDeath_4_0     = 1;
                globalParameters.touchDeath_4_1     = 0;
                globalParameters.touchDeath_4_2     = 0;
                globalParameters.touchDeath_4_3     = 0;
                globalParameters.touchDeath_4_4     = 0;
                globalParameters.deathVisualGood_4  = 8;
                globalParameters.deathVisualBad_4   = 0;
                globalParameters.deathSoundGood_4   = 5;
                globalParameters.deathSoundBad_4    = 0;
            }
        }
    }



    //---------------------------------
    this.getCurrentLevel = function()
    {           
        return _level;
    }
    
    //------------------------------
    this.getNextLevel = function()
    {           
        if (_level == _levelData.levels.length-1)
            return _levelData.levels.length-1;
        return _level+1;
    }
    
    //------------------------------
    this.getPrevLevel = function()
    {           
        if (_level == 0)
            return 0;
        return _level - 1;
    }
    

    //----------------------------------------------
    this.setNextButtonEnabled = function( enabled )
    {
        _nextButton.enabled = enabled;
    }



    //----------------------------------------------
    this.setResetButtonEnabled = function( enabled )
    {
        _resetButton.enabled = enabled;
    }


    //----------------------------------------------
    this.setPreviousButtonEnabled = function( enabled )
    {
        _previousButton.enabled = enabled;
    }

        
    //----------------------------------------------------------------------------
    this.createBallCircle = function( parent, x, y, ballType, radius, ballCount )
    {
        for (var i=0; i<ballCount; i++)
        {
            var a = ( i / ballCount ) * PI2;
            var r = radius + 0.5 * radius * Math.random();
            var bx = x + r * Math.sin(a);
            var by = y + r * Math.cos(a);
            parent.createBall( bx, by, ballType );
        }
    }    
    
    //-------------------------------------------------------------------------------------------------------------------------
    this.initializeGameState = function( period, collisionSpecies, numCollisionsGoal, collisionBalls, ballsWithSomeCollision )
    {                
        gameState.testBall            = NULL_BALL;
        gameState.testSpecies         = 0;
        gameState.period              = period;
        gameState.collisionSpecies    = collisionSpecies;
        gameState.numCollisionsGoal   = numCollisionsGoal;
        gameState.running             = true;
        gameState.clock               = 0;
        gameState.timeInLevel         = 0.0;
        gameState.numCollisions       = 0;
        gameState.numFlings           = 0;
        gameState.numBonus            = 0;
        gameState.someCollisionsInPeriod = false;

        globalParameters.quest0Success = false;
        globalParameters.quest1Success = false;
        globalParameters.quest2Success = false;

        for (var c=0; c<gameState.numCollisionsGoal; c++)
        {                            
            collisionBalls[c] = NULL_BALL;
        }            

        for (var i=0; i<MAX_BALLS; i++)
        {
            ballsWithSomeCollision[i] = false;
        }        
        
        _score = 0;
        _ballDied = false;
        gameState.numFlings = 0;
    }    
    
    
    
    //--------------------------------------------------------------------------------
    this.update = function( dt, collisionBalls, ballsWithSomeCollision, numBalls, balls )
    {        
        gameState.timeInLevel += dt;

        if ( gameState.running )
        {
            var type0BallCount = 0;
            var type1BallCount = 0;
            var type2BallCount = 0;
        
            gameState.testBall = NULL_BALL;
        
            for (var i=0; i<numBalls; i++)
            {   
                switch (balls[i].getType())
                {
                    case 0:
                        type0BallCount++;
                        break;
                    case 1:
                        type1BallCount++;
                        gameState.testBall = i;
                        break;
                    case 2:
                        type2BallCount++;
                        break;
                    default:
                        break;  
                }   
            }

            globalParameters.type0BallCount = type0BallCount;
            globalParameters.type1BallCount = type1BallCount;
            globalParameters.type2BallCount = type2BallCount;            

            if ( _level < _levelData.levels.length )
            {
                if ( globalParameters.type0BallCount == 0
                && !_ballDied
                && _ballReachedGoal )
                {   
                    gameState.running = false;
                    gameState.success = true;
                    globalParameters.levelSuccess = true;
                    _successScreen.enabled = true;

                    // to do: this needs to be determined by which species the sound is associated with.
                    // Sounds.play( "fizzics/success1" );
                    Sounds.play( "fizzics/collision/winning" );
                    Sounds.playLoop( "fizzics/you_won" );
                }

                _ballReachedGoal = false;
            }

            // Quest level
            else
            {
                //----------------------------------
                // collect num collisions
                //----------------------------------
                gameState.numCollisions = 0;
                for (var c=0; c<gameState.numCollisionsGoal; c++)
                {                            
                    if ( collisionBalls[c] != NULL_BALL )
                    {
                        gameState.numCollisions ++;
                    }
                }
            
                if (!gameState.someCollisionsInPeriod)
                {
                    for (var i=0; i<MAX_BALLS; i++)
                    {
                        if ( ballsWithSomeCollision[i])
                        {
                            gameState.someCollisionsInPeriod = true;
                            break;
                        }
                    }
                }

                if (!globalParameters.quest0Success)
                {
                    globalParameters.quest0Success = this.isQuest0GoalReached();
                }
            
                if (!globalParameters.quest1Success)
                {
                    globalParameters.quest1Success = this.isQuest1GoalReached();
                }

                gameState.clock ++;
                if ( gameState.clock > gameState.period )
                {
                    gameState.clock = 0;
                    gameState.numCollisions    = 0;    
                    gameState.someCollisionsInPeriod = false;
                
                    for (var c=0; c<gameState.numCollisionsGoal; c++)
                    {                            
                        collisionBalls[c] = NULL_BALL;
                    }   
                 
                    for (var i=0; i<MAX_BALLS; i++)
                    {
                        ballsWithSomeCollision[i] = false;
                    }
                }
            }  

            globalParameters.score = _score;
            globalParameters.currentLevel = _level;
        }    
    }
    
    
    //--------------------------------------
    this.isQuest0GoalReached = function()
    {
        // Don't accept the goal met before 5 seconds are up so things get a chance to settle down
        if (gameState.timeInLevel < 5)
            return false;

        if (gameState.clock < gameState.period-1)
            return false;

        if (globalParameters.type1BallCount < 20)
            return false;

        if ( gameState.someCollisionsInPeriod )
        {
            //console.log( "Some collisions");
            return false;
        }

        //console.log( "Goal met");
        return true;
    }


    //--------------------------------------
    this.isQuest1GoalReached = function()
    {
        if (globalParameters.type1BallCount != 1)
            return false;
    
        if ( gameState.numCollisions >= gameState.numCollisionsGoal )
            return true;
        
        return false;
    }    

    this.getScore = function()
    {
        return 10 - gameState.numFlings + gameState.numBonus;
    }

    //--------------------------
    this.isPositionOverButton = function(x, y)
    {
        const buttons = [ _resetButton, _previousButton, _nextButton,  _successScreen ];

        for (var i = 0, n = buttons.length; i < n; i++)
        {
            const button = buttons[i];
            if ( button.enabled &&
                 x > button.x && x < button.x + button.width &&
                 y > button.y && y < button.y + button.height)
                return true;
        }

        return false;
    }

    this._renderButton = function (b)
    {
        var image;

        if (b.enabled)
            image = b.blinkImage ? b.blinkImage : (b.hover ? b.imageHover : b.image);
        else
            image = b.imageDisabled;

        canvas.drawImageCached ( image, b.x, b.y, b.width, b.height );
    }

    //------------------------
    this.render = function()
    {
        canvas.fillStyle = "rgb( 255, 255, 255 )"
        
        //--------------------------------------
        // render levelboard
        //--------------------------------------
        canvas.drawImageCached
        ( 
            _levelboard.image, 
            _levelboard.x,
            _levelboard.y, 
            _levelboard.width, 
            _levelboard.height
        );
        
        canvas.font = eval( _levelboard.height * FONT_SIZE_SCALE ) + "px Arial";
        var levelString = _level+1;
        if (_level >= QUEST_FIZZICS1)
            levelString = "Ꮘො";
        canvas.fillText( "Level " + levelString, _levelboard.x + _levelboard.width * 0.23, _levelboard.y + _levelboard.height * FONT_Y_SCALE );

        //------------------------------------------------------------
        // if ballDied is true, then make the reset button flash
        //------------------------------------------------------------
        if ( _ballDied )
        {
            const period = 500;
            var timer = (new Date).getTime() % period;

            _resetButton.blinkImage = timer > ( period * ONE_HALF) ? _resetButton.imageHover : _resetButton.image;
        }
        else
        {
            this.setResetButtonEnabled(_resetButton.enabled);   
        }

        //------------------------
        // render reset button
        //------------------------
        this._renderButton (_resetButton);

        //--------------------------------------
        // render previous button
        //--------------------------------------
        this._renderButton (_previousButton);

        //--------------------------------------
        // render next button
        //--------------------------------------
        this._renderButton (_nextButton);

        //--------------------------------------
        // render scoreboard
        //--------------------------------------
        canvas.drawImageCached
        ( 
            _scoreboard.image, 
            _scoreboard.x,
            _scoreboard.y, 
            _scoreboard.width,
            _scoreboard.height
        );        
        canvas.fillText( gameState.numBonus.toString(), _scoreboard.x + _scoreboard.width * 0.6, _scoreboard.y + _scoreboard.height * FONT_Y_SCALE );
        
        
        //--------------------------------------
        // render flingboard
        //--------------------------------------
        canvas.drawImageCached
        ( 
            _flingboard.image, 
            _flingboard.x,
            _flingboard.y, 
            _flingboard.width,
            _flingboard.height
        );
        canvas.fillText( gameState.numFlings.toString(), _flingboard.x + _flingboard.width * 0.6, _flingboard.y + _flingboard.height * FONT_Y_SCALE );

        //--------------------------------------
        // render success screen
        //--------------------------------------
        if ( gameState.success )
        {
            canvas.drawImageCached
            ( 
                _successScreen.image, 
                _successScreen.x,
                _successScreen.y, 
                _successScreen.width, 
                _successScreen.height
            );
            

            var score = this.getScore();
            var scoreX = _successScreen.x + _successScreen.width * 0.61;
            var scoreY = _successScreen.y + _successScreen.height * 0.683;
            canvas.font = "32px Arial";
            canvas.fillText( score.toString(),  scoreX, scoreY );


            var flingX = _successScreen.x + _successScreen.width  * 0.38;
            var bonusX = _successScreen.x + _successScreen.width  * 0.63;
            var fontY  = _successScreen.y + _successScreen.height * 0.76;
            
            canvas.font = "17px Times";
            canvas.fillText( "+ " + gameState.numBonus.toString(),  bonusX, fontY );
            canvas.fillText( "+ " + gameState.numFlings.toString(), flingX, fontY );

            //--------------------------------------
            // render success ball
            //--------------------------------------
            _sucessBall.src = "images/ball-" + globalParameters.imageIndex_0 + ".png";
            canvas.drawImageCached
            ( 
                _sucessBall, 
                _successScreen.x + _successScreen.width/2 - SUCCESS_BALL_RADIUS * ONE_HALF,
                _successScreen.y + _successScreen.height/2 - SUCCESS_BALL_RADIUS * ONE_HALF - 120,
                SUCCESS_BALL_RADIUS, 
                SUCCESS_BALL_RADIUS
            );            
        }
    }
}

