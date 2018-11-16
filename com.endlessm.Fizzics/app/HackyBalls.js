var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var USING_TEST_GUI = false;

var WINDOW_WIDTH  = canvasID.width;
var WINDOW_HEIGHT = canvasID.height;

var NULL_BALL = -1;
var MAX_BALLS = 100;


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

    // switches for including game tools
    moveToolActive  : false,
    flingToolActive : false,
    createToolActive: false,
    deleteToolActive: false,

    // Communication with Clubhouse
    preset          : 0,
    quest0Success   : false,
    quest1Success   : false,
    quest2Success   : false,
    type0BallCount  : 0,
    type1BallCount  : 0,
    type2BallCount  : 0,
    score           : 0,
    currentLevel    : 0,

    // parameters for species 0 balls
    radius_0        : ZERO,
    gravity_0       : ZERO,
    collision_0     : ZERO,
    friction_0      : ZERO,
    usePhysics_0    : false,
    socialForce_0_0 : ZERO,
    socialForce_0_1 : ZERO,
    socialForce_0_2 : ZERO,
    socialForce_0_3 : ZERO,
    socialForce_0_4 : ZERO,
    touchDeath_0_0  : 0,
    touchDeath_0_1  : 0,
    touchDeath_0_2  : 0,
    touchDeath_0_3  : 0,
    touchDeath_0_4  : 0,
    deathVisualGood_0 : 0,
    deathVisualBad_0  : 0,
    deathSoundGood_0  : 0,
    deathSoundBad_0   : 0,    
    imageIndex_0      : 0,

    // parameters for species 1 balls
    radius_1        : ZERO,
    gravity_1       : ZERO,
    collision_1     : ZERO,
    friction_1      : ZERO,
    usePhysics_1    : false,
    socialForce_1_0 : ZERO,
    socialForce_1_1 : ZERO,
    socialForce_1_2 : ZERO,
    socialForce_1_3 : ZERO,
    socialForce_1_4 : ZERO,
    touchDeath_1_0  : 0,
    touchDeath_1_1  : 0,
    touchDeath_1_2  : 0,
    touchDeath_1_3  : 0,
    touchDeath_1_4  : 0,
    deathVisualGood_1 : 0,
    deathVisualBad_1  : 0,
    deathSoundGood_1  : 0,
    deathSoundBad_1   : 0,
    imageIndex_1      : 0,

    //------------------------------------
    // parameters for species 2 balls
    //------------------------------------
    radius_2        : ZERO,
    gravity_2       : ZERO,
    collision_2     : ZERO,
    friction_2      : ZERO,
    usePhysics_2    : false,
    socialForce_2_0 : ZERO,
    socialForce_2_1 : ZERO,
    socialForce_2_2 : ZERO,
    socialForce_2_3 : ZERO,
    socialForce_2_4 : ZERO,
    touchDeath_2_0  : 0,
    touchDeath_2_1  : 0,
    touchDeath_2_2  : 0,
    touchDeath_2_3  : 0,
    touchDeath_2_4  : 0,
    deathVisualGood_2 : 0,
    deathVisualBad_2  : 0,
    deathSoundGood_2  : 0,
    deathSoundBad_2   : 0,
    imageIndex_2      : 0,

    //------------------------------------
    // parameters for species 3 balls
    //------------------------------------
    radius_3        : ZERO,
    gravity_3       : ZERO,
    collision_3     : ZERO,
    friction_3      : ZERO,
    usePhysics_3    : false,
    socialForce_3_0 : ZERO,
    socialForce_3_1 : ZERO,
    socialForce_3_2 : ZERO,
    socialForce_3_3 : ZERO,
    socialForce_3_4 : ZERO,
    touchDeath_3_0  : 0,
    touchDeath_3_1  : 0,
    touchDeath_3_2  : 0,
    touchDeath_3_3  : 0,
    touchDeath_3_4  : 0,
    deathVisualGood_3 : 0,
    deathVisualBad_3  : 0,
    deathSoundGood_3  : 0,
    deathSoundBad_3   : 0,
    imageIndex_3      : 0,

    //------------------------------------
    // parameters for species 4 balls
    //------------------------------------
    radius_4        : ZERO,
    gravity_4       : ZERO,
    collision_4     : ZERO,
    friction_4      : ZERO,
    usePhysics_4    : false,
    socialForce_4_0 : ZERO,
    socialForce_4_1 : ZERO,
    socialForce_4_2 : ZERO,
    socialForce_4_3 : ZERO,
    socialForce_4_4 : ZERO,
    touchDeath_4_0  : 0,
    touchDeath_4_1  : 0,
    touchDeath_4_2  : 0,
    touchDeath_4_3  : 0,
    touchDeath_4_4  : 0,
    deathVisualGood_4 : 0,
    deathVisualBad_4  : 0,
    deathSoundGood_4  : 0,
    deathSoundBad_4   : 0,
    imageIndex_4      : 0
}

//-----------------------------------------------------------------------------
// The object gameState contains all the dynamic data pertaining to gameplay. 
// This includes the species-to-species collisions per gameSate period
//-----------------------------------------------------------------------------
var gameState = 
{
    running             : false,
    clock               : 0,
    period              : 0,
    testBall            : 0,
    testSpecies         : 0,
    collisionSpecies    : 0,
    numCollisionsGoal   : 0,
    numCollisions       : 0,
    totalCollisionCount : 0,
    success             : false
}

