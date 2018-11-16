var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";


var QUEST_FIZZICS1 =  10;
var QUEST_FIZZICS2 =  11;


//--------------------------
function Game()
{    
    var SUCCESS_BALL_RADIUS = 100.0;
    
    function InfoPanel()
    {    
        this.image  = new Image();
        this.width  = 0;
        this.height = 0;
        this.x      = 0;
        this.y      = 0;
    }
    
    var _level         = 0;
    var _score         = 0;
    var _ballDied      = false;
    var _levelboard    = new InfoPanel();
    var _scoreboard    = new InfoPanel();
    //var _flingboard    = new InfoPanel();
    var _successScreen = new InfoPanel();
    var _levelData     = null;
    var _sucessBall    = new Image();
    
    this.addScore = function( delta )
    {
        _score += delta;
    }

    this.setBallDied = function()
    {
        _ballDied = true;
    }

    //----------------------------------------
    this.setLevelData = function( levelData )
    {                
        _levelData = levelData;
    }	


    //--------------------------------------------
    this.okayToChooseNextLevel = function( x, y )
    {
        if (( x > _successScreen.x )
        &&  ( x < _successScreen.x + _successScreen.width )
        &&  ( y > _successScreen.y )
        &&  ( y < _successScreen.y + _successScreen.height ))
        {
            return gameState.success;
        }    
    
        return false;
    }
    
    //----------------------------------------------------------------------------------
    this.setLevel = function( parent, levelID, collisionBalls, ballsWithSomeCollision )
    {                
        _level = levelID;
        _score = 0;
        _ballDied = false;
        
        gameState.numFlings = 0;
        gameState.running   = true; 
        gameState.success   = false; 
        
        if (_level < _levelData.levels.length)
        {
            this.applyLevel( _levelData.levels[_level], parent );
        }        
  
        else if ( _level == QUEST_FIZZICS1 )
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
            globalParameters.friction_1         = 1.0;
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
            globalParameters.imageIndex_3        = 1;
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
            globalParameters.imageIndex_4        = 0;
            globalParameters.socialForce_4_0     = -10.0;
            globalParameters.socialForce_4_1     =  0.0;
            globalParameters.socialForce_4_2     =  0.0;
            globalParameters.touchDeath_4_0     = false;
            globalParameters.touchDeath_4_1     = false;
            globalParameters.touchDeath_4_2     = false;
            globalParameters.deathEffect_4_0     = 2;
            globalParameters.deathEffect_4_1     = 2;
            globalParameters.deathEffect_4_2    = 2;
            
        
            var r = 300;
            this.createBallCircle( parent, 0.5 * canvasID.width, 0.5 * canvasID.height, 1, r, 20 );

            var period = 50; // how many time steps are used to run this test?
            this.initializeGameState( period, 0, 0, collisionBalls, ballsWithSomeCollision  );
        }

        else if ( _level == QUEST_FIZZICS2 )
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

        //------------------------------------------------------------------------------
        // set up levelboard, scoreboard and flingboard
        //------------------------------------------------------------------------------
        _levelboard.width  = 120;
        _levelboard.height = 40;
        _levelboard.x      = canvasID.width * ONE_HALF - _levelboard.width/2;
        _levelboard.y      = 0;
        _levelboard.image.src = "images/levelboard.png";

        _scoreboard.width  = 120;
        _scoreboard.height = 40;
        _scoreboard.x      = _levelboard.x + _levelboard.width;
        _scoreboard.y      = 0;
        _scoreboard.image.src = "images/scoreboard.png";

        /*
        _flingboard.width  = 120;
        _flingboard.height = 40;
        _flingboard.x      = _scoreboard.x + _scoreboard.width;
        _flingboard.y      = _scoreboard.y;
        _flingboard.image.src = "images/flingboard.png";
        */
        _successScreen.width  = 818 * 0.5;
        _successScreen.height = 1024 * 0.5;
        _successScreen.x      = canvasID.width  * ONE_HALF - _successScreen.width  * ONE_HALF;
        _successScreen.y      = canvasID.height * ONE_HALF - _successScreen.height * ONE_HALF;
        _successScreen.image.src = "images/success-screen.png";
    }        
    
    
      
    //-------------------------------------------
    this.applyLevel = function( level, parent )
    {
        globalParameters.backgroundImageIndex = parseInt( level.background );
        
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
            globalParameters.radius_0           = 40;
            globalParameters.gravity_0          = 0.0
            globalParameters.collision_0        = 0.9;
            globalParameters.friction_0         = 0.5;
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
            globalParameters.deathSoundGood_0   = 0;
            globalParameters.deathSoundBad_0    = 0;

            globalParameters.usePhysics_1       = false;
            globalParameters.radius_1           = 60;
            globalParameters.gravity_1          = 0.0
            globalParameters.collision_1        = 0.2;
            globalParameters.friction_1         = 0.05;
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

            globalParameters.usePhysics_2       = true;
            globalParameters.radius_2           = 60;
            globalParameters.gravity_2          = 0.0
            globalParameters.collision_2        = 0.5;
            globalParameters.friction_2         = 0.7;
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
            globalParameters.friction_3         = 0.05;
            globalParameters.imageIndex_3       = 4;
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
            globalParameters.radius_4           = 25;
            globalParameters.gravity_4          = 0.0
            globalParameters.collision_4        = 0.2;
            globalParameters.friction_4         = 0.4;
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
            globalParameters.deathSoundGood_4   = 0;
            globalParameters.deathSoundBad_4    = 0;
        }
        
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
    
      
    //---------------------------------
    this.getCurrentLevel = function()
    {           
        return _level;
    }
    
    
    //------------------------------
    this.getNextLevel = function()
    {           
        return ( _level + 1 ) % _levelData.levels.length;
    }
    
    //------------------------------
    this.getPrevLevel = function()
    {           
        var levelIndex = _level - 1;
        if (levelIndex < 0)
            levelIndex += _levelData.levels.length;
        return levelIndex;
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
        gameState.numCollisions       = 0;
        gameState.numFlings           = 0;
        gameState.totalCollisionCount = 0;

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
    this.update = function( collisionBalls, ballsWithSomeCollision, numBalls, balls )
    {        
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
                if ( globalParameters.type0BallCount == 0 && !_ballDied)
                {   
                    gameState.running = false;
                    gameState.success = true;
                    //_scoreboard.image.src = "images/scoreboard-win.png";
                }
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

                gameState.totalCollisionCount = 0;
            
                for (var i=0; i<MAX_BALLS; i++)
                {	
                    if ( ballsWithSomeCollision[i])
                    {
                        gameState.totalCollisionCount++;
                    }
                }

                if (!gameState.quest0Success)
                {
                    globalParameters.quest0Success = this.isQuest0GoalReached();
                }
            
                if (!gameState.quest1Success)
                {
                    globalParameters.quest1Success = this.isQuest1GoalReached();
                }

                gameState.clock ++;
                if ( gameState.clock > gameState.period )
                {
                    gameState.clock = 0;
                    gameState.numCollisions    = 0;    
                
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
        if (globalParameters.type1BallCount < 20)
            return false;

        if ( gameState.totalCollisionCount > 0 )
        {
            //console.log( "Collisions " + gameState.totalCollisionCount);
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
    
    //------------------------
    this.render = function()
    {
        canvas.fillStyle = "rgb( 255, 255, 255 )"
    
        //--------------------------------------
        // render levelboard
        //--------------------------------------
        canvas.drawImage
        ( 
            _levelboard.image, 
            _levelboard.x,
            _levelboard.y, 
            _levelboard.width, 
            _levelboard.height
        );
        
        canvas.font = "17px Arial";
        var l = _level+1;
        canvas.fillText( "Level " + l.toString(), _levelboard.x + 15, _levelboard.y + 25 );

        //--------------------------------------
        // render scoreboard
        //--------------------------------------
        canvas.drawImage
        ( 
            _scoreboard.image, 
            _scoreboard.x,
            _scoreboard.y, 
            _scoreboard.width, 
            _scoreboard.height
        );
        
        canvas.font = "14px Arial"; canvas.fillText( "score", _scoreboard.x + 20, _scoreboard.y + 25 );
        canvas.font = "20px Arial"; canvas.fillText( _score.toString(), _scoreboard.x + 70, _scoreboard.y + 25 );
        
        /*
        //--------------------------------------
        // render flingboard
        //--------------------------------------
        canvas.drawImage
        ( 
            _flingboard.image, 
            _flingboard.x,
            _flingboard.y, 
            _flingboard.width, 
            _flingboard.height
        );
        canvas.font = "14px Arial"; canvas.fillText( "flings", _flingboard.x + 20, _flingboard.y + 25 );
        canvas.font = "20px Arial"; canvas.fillText( gameState.numFlings.toString(), _flingboard.x + 70, _flingboard.y + 25 );
        */
        //--------------------------------------
        // render success screen
        //--------------------------------------
        if ( gameState.success )
        {
            canvas.drawImage
            ( 
                _successScreen.image, 
                _successScreen.x,
                _successScreen.y, 
                _successScreen.width, 
                _successScreen.height
            );

            //--------------------------------------
            // render success ball
            //--------------------------------------
            _sucessBall.src = "images/ball-" + globalParameters.imageIndex_0 + ".png";
            canvas.drawImage
            ( 
                _sucessBall, 
                canvasID.width  * ONE_HALF - SUCCESS_BALL_RADIUS * ONE_HALF,
                canvasID.height * ONE_HALF - SUCCESS_BALL_RADIUS * ONE_HALF - 40,
                SUCCESS_BALL_RADIUS, 
                SUCCESS_BALL_RADIUS
            );            
        }
    }
}

