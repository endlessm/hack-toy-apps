var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var USING_TEST_GUI = true;
var CANVAS_PIXEL_OFFSET = 8; // this is a tad hacky, but it fixes the problem of the canvas being offset a bit. 

var WINDOW_WIDTH  = canvasID.width;
var WINDOW_HEIGHT = canvasID.height;

//---------------------------------------------------------
// The object globalParameters contains all the data that
// must be exposed to and share with GTK so that the UI 
// can be handled externally (not using _hackyBallsGUI).
//---------------------------------------------------------
var globalParameters = 
{
    //min and max values for ball parameters
    minRadius       :  10.0,
    maxRadius       : 100.0,
    minGravity      : -50.0,
    maxGravity      :  50.0,
    minCollision    :   0.01,
    maxCollision    :   0.2,
    minFriction     :   0.0,
    maxFriction     :  18.0,
    minSocialForce  : -30.0,
    maxSocialForce  :  30.0,

    // index of background image
    backgroundImageIndex: 0,

    // Communication with Clubhouse
    preset          : 0,
    quest1Success   : false,

    // parameters for species 0 balls
    radius_0        : ZERO,
    gravity_0       : ZERO,
    collision_0     : ZERO,
    friction_0      : ZERO,
    usePhysics_0    : false,
    socialForce_0_0 : ZERO,
    socialForce_0_1 : ZERO,
    socialForce_0_2 : ZERO,
    touchDeath_0_0  : false,
    touchDeath_0_1  : false,
    touchDeath_0_2  : false,
    deathEffect_0_0 : 0,
    deathEffect_0_1 : 0,
    deathEffect_0_2 : 0,
    imageIndex_0    : 0,

    // parameters for species 1 balls
    radius_1         : ZERO,
    gravity_1         : ZERO,
    collision_1     : ZERO,
    friction_1         : ZERO,
    usePhysics_1     : false,
    socialForce_1_0 : ZERO,
    socialForce_1_1 : ZERO,
    socialForce_1_2 : ZERO,
    touchDeath_1_0     : false,
    touchDeath_1_1     : false,
    touchDeath_1_2     : false,
    deathEffect_1_0    : 0,
    deathEffect_1_1    : 0,
    deathEffect_1_2    : 0,
    imageIndex_1    : 0,

    // parameters for species 2 balls
    radius_2         : ZERO,
    gravity_2         : ZERO,
    collision_2     : ZERO,
    friction_2         : ZERO,
    usePhysics_2     : false,
    socialForce_2_0 : ZERO,
    socialForce_2_1 : ZERO,
    socialForce_2_2 : ZERO,
    touchDeath_2_0     : false,
    touchDeath_2_1     : false,
    touchDeath_2_2     : false,
    deathEffect_2_0    : 0,
    deathEffect_2_1    : 0,
    deathEffect_2_2    : 0,
    imageIndex_2    : 0
}


//------------------------------------------------------------------
// The object gameState contains all the dynamic data pertaining 
// to the species-to-species collisions per gameSate period
//------------------------------------------------------------------
var gameState = 
{
    running             : false,
    clock               : 0,
    period              : 0,
    testBall            : 0,
    collisionSpecies    : 0,
    numCollisionsGoal   : 0,
    numCollisions       : 0
}


