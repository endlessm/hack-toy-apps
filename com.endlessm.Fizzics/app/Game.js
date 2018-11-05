var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var CROQUET_GAME =  0;
var SPACE_GAME   =  1;
var GAME_3       =  2;
var GAME_4       =  3;
var GAME_5       =  4;
var GAME_6       =  5;
var GAME_7       =  6;
var GAME_8       =  7;
var GAME_9       =  8;
var GAME_10      =  9;
var NUM_GAMES    = 10;


//------------------
function Game()
{    
    function Scoreboard()
    {    
        this.image  = new Image();
        this.width  = 0;
        this.height = 0;
        this.x      = 0;
        this.y      = 0;
    }
    
    var _level = 0;
    var _score = 0;
    var _scoreboard = new Scoreboard();
  
  
    //----------------------------------------------------------------------------------
    this.setLevel = function( parent, levelID, collisionBalls, ballsWithSomeCollision )
    {                
        _level = levelID;
        _score = 0;
        
        gameState.running = true; 
        gameState.success = false; 

        //----------------------------------------------------------------
        //----------------------------------------------------------------
        //
        // Croquet Game
        //
        //----------------------------------------------------------------
        //----------------------------------------------------------------
        if ( _level == CROQUET_GAME )
        {
            globalParameters.backgroundImageIndex = 2;

            globalParameters.radius_0           = 40.0;
            globalParameters.gravity_0          = 0.0;
            globalParameters.collision_0        = 0.9;
            globalParameters.friction_0         = 1.0;
            globalParameters.usePhysics_0       = true;
            globalParameters.imageIndex_0       = 6;
            globalParameters.socialForce_0_0    = 0.0;
            globalParameters.socialForce_0_1    = 0.0;
            globalParameters.socialForce_0_2    = 0.0;
            globalParameters.touchDeath_0_0     = false;
            globalParameters.touchDeath_0_1     = true;
            globalParameters.touchDeath_0_2     = true;
            globalParameters.deathVisual_0_0    = 2;
            globalParameters.deathVisual_0_1    = 0;
            globalParameters.deathSound_0_0     = 2;
            globalParameters.deathSound_0_1     = 0;
            
            // parameters for species 1 balls
            globalParameters.radius_1           = 60.0;
            globalParameters.gravity_1          = 0.0;
            globalParameters.collision_1        = 0.2;
            globalParameters.friction_1         = 0.05;
            globalParameters.usePhysics_1       = false;
            globalParameters.imageIndex_1       = 8;
            globalParameters.socialForce_1_0    =  0.0;
            globalParameters.socialForce_1_1    =  0.0;
            globalParameters.socialForce_1_2    =  0.0;
            globalParameters.touchDeath_1_0     = false;
            globalParameters.touchDeath_1_1     = false;
            globalParameters.touchDeath_1_2     = false;
            globalParameters.deathVisual_1_0    = 2;
            globalParameters.deathVisual_1_1    = 0;
            globalParameters.deathSound_1_0     = 2;
            globalParameters.deathSound_1_1     = 0;

            // parameters for species 2 balls
            globalParameters.radius_2             = 10.0;
            globalParameters.gravity_2             = 0.0;
            globalParameters.collision_2         = 0.0;
            globalParameters.friction_2         = 0.0;
            globalParameters.usePhysics_2         = false;
            globalParameters.imageIndex_2        = 0;
            globalParameters.socialForce_2_0     = 0.0;    
            globalParameters.socialForce_2_1     = 0.0;
            globalParameters.socialForce_2_2     = 0.0;    
            globalParameters.touchDeath_2_0     = true;
            globalParameters.touchDeath_2_1     = false;
            globalParameters.touchDeath_2_2     = false;
            globalParameters.deathVisual_2_0    = 0;
            globalParameters.deathVisual_2_1    = 0;
            globalParameters.deathSound_2_0     = 0;
            globalParameters.deathSound_2_1     = 0;
                    
            parent.createBall( 1000, 250, 1 );                    
            parent.createBall(  400, 400, 0 );        
            parent.createBall(  500, 400, 0 );        

            globalParameters.moveToolActive   = false;
            globalParameters.flingToolActive  = true;
            globalParameters.createToolActive = false;
            globalParameters.deleteToolActive = false;
            parent.selectTool( TOOL_FLING );    
            
            gameState.testSpecies           = 0;
            gameState.collisionSpecies      = 1;
            gameState.numCollisionsGoal     = 2;
            gameState.numCollisions         = 0;
        }
        //----------------------------------------------------------------
        //----------------------------------------------------------------
        //
        // Space Game
        //
        //----------------------------------------------------------------
        //----------------------------------------------------------------
        else if ( _level == SPACE_GAME )
        {
            globalParameters.backgroundImageIndex = 1;

            globalParameters.radius_0             = 30.0;
            globalParameters.gravity_0             = 0.0;
            globalParameters.collision_0         = 0.2;
            globalParameters.friction_0         = 2.0;
            globalParameters.usePhysics_0         = true;
            globalParameters.imageIndex_0        = 3;
            globalParameters.socialForce_0_0     = 0.0;
            globalParameters.socialForce_0_1     = -10.0;
            globalParameters.socialForce_0_2     =  0.0;
            globalParameters.touchDeath_0_0     = false;
            globalParameters.touchDeath_0_1     = false;
            globalParameters.touchDeath_0_2     = false;

            // parameters for species 1 balls
            globalParameters.radius_1             = 30.0;
            globalParameters.gravity_1             = 0.0;
            globalParameters.collision_1         = 0.2;
            globalParameters.friction_1         = 2.0;
            globalParameters.usePhysics_1         = true;
            globalParameters.imageIndex_1        = 4;
            globalParameters.socialForce_1_0     =  0.0;
            globalParameters.socialForce_1_1     =  0.0;
            globalParameters.socialForce_1_2     = -10.0;
            globalParameters.touchDeath_1_0     = false;
            globalParameters.touchDeath_1_1     = false;
            globalParameters.touchDeath_1_2     = false;

            // parameters for species 2 balls
            globalParameters.radius_2             = 30.0;
            globalParameters.gravity_2             = 0.0;
            globalParameters.collision_2         = 0.2;
            globalParameters.friction_2         = 2.0;
            globalParameters.usePhysics_2         = true;
            globalParameters.imageIndex_2        = 2;
            globalParameters.socialForce_2_0     = -10.0;    
            globalParameters.socialForce_2_1     =  0.0;
            globalParameters.socialForce_2_2     =  0.0;    
            globalParameters.touchDeath_2_0     = false;
            globalParameters.touchDeath_2_1     = false;
            globalParameters.touchDeath_2_2     = false;

            // parameters for species 3 balls
            globalParameters.radius_3             = 30.0;
            globalParameters.gravity_3             = 0.0;
            globalParameters.collision_3         = 0.2;
            globalParameters.friction_3         = 2.0;
            globalParameters.usePhysics_3         = true;
            globalParameters.imageIndex_3        = 1;
            globalParameters.socialForce_3_0     = 2.0;    
            globalParameters.socialForce_3_1     = 2.0;
            globalParameters.socialForce_3_2     = 2.0;    
            globalParameters.touchDeath_3_0     = false;
            globalParameters.touchDeath_3_1     = false;
            globalParameters.touchDeath_3_2     = false;
                    
            // parameters for species 4 balls
            globalParameters.radius_4             = 30.0;
            globalParameters.gravity_4             = 0.0;
            globalParameters.collision_4         = 0.2;
            globalParameters.friction_4         = 2.0;
            globalParameters.usePhysics_4         = true;
            globalParameters.imageIndex_4        = 0;
            globalParameters.socialForce_4_0     = -10.0;    
            globalParameters.socialForce_4_1     =  2.0;
            globalParameters.socialForce_4_2     =  0.0;    
            globalParameters.touchDeath_4_0     = false;
            globalParameters.touchDeath_4_1     = false;
            globalParameters.touchDeath_4_2     = false;
                    
            parent.createBall( 300, 300, 0 );
            parent.createBall( 400, 300, 1 );
            parent.createBall( 350, 360, 2 );

            globalParameters.moveToolActive   = true;
            globalParameters.flingToolActive  = true;
            globalParameters.createToolActive = true;
            globalParameters.deleteToolActive = true;
            parent.selectTool( TOOL_MOVE );    
        }
        //----------------------------------------------------------------
        //----------------------------------------------------------------
        //
        //  Game 3
        //
        //----------------------------------------------------------------
        //----------------------------------------------------------------
        else if ( _level == GAME_3 )
        {
            globalParameters.backgroundImageIndex = 0;

            globalParameters.radius_0             = 30.0;
            globalParameters.gravity_0             = 100.0;
            globalParameters.collision_0         = 0.2;
            globalParameters.friction_0         = 1.0;
            globalParameters.usePhysics_0         = true;
            globalParameters.imageIndex_0        = 0;
            globalParameters.socialForce_0_0     = 0.0;
            globalParameters.socialForce_0_1     = 0.0;
            globalParameters.socialForce_0_2     = 0.0;
            globalParameters.touchDeath_0_0     = false;
            globalParameters.touchDeath_0_1     = false;
            globalParameters.touchDeath_0_2     = false;
            globalParameters.deathEffect_0_0     = 0;
            globalParameters.deathEffect_0_1     = 0;
            globalParameters.deathEffect_0_2    = 0;

            // parameters for species 1 balls
            globalParameters.radius_1             = 50.0;
            globalParameters.gravity_1             = 100.0;
            globalParameters.collision_1         = 0.2;
            globalParameters.friction_1         = 1.0;
            globalParameters.usePhysics_1         = true;
            globalParameters.imageIndex_1        = 1;
            globalParameters.socialForce_1_0     =  0.0;
            globalParameters.socialForce_1_1     =  0.0;
            globalParameters.socialForce_1_2     =  0.0;
            globalParameters.touchDeath_1_0     = false;
            globalParameters.touchDeath_1_1     = false;
            globalParameters.touchDeath_1_2     = false;
            globalParameters.deathEffect_1_0     = 0;
            globalParameters.deathEffect_1_1     = 0;
            globalParameters.deathEffect_1_2    = 0;

            // parameters for species 2 balls
            globalParameters.radius_2             = 10.0;
            globalParameters.gravity_2             = 0.0;
            globalParameters.collision_2         = 0.0;
            globalParameters.friction_2         = 0.0;
            globalParameters.usePhysics_2         = false;
            globalParameters.imageIndex_2        = 0;
            globalParameters.socialForce_2_0     = 0.0;    
            globalParameters.socialForce_2_1     = 0.0;
            globalParameters.socialForce_2_2     = 0.0;    
            globalParameters.touchDeath_2_0     = false;
            globalParameters.touchDeath_2_1     = false;
            globalParameters.touchDeath_2_2     = false;
            globalParameters.deathEffect_2_0     = 0;
            globalParameters.deathEffect_2_1     = 0;
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
                    
            parent.createBall( WINDOW_WIDTH * ONE_HALF, WINDOW_HEIGHT * ONE_HALF, 1 );
            
            var num = 5;
            for (var i=0; i<num; i++)
            {
                var a = ( i / num ) * PI2;
                var r = 150.0 + 130.0 * Math.random();
                var x = WINDOW_WIDTH  * ONE_HALF + r * Math.sin(a);
                var y = WINDOW_HEIGHT * ONE_HALF + r * Math.cos(a);
                parent.createBall( x, y, 0 );
            }
            
            //------------------------------------------------------------------------
            // set up the game state to detect collisions between species...
            //------------------------------------------------------------------------
            var period = 5;                // how many time steps are used to run this test?     
            var collisionSpecies = 0;     // which species of balls do we care about for collisions?
            var numCollisionsGoal = 10;     // how many unique balls do we want to test for collisions?
            this.initializeGameState( period, collisionSpecies, numCollisionsGoal, collisionBalls, ballsWithSomeCollision );   

            globalParameters.moveToolActive   = true;
            globalParameters.flingToolActive  = true;
            globalParameters.createToolActive = true;
            globalParameters.deleteToolActive = true;
            parent.selectTool( TOOL_MOVE );    
        }
        //----------------------------------------------------------------
        //----------------------------------------------------------------
        //
        //  Game 4
        //
        //----------------------------------------------------------------
        //----------------------------------------------------------------
        else if ( _level == GAME_4 )
        {
            globalParameters.backgroundImageIndex = 0;            

            // parameters for species 0 balls
            globalParameters.radius_0             = 30.0;
            globalParameters.gravity_0             = 20.0;
            globalParameters.collision_0         = 0.2;
            globalParameters.friction_0         = 2.0;
            globalParameters.usePhysics_0         = true;
            globalParameters.socialForce_0_0     = -8.0;
            globalParameters.socialForce_0_1     = 0.0;
            globalParameters.socialForce_0_2     = 0.0;
            globalParameters.touchDeath_0_0     = false;
            globalParameters.touchDeath_0_1     = true;
            globalParameters.touchDeath_0_2     = true;
            globalParameters.deathEffect_0_0     = 0;
            globalParameters.deathEffect_0_1     = 0;
            globalParameters.deathEffect_0_2    = 3;
            globalParameters.imageIndex_0        = 0;
        
            // parameters for species 1 balls
            globalParameters.radius_1             = 50.0;
            globalParameters.gravity_1             = 0.0;
            globalParameters.collision_1         = 0.2;
            globalParameters.friction_1         = 5.0;
            globalParameters.usePhysics_1         = true;
            globalParameters.socialForce_1_0     = -20.0;
            globalParameters.socialForce_1_1     = 0.0;
            globalParameters.socialForce_1_2     = 20.0;
            globalParameters.touchDeath_1_0     = false;
            globalParameters.touchDeath_1_1     = false;
            globalParameters.touchDeath_1_2     = true;
            globalParameters.deathEffect_1_0     = 1;
            globalParameters.deathEffect_1_1     = 1;
            globalParameters.deathEffect_1_2    = 1;
            globalParameters.imageIndex_1        = 1;

            // parameters for species 2 balls
            globalParameters.radius_2             = 30.0;
            globalParameters.gravity_2             = 8.0;
            globalParameters.collision_2         = 0.2;
            globalParameters.friction_2         = 10.0;
            globalParameters.usePhysics_2         = true;
            globalParameters.socialForce_2_0     =  0.0;    
            globalParameters.socialForce_2_1     =  0.0;
            globalParameters.socialForce_2_2     = -10.0;    
            globalParameters.touchDeath_2_0     = false;
            globalParameters.touchDeath_2_1     = false;
            globalParameters.touchDeath_2_2     = false;
            globalParameters.deathEffect_2_0     = 2;
            globalParameters.deathEffect_2_1     = 2;
            globalParameters.deathEffect_2_2    = 2;
            globalParameters.imageIndex_2        = 2;
        
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
            
            //----------------------------
            // create some initial balls  
            //----------------------------
            var r = globalParameters.radius_0;
            var x = 0.0 + r;
            var y = WINDOW_HEIGHT - r;
            var speciesID = 0;
            
            parent.createBall( x + r * 0, y,              speciesID );
            parent.createBall( x + r * 2, y,              speciesID );
            parent.createBall( x + r * 4, y,              speciesID );
            parent.createBall( x + r * 1, y - r * 1.7,    speciesID );
            parent.createBall( x + r * 3, y - r * 1.7,    speciesID );
            parent.createBall( x + r * 2, y - r * 3.4,    speciesID );

            x = WINDOW_WIDTH * ONE_HALF;
            y = 200;
            var s = 130;
            speciesID = 1;
            parent.createBall( x, y + s * 0, speciesID );
            parent.createBall( x, y + s * 1, speciesID );
            parent.createBall( x, y + s * 3, speciesID );
            parent.createBall( x, y + s * 4, speciesID );
        
            var r = globalParameters.radius_2;
            var x = 1000;
            var y = WINDOW_HEIGHT - r;

            parent.createBall( x + r *  0, y, 2 );
            parent.createBall( x + r *  2, y, 2 );
            parent.createBall( x + r *  4, y, 2 );
            parent.createBall( x + r *  6, y, 2 );
            parent.createBall( x + r *  8, y, 2 );
            parent.createBall( x + r * 10, y, 2 );    
            
            globalParameters.moveToolActive   = true;
            globalParameters.flingToolActive  = true;
            globalParameters.createToolActive = true;
            globalParameters.deleteToolActive = true;
            parent.selectTool( TOOL_MOVE );  
        }
        
	// QUEST: Hacky Balls 0
        //----------------------------------------------------------------
        //----------------------------------------------------------------
        //
        //  Game 10
        //
        //----------------------------------------------------------------
        //----------------------------------------------------------------
        else if ( _level == GAME_10 )
        {
            globalParameters.backgroundImageIndex = 0;

            globalParameters.radius_0 		= 30.0;
            globalParameters.gravity_0 		= 100.0;
            globalParameters.collision_0 		= 0.2;
            globalParameters.friction_0 		= 1.0;
            globalParameters.usePhysics_0 		= true;
            globalParameters.imageIndex_0		= 0;
            globalParameters.socialForce_0_0 	= 0.0;
            globalParameters.socialForce_0_1 	= 0.0;
            globalParameters.socialForce_0_2 	= 0.0;
            globalParameters.touchDeath_0_0 	= false;
            globalParameters.touchDeath_0_1 	= false;
            globalParameters.touchDeath_0_2 	= false;
            globalParameters.deathEffect_0_0 	= 0;
            globalParameters.deathEffect_0_1 	= 0;
            globalParameters.deathEffect_0_2	= 0;

            // parameters for species 1 balls
            globalParameters.radius_1 		= 50.0;
            globalParameters.gravity_1 		= 100.0;
            globalParameters.collision_1 		= 0.2;
            globalParameters.friction_1 		= 1.0;
            globalParameters.usePhysics_1 		= true;
            globalParameters.imageIndex_1		= 1;
            globalParameters.socialForce_1_0 	= 0.0;
            globalParameters.socialForce_1_1 	= 0.0;
            globalParameters.socialForce_1_2 	= 0.0;
            globalParameters.touchDeath_1_0 	= false;
            globalParameters.touchDeath_1_1 	= false;
            globalParameters.touchDeath_1_2 	= false;
            globalParameters.deathEffect_1_0 	= 0;
            globalParameters.deathEffect_1_1 	= 0;
            globalParameters.deathEffect_1_2	= 0;

            // parameters for species 2 balls
            globalParameters.radius_2 		= 10.0;
            globalParameters.gravity_2 		= 100.0;
            globalParameters.collision_2 		= 0.2;
            globalParameters.friction_2 		= 1.0;
            globalParameters.usePhysics_2 		= true;
            globalParameters.imageIndex_2		= 2;
            globalParameters.socialForce_2_0 	= 0.0;
            globalParameters.socialForce_2_1 	= 0.0;
            globalParameters.socialForce_2_2 	= 0.0;
            globalParameters.touchDeath_2_0 	= false;
            globalParameters.touchDeath_2_1 	= false;
            globalParameters.touchDeath_2_2 	= false;
            globalParameters.deathEffect_2_0 	= 0;
            globalParameters.deathEffect_2_1 	= 0;
            globalParameters.deathEffect_2_2	= 0;
            
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
        }
        
        //------------------------------------------------------------------------------
        // set up scoreboard
        //------------------------------------------------------------------------------
        _scoreboard.width  = 200;
        _scoreboard.height = 50;
        _scoreboard.x      = canvasID.width * ONE_HALF - _scoreboard.width * ONE_HALF
        _scoreboard.y      = 40;
        _scoreboard.image.src = "images/scoreboard.png";
    }        
    
    
  
    //---------------------------------
    this.getCurrentLevel = function()
    {           
        return _level;
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
        gameState.testBall             = NULL_BALL;
        gameState.testSpecies         = 0;
        gameState.period             = period;
        gameState.collisionSpecies  = collisionSpecies;
        gameState.numCollisionsGoal = numCollisionsGoal;
        gameState.running            = true;
        gameState.clock             = 0;
        gameState.numCollisions        = 0;
        gameState.totalCollisionCount   = 0;

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
    }    
    
    
    
    //--------------------------------------------------------------------------------
    this.update = function( collisionBalls, ballsWithSomeCollision, numBalls, balls )
    {        
        if ( gameState.running )
        {
            if ( _level == CROQUET_GAME )
            {
                _score = gameState.numCollisions;

                if ( gameState.numCollisions >= gameState.numCollisionsGoal )
                {   
                    gameState.numCollisions = 0;
                    gameState.running = false;
                    gameState.success = true;
                    _scoreboard.image.src = "images/scoreboard-win.png";
                }
            }
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
            
                gameState.clock ++;

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

                if (!gameState.quest0Success)
                {
                    globalParameters.quest0Success = this.isQuest0GoalReached();
                }
            
                if (!gameState.quest1Success)
                {
                    globalParameters.quest1Success = this.isQuest1GoalReached();
                }

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
        if (globalParameters.type2BallCount != 1)
            return false;
    
        if ( gameState.numCollisions >= gameState.numCollisionsGoal )
            return true;
        
        return false;
    }    
    
    


    //--------------------------------------
    this.render = function()
    {
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
        
        canvas.font = "18px Arial";
        canvas.fillStyle = "rgb( 190, 190, 190 )"
        canvas.fillText( "level: " + _level.toString(), _scoreboard.x +  20, _scoreboard.y + 30 );
        canvas.fillText( "score: " + _score.toString(), _scoreboard.x + 100, _scoreboard.y + 30 );
    }    
        
          
}