//----------------------
function HackyBalls()
{    
    var NUM_BALL_SPECIES         = 5;
    var INTERACTION_RADIUS       = 200.0;
    var MILLISECONDS_PER_UPDATE  = 10;
    var COLLISION_DISTANCE_FUDGE = 10;
    var MAX_COLLISION_BALLS      = 10;

    //--------------------
    function Species()
    {    
        this.gravity         = ZERO;
        this.radius          = ZERO;
        this.friction        = ZERO;
        this.collision       = ZERO;
        this.usePhysics      = false;
        this.imageID         = 0;
        this.createSound     = null; 
        this.successSound    = null; 
        this.toolSound       = null; 
        this.deleteSound     = null; 
        this.flySound        = null; 
        this.forces          = new Array( NUM_BALL_SPECIES );
        this.touchDeath      = new Array( NUM_BALL_SPECIES );
        this.deathVisualGood = 0;
        this.deathVisualBad  = 0;
        this.deathSoundGood  = 0;
        this.deathSoundBad   = 0;

        for (var s=0; s<NUM_BALL_SPECIES; s++)
        {    
            this.forces     [s] = ZERO;                
            this.touchDeath [s] = 0;                
        }
    }

    //-------------------------
    function DeathAnimation()
    {    
        this.position = new Vector2D();
        this.image    = new Image();
        this.clock    = 0;
        this.radius   = ZERO;
        this.duration = 20;
    }
    
    //-------------------------------
    // variables
    //-------------------------------
    var _seconds                = ZERO;
    var _prevSeconds            = ZERO;
    var _flinger                = new Flinger();
    var _species                = new Array( NUM_BALL_SPECIES );
    var _background             = new Image();
    var _success                = new Image();
    var _balls                  = new Array();
    var _deathAnimation         = new DeathAnimation();
    var _numBalls               = 0;
    var _hackyBallsGUI          = new HackyBallsGUI();
    var _leftWall               = ZERO;
    var _topWall                = ZERO;
    var _bottomWall             = WINDOW_HEIGHT;
    var _rightWall              = WINDOW_WIDTH;
    var _grabbedBall            = NULL_BALL;
    var _selectedSpecies        = 0;
    var _currentTool            = TOOL_FLING;
    var _mousePosition          = new Vector2D();
    var _prevMousePosition      = new Vector2D();
    var _mouseVelocity          = new Vector2D();
    var _vector                 = new Vector2D();
    var _startTime              = ZERO;
    var _deleteImage            = new Image();
    var _collisionBalls         = new Array( MAX_COLLISION_BALLS );
    var _ballsWithSomeCollision = new Array( MAX_BALLS );
    var _game                   = new Game();
    var _initializeFirstLevel   = false;
    var _tools                  = new Tools();
    var _devMode                = false;
    var _savedBalls             = null;
    var _numSavedBalls          = 0;
    var _levelLoading           = false;
    
    //---------------------------------------
    // this is a wrapper for the Sounds API
    //---------------------------------------
    var Sounds = new TEMPSoundAPI();
    
    //------------------------------------------------------------------------- 
    // NOTE: The json-reading scheme is not fully figured out yet! 
    //
    // This function is required for getting the
    // json data for game levels loaded into the game 
    //------------------------------------------------------------------------- 
    this.jsonFileLoaded = function(event)
    {
        _game.setLevelData( event.target.response );
        _initializeFirstLevel = true;
        
        //this starts the animation running...
        window.requestAnimationFrame( this.update.bind(this) );
    }


    //--------------------------
    this.initialize = function()
    {    
        //----------------------------------------------------------------------- 
        // NOTE: The json-reading scheme is not fully figured out yet! 
        //
        // This is for requesting to load the json file for loading game levels
        //-----------------------------------------------------------------------
        var request = new XMLHttpRequest();
        request.open( 'GET', 'GameLevels.json', true );
        request.responseType = 'json';
        request.send( null );
        request.addEventListener( 'load', this.jsonFileLoaded.bind(this) );
        
        //-----------------------------------
        // Set canvas size
        //-----------------------------------
        canvasID.width  = window.innerWidth;
        canvasID.height = window.innerHeight;

        _rightWall  = canvasID.width;
        _bottomWall = canvasID.height;

        //--------------------------------------
        // create species array  
        //--------------------------------------
        for (var i=0; i<NUM_BALL_SPECIES; i++) 
        {
            _species[i] = new Species();
        }

        //-----------------------------------------------------
        // set up the sounds associated with each species...  
        //-----------------------------------------------------
        _species[0].createSound  = "create0";
        _species[1].createSound  = "create1"; 
        _species[2].createSound  = "create2"; 
        _species[3].createSound  = "create3"; 
        _species[4].createSound  = "create4"; 

        _species[0].deleteSound  = "delete0";
        _species[1].deleteSound  = "delete1"; 
        _species[2].deleteSound  = "delete2"; 
        _species[3].deleteSound  = "delete3"; 
        _species[4].deleteSound  = "delete4"; 

        _species[0].flySound     = "fly0";
        _species[1].flySound     = "fly1"; 
        _species[2].flySound     = "fly2"; 
        _species[3].flySound     = "fly3"; 
        _species[4].flySound     = "fly4"; 

        _species[0].successSound = "success0";
        _species[1].successSound = "success1"; 
        _species[2].successSound = "success2"; 
        _species[3].successSound = "success3"; 
        _species[4].successSound = "success4"; 

        _species[0].toolSound    = "tool0"; 
        _species[1].toolSound    = "tool1"; 
        _species[2].toolSound    = "tool2"; 
        _species[3].toolSound    = "tool3"; 
        _species[4].toolSound    = "tool4"; 
                
        _species[0].score = 0;
        _species[1].score = 0;
        _species[2].score = 0;
        _species[3].score = 0;
        _species[4].score = -2;        
        
        //--------------------------------------
        // create balls array  
        //--------------------------------------
        for (var b=0; b<MAX_BALLS; b++) 
        {
            _balls[b] = new Ball();
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
        // load images
        //--------------------------------------
        canvasID.style.backgroundImage = "url('images/background-0.png')";
        _deleteImage.src = "images/delete-ball.png";    

        //---------------------------------------------
        // initialize user interface with parameters
        //---------------------------------------------
        if ( USING_TEST_GUI )
        {
            _hackyBallsGUI.initialize( globalParameters );
        }

        //------------------------------------
        // initialize tools
        //------------------------------------
        _tools.initialize();
        _tools.setNumSpecies( NUM_BALL_SPECIES );
                 
        //---------------------------------
        // set up death animation
        //---------------------------------
        _deathAnimation.position.clear()
        _deathAnimation.clock     = 100; // So we don't play the animation in the corner
        _deathAnimation.radius    = ZERO;
        _deathAnimation.duration  = 20;
        _deathAnimation.image.src = "images/death-0.png";    //default
                
        //------------------------------------------------------------------------
        // NOTE: The json-reading scheme is not fully figured out yet! 
        // This part of the code was commented-out as part of the current scheme. 
        // I want to leave this commented-out code here until we are certain.
        //------------------------------------------------------------------------        
        // this forces the frame rate to be same as browser        
        //window.requestAnimationFrame( this.update.bind(this) ); 

    }
    


    //------------------------------------------
    this.createBall = function( x, y, species )
    {    
        if ( _numBalls < MAX_BALLS )
        {
            if (!_levelLoading)
            {
                Sounds.play( _species[ species ].createSound );
            }
            
            //---------------------------------------------------------------------------
            // jitter discourages balls from being created at the exact same position
            // as other balls due to the user rapidly clicking to add in one place
            //---------------------------------------------------------------------------
            var jitter = 0.1;
            x += (-jitter * ONE_HALF + Math.random() * jitter );
            y += (-jitter * ONE_HALF + Math.random() * jitter );
        
            _balls[ _numBalls ].setWalls( _leftWall, _bottomWall, _rightWall, _topWall );

            var position = new Vector2D();
            var velocity = new Vector2D();
            position.setXY( x, y );
            velocity.clear();

            _balls[ _numBalls ].setType         ( species  );
            _balls[ _numBalls ].setPosition     ( position );
            _balls[ _numBalls ].setVelocity     ( velocity );
            _balls[ _numBalls ].setGravity      ( _species[ species ].gravity    );
            _balls[ _numBalls ].setRadius       ( _species[ species ].radius     );
            _balls[ _numBalls ].setCollision    ( _species[ species ].collision  );     
            _balls[ _numBalls ].setAirFriction  ( _species[ species ].friction   );
            _balls[ _numBalls ].setImageID      ( _species[ species ].imageID    );
            _balls[ _numBalls ].setUsingPhysics ( _species[ species ].usePhysics );     

            _numBalls ++;
        }
        else
        {
            Sounds.play( "tooManyBalls" );
        }
    }
    


    //-----------------------
    this.update = function()
    {       
        //-----------------------------------------------------------------------------
        // NOTE: The json-reading scheme is not fully figured out yet! 
        //
        // As soon as the level data have been loaded, set start up the first level...
        //-----------------------------------------------------------------------------
        if ( _initializeFirstLevel )
        {
            this.setGameLevel( 0 );
            _initializeFirstLevel = false;
        }
    
        // The Clubhouse requested a particular level. Set it and then reset the variable so we don't do it again.
        if ( globalParameters.preset != 0 )
        {
            this.setGameLevel( globalParameters.preset - 1 );
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
        _game.update( _collisionBalls, _ballsWithSomeCollision, _numBalls, _balls );
        
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
                
                if ( this._devMode )
                {
                    _balls[b].setPosition( _mousePosition );
                }
            }
            
            //-----------------------------
            // basic ball physics update
            //-----------------------------
            if ( !this._devMode )
            {
                this.updateBall( b, deltaTime );
            }
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

        //---------------------------------------------------
        // this forces the frame rate to be same as browser        
        //---------------------------------------------------
        window.requestAnimationFrame( this.update.bind(this) );                
    } 





    //------------------------------------------
    this.updateBall = function( b, deltaTime )
    {
        //-----------------------------
        // basic physics update
        //-----------------------------
        _balls[b].update( deltaTime );

        //-------------------------------------
        // update interactions with flinger
        //-------------------------------------
        this.updateBallInteractionsWithFlinger( b, deltaTime );
        
        //-----------------------------
        // ball-to-ball interactions
        //-----------------------------
        for (var o=0; o<_numBalls; o++)
        {    
            //--------------------------------------------------------------
            // balls in flingers don't participate in these interactions
            //--------------------------------------------------------------
            if (( _flinger.ballIndex != b )
            &&  ( _flinger.ballIndex != o ))
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
                            force.setToScaled( _vector, -ONE / distance );
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
                                    //---------------------------------------------
                                    // accumulate collisions that adhere to the 
                                    // spcification in game state for testSpecies
                                    //---------------------------------------------
                                    if ( bSpecies == gameState.testSpecies )
                                    {
                                        if ( oSpecies == gameState.collisionSpecies )
                                        {
                                            gameState.numCollisions ++;
                                        }
                                    }
                                                
                                    //---------------------------------------------
                                    // accumulate collisions that adhere to the 
                                    // spcification in game state for testBall
                                    //---------------------------------------------
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
                                
                                    _ballsWithSomeCollision[b] = true;
                                }

                                if ( _species[ bSpecies ].touchDeath[ oSpecies ] != 0 ) // if ball dies upon collision
                                {
                                    this.killBallFromCollision( b, _species[ bSpecies ].touchDeath[ oSpecies ] );
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
    }
    
    
    
    //----------------------------------------------------------------
    this.updateBallInteractionsWithFlinger = function( b, deltaTime )
    {    
        if ( _flinger.ballIndex == b )
        {
            if ( _flinger.state == FLINGER_STATE_MOVING )
            {
                _flinger.state = FLINGER_STATE_WAITING;

                /*
                _flinger.position.x = _balls[b].getPosition().x;
                _flinger.position.y = _balls[b].getPosition().y;
            
                var force = new Vector2D();

                force.setToDifference( _flinger.position, _balls[b].getPosition() );
                force.scale( FLINGER_HOLD_FORCE * deltaTime );

                _balls[b].addVelocity( force );            
                
                var friction = FLINGER_HOLD_FRICTION * deltaTime;        
                if ( friction < ONE )
                {
                    _balls[b].scaleVelocity( ONE - friction );   
                }
                else
                {
                    _balls[b].scaleVelocity( ZERO );   
                }                
                */
            }
            else if ( _flinger.state == FLINGER_STATE_WAITING )
            {
                var force = new Vector2D();

                force.setToDifference( _flinger.position, _balls[b].getPosition() );
                force.scale( FLINGER_HOLD_FORCE * deltaTime );

                _balls[b].addVelocity( force );
            
                var friction = FLINGER_HOLD_FRICTION * deltaTime;        
                if ( friction < ONE )
                {
                    _balls[b].scaleVelocity( ONE - friction );   
                }
                else
                {
                    _balls[b].scaleVelocity( ZERO );   
                }                
            }
            else if ( _flinger.state == FLINGER_STATE_PULLING )
            {    
                var xx = _flinger.position.x - _flinger.handlePosition.x;
                var yy = _flinger.position.y - _flinger.handlePosition.y;
                var length = Math.sqrt( xx*xx + yy*yy );
                                
                if ( length > ZERO )
                {
                    xx /= length;
                    yy /= length;
                }
                
                _balls[b].scaleVelocity( ZERO );
                
                var pullPosition = new Vector2D();
                pullPosition.setXY
                (
                    _flinger.handlePosition.x + xx * _flinger.handleLength,
                    _flinger.handlePosition.y + yy * _flinger.handleLength
                );
                
                _balls[b].setPosition( pullPosition );
                
                var offset = new Vector2D();
                offset.setToDifference( _flinger.position, _balls[b].getPosition() );

                if ( offset.getMagnitude() > _balls[b].getRadius() * FLINGER_MIN_PULL_RATIO )
                {                
                    _flinger.setReadyToFling( true );
                }
                else
                {                
                    _flinger.setReadyToFling( false );
                }
            }
            else if ( _flinger.state == FLINGER_STATE_FLINGING )
            {
                if ( _flinger.getReadyToFling() )
                {                
                    var offset = new Vector2D();
                    offset.setToDifference( _flinger.position, _balls[b].getPosition() );
                
                    var force = new Vector2D();
                    force.setToScaled( offset, FLINGER_FLING_FORCE * deltaTime );
                
                    Sounds.stop( "pullFling" );
                    Sounds.play( "fling" );
                    Sounds.playLoop( _species[ _balls[b].getType() ].flySound );
                     
                     _flinger.ballIndex = NULL_BALL;

                    _balls[b].addVelocity( force );

                    var friction = FLINGER_HOLD_FRICTION * deltaTime;        
                    if ( friction < ONE )
                    {
                        _balls[b].scaleVelocity( ONE - friction );   
                    }
                    else
                    {
                        _balls[b].scaleVelocity( ZERO );   
                    }                

                    _flinger.state = FLINGER_STATE_NULL;
                }
                else
                {
                    _flinger.state = FLINGER_STATE_WAITING;
                }
            }
        }    
    }
    
    
    

    //-----------------------------------------------------
    this.killBallFromCollision = function( b, deathType )
    {    
        var deathImage  = new Image();
        var deathSound  = "death0";//default
        var ballSpecies = _balls[b].getType();
        
        deathImage.src = "images/death-0.png"; //default

        if ( deathType == 1 ) // good
        {
            deathImage.src = "images/death-" + _species[ ballSpecies ].deathVisualGood + ".png";
            
                 if ( _species[ ballSpecies ].deathSoundGood  == 0 ) { deathSound = "death0"; }
            else if ( _species[ ballSpecies ].deathSoundGood  == 1 ) { deathSound = "death1"; }
            else if ( _species[ ballSpecies ].deathSoundGood  == 2 ) { deathSound = "death2"; }
            else if ( _species[ ballSpecies ].deathSoundGood  == 3 ) { deathSound = "death3"; }
        }
        else if ( deathType == 2 ) // bad
        {
            deathImage.src = "images/death-" + _species[ ballSpecies ].deathVisualBad + ".png";

                 if ( _species[ ballSpecies ].deathSoundBad   == 0 ) { deathSound = "death0"; }
            else if ( _species[ ballSpecies ].deathSoundBad   == 1 ) { deathSound = "death1"; }
            else if ( _species[ ballSpecies ].deathSoundBad   == 2 ) { deathSound = "death2"; }
            else if ( _species[ ballSpecies ].deathSoundBad   == 3 ) { deathSound = "death3"; }
        }
        
        _game.addScore( _species[ ballSpecies ].score );
        if (ballSpecies == 0 && deathType == 2)
            _game.setBallDied();
        this.deleteBall( b, deathImage, deathSound );    
    }    
    
    
    
    
    //---------------------------------------------------------
    this.deleteBall = function( b, deleteImage, deleteSound )
    {    
        this.playBallDeathEffect( b, deleteImage, deleteSound );

        if ( _grabbedBall == b )
        {
            _grabbedBall = NULL_BALL;
        }

        //---------------------------------------------------------
        // copy the data from the last ball in the array to the
        // ball just deleted so the array remains contiguous.
        //---------------------------------------------------------
        var r = _numBalls - 1;
        _balls[b].setPosition     ( _balls[r].getPosition     () );
        _balls[b].setVelocity     ( _balls[r].getVelocity     () );
        _balls[b].setType         ( _balls[r].getType         () );
        _balls[b].setRadius       ( _balls[r].getRadius       () );
        _balls[b].setGravity      ( _balls[r].getGravity      () );
        _balls[b].setAirFriction  ( _balls[r].getAirFriction  () );
        _balls[b].setCollision    ( _balls[r].getCollision    () );
        _balls[b].setUsingPhysics ( _balls[r].getUsingPhysics () );
        
        _numBalls --;
        
        //---------------------------------------------------------
        // if this ball has the flinger on it, kill the flinger
        //--------------------------------------------------------
        if ( b == _flinger.ballIndex )
        {
             _flinger.cancel();
        }            
    }

    //---------------------------------------------------------------
    this.playBallDeathEffect = function( b, deathImage, deathSound )
    {    
        _deathAnimation.position.setXY( _balls[b].getPosition().x, _balls[b].getPosition().y )
        _deathAnimation.clock = 0;
        _deathAnimation.duration = 30;
        _deathAnimation.radius = _balls[b].getRadius();        
        _deathAnimation.image = deathImage;    

        Sounds.play( deathSound );   
    }    


        
    //------------------------
    this.render = function()
    {    
        //-------------------------------------------
        // clear background
        //-------------------------------------------
        canvas.clearRect(0, 0, canvasID.width, canvasID.height);
        
        //-----------------------------------------
        // show animation from balls being killed
        //-----------------------------------------
        if ( _deathAnimation.clock < _deathAnimation.duration )
        {
            _deathAnimation.clock ++;
        
            var wave = ONE_HALF - ONE_HALF * Math.cos( _deathAnimation.clock / _deathAnimation.duration * Math.PI );
            
            var r = _deathAnimation.radius + 40.0 + 40.0 * wave; 

            canvas.drawImageCached
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
           
        //------------------------------------------
        // render game data (level, score, etc)
        //------------------------------------------
        _game.render();

        //-------------------------
        // show tools
        //-------------------------
        _tools.render();
        
        //-------------------------
        // show user interface
        //-------------------------
        if ( USING_TEST_GUI )
        {
            _hackyBallsGUI.render();
        }
        
    }

    //------------------------
    this.reset = function()
    {
        this.setGameLevel( _game.getCurrentLevel() );
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
        
        //---------------------------------------------------------------------------
        // send mouse click to the game and ask if it is ready for the next level
        //---------------------------------------------------------------------------
        if ( _game.okayToChooseNextLevel( x, y ) )
        {
            this.setGameLevel( _game.getNextLevel() ); 
        }
            
        //--------------------------
        // detect selecting a tool
        //--------------------------
        var selectedTool = _tools.mouseClick( x, y );
        
        if ( selectedTool != -1 )
        {
            _flinger.cancel();  

            _currentTool = selectedTool;   
                    
                 if ( _currentTool == TOOL_MOVE    ) { Sounds.play( "grab"  ); }
            else if ( _currentTool == TOOL_FLING   ) { Sounds.play( "grab"  ); }
            else if ( _currentTool == TOOL_CREATE  ) { Sounds.play( "grab"  ); }
            else if ( _currentTool == TOOL_DELETE  ) { Sounds.play( "trash" ); }
            else if ( _currentTool == TOOL_RESET   ) { this.reset();           }     
            else if ( _currentTool == TOOL_SPECIES )
            {
                _selectedSpecies = _tools.getSelectedSpecies();
                Sounds.play( _species[ _selectedSpecies ].toolSound );
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
                Sounds.playLoop( "pullFling" );
            }
        }
        
        if (( _currentTool == TOOL_SPECIES )
        &&  ( selectedTool == -1 ))
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
                        this.deleteBall( b, _deleteImage, _species[ _balls[b].getType() ].deleteSound );
                    }
                    else 
                    {                            
                        if ( _currentTool == TOOL_FLING )
                        {
                            if ( _species[ _balls[b].getType() ].usePhysics )
                            {
                                this.putBallInFlinger(b);
                            }
                        }
                        
                        if (( _species[ _balls[b].getType() ].usePhysics &&  
                            ( _flinger.state != FLINGER_STATE_MOVING )) || this._devMode)
                        {
                            _grabbedBall = b;
                        }
                    }
                }
            }
        }
    }
    


    //------------------------------------
    this.setGameLevel = function( level )
    {
        _levelLoading = true;
        _numBalls = 0;
        _game.setLevel( this, level, _collisionBalls, _ballsWithSomeCollision ); 
        
        if ( USING_TEST_GUI ) 
        { 
            _hackyBallsGUI.setParameters( globalParameters ); 
        } 
        
        _flinger.cancel(); 
        _grabbedBall = NULL_BALL;

        globalParameters.moveToolActive = false;
        globalParameters.createToolActive = false;
        globalParameters.deleteToolActive = false;
        globalParameters.flingToolActive = true;
        _tools.select(TOOL_FLING);
        _currentTool = TOOL_FLING;

        _levelLoading = false;
    }


    //---------------------------------
    this.putBallInFlinger = function(b)
    {
        Sounds.play( "moveFling" );
            
        _flinger.setBall( b, _balls[b].getPosition(), _balls[b].getRadius() );
        
        var jolt = new Vector2D();
        jolt.setXY
        ( 
            -FLINGER_INITIAL_JOLT * ONE_HALF + Math.random() * FLINGER_INITIAL_JOLT,
            -FLINGER_INITIAL_JOLT * ONE_HALF + Math.random() * FLINGER_INITIAL_JOLT
        );
        
        _balls[b].setVelocity( jolt );
    }


    //-----------------------------
    this.selectTool = function(t)
    {
        _tools.select(t);
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
            _game.addScore(1);    
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
            this.deleteBall( _flinger.ballIndex, _deleteImage, _species[ _balls[ _flinger.ballIndex ].getType() ].deleteSound );
        }

        if ( _grabbedBall != NULL_BALL )
        {
            this.deleteBall( _grabbedBall, _deleteImage, _species[ _balls[ _grabbedBall ].getType() ].deleteSound );
        }
    }
    
    //---------------------------------
    this.spaceKeyPressed = function()
    {    
        this.createBall( _mousePosition.x, _mousePosition.y, _selectedSpecies );        
    }
    

    this.toggleDevMode = function()
    {
        this._devMode = !this._devMode;
        if (this._devMode)
        {
            console.log("DEV MODE ACTIVE");
            globalParameters.moveToolActive = true;
            globalParameters.createToolActive = true;
            globalParameters.deleteToolActive = true;
            globalParameters.flingToolActive = false;
            _tools.select(TOOL_MOVE);
            _currentTool = TOOL_MOVE;
        }
        else
        {
            console.log("Game mode");
            globalParameters.moveToolActive = false;
            globalParameters.createToolActive = false;
            globalParameters.deleteToolActive = false;
            globalParameters.flingToolActive = true;
            _tools.select(TOOL_FLING);
            _currentTool = TOOL_FLING;

            for (var i=0; i<_numBalls; i++)
            {
                _balls[i].setVelocity(new Vector2D(0,0));
            }
        }
    }

    this.printLevel = function()
    {
        if (!this._devMode)
            return;

        console.log("Saving level");
        out = '\n{\n';
        out += '\t"ID": "X",\n';
        out += '\t"background": "2",\n';

        out += '\t"balls":\n';
        out += '\t[\n';
        for (var b=0; b<_numBalls; b++)
        {
            out += '\t\t{\n';
            out += '\t\t\t"ID" : "' + b + '",\n';
            var p = _balls[b].getPosition();
            out += '\t\t\t"x" : "' + p.x + '",\n';
            out += '\t\t\t"y" : "' + p.y + '",\n';
            out += '\t\t\t"species" : "' + _balls[b].getType() + '"\n';
            if (b == _numBalls-1)
                out += '\t\t}\n';
            else
                out += '\t\t},\n';
        }        
        out += '\t]\n';

        out += '}\n';
        console.log(out);

        //_savedBalls = _balls.slice();

        _savedBalls = new Array();
        _numSavedBalls = _numBalls;
        for (var i=0; i<_numBalls; i++ )
        {
            var info = {};
            var pos = _balls[i].getPosition(); 
            info.x = pos.x;
            info.y = pos.y;
            info.species = _balls[i].getType();
            _savedBalls.push(info);
        }
    }

    this.restoreLevel = function()
    {
        if (!this._devMode)
            return;

        console.log("Restoring level");
        //_balls = _savedBalls.slice();
        _numBalls = 0;
        for (var i=0; i<_savedBalls.length; i++ )
        {  
            this.createBall(_savedBalls[i].x, _savedBalls[i].y, _savedBalls[i].species);
        }
    }    


    this.nextLevel = function()
    {
        if (!this._devMode)
            return;
        this.setGameLevel( _game.getNextLevel() );
        globalParameters.moveToolActive = true;
        globalParameters.createToolActive = true;
        globalParameters.deleteToolActive = true;
        globalParameters.flingToolActive = false;
    }

    this.prevLevel = function()
    {
        if (!this._devMode)
            return;
        this.setGameLevel( _game.getPrevLevel() );
        globalParameters.moveToolActive = true;
        globalParameters.createToolActive = true;
        globalParameters.deleteToolActive = true;
        globalParameters.flingToolActive = false;
    }


    //---------------------------------
    this.applyParameters = function()
    {    
        /* NOTE: set background on DOM element instead of drawing it on the canvas to avoid
         * performance issues with webkit2gtk, since its canvas implementation scales images
         * in software.
         */
        canvasID.style.backgroundImage = "url('images/background-" + globalParameters.backgroundImageIndex + ".png')";
                
        _species[0].gravity         = globalParameters.gravity_0;
        _species[0].radius          = globalParameters.radius_0;
        _species[0].friction        = globalParameters.friction_0;
        _species[0].collision       = globalParameters.collision_0;
        _species[0].usePhysics      = globalParameters.usePhysics_0;
        _species[0].imageID         = globalParameters.imageIndex_0;
        _species[0].forces     [0]  = globalParameters.socialForce_0_0;                
        _species[0].forces     [1]  = globalParameters.socialForce_0_1;
        _species[0].forces     [2]  = globalParameters.socialForce_0_2;    
        _species[0].forces     [3]  = globalParameters.socialForce_0_3;    
        _species[0].forces     [4]  = globalParameters.socialForce_0_4;    
        _species[0].touchDeath [0]  = globalParameters.touchDeath_0_0;                
        _species[0].touchDeath [1]  = globalParameters.touchDeath_0_1;
        _species[0].touchDeath [2]  = globalParameters.touchDeath_0_2;    
        _species[0].touchDeath [3]  = globalParameters.touchDeath_0_3;    
        _species[0].touchDeath [4]  = globalParameters.touchDeath_0_4;            
        _species[0].deathVisualGood = globalParameters.deathVisualGood_0;                
        _species[0].deathVisualBad  = globalParameters.deathVisualBad_0;                
        _species[0].deathSoundGood  = globalParameters.deathSoundGood_0;                
        _species[0].deathSoundBad   = globalParameters.deathSoundBad_0;                
        
        _species[1].gravity         = globalParameters.gravity_1;
        _species[1].radius          = globalParameters.radius_1;
        _species[1].friction        = globalParameters.friction_1;
        _species[1].collision       = globalParameters.collision_1;
        _species[1].usePhysics      = globalParameters.usePhysics_1;
        _species[1].imageID         = globalParameters.imageIndex_1;
        _species[1].forces     [0]  = globalParameters.socialForce_1_0;                
        _species[1].forces     [1]  = globalParameters.socialForce_1_1;
        _species[1].forces     [2]  = globalParameters.socialForce_1_2;    
        _species[1].forces     [3]  = globalParameters.socialForce_1_3;    
        _species[1].forces     [4]  = globalParameters.socialForce_1_4;    
        _species[1].touchDeath [0]  = globalParameters.touchDeath_1_0;                
        _species[1].touchDeath [1]  = globalParameters.touchDeath_1_1;
        _species[1].touchDeath [2]  = globalParameters.touchDeath_1_2;    
        _species[1].touchDeath [3]  = globalParameters.touchDeath_1_3;    
        _species[1].touchDeath [4]  = globalParameters.touchDeath_1_4;           
        _species[1].deathVisualGood = globalParameters.deathVisualGood_1;                
        _species[1].deathVisualBad  = globalParameters.deathVisualBad_1;                
        _species[1].deathSoundGood  = globalParameters.deathSoundGood_1;                
        _species[1].deathSoundBad   = globalParameters.deathSoundBad_1;                

        _species[2].gravity         = globalParameters.gravity_2;
        _species[2].radius          = globalParameters.radius_2;
        _species[2].friction        = globalParameters.friction_2;
        _species[2].collision       = globalParameters.collision_2;
        _species[2].usePhysics      = globalParameters.usePhysics_2;
        _species[2].imageID         = globalParameters.imageIndex_2;
        _species[2].forces     [0]  = globalParameters.socialForce_2_0;                
        _species[2].forces     [1]  = globalParameters.socialForce_2_1;
        _species[2].forces     [2]  = globalParameters.socialForce_2_2;    
        _species[2].forces     [3]  = globalParameters.socialForce_2_3;    
        _species[2].forces     [4]  = globalParameters.socialForce_2_4;    
        _species[2].touchDeath [0]  = globalParameters.touchDeath_2_0;                
        _species[2].touchDeath [1]  = globalParameters.touchDeath_2_1;
        _species[2].touchDeath [2]  = globalParameters.touchDeath_2_2;    
        _species[2].touchDeath [3]  = globalParameters.touchDeath_2_3;    
        _species[2].touchDeath [4]  = globalParameters.touchDeath_2_4;         
        _species[2].deathVisualGood = globalParameters.deathVisualGood_2;                
        _species[2].deathVisualBad  = globalParameters.deathVisualBad_2;                
        _species[2].deathSoundGood  = globalParameters.deathSoundGood_2;                
        _species[2].deathSoundBad   = globalParameters.deathSoundBad_2;                

        _species[3].gravity         = globalParameters.gravity_3;
        _species[3].radius          = globalParameters.radius_3;
        _species[3].friction        = globalParameters.friction_3;
        _species[3].collision       = globalParameters.collision_3;
        _species[3].usePhysics      = globalParameters.usePhysics_3;
        _species[3].imageID         = globalParameters.imageIndex_3;
        _species[3].forces     [0]  = globalParameters.socialForce_3_0;                
        _species[3].forces     [1]  = globalParameters.socialForce_3_1;
        _species[3].forces     [2]  = globalParameters.socialForce_3_2;    
        _species[3].forces     [3]  = globalParameters.socialForce_3_3;    
        _species[3].forces     [4]  = globalParameters.socialForce_3_4;    
        _species[3].touchDeath [0]  = globalParameters.touchDeath_3_0;                
        _species[3].touchDeath [1]  = globalParameters.touchDeath_3_1;
        _species[3].touchDeath [2]  = globalParameters.touchDeath_3_2;    
        _species[3].touchDeath [3]  = globalParameters.touchDeath_3_3;    
        _species[3].touchDeath [4]  = globalParameters.touchDeath_3_4;        
        _species[3].deathVisualGood = globalParameters.deathVisualGood_3;                
        _species[3].deathVisualBad  = globalParameters.deathVisualBad_3;                
        _species[3].deathSoundGood  = globalParameters.deathSoundGood_3;                
        _species[3].deathSoundBad   = globalParameters.deathSoundBad_3;                
        
        _species[4].gravity         = globalParameters.gravity_4;
        _species[4].radius          = globalParameters.radius_4;
        _species[4].friction        = globalParameters.friction_4;
        _species[4].collision       = globalParameters.collision_4;
        _species[4].usePhysics      = globalParameters.usePhysics_4;
        _species[4].imageID         = globalParameters.imageIndex_4;
        _species[4].forces     [0]  = globalParameters.socialForce_4_0;                
        _species[4].forces     [1]  = globalParameters.socialForce_4_1;
        _species[4].forces     [2]  = globalParameters.socialForce_4_2;    
        _species[4].forces     [3]  = globalParameters.socialForce_4_3;    
        _species[4].forces     [4]  = globalParameters.socialForce_4_4;    
        _species[4].touchDeath [0]  = globalParameters.touchDeath_4_0;                
        _species[4].touchDeath [1]  = globalParameters.touchDeath_4_1;
        _species[4].touchDeath [2]  = globalParameters.touchDeath_4_2;    
        _species[4].touchDeath [3]  = globalParameters.touchDeath_4_3;    
        _species[4].touchDeath [4]  = globalParameters.touchDeath_4_4;         
        _species[4].deathVisualGood = globalParameters.deathVisualGood_4;                
        _species[4].deathVisualBad  = globalParameters.deathVisualBad_4;                
        _species[4].deathSoundGood  = globalParameters.deathSoundGood_4;                
        _species[4].deathSoundBad   = globalParameters.deathSoundBad_4;                

        for (var b=0; b<_numBalls; b++)
        {
            var s = _balls[b].getType();
            {
                _balls[b].setGravity      ( _species[s].gravity    );
                _balls[b].setRadius       ( _species[s].radius     );
                _balls[b].setCollision    ( _species[s].collision  );     
                _balls[b].setAirFriction  ( _species[s].friction   );    
                _balls[b].setImageID      ( _species[s].imageID    );    
                _balls[b].setUsingPhysics ( _species[s].usePhysics );     
            }
        }
        
        _tools.applyParameters();
    }
    
    
    //---------------------------------------------------
    this.setWalls = function( left, bottom, right, top )
    {
        _leftWall   = left;
        _rightWall  = right;
        _bottomWall = bottom;
        _topWall    = top;

        for (var i=0; i<_numBalls; i++)
        {
            _balls[i].setWalls( left, bottom, right, top );
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
    hackyBalls.mouseDown( e.pageX, e.pageY );
}

//---------------------------------
document.onmousemove = function(e) 
{
    hackyBalls.mouseMove( e.pageX, e.pageY );
}

//-------------------------------
document.onmouseup = function(e) 
{
    hackyBalls.mouseUp( e.pageX, e.pageY );
}


//-------------------------------
document.onkeydown = function(e) 
{
    if ( e.keyCode === 32 ) { hackyBalls.spaceKeyPressed();  }
    if ( e.keyCode ===  8 ) { hackyBalls.deleteKeyPressed(); }

    // Ctrl + Sift + D: Toggle developer mode
    if (e.keyCode == 68 && e.ctrlKey && e.shiftKey) { hackyBalls.toggleDevMode(); }
    // Ctrl - S: Save level
    if (e.keyCode == 83 && e.ctrlKey) { hackyBalls.printLevel(); }
    // Ctrl - R: Restore saved level
    if (e.keyCode == 82 && e.ctrlKey) { hackyBalls.restoreLevel(); }
    // Ctrl - N: Next level
    if (e.keyCode == 78 && e.ctrlKey) { hackyBalls.nextLevel(); }
    // Ctrl - P: Prev level
    if (e.keyCode == 80 && e.ctrlKey) { hackyBalls.prevLevel(); }
}

/* Declare main object */
var hackyBalls = new HackyBalls();


/* globally accessible reset */
function reset()
{
    hackyBalls.reset();
}

window.addEventListener("resize", function () {

    // Resize canvas
    canvasID.width = window.innerWidth;
    canvasID.height = window.innerHeight;

    // Update balls walls
    hackyBalls.setWalls ( ZERO, canvasID.height, canvasID.width, ZERO );
});