//----------------------
function HackyBalls()
{    
    var CURSOR_SIZE                    = 40.0;
    var NUM_BALL_SPECIES             = 3;
    var NULL_BALL                     = -1;
    var MAX_BALLS                    = 100;
    var INTERACTION_RADIUS             = 200.0;
    var MILLISECONDS_PER_UPDATE     = 10;
    var COLLISION_DISTANCE_FUDGE     = 10;

    var MAX_COLLISION_BALLS         = 10;
    var GAME_SUCCESS_DISPLAY_DURATION = 100;

    var TOOL_MOVE       =  0;
    var TOOL_FLING      =  1;
    var TOOL_CREATE     =  2;
    var TOOL_DELETE     =  3;
    var TOOL_SPECIES    =  4;
    var TOOL_PRESET_1   =  5;
    var TOOL_PRESET_2   =  6;
    var TOOL_PRESET_3   =  7;
    var TOOL_PRESET_4   =  8;
    var NUM_TOOLS       =  9;
    
    var TOOL_TRASH_SOUND        = new Audio( "sounds/Tool_Trash.wav"            ); 
    var TOOL_GRAB_SOUND            = new Audio( "sounds/Tool_Grab.wav"                ); 
    var TOOL_SPECIES_1_SOUND    = new Audio( "sounds/Tool_Species1.wav"            ); 
    var TOOL_SPECIES_2_SOUND    = new Audio( "sounds/Tool_Species2.wav"            ); 
    var TOOL_SPECIES_3_SOUND    = new Audio( "sounds/Tool_Species3.wav"            ); 
    var CREATE_1_SOUND            = new Audio( "sounds/CreateBall_Species1.wav"    ); 
    var CREATE_2_SOUND            = new Audio( "sounds/CreateBall_Species2.wav"    ); 
    var CREATE_3_SOUND            = new Audio( "sounds/CreateBall_Species3.wav"    ); 
    var TOO_MANY_SOUND            = new Audio( "sounds/too-many.wav"                ); 
    var DEATH_1_SOUND            = new Audio( "sounds/Death_Species1.wav"        ); 
    var DEATH_2_SOUND            = new Audio( "sounds/Death_Species2.wav"        ); 
    var DEATH_3_SOUND            = new Audio( "sounds/Death_Species3.wav"        ); 
    var FLING_SOUND                = new Audio( "sounds/Slingshot_Release.wav"        ); 
    var MOVE_FLING_SOUND        = new Audio( "sounds/Slingshot_Grab.wav"        ); 
    var SUCCESS_1_SOUND            = new Audio( "sounds/Success_Species1.wav"        ); 
    var SUCCESS_2_SOUND            = new Audio( "sounds/Success_Species2.wav"        ); 
    var SUCCESS_3_SOUND            = new Audio( "sounds/Success_Species3.wav"        ); 
    
    //--------------------
    function Species()
    {    
        this.gravity        = ZERO;
        this.radius            = ZERO;
        this.friction        = ZERO;
        this.collision        = ZERO;
        this.usePhysics        = false;
        this.imageID        = 0;
        this.forces            = new Array( NUM_BALL_SPECIES );
        this.touchDeath        = new Array( NUM_BALL_SPECIES );
        this.deathEffect    = new Array( NUM_BALL_SPECIES );

        for (var s=0; s<NUM_BALL_SPECIES; s++)
        {    
            this.forces        [s] = ZERO;                
            this.touchDeath    [s] = false;                
            this.deathEffect[s] = 0;                
        }
    }
    

    //-----------------------------
    function SpeciesButtonImages()
    {    
        this.ballImage = new Array( NUM_BALL_SPECIES );
        
        for (var s=0; s<NUM_BALL_SPECIES; s++)
        {
            this.ballImage[s] = new Image();
        }
    }
    
/*
var MAX_NUMBER = 10;

function Partition()
{
    this.valid = false;
    this.part = new Array( MAX_NUMBER );
    
    for (var p=0; p<MAX_NUMBER; p++)
    {
        this.part[p] = 0;
    }
}    

var _partitions = new Array( NUM_BALL_SPECIES );

//-----------------------------------
// set up the array of partitions
//-----------------------------------
for (var p=0; p<NUM_BALL_SPECIES; p++)
{
    _partitions[p] = new Partition();
}

for (var p=0; p<NUM_BALL_SPECIES; p++)
{
    _partitions[p].valid = false;
    
    for (var d=0; d<MAX_NUMBER; d++)
    {        
        _partitions[p].part[d] = 0;
    }        
}  
*/





    //-------------------------
    function DeathAnimation()
    {    
        this.position     = new Vector2D();
        this.image        = new Image();
        this.clock        = 0;
        this.radius        = ZERO;
        this.duration   = 20;
    }

    //--------------------
    function ToolButton()
    {    
        this.visible    = false;
        this.position    = new Vector2D();
        this.width        = ZERO;
        this.height        = ZERO;
        this.image        = new Image();
    }
    
    //-------------------------------
    // variables
    //-------------------------------
    var _seconds            = ZERO;
    var _prevSeconds        = ZERO;
    var _flinger            = new Flinger();
    var _species            = new Array( NUM_BALL_SPECIES );
    var _background            = new Image();
    var _cursor                = new Image();
    var _success            = new Image();
    //var _gameStateInfo        = new Image();
    var _balls                 = new Array();
    var _toolButtons         = new Array( NUM_TOOLS );
    var _deathAnimation        = new DeathAnimation();
    var _numBalls            = 0;
    var _hackyBallsGUI         = new HackyBallsGUI();
    var _leftWall             = ZERO;
    var _topWall             = ZERO;
    var _bottomWall         = WINDOW_HEIGHT;
    var _rightWall             = WINDOW_WIDTH;
    var _grabbedBall        = NULL_BALL;
    var _selectedSpecies    = 0;
    var _currentTool        = TOOL_FLING;
    var _mousePosition        = new Vector2D();
    var _prevMousePosition    = new Vector2D();
    var _mouseVelocity        = new Vector2D();
    var _vector                = new Vector2D();
    var _startTime            = ZERO;
    var _useAudio            = false;
    var _deleteImage         = new Image();
    var _collisionBalls     = new Array( MAX_COLLISION_BALLS );
    var _speciesButtonImages= new SpeciesButtonImages();
    

    //--------------------------
    this.initialize = function()
    {                
        //--------------------------------------
        // create species array  
        //--------------------------------------
        for (var i=0; i<NUM_BALL_SPECIES; i++) 
        {
            _species[i] = new Species();
        }
        
        //--------------------------------------
        // create balls array  
        //--------------------------------------
        for (var b=0; b<MAX_BALLS; b++) 
        {
            _balls[b] = new Ball();
        }
        
        //--------------------------------------
        // create tool buttons array  
        //--------------------------------------
        for (var t=0; t<NUM_TOOLS; t++)
        {
            _toolButtons[t] = new ToolButton();
        }
        
        //--------------------------------------
        // initialize collision ball array  
        //--------------------------------------
        for (var c=0; c<MAX_COLLISION_BALLS; c++)
        {
            _collisionBalls[c] = NULL_BALL;
        }

        
        //----------------------------
        // get start time
        //----------------------------
        _startTime = (new Date).getTime();

        //--------------------------------------
        // grab images
        //--------------------------------------
        _cursor.src         = "images/move-tool-selected.png";
        _background.src     = "images/background-0.png";
        _deleteImage.src     = "images/delete-ball.png";    
        //_gameStateInfo.src     = "images/game-state-info.png";    

        //-------------------------------------------------------
        // set all hack parameters and balls to default state
        //-------------------------------------------------------
        this.setStateToPreset(3);

        //---------------------------------------------
        // initialize user interface with parameters
        //---------------------------------------------
        if ( USING_TEST_GUI )
        {
            _hackyBallsGUI.initialize( globalParameters );
        }

        //------------------------------------
        // create tools
        //------------------------------------
        var size = 50.0;
        for (var t=0; t<NUM_TOOLS; t++)
        {
            _toolButtons[t].visible = true;
            _toolButtons[t].width  = 50.0;
            _toolButtons[t].height = 50.0;
            _toolButtons[t].image.src = "images/move-tool.png";
        }
        
        var left = 20.0;
        var top  = 80.0;
        var ys      = 55.0;
        
        _toolButtons[ TOOL_MOVE     ].position.setXY( left, top +  0 * ys );
        _toolButtons[ TOOL_FLING    ].position.setXY( left, top +  1 * ys );
        _toolButtons[ TOOL_CREATE   ].position.setXY( left, top +  2 * ys );
        _toolButtons[ TOOL_DELETE   ].position.setXY( left, top +  3 * ys );
        
        _toolButtons[ TOOL_PRESET_1 ].position.setXY( left, top +  5 * ys );
        _toolButtons[ TOOL_PRESET_2 ].position.setXY( left, top +  6 * ys );
        _toolButtons[ TOOL_PRESET_3 ].position.setXY( left, top +  7 * ys );
        _toolButtons[ TOOL_PRESET_4 ].position.setXY( left, top +  8 * ys );
        
        _toolButtons[ TOOL_MOVE     ].image.src = "images/move-tool.png";
        _toolButtons[ TOOL_FLING    ].image.src = "images/fling-tool.png";
        _toolButtons[ TOOL_CREATE   ].image.src = "images/create-tool.png";
        _toolButtons[ TOOL_DELETE   ].image.src = "images/delete-tool.png";
        _toolButtons[ TOOL_PRESET_1 ].image.src = "images/preset-1-tool.png";
        _toolButtons[ TOOL_PRESET_2 ].image.src = "images/preset-2-tool.png";
        _toolButtons[ TOOL_PRESET_3 ].image.src = "images/preset-3-tool.png";
        _toolButtons[ TOOL_PRESET_4 ].image.src = "images/preset-4-tool.png";

        _toolButtons[ TOOL_SPECIES  ].position.setXY( left + size + 3, _toolButtons[ TOOL_CREATE ].position.y );
        _toolButtons[ TOOL_SPECIES  ].height = size * 2.7;
        _toolButtons[ TOOL_SPECIES  ].image.src = "images/species-panel.png";
        _toolButtons[ TOOL_SPECIES  ].visible = false;

        this.selectTool( TOOL_MOVE );
        
        //-----------------------------------------------------------------------------
        // turn this on only after creating the initial balls, because some browsers
        // don't want to have sounds played until the user has done some interaction. 
        //-----------------------------------------------------------------------------
        _useAudio = true;        
                
        //------------------------------------------------------------------------
        // set up death animation
        //------------------------------------------------------------------------
        _deathAnimation.position.clear()
        _deathAnimation.clock        = 0;
        _deathAnimation.radius        = ZERO;
        _deathAnimation.duration       = 20;
        _deathAnimation.image.src     = "images/death-0.png";    
                
        //------------------------------------------------------------------------
        // start up the timer
        //------------------------------------------------------------------------
        //this.timer = setTimeout( "hackyBalls.update()", MILLISECONDS_PER_UPDATE );    
        
        // this forces the frame rate to be same as browser        
        window.requestAnimationFrame( this.update.bind(this) );                
    }




    //--------------------------------------------
    this.setStateToPreset = function( presetID )
    {
        gameState.running = false;
        _numBalls = 0;
                
        //----------------------------------------------------------------
        // Game 0
        //----------------------------------------------------------------
        if ( presetID == 0 )
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
        
            //----------------------------
            // apply parameters  
            //----------------------------
            this.applyParameters();
        
            //----------------------------
            // create some initial balls  
            //----------------------------
            var r = _species[0].radius;
            var x = _leftWall + r;
            var y = WINDOW_HEIGHT - r;
            var speciesID = 0;
        
            this.createBall( x + r * 0, y,                 speciesID );
            this.createBall( x + r * 2, y,                 speciesID );
            this.createBall( x + r * 4, y,                 speciesID );
            this.createBall( x + r * 1, y - r * 1.7,    speciesID );
            this.createBall( x + r * 3, y - r * 1.7,    speciesID );
            this.createBall( x + r * 2, y - r * 3.4,    speciesID );

            x = WINDOW_WIDTH * ONE_HALF;
            y = 200;
            s = 130;
            speciesID = 1;
            this.createBall( x, y + s * 0, speciesID );
            this.createBall( x, y + s * 1, speciesID );
            this.createBall( x, y + s * 3, speciesID );
            this.createBall( x, y + s * 4, speciesID );
        
            var r = _species[2].radius;
            var x = 1000;
            var y = WINDOW_HEIGHT - r;

            this.createBall( x + r *  0, y, 2 );
            this.createBall( x + r *  2, y, 2 );
            this.createBall( x + r *  4, y, 2 );
            this.createBall( x + r *  6, y, 2 );
            this.createBall( x + r *  8, y, 2 );
            this.createBall( x + r * 10, y, 2 );    
        }
        //----------------------------------------------------------------
        // Game 1
        //----------------------------------------------------------------
        else if ( presetID == 1 )
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
            globalParameters.deathEffect_0_0     = 0;
            globalParameters.deathEffect_0_1     = 0;
            globalParameters.deathEffect_0_2    = 0;

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
            globalParameters.deathEffect_1_0     = 0;
            globalParameters.deathEffect_1_1     = 0;
            globalParameters.deathEffect_1_2    = 0;

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
            globalParameters.deathEffect_2_0     = 2;
            globalParameters.deathEffect_2_1     = 2;
            globalParameters.deathEffect_2_2    = 2;
                    
            //----------------------------
            // apply parameters  
            //----------------------------
            this.applyParameters();

            this.createBall( 300, 300, 0 );
            this.createBall( 400, 300, 1 );
            this.createBall( 350, 360, 2 );
        }
        //----------------------------------------------------------------
        // Game 2
        //----------------------------------------------------------------
        else if ( presetID == 2 )
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
                    
            //----------------------------
            // apply parameters  
            //----------------------------
            this.applyParameters();

            this.createBall( WINDOW_WIDTH * ONE_HALF, WINDOW_HEIGHT * ONE_HALF, 1 );
            
            var num = 5;
            for (var i=0; i<num; i++)
            {
                var a = ( i / num ) * PI2;
                var r = 150.0 + 130.0 * Math.random();
                var x = WINDOW_WIDTH  * ONE_HALF + r * Math.sin(a);
                var y = WINDOW_HEIGHT * ONE_HALF + r * Math.cos(a);
                this.createBall( x, y, 0 );
            }
            
            
            //------------------------------------------------------------------------
            // set up the game state to detect collisions between species...
            //------------------------------------------------------------------------
            var period = 5;                // how many time steps are used to run this test?     
            var collisionSpecies = 0;     // which species of balls do we care about for collisions?
            var numCollisionsGoal = 10;     // how many unique balls do we want to test for collisions?
            this.initializeGameState( period, collisionSpecies, numCollisionsGoal );                            
        }
        //----------------------------------------------------------------
        // Game 3
        //----------------------------------------------------------------
        else if ( presetID == 3 )
        {
            globalParameters.backgroundImageIndex = 2;

            globalParameters.radius_0             = 40.0;
            globalParameters.gravity_0             = 0.0;
            globalParameters.collision_0         = 0.0;
            globalParameters.friction_0         = 1.0;
            globalParameters.usePhysics_0         = true;
            globalParameters.imageIndex_0        = 6;
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
            globalParameters.radius_1             = 60.0;
            globalParameters.gravity_1             = 0.0;
            globalParameters.collision_1         = 0.2;
            globalParameters.friction_1         = 0.05;
            globalParameters.usePhysics_1         = false;
            globalParameters.imageIndex_1        = 8;
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
            globalParameters.touchDeath_2_0     = true;
            globalParameters.touchDeath_2_1     = false;
            globalParameters.touchDeath_2_2     = false;
            globalParameters.deathEffect_2_0     = 0;
            globalParameters.deathEffect_2_1     = 0;
            globalParameters.deathEffect_2_2    = 0;
                    
            //----------------------------
            // apply parameters  
            //----------------------------
            this.applyParameters();

            this.createBall( 400, 400, 0 );        

            //var velocity = new Vector2D();
            //velocity.setXY( 6.0, 7.0 );            
            //_balls[0].setVelocity( velocity );
            
            this.createBall( 1000, 250, 1 );                    
            //this.createBall( 1060, 350, 1 );    
        }
        
        //---------------------------------------------
        // initialize user interface with parameters
        //---------------------------------------------
        if ( USING_TEST_GUI )
        {
            _hackyBallsGUI.setParameters( globalParameters );
        }

        //------------------------------
        // delete flinger
        //------------------------------
        _flinger.cancel();
         _grabbedBall = NULL_BALL    

        //----------------------------------
        // start with this tool selected...
        //----------------------------------
        this.selectTool( TOOL_MOVE );    
    }




    //------------------------------------------
    this.createBall = function( x, y, species )
    {    
        if ( _numBalls < MAX_BALLS )
        {
            if ( _useAudio ) 
            { 
                     if ( species == 0 ) { this.playSound( CREATE_1_SOUND ); }
                else if ( species == 1 ) { this.playSound( CREATE_2_SOUND ); }
                else if ( species == 2 ) { this.playSound( CREATE_3_SOUND ); }
            }          
    
            //---------------------------------------------
            // jitter discourages balls from being created 
            // at the same position as other balls due to 
            // the user rapidly clicking to add
            //---------------------------------------------
            var jitter = 0.1;
            x += (-jitter * ONE_HALF + Math.random() * jitter );
            y += (-jitter * ONE_HALF + Math.random() * jitter );
        
            _balls[ _numBalls ].setWalls( _leftWall, _bottomWall, _rightWall, _topWall );

            var position = new Vector2D();
            var velocity = new Vector2D();
            position.setXY( x, y );
            velocity.clear();

            _balls[ _numBalls ].setType           ( species  );
            _balls[ _numBalls ].setPosition        ( position );
            _balls[ _numBalls ].setVelocity        ( velocity );
            _balls[ _numBalls ].setGravity        ( _species[ species ].gravity        );
            _balls[ _numBalls ].setRadius        ( _species[ species ].radius        );
            _balls[ _numBalls ].setCollision    ( _species[ species ].collision        );     
            _balls[ _numBalls ].setAirFriction    ( _species[ species ].friction        );
            _balls[ _numBalls ].setImageID        ( _species[ species ].imageID         );
            _balls[ _numBalls ].setUsingPhysics    ( _species[ species ].usePhysics    );     

            _numBalls ++;
        }
        else
        {
            this.playSound( TOO_MANY_SOUND );
        }
    }



    //-----------------------
    this.update = function()
    {       
        if ( globalParameters.preset != 0 )
        {
            this.setStateToPreset( globalParameters.preset - 1 );
            globalParameters.preset = 0;
        }

        //------------------------------------
        // this gets called all the time to 
        // catch any changes from the UI
        //------------------------------------
        this.applyParameters();
        
        //-----------------------
        // update game logic
        //-----------------------
        this.updateGameLogic();
        
        //----------------------------------------------------
        // get seconds since started, and derive deltaTime...
        //----------------------------------------------------
        _prevSeconds = _seconds;
        _seconds = ( (new Date).getTime() - _startTime ) / MILLISECONDS_PER_SECOND;
        var deltaTime = _seconds - _prevSeconds;

        //-----------------------------
        // loop through all balls
        //-----------------------------
        for (var b=0; b<_numBalls; b++)
        {
            if ( _grabbedBall == b )
            {
                _balls[b].grab( _mousePosition );
            }

            //-----------------------------
            // basic ball physics update
            //-----------------------------
            this.updateBall( b, deltaTime );
        }
        
        //-----------------------------
        // update flinger
        //-----------------------------
        if (( _flinger.state != FLINGER_STATE_NULL )
        &&  ( _flinger.state != FLINGER_STATE_PULLING ))
        {
            _flinger.update( deltaTime );
        }
            
        //---------------------------
        // render everything...
        //---------------------------
        this.render();

        //---------------------------
        // trigger next update...
        //---------------------------
        //this.timer = setTimeout( "hackyBalls.update()", MILLISECONDS_PER_UPDATE );
        
        /*
        var start = null;
        var element = document.getElementById('SomeElementYouWantToAnimate');
        element.style.position = 'absolute';

        function step(timestamp) {
          if (!start) start = timestamp;
          var progress = timestamp - start;
          element.style.left = Math.min(progress / 10, 200) + 'px';
          if (progress < 2000) {
            window.requestAnimationFrame(step);
          }
        }
        */        
        
        // this forces the frame rate to be same as browser        
        window.requestAnimationFrame( this.update.bind(this) );                
    } 


    //-------------------------------------------------------------------------------------------
    this.initializeGameState = function( period, collisionSpecies, numCollisionsGoal )
    {                
        gameState.testBall             = NULL_BALL;
        gameState.period             = period;
        gameState.collisionSpecies  = collisionSpecies;
        gameState.numCollisionsGoal = numCollisionsGoal;
        gameState.running            = true;
        gameState.clock             = 0;
        gameState.numCollisions        = 0;

        globalParameters.quest1Success = false;

        for (var c=0; c<gameState.numCollisionsGoal; c++)
        {                            
            _collisionBalls[c] = NULL_BALL;
        }            
    }



    this.isQuest1GoalReached = function()
    {
        var type2BallCount = 0;
        for (var i=0; i<_numBalls; i++)
        {    
            if (_balls[i].getType() == 1)
            {
                type2BallCount++;
                if (type2BallCount > 1)
                    return false;
            }
        }
        if (type2BallCount != 1)
            return false;
    
        if ( gameState.numCollisions >= gameState.numCollisionsGoal )
            return true;
        
        return false;
    }


    //--------------------------------
    this.updateGameLogic = function()
    {        
        if ( gameState.running )
        {
            /*
            console.log( "                                                            " );
            console.log( "------------------------------------------------------------" );
            console.log( "gameState.testBall           = " + gameState.testBall            );
            console.log( "gameState.period               = " + gameState.period            );
            console.log( "gameState.collisionSpecies  = " + gameState.collisionSpecies    );
            console.log( "gameState.numCollisionsGoal = " + gameState.numCollisionsGoal    );
            console.log( "gameState.running                = " + gameState.running            );
            console.log( "gameState.success              = " + gameState.success            );
            console.log( "gameState.clock               = " + gameState.clock                );
            console.log( "gameState.numCollisions      = " + gameState.numCollisions        );
            */
            
            //----------------------------------
            // collect num collisions
            //----------------------------------
            gameState.numCollisions = 0;
            for (var c=0; c<gameState.numCollisionsGoal; c++)
            {                            
                if ( _collisionBalls[c] != NULL_BALL )
                {
                    gameState.numCollisions ++;
                }
            }

            gameState.clock ++;

            gameState.testBall = NULL_BALL;
            for (var i=0; i<_numBalls; i++)
            {    
                if (_balls[i].getType() == 1)
                {
                    gameState.testBall = i;
                    break;
                }
            }


            if (!gameState.quest1Success)
            {
                globalParameters.quest1Success = this.isQuest1GoalReached();
            }
            /*
            if ( gameState.success ) 
            {
                if ( gameState.clock > GAME_SUCCESS_DISPLAY_DURATION )
                {
                    gameState.running = false;
                }
            }
            else
            {
                gameState.quest1Success = this.isQuest1GoalReached();


                //----------------------------------
                // game goal reached! :)
                //----------------------------------
                if ( gameState.numCollisions >= gameState.numCollisionsGoal )
                {
                    gameState.success = true;    
                    if ( _useAudio ) { SUCCESS_SOUND.play(); }        
                }

                //------------------------------------------------------------------------------------
                // periodically clear out the collisions array and start over.
                // this test refers to a limited time span, defined by gameState.period
                //------------------------------------------------------------------------------------
            }
            */
            if ( gameState.clock > gameState.period )
            {
                gameState.clock = 0;
                gameState.numCollisions    = 0;    
                
                for (var c=0; c<gameState.numCollisionsGoal; c++)
                {                            
                    _collisionBalls[c] = NULL_BALL;
                }    
            }
        }        
    }
    

    //------------------------------------------
    this.updateBall = function( b, deltaTime )
    {
        //-----------------------------------------
        // basic physics update
        //-----------------------------------------
        _balls[b].update( deltaTime );

        //-------------------------------------
        // update interactions with flinger
        //-------------------------------------
        if ( _flinger.ballIndex == b )
        {
            if ( _flinger.state == FLINGER_STATE_MOVING )
            {
                _flinger.position.x = _balls[b].getPosition().x;
                _flinger.position.y = _balls[b].getPosition().y;
            
                var force = new Vector2D();

                force.setToDifference( _flinger.position, _balls[b].getPosition() );
                force.scale( FLINGER_HOLD_FORCE * deltaTime );

                _balls[b].addVelocity( force );            
                _balls[b].scaleVelocity( ONE - FLINGER_HOLD_FRICTION );            
            }
            else if ( _flinger.state == FLINGER_STATE_WAITING )
            {
                var force = new Vector2D();

                force.setToDifference( _flinger.position, _balls[b].getPosition() );
                force.scale( FLINGER_HOLD_FORCE * deltaTime );

                _balls[b].addVelocity( force );
                _balls[b].scaleVelocity( ONE - FLINGER_HOLD_FRICTION );            
            }
            else if ( _flinger.state == FLINGER_STATE_PULLING )
            {
                var xx = _flinger.position.x - _flinger.handlePosition.x;
                var yy = _flinger.position.y - _flinger.handlePosition.y;
                var length = Math.sqrt( xx*xx + yy*yy );
                
                xx /= length;
                yy /= length;
                
                _balls[b].getPosition().x = _flinger.handlePosition.x + xx * _flinger.handleLength;
                _balls[b].getPosition().y = _flinger.handlePosition.y + yy * _flinger.handleLength;
            }
            else if ( _flinger.state == FLINGER_STATE_FLINGING )
            {
                var force = new Vector2D();

                force.setToDifference( _flinger.position, _balls[b].getPosition() );
                force.scale( FLINGER_FLING_FORCE * deltaTime );
                
                this.playSound( FLING_SOUND );
    
                _balls[b].addVelocity( force );
                _balls[b].scaleVelocity( ONE - FLINGER_HOLD_FRICTION );            

                _flinger.state = FLINGER_STATE_NULL;
            }
        }

//console.log( "------------------" );

        //-----------------------------
        // ball-to-ball interactions
        //-----------------------------
        for (var o=0; o<_numBalls; o++)
        {    
            if ( b != o )
            {
                _vector.setToDifference( _balls[b].getPosition(), _balls[o].getPosition() );

                var distance = _vector.getMagnitude();

                if ( distance < INTERACTION_RADIUS )
                {
                    if ( distance > ZERO )
                    {
                        var bSpecies = _balls[b].getType();
                        var oSpecies = _balls[o].getType();

                        //-----------------------------
                        // attractions and repulsions
                        //-----------------------------
                        var force = new Vector2D();
                        force.setToScaled( _vector, ONE / distance );
                        force.scale( _species[ bSpecies ].forces[ oSpecies ] * deltaTime );
                        _balls[b].addVelocity( force );
                    
                        //-----------------------------------------------------------------------------------------------------
                        // collisions
                        //-----------------------------------------------------------------------------------------------------
                        var collisionDistance = ( _balls[b].getRadius() + _balls[o].getRadius() ) - COLLISION_DISTANCE_FUDGE;

                        if ( distance < collisionDistance )
                        {
                            //-------------------------------------------------------------
                            // if we are running a game and collecting collision info...    
                            //-------------------------------------------------------------
                            if ( gameState.running )
                            {                
                                //------------------------------------
                                // accumulate collisions that adhere 
                                // to the spcification in game state    
                                //------------------------------------    
                                if ( b == gameState.testBall )
                                {
                                    if ( oSpecies == gameState.collisionSpecies )
                                    {
                                        var alreadyExistingBallIndex = NULL_BALL;
                                        var slot = 0;
                                        for (var c=0; c<gameState.numCollisionsGoal; c++)
                                        {
                                            if ( _collisionBalls[c] == NULL_BALL )
                                            {
                                                slot = c;
                                            }
                                            else if ( _collisionBalls[c] == o )
                                            {
                                                alreadyExistingBallIndex = o;
                                            }                                            
                                        }
                                        
                                        if ( alreadyExistingBallIndex == NULL_BALL )
                                        {
                                            _collisionBalls[ slot ] = o;
                                        }
                                    }
                                }
                            }

                            if ( _species[ bSpecies ].touchDeath[ oSpecies ] )
                            {
                                this.killBallFromCollision( b, oSpecies );                                
                            }
                            else
                            {
                                //--------------------------------------------                    
                                // apply collision force         
                                //--------------------------------------------                    
                                var f = ONE - ( distance / collisionDistance );

                                var v1 = new Vector2D();
                                var v2 = new Vector2D();

                                v1.set( _vector );
                                v2.set( _vector );

                                v1.scale(  f );
                                v2.scale( -f );

                                _balls[b].addCollisionForce( v1 );
                                _balls[o].addCollisionForce( v2 );
                            }
                        }
                    }
                }
            }
        }
    }

    
    
    //-----------------------------------------------------------
    this.killBallFromCollision = function( b, otherBallSpecies )
    {    
        var deathImage  = new Image();
        var ballSpecies = _balls[b].getType();
        
        deathImage.src = "images/death-0.png";    

             if ( _species[ ballSpecies ].deathEffect[ otherBallSpecies ] == 0 ) { deathImage.src = "images/death-0.png"; }
        else if ( _species[ ballSpecies ].deathEffect[ otherBallSpecies ] == 1 ) { deathImage.src = "images/death-1.png"; }
        else if ( _species[ ballSpecies ].deathEffect[ otherBallSpecies ] == 2 ) { deathImage.src = "images/death-2.png"; }
        else if ( _species[ ballSpecies ].deathEffect[ otherBallSpecies ] == 3 ) { deathImage.src = "images/death-3.png"; }
        
        /*
        if ( _useAudio ) 
        { 
            //KILL_SOUND.play(); 

                 if ( ballSpecies == 0 ) { DEATH_1_SOUND.play(); }
            else if ( ballSpecies == 1 ) { DEATH_2_SOUND.play(); }
            else if ( ballSpecies == 2 ) { DEATH_3_SOUND.play(); }
        }    
        */
        
        this.deleteBall( b, deathImage );    
    }    
    
    
    
    //-------------------------------------------
    this.deleteBall = function( b, deleteImage )
    {    
        this.playBallDeathEffect( b, deleteImage )

        //---------------------------------------------------------
        // copy the data from the last ball in the array to the
        // ball just deleted so the array remains contiguous.
        //---------------------------------------------------------
        var r = _numBalls - 1;
        _balls[b].setPosition        ( _balls[r].getPosition        () );
        _balls[b].setVelocity        ( _balls[r].getVelocity        () );
        _balls[b].setType            ( _balls[r].getType            () );
        _balls[b].setRadius         ( _balls[r].getRadius        () );
        _balls[b].setGravity         ( _balls[r].getGravity        () );
        _balls[b].setAirFriction    ( _balls[r].getAirFriction    () );
        _balls[b].setCollision        ( _balls[r].getCollision    () );
        _balls[b].setUsingPhysics    ( _balls[r].getUsingPhysics    () );

        _numBalls --;
        
        //---------------------------------------------------------
        // if this ball has the flinger on it, kill the flinger
        //--------------------------------------------------------
        if ( b == _flinger.ballIndex )
        {
             _flinger.cancel();
        }    
    }
    
    

    //----------------------------------------------------
    this.playBallDeathEffect = function( b, deathImage )
    {    
        _deathAnimation.position.setXY( _balls[b].getPosition().x, _balls[b].getPosition().y )
        _deathAnimation.clock = 0;
        _deathAnimation.duration = 30;
        _deathAnimation.radius = _balls[b].getRadius();        
        _deathAnimation.image = deathImage;    

        if ( _useAudio ) 
        { 
            var ballSpecies = _balls[b].getType();

                //this.playSound( FLING_SOUND );


                 if ( ballSpecies == 0 ) { this.playSound( DEATH_1_SOUND ); }
            else if ( ballSpecies == 1 ) { this.playSound( DEATH_2_SOUND ); }
            else if ( ballSpecies == 2 ) { this.playSound( DEATH_3_SOUND ); }        
        }        
    }    


        
    //------------------------
    this.render = function()
    {    
        //-------------------------------------------
        // show background
        //-------------------------------------------
        canvas.drawImage( _background, 0, 0, WINDOW_WIDTH, WINDOW_HEIGHT );
        
        //-----------------------------------------
        // show animation from balls being killed
        //-----------------------------------------
        if ( _deathAnimation.clock < _deathAnimation.duration )
        {
            _deathAnimation.clock ++;
        
            var wave = ONE_HALF - ONE_HALF * Math.cos( _deathAnimation.clock / _deathAnimation.duration * Math.PI );
            
            var r = _deathAnimation.radius + 40.0 + 40.0 * wave; 

            canvas.drawImage
            ( 
                _deathAnimation.image, 
                _deathAnimation.position.x - r * ONE_HALF,
                _deathAnimation.position.y - r * ONE_HALF, 
                r, 
                r 
            );
        }

        //------------------------------
        // show the balls
        //------------------------------
        for (var b=0; b<_numBalls; b++)
        {
            _balls[b].render();
        }
        
       
        //-----------------------
        // show the flinger
        //-----------------------
        if ( _flinger.state != FLINGER_STATE_NULL )
        {        
            _flinger.render( _balls[ _flinger.ballIndex ].getPosition(), _balls[ _flinger.ballIndex ].getRadius() );
        }        
        
        
        //-------------------------
        // show tools
        //-------------------------
        for (var t=0; t<NUM_TOOLS; t++)
        {
            if ( _toolButtons[t].visible )
            {
                canvas.drawImage
                ( 
                    _toolButtons[t].image, 
                    _toolButtons[t].position.x, 
                    _toolButtons[t].position.y, 
                    _toolButtons[t].width, 
                    _toolButtons[t].height 
                );
                
                if ( t == TOOL_SPECIES )
                {
                    this.showSpeciesButtonImages(t);
                }
            }
        }
        
        //-------------------------
        // show user interface
        //-------------------------
        if ( USING_TEST_GUI )
        {
            _hackyBallsGUI.render();
        }        
 
         /*
        //---------------------------------
        // show game state success screen
        //---------------------------------
        if (( gameState.running )
        &&  ( gameState.quest1Success ))
        {
            var width  = 300;
            var height = 200;
            canvas.drawImage
            ( 
                _gameStateInfo, 
                WINDOW_WIDTH  * ONE_HALF - width * ONE_HALF, 
                WINDOW_HEIGHT * ONE_HALF - height * ONE_HALF, 
                width, height
            );        
        }
        */
    }
    
    
    

    //---------------------------------
    this.showSpeciesButtonImages = function(t)
    {                                    
        var rm = _toolButtons[t].width * 0.1;
        var rr = _toolButtons[t].width * 0.8;

        for (var s=0; s<NUM_BALL_SPECIES; s++)
        {
            _speciesButtonImages.ballImage[s].src = "images/ball-" + _species[s].imageID + ".png"    
            canvas.drawImage( _speciesButtonImages.ballImage[s], _toolButtons[t].position.x + rm, _toolButtons[t].position.y + rm + rr * s, rr, rr );
        }
    }
    
    
    

    //--------------------------------
    this.mouseDown = function( x, y )
    {
        if ( USING_TEST_GUI )
        {
            if ( _grabbedBall == NULL_BALL )
            {
                _hackyBallsGUI.setMouseDown( x, y );    
             }
        }
        
        //--------------------------
        // update mouse state
        //--------------------------
        this.updateMouse( x, y );
        
        //--------------------------
        // detect selecting a tool
        //--------------------------
        var buttonSelected = false;

        for (var t=0; t<NUM_TOOLS; t++)
        {
            if (( x > _toolButtons[t].position.x )
            &&  ( x < _toolButtons[t].position.x + _toolButtons[t].width )
            &&  ( y > _toolButtons[t].position.y )
            &&  ( y < _toolButtons[t].position.y + _toolButtons[t].height ))
            {
                this.selectTool(t);
                buttonSelected = true;
            
                if ( t == TOOL_CREATE )
                {
                    _toolButtons[ TOOL_SPECIES ].visible = true;
                }
                
                else if ( t == TOOL_PRESET_1 ) { this.setStateToPreset(0); /*_hackyBallsGUI.setParameters( globalParameters ); */ }
                else if ( t == TOOL_PRESET_2 ) { this.setStateToPreset(1); /*_hackyBallsGUI.setParameters( globalParameters ); */ }
                else if ( t == TOOL_PRESET_3 ) { this.setStateToPreset(2); /*_hackyBallsGUI.setParameters( globalParameters ); */ }
                else if ( t == TOOL_PRESET_4 ) { this.setStateToPreset(3); /*_hackyBallsGUI.setParameters( globalParameters ); */ }
                else if ( t == TOOL_SPECIES )
                {
                    var h = ( y - _toolButtons[t].position.y ) / _toolButtons[t].height;
                    _selectedSpecies = Math.floor( h * NUM_BALL_SPECIES );
                    
                    _toolButtons[ TOOL_SPECIES ].image.src = "images/species-panel.png";
                    
                    if ( _selectedSpecies == 0 ) { this.playSound( TOOL_SPECIES_1_SOUND  ); }
                    if ( _selectedSpecies == 1 ) { this.playSound( TOOL_SPECIES_2_SOUND  ); }
                    if ( _selectedSpecies == 2 ) { this.playSound( TOOL_SPECIES_3_SOUND  ); }
                    
                    
                    /*
                    if ( _selectedSpecies == 0 ) { _toolButtons[ TOOL_SPECIES ].image.src = "images/ball-type-0.png"; }
                    if ( _selectedSpecies == 1 ) { _toolButtons[ TOOL_SPECIES ].image.src = "images/ball-type-1.png"; }
                    if ( _selectedSpecies == 2 ) { _toolButtons[ TOOL_SPECIES ].image.src = "images/ball-type-2.png"; }
                    */
                }
                else if ( t != TOOL_SPECIES )
                {
                    _toolButtons[ TOOL_SPECIES ].visible = false;
                }
            }
        }

        
        //----------------------------------
        // detect selecting flinger handle
        //----------------------------------
        var flingerSelected = false;
        if ( _flinger.state == FLINGER_STATE_WAITING )
        {
            if ( _flinger.positionOverHandle( _mousePosition ) )
            {
                flingerSelected = true;
                _flinger.state = FLINGER_STATE_PULLING;
            }
        }

        if (( !buttonSelected )
        &&  ( !flingerSelected )) 
        {
            if (( _currentTool == TOOL_CREATE )
            ||  ( _currentTool == TOOL_SPECIES  ))
            {
                this.createBall( x, y, _selectedSpecies );
            }
            else
            {
                //-------------------------------
                // detect grabbing a ball
                //-------------------------------
                for (var b=0; b<_numBalls; b++)
                {
                    _vector.set( _balls[b].getPosition() );
                    var r = _balls[b].getRadius();

                    if (( x > _vector.x - r )
                    &&  ( x < _vector.x + r )
                    &&  ( y > _vector.y - r )
                    &&  ( y < _vector.y + r ))
                    {
                        if ( _currentTool == TOOL_DELETE )
                        {
                            this.deleteBall( b, _deleteImage );
                        }
                        else 
                        {                            
                            if ( _currentTool == TOOL_FLING )
                            {
                                this.putBallInFlinger(b);
                            }
                            
                            _grabbedBall  = b;
                        }
                    }
                }
            }
        }
    }



    //---------------------------------
    this.putBallInFlinger = function(b)
    {
        this.playSound( MOVE_FLING_SOUND );         
        _flinger.setBall( b, _balls[b].getPosition(), _balls[b].getRadius() );
    }


    //-----------------------------
    this.selectTool = function(t)
    {
        //this.playSound( BUTTON_SOUND );
    
        _currentTool = t;        
        _flinger.cancel();

        _toolButtons[ TOOL_MOVE     ].image.src = "images/move-tool.png";
        _toolButtons[ TOOL_FLING    ].image.src = "images/fling-tool.png";
        _toolButtons[ TOOL_CREATE   ].image.src = "images/create-tool.png";
        _toolButtons[ TOOL_DELETE   ].image.src = "images/delete-tool.png";
        _toolButtons[ TOOL_PRESET_1 ].image.src = "images/preset-1-tool.png";
        _toolButtons[ TOOL_PRESET_2 ].image.src = "images/preset-2-tool.png";
        _toolButtons[ TOOL_PRESET_3 ].image.src = "images/preset-3-tool.png";
        _toolButtons[ TOOL_PRESET_4 ].image.src = "images/preset-4-tool.png";

             if ( t == TOOL_MOVE     ) { _toolButtons[t].image.src = "images/move-tool-selected.png";   this.playSound( TOOL_GRAB_SOUND  ); }
        else if ( t == TOOL_FLING    ) { _toolButtons[t].image.src = "images/fling-tool-selected.png";   this.playSound( TOOL_GRAB_SOUND  ); }
        else if ( t == TOOL_CREATE   ) { _toolButtons[t].image.src = "images/create-tool-selected.png"; this.playSound( TOOL_GRAB_SOUND  ); }
        else if ( t == TOOL_DELETE   ) { _toolButtons[t].image.src = "images/delete-tool-selected.png"; this.playSound( TOOL_TRASH_SOUND ); }
        else if ( t == TOOL_PRESET_1 ) { _toolButtons[t].image.src = "images/preset-1-tool-selected.png"; }
        else if ( t == TOOL_PRESET_2 ) { _toolButtons[t].image.src = "images/preset-2-tool-selected.png"; }
        else if ( t == TOOL_PRESET_3 ) { _toolButtons[t].image.src = "images/preset-3-tool-selected.png"; }
        else if ( t == TOOL_PRESET_4 ) { _toolButtons[t].image.src = "images/preset-4-tool-selected.png"; }
        
        if ( t != TOOL_SPECIES )
        {
            _toolButtons[ TOOL_SPECIES  ].visible = false;
        }
    }


    //--------------------------------
    this.mouseMove = function( x, y )
    {
        if ( _grabbedBall == NULL_BALL )
        {
            if ( USING_TEST_GUI )
            {
                _hackyBallsGUI.setMouseMove( x, y );
            }
        }


        if ( _flinger.state == FLINGER_STATE_WAITING )
        {
            if ( _flinger.positionOverHandle( _mousePosition ) )
            {
                console.log( "hover!" );
                _flinger.setHover( true );
            }
            else
            {
                _flinger.setHover( false );
            }
        }
        else if ( _flinger.state == FLINGER_STATE_PULLING )
        {
            _flinger.handlePosition.x = x;
            _flinger.handlePosition.y = y;
        }

        this.updateMouse( x, y );
    }
    


    //------------------------------
    this.mouseUp = function( x, y )
    {    
        if ( USING_TEST_GUI )
        {
            _hackyBallsGUI.setMouseUp( x, y );
        }
        
        if ( _flinger.state == FLINGER_STATE_MOVING )
        {
            _flinger.state = FLINGER_STATE_WAITING;
        }        
        else if ( _flinger.state == FLINGER_STATE_PULLING )
        {
            _flinger.state = FLINGER_STATE_FLINGING;
        }
        
        for (var b=0; b<_numBalls; b++)
        {
            if ( _grabbedBall == b )
            {
                //throw ball...
                _balls[b].setVelocity( _mouseVelocity );
                _grabbedBall = NULL_BALL
            }
        }

        this.updateMouse( x, y );        
    }



    //---------------------------------
    this.updateMouse = function( x, y )
    {
        _prevMousePosition.x = _mousePosition.x;
        _prevMousePosition.y = _mousePosition.y;

        _mousePosition.x = x;
        _mousePosition.y = y;

        _mouseVelocity.x = _mousePosition.x - _prevMousePosition.x;
        _mouseVelocity.y = _mousePosition.y - _prevMousePosition.y;
    }
    

    //---------------------------------
    this.deleteKeyPressed = function()
    {    
        if ( _flinger.ballIndex != NULL_BALL )
        {
            this.deleteBall( _flinger.ballIndex, _deleteImage );
        }
    }
    
    //---------------------------------
    this.spaceKeyPressed = function()
    {    
        this.createBall( _mousePosition.x, _mousePosition.y, _selectedSpecies );        
    }
    

    //---------------------------------
    this.applyParameters = function()
    {    
        _background.src = "images/background-" + globalParameters.backgroundImageIndex + ".png";
                
        _species[0].gravity            = globalParameters.gravity_0;
        _species[0].radius            = globalParameters.radius_0;
        _species[0].friction        = globalParameters.friction_0;
        _species[0].collision        = globalParameters.collision_0;
        _species[0].usePhysics        = globalParameters.usePhysics_0;
        _species[0].imageID            = globalParameters.imageIndex_0;
        _species[0].forces[0]         = globalParameters.socialForce_0_0;                
        _species[0].forces[1]         = globalParameters.socialForce_0_1;
        _species[0].forces[2]         = globalParameters.socialForce_0_2;    
        _species[0].touchDeath    [0]    = globalParameters.touchDeath_0_0;                
        _species[0].touchDeath    [1]    = globalParameters.touchDeath_0_1;
        _species[0].touchDeath    [2]    = globalParameters.touchDeath_0_2;    
        _species[0].deathEffect    [0]    = globalParameters.deathEffect_0_0;                
        _species[0].deathEffect    [1]    = globalParameters.deathEffect_0_1;
        _species[0].deathEffect    [2]    = globalParameters.deathEffect_0_2;    
                
        _species[1].gravity            = globalParameters.gravity_1;
        _species[1].radius            = globalParameters.radius_1;
        _species[1].friction        = globalParameters.friction_1;
        _species[1].collision        = globalParameters.collision_1;
        _species[1].usePhysics        = globalParameters.usePhysics_1;
        _species[1].imageID            = globalParameters.imageIndex_1;
        _species[1].forces[0]         = globalParameters.socialForce_1_0;                
        _species[1].forces[1]         = globalParameters.socialForce_1_1;
        _species[1].forces[2]         = globalParameters.socialForce_1_2;    
        _species[1].touchDeath    [0] = globalParameters.touchDeath_1_0;                
        _species[1].touchDeath    [1] = globalParameters.touchDeath_1_1;
        _species[1].touchDeath    [2] = globalParameters.touchDeath_1_2;    
        _species[1].deathEffect    [0]    = globalParameters.deathEffect_1_0;                
        _species[1].deathEffect    [1]    = globalParameters.deathEffect_1_1;
        _species[1].deathEffect    [2]    = globalParameters.deathEffect_1_2;    

        _species[2].gravity            = globalParameters.gravity_2;
        _species[2].radius            = globalParameters.radius_2;
        _species[2].friction        = globalParameters.friction_2;
        _species[2].collision        = globalParameters.collision_2;
        _species[2].usePhysics        = globalParameters.usePhysics_2;
        _species[2].imageID            = globalParameters.imageIndex_2;
        _species[2].forces[0]         = globalParameters.socialForce_2_0;                
        _species[2].forces[1]         = globalParameters.socialForce_2_1;
        _species[2].forces[2]         = globalParameters.socialForce_2_2;    
        _species[2].touchDeath    [0] = globalParameters.touchDeath_2_0;                
        _species[2].touchDeath    [1] = globalParameters.touchDeath_2_1;
        _species[2].touchDeath    [2] = globalParameters.touchDeath_2_2;    
        _species[2].deathEffect    [0]    = globalParameters.deathEffect_2_0;                
        _species[2].deathEffect    [1]    = globalParameters.deathEffect_2_1;
        _species[2].deathEffect    [2]    = globalParameters.deathEffect_2_2;    
        
        for (var b=0; b<_numBalls; b++)
        {
            var s = _balls[b].getType();
            {
                _balls[b].setGravity        ( _species[s].gravity         );
                _balls[b].setRadius            ( _species[s].radius         );
                _balls[b].setCollision        ( _species[s].collision        );     
                _balls[b].setAirFriction    ( _species[s].friction        );    
                _balls[b].setImageID        ( _species[s].imageID        );    
                _balls[b].setUsingPhysics    ( _species[s].usePhysics    );     
            }
        }
    }
    
    
    //----------------------------------
    this.playSound = function( sound )
    {
        if ( _useAudio ) 
        {
            sound.pause();
            sound.currentTime = 0; 
            sound.play(); 
        }
    }
    
    //---------------------
    // start this puppy!
    //---------------------
    this.initialize();
}


//--------------------------------
document.onmousedown = function(e) 
{
    var rect = e.target.getBoundingClientRect();
    var xOffset = -rect.left;
    var yOffset = -rect.top;

    // overwrite the above (for now). It's not working! 
    xOffset = -CANVAS_PIXEL_OFFSET;
    yOffset = -CANVAS_PIXEL_OFFSET;
    
    hackyBalls.mouseDown( e.pageX + xOffset, e.pageY + yOffset );
}

//---------------------------------
document.onmousemove = function(e) 
{
    var rect = e.target.getBoundingClientRect();
    var xOffset = -rect.left;
    var yOffset = -rect.top;

    // overwrite the above (for now). It's not working! 
    xOffset = -CANVAS_PIXEL_OFFSET;
    yOffset = -CANVAS_PIXEL_OFFSET;

    hackyBalls.mouseMove( e.pageX + xOffset, e.pageY + yOffset );
}

//-------------------------------
document.onmouseup = function(e) 
{
    var rect = e.target.getBoundingClientRect();
    var xOffset = -rect.left;
    var yOffset = -rect.top;

    // overwrite the above (for now). It's not working! 
    xOffset = -CANVAS_PIXEL_OFFSET;
    yOffset = -CANVAS_PIXEL_OFFSET;

    hackyBalls.mouseUp( e.pageX + xOffset, e.pageY + yOffset );
}

//-------------------------------
document.onkeydown = function(e) 
{
    if ( e.keyCode === 32 ) { hackyBalls.spaceKeyPressed();  }
    if ( e.keyCode ===  8 ) { hackyBalls.deleteKeyPressed(); }
}
