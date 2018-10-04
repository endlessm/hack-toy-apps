
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var USING_TEST_GUI = false;

//---------------------------------------------------------
// The object globalParameters contains all the data that
// must be exposed to and share with GTK so that the UI 
// can be handled externally (not using _hackyBallsGUI).
//---------------------------------------------------------
var globalParameters = 
{
	backgroundImageIndex: 0,
	speciesIndex		: 0,

	// parameters for species 0 balls
	radius0 			: ZERO,
	gravity0 			: ZERO,
	collision0 		: ZERO,
	friction0 			: ZERO,
	socialForce00 	: ZERO,
	socialForce01 	: ZERO,
	socialForce02 	: ZERO,
	touchDeath00 		: false,
	touchDeath01 		: false,
	touchDeath02 		: false,
	imageIndex_0		: 0,

	// parameters for species 1 balls
	radius1 			: ZERO,
	gravity1 			: ZERO,
	collision1 		: ZERO,
	friction1 			: ZERO,
	socialForce10 	: ZERO,
	socialForce11 	: ZERO,
	socialForce12 	: ZERO,
	touchDeath10 		: false,
	touchDeath11 		: false,
	touchDeath12 		: false,
	imageIndex_1		: 0,

	// parameters for species 2 balls
	radius2 			: ZERO,
	gravity2 			: ZERO,
	collision2 		: ZERO,
	friction2 			: ZERO,
	socialForce20 	: ZERO,
	socialForce21 	: ZERO,
	socialForce22 	: ZERO,
	touchDeath20 		: false,
	touchDeath21 		: false,
	touchDeath22 		: false,
	imageIndex_2		: 0,
}


//----------------------
function HackyBalls()
{	
	var FLINGER_SPRING_FORCE	= 0.7;
	var FLINGER_FRICTION		= 0.5;
	var FLINGER_GRAVITY			= 5.0;
	var FLINGER_FLING_DURATION	= 30;
	var FLINGER_HOLD_FORCE 		= 0.1;
	var FLINGER_FLING_FORCE 	= 0.5;
	var FLINGER_HANDLE_SIZE		= 19.0;
	var FLINGER_SIZE	 		= 50.0;
	
	var CURSOR_SIZE				= 40.0;
	var NUM_BALL_SPECIES 		= 3;
	var NULL_BALL 				= -1;
	var MAX_BALLS				= 100;
	var MAX_FORCE 				= 0.5;
	var INTERACTION_RADIUS 		= 200.0;
	var SCORE_EFFECT_DURATION 	= 60; 
	var MILLISECONDS_PER_UPDATE = 10;

	var TOOL_MOVE 		= 0;
	var TOOL_CREATE 	= 1;
	var TOOL_DELETE 	= 2;
	var TOOL_SPECIES  	= 3;
	var NUM_TOOLS		= 4;

	var FLINGER_STATE_NULL		= -1;
	var FLINGER_STATE_MOVING	=  0;
	var FLINGER_STATE_WAITING	=  1;
	var FLINGER_STATE_PULLING	=  2;
	var FLINGER_STATE_FLINGING	=  3;
	
	var BUTTON_SOUND		= new Audio( "sounds/button.wav"		); 
	var CREATE_SOUND		= new Audio( "sounds/create.wav"		); 
	var TOO_MANY_SOUND		= new Audio( "sounds/too-many.wav"		); 
	var KILL_SOUND			= new Audio( "sounds/kill.wav"  		); 
	var FLING_SOUND			= new Audio( "sounds/fling.wav" 		); 
	var MOVE_FLING_SOUND	= new Audio( "sounds/move-fling.wav"	); 
	var SUCCESS_SOUND		= new Audio( "sounds/success.wav"		); 


	//--------------------
	function Species()
	{	
		this.gravity	= ZERO;
		this.radius		= ZERO;
		this.friction	= ZERO;
		this.collision	= ZERO;
		this.forces		= new Array( NUM_BALL_SPECIES );
		this.touchDeath	= new Array( NUM_BALL_SPECIES );

		for (var s=0; s<NUM_BALL_SPECIES; s++)
		{	
			this.forces		[s] = ZERO;				
			this.touchDeath	[s] = false;				
		}
	}

	//------------------
	function Flinger()
	{	
		this.state 			= FLINGER_STATE_NULL;
		this.ballIndex		= NULL_BALL;
		this.position		= new Vector2D();
		this.handlePosition	= new Vector2D();
		this.handleVelocity	= new Vector2D();
		this.handleLength	= ZERO;
		this.image			= new Image();
		
		//-----------------------
		this.update = function()
		{	  
			var xx = _flinger.handlePosition.x - _flinger.position.x;
			var yy = _flinger.handlePosition.y - _flinger.position.y;

			var currentLength = Math.sqrt( xx*xx + yy*yy );
			if ( currentLength > ZERO )
			{
				var force = ( _flinger.handleLength - currentLength ) * FLINGER_SPRING_FORCE;
				
				xx /= currentLength;
				yy /= currentLength;
			
				_flinger.handleVelocity.x += xx * force;	
				_flinger.handleVelocity.y += yy * force;					
			}

			_flinger.handleVelocity.addY( FLINGER_GRAVITY );
			_flinger.handleVelocity.scale( ONE - FLINGER_FRICTION );
			_flinger.handlePosition.add( _flinger.handleVelocity );
			_flinger.handlePosition.addScaled( _flinger.handleVelocity, 0.9 );				
		}		
	}


	//-------------------------
	function DeathAnimation()
	{	
		this.position 	= new Vector2D();
		this.image		= new Image();
		this.clock		= 0;
		this.radius		= ZERO;
		this.duration   = 20;
	}

	//--------------------
	function ToolButton()
	{	
		this.visible	= false;
		this.position	= new Vector2D();
		this.width		= ZERO;
		this.height		= ZERO;
		this.image		= new Image();
	}
	
	//----------------
	function Score()
	{	
		this.number		= 0;
		this.clock		= 0;
		this.ballIndex 	= NULL_BALL;
		this.image		= new Image();
	}
	
	var _flinger			= new Flinger();
	var _species			= new Array( NUM_BALL_SPECIES );
	var _background			= new Image();
	var _logo				= new Image();
	var _cursor				= new Image();
	var _success			= new Image();
	var _balls 				= new Array();
	var _toolButtons 		= new Array( NUM_TOOLS );
	var _deathAnimation		= new DeathAnimation();
	var _numBalls			= 0;
	var _hackyBallsGUI 		= new HackyBallsGUI();
	var _leftWall 			= 90;
	var _topWall 			= ZERO;
	var _bottomWall 		= canvasID.height;
	var _rightWall 			= canvasID.width;
	var _grabbedBall		= NULL_BALL;
	var _selectedSpecies	= 0;
	var _currentTool		= TOOL_MOVE;
    var _mousePosition		= new Vector2D();
    var _prevMousePosition	= new Vector2D();
    var _mouseVelocity		= new Vector2D();
    var _vector				= new Vector2D();
	var _startTime			= ZERO;
	var _score				= new Score();
	var _useAudio			= false;


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

		//-------------------------------------
		// configure parameters to start game
		//-------------------------------------
		globalParameters.backgroundImageIndex = 0;
		globalParameters.speciesIndex = 0;

		// parameters for species 0 balls
		globalParameters.radius0 			= BALL_MAX_RADIUS  		*  0.6;
		globalParameters.gravity0 			= BALL_MAX_GRAVITY 		*  0.5;
		globalParameters.collision0 		= BALL_MAX_COLLISION 	*  1.0;
		globalParameters.friction0 		= BALL_MAX_AIR_FRICTION *  0.15;
		globalParameters.socialForce00 	= MAX_FORCE 			* -0.3;
		globalParameters.socialForce01 	= MAX_FORCE 			*  0.0;
		globalParameters.socialForce02 	= MAX_FORCE 			*  0.0;
		globalParameters.touchDeath00 	= false;
		globalParameters.touchDeath01 	= true;
		globalParameters.touchDeath02 	= false;
		globalParameters.imageIndex_0		= 0;
		
		// parameters for species 1 balls
		globalParameters.radius1 			= BALL_MAX_RADIUS		*  1.0;
		globalParameters.gravity1 			= BALL_MIN_GRAVITY		*  1.0;
		globalParameters.collision1 		= BALL_MAX_COLLISION	*  1.0;
		globalParameters.friction1 		= BALL_MAX_AIR_FRICTION *  0.33;
		globalParameters.socialForce10 	= MAX_FORCE				* -1.0;
		globalParameters.socialForce11 	= MAX_FORCE 			*  0.0;
		globalParameters.socialForce12 	= MAX_FORCE				*  1.0;
		globalParameters.touchDeath10 	= false;
		globalParameters.touchDeath11 	= false;
		globalParameters.touchDeath12 	= true;
		globalParameters.imageIndex_1		= 1;

		// parameters for species 2 balls
		globalParameters.radius2 			= BALL_MAX_RADIUS 		*  0.6;
		globalParameters.gravity2 			= BALL_MAX_GRAVITY 		*  0.1;
		globalParameters.collision2 		= BALL_MAX_COLLISION	*  1.0;
		globalParameters.friction2 		= BALL_MAX_AIR_FRICTION *  0.33;
		globalParameters.socialForce20 	= MAX_FORCE 			*  0.0;	
		globalParameters.socialForce21 	= MAX_FORCE				*  0.0;
		globalParameters.socialForce22 	= MAX_FORCE				* -1.0;	
		globalParameters.touchDeath20 	= false;
		globalParameters.touchDeath21 	= false;
		globalParameters.touchDeath22 	= false;
		globalParameters.imageIndex_2		= 2;

		//---------------------------------------------
		// initialize user interface with parameters
		//---------------------------------------------
		if ( USING_TEST_GUI )
		{
			_hackyBallsGUI.initialize( globalParameters );
		}
		
		//----------------------------
		// get start time
		//----------------------------
		_startTime = (new Date).getTime();

		//--------------------------------------
		// grab images
		//--------------------------------------
		_logo.src 			= "images/logo.png";
		_cursor.src 		= "images/move-tool-selected.png";
		_background.src 	= "images/background-0.png";
		_flinger.image.src	= "images/flinger.png";
		
		//------------------------------------
		// create tools
		//------------------------------------
		var left = 20.0;
		var size = 50.0;
		for (var t=0; t<NUM_TOOLS; t++)
		{
			_toolButtons[t] = new ToolButton();
			_toolButtons[t].visible = true;
			_toolButtons[t].position.setXY( left, 100 + t * 60.0 );
			_toolButtons[t].width  = 50.0;
			_toolButtons[t].height = 50.0;
			_toolButtons[t].image.src = "images/move-tool.png";
		}
		
		_toolButtons[ TOOL_MOVE		].image.src = "images/move-tool.png";
		_toolButtons[ TOOL_CREATE	].image.src = "images/create-tool.png";
		_toolButtons[ TOOL_DELETE	].image.src = "images/delete-tool.png";

		_toolButtons[ TOOL_SPECIES ].position.setXY( left + size + 3, _toolButtons[ TOOL_CREATE ].position.y );
		_toolButtons[ TOOL_SPECIES ].height = size * 2.7;
		_toolButtons[ TOOL_SPECIES ].image.src = "images/ball-type-0.png";
		_toolButtons[ TOOL_SPECIES ].visible = false;

		this.selectTool( TOOL_MOVE );

		//----------------------------
		// apply parameters  
		//----------------------------
		this.applyParameters();
		
		//----------------------------
		// create some initial balls  
		//----------------------------
		var r = _species[0].radius;
		var x = _leftWall + r;
		var y = canvasID.height - r;
		var species = 0;
		
		this.createBall( x + r * 0, y, 				species );
		this.createBall( x + r * 2, y, 				species );
		this.createBall( x + r * 4, y, 				species );
		this.createBall( x + r * 1, y - r * 1.7,	species );
		this.createBall( x + r * 3, y - r * 1.7,	species );
		this.createBall( x + r * 2, y - r * 3.4,	species );

		x = canvasID.width * ONE_HALF;
		y = 200;
		s = 130;
		species = 1;
		this.createBall( x, y + s * 0, species );
		this.createBall( x, y + s * 1, species );
		this.createBall( x, y + s * 3, species );
		this.createBall( x, y + s * 4, species );
		
		var r = _species[2].radius;
		var x = 1000;
		var y = canvasID.height - r;

		this.createBall( x + r *  0, y, 2 );
		this.createBall( x + r *  2, y, 2 );
		this.createBall( x + r *  4, y, 2 );
		this.createBall( x + r *  6, y, 2 );
		this.createBall( x + r *  8, y, 2 );
		this.createBall( x + r * 10, y, 2 );

		
		//-----------------------------------------------------------------------------
		// turn this on only after creating the initial balls, because some browsers
		// don't want to have sounds played until the user has done some interaction. 
		//-----------------------------------------------------------------------------
		_useAudio = true;		
		
		//------------------------------------------------------------------------
		// set up scoring
		//------------------------------------------------------------------------
		_score.showing	 = 0;
		_score.clock	 = 0.0;
		_score.image.src = "images/fireworks.png";
		
		//------------------------------------------------------------------------
		// set up death animation
		//------------------------------------------------------------------------
		_deathAnimation.position.clear()
		_deathAnimation.clock		= 0;
		_deathAnimation.radius		= ZERO;
		_deathAnimation.duration   	= 20;
		_deathAnimation.image.src 	= "images/green-death.png";	
		
		//------------------------------------------------------------------------
		// start up the timer
		//------------------------------------------------------------------------
		this.timer = setTimeout( "hackyBalls.update()", MILLISECONDS_PER_UPDATE );		
    }




	//------------------------------------------
	this.createBall = function( x, y, species )
	{	
		if ( _numBalls < MAX_BALLS )
		{
			if ( _useAudio ) { CREATE_SOUND.play(); }  		
	
			//---------------------------------------------
			// jitter discourages balls from being created 
			// at the same position as other balls due to 
			// the user rapidly clicking to add
			//---------------------------------------------
			var jitter = 0.1;
		
			x += (-jitter * ONE_HALF + Math.random() * jitter );
			y += (-jitter * ONE_HALF + Math.random() * jitter );
		
			_balls[ _numBalls ] = new Ball();
			_balls[ _numBalls ].initialize();
			_balls[ _numBalls ].setWalls( _leftWall, _bottomWall, _rightWall, _topWall );

			var position = new Vector2D();
			var velocity = new Vector2D();
			position.setXY( x, y );
			velocity.clear();

			_balls[ _numBalls ].setVelocity		( velocity );
			_balls[ _numBalls ].setPosition		( position );
			_balls[ _numBalls ].setGravity		( _species[ species ].gravity	);
			_balls[ _numBalls ].setRadius		( _species[ species ].radius	);
			_balls[ _numBalls ].setCollision	( _species[ species ].collision	); 	
			_balls[ _numBalls ].setAirFriction	( _species[ species ].friction	);

			_balls[ _numBalls ].setType( species );

			_numBalls ++;
		}
		else
		{
			if ( _useAudio ) { TOO_MANY_SOUND.play(); }	
		}
	}



	//------------------------
	this.update = function()
	{	   
		//---------------------------------------
		// this gets called all the time to 
		// catch any changes from the UI
		//--------------------------------------
		this.applyParameters();

		//-------------------------------------
		// get seconds since started...
		//-------------------------------------
		_seconds = ( (new Date).getTime() - _startTime ) / MILLISECONDS_PER_SECOND;

		//-----------------------------
		// loop through all balls
		//-----------------------------
		for (var b=0; b<_numBalls; b++)
		{
			if ( _balls[b].getActive() )
			{
				if ( _grabbedBall == b )
				{
					_balls[b].grab( _mousePosition );
				}

				//-----------------------------
				// basic ball physics update
				//-----------------------------
				this.updateBall(b);
			}
		}
		
		//-----------------------------
		// update flinger
		//-----------------------------
		if (( _flinger.state != FLINGER_STATE_NULL )
		&&  ( _flinger.state != FLINGER_STATE_PULLING ))
		{
			_flinger.update();
		}
			
		//---------------------------
		// render everything...
		//---------------------------
		this.render();

		//---------------------------
		// trigger next update...
		//---------------------------
		this.timer = setTimeout( "hackyBalls.update()", MILLISECONDS_PER_UPDATE );
	} 



	//----------------------------
	this.updateBall = function(b)
	{
		//-----------------------------
		// basic physics update
		//-----------------------------
		_balls[b].update( _seconds );

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
				force.scale( FLINGER_HOLD_FORCE );

				_balls[b].addVelocity( force );			
			}
			else if ( _flinger.state == FLINGER_STATE_WAITING )
			{
				var force = new Vector2D();

				force.setToDifference( _flinger.position, _balls[b].getPosition() );
				force.scale( FLINGER_HOLD_FORCE );

				_balls[b].addVelocity( force );
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
				force.scale( FLINGER_FLING_FORCE );
				
				if ( _useAudio ) { FLING_SOUND.play(); }		

				_balls[b].addVelocity( force );

				_flinger.state = FLINGER_STATE_NULL;
			}
		}

		//-----------------------------
		// ball-to-ball interactions
		//-----------------------------
		for (var o=0; o<_numBalls; o++)
		{	
			if ( _balls[o].getActive() )
			{	
				if ( b != o )
				{
					_vector.setToDifference( _balls[b].getPosition(), _balls[o].getPosition() );

					var distance = _vector.getMagnitude();

					//-----------------------------
					// attractions and repulsions
					//-----------------------------
					if ( distance < INTERACTION_RADIUS )
					{
						if ( distance > ZERO )
						{
							var bSpecies = _balls[b].getType();
							var oSpecies = _balls[o].getType();

							var force = new Vector2D();

							force.setToScaled( _vector, ONE / distance );
							force.scale( _species[ bSpecies ].forces[ oSpecies ] );
							_balls[b].addVelocity( force );
						}
						
						//-----------------------------
						// collisions
						//-----------------------------
						var combinedRadii = _balls[b].getRadius() + _balls[o].getRadius();

						if ( distance < combinedRadii )
						{	
							//------------------------------------------
							// detect score advance
							//------------------------------------------
							if ( _score.ballIndex == b )
							{
								if (( bSpecies == 0 ) && ( oSpecies == 2 ))
								{
									_score.clock = SCORE_EFFECT_DURATION;
									_score.ballIndex = NULL_BALL;
									if ( _useAudio ) { SUCCESS_SOUND.play(); }  		
								}
							}
							
							if ( _species[ bSpecies ].touchDeath[ oSpecies ] )
							{
								this.killBall(b);								
							}
							else
							{								
								var f = ONE - ( distance / combinedRadii );

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
	
	
	//---------------------------
	this.killBall = function(b)
	{	
		_deathAnimation.position.setXY( _balls[b].getPosition().x, _balls[b].getPosition().y )
		_deathAnimation.clock = 0;
		_deathAnimation.duration = 30;
		_deathAnimation.radius = _balls[b].getRadius();
		_deathAnimation.image.src = "images/green-death.png";	
		
			 if ( _balls[b].getType() == 0 ) { _deathAnimation.image.src = "images/green-death.png"; 	}
		else if ( _balls[b].getType() == 1 ) { _deathAnimation.image.src = "images/red-death.png"; 		}
		else if ( _balls[b].getType() == 2 ) { _deathAnimation.image.src = "images/black-death.png"; 	}

		if ( _useAudio ) { KILL_SOUND.play(); }		

		_balls[b].setActive( false );
		
		//---------------------------------------------------------
		// if this ball has the flinger on it, kill the flinger
		//--------------------------------------------------------
		if ( b == _flinger.ballIndex )
		{
			_flinger.state = FLINGER_STATE_NULL;		
		}	
	}
	
		

	//------------------------
	this.render = function()
	{	
		//-------------------------------------------
		// show background
		//-------------------------------------------
		canvas.drawImage( _background, 0, 0, canvasID.width, canvasID.height );

		//----------------
		// show info 
		//----------------
		this.showInfo();
		
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
			}
		}
		
		//-----------------------
		// show the flinger
		//-----------------------
		if ( _flinger.state != FLINGER_STATE_NULL )
		{		
			this.showFlinger();
		}		
		
		
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
			if ( _balls[b].getActive() )
			{
				_balls[b].render();
			}
		}
		
		//-------------------------
		// show user interface
		//-------------------------
		if ( USING_TEST_GUI )
		{
			_hackyBallsGUI.render();
		}
		
		//-------------------------------------
		// show success from advancing score
		//-------------------------------------
		if ( _score.clock > 0 )
		{
			var f = ONE - ( _score.clock / SCORE_EFFECT_DURATION );
			var size = 300.0 + 200.0 * f;
			
			canvas.drawImage
			(
				_score.image, 
				canvasID.width  * ONE_HALF - size * ONE_HALF, 
				canvasID.height * ONE_HALF - size * ONE_HALF, 
				size, 
				size 
			);
			
			_score.clock --;
		}
	}
	

	//-------------------------
	this.showInfo = function()
	{		
		canvas.drawImage( _logo, 10, 10, 50, 20 );

		//-------------------------------------------
		// title and instructions
		//-------------------------------------------
		canvas.font = '16px sans-serif';
		canvas.fillStyle = "rgb( 220, 210, 200 )";		
		canvas.fillText( "HackyBalls v0.4", 10, 50 );
	}


	//----------------------------
	this.showFlinger = function()
	{			
		canvas.lineWidth = 4; 
		canvas.strokeStyle = "rgba( 200, 230, 255, 0.3 )";
				
		var radius = _balls[ _flinger.ballIndex ].getRadius() * 1.5;
					
		var xx = _flinger.handlePosition.x - _flinger.position.x;
		var yy = _flinger.handlePosition.y - _flinger.position.y;	
		
		var d = Math.sqrt( xx*xx + yy*yy );		
					
		if ( d > ZERO )
		{					
			xx /= d;
			yy /= d;	
		}
		else
		{
			xx = ZERO;
			yy = ONE;
		}
			
		xx *= radius;
		yy *= radius;
		
		var xl = xx * 0.9;
		var yl = yy * 0.9;
		
		//-----------------------------------
		// show slingshot rubber band lines
		//-----------------------------------
		canvas.beginPath();
		canvas.moveTo
		( 
			_balls[ _flinger.ballIndex ].getPosition().x - yl, 
			_balls[ _flinger.ballIndex ].getPosition().y + xl
		);

		canvas.lineTo
		( 
			_flinger.position.x - yl, 
			_flinger.position.y + xl
		);

		canvas.closePath();
		canvas.stroke();

		canvas.beginPath();
		canvas.moveTo
		( 
			_balls[ _flinger.ballIndex ].getPosition().x + yl, 
			_balls[ _flinger.ballIndex ].getPosition().y - xl
		);

		canvas.lineTo
		( 
			_flinger.position.x + yl, 
			_flinger.position.y - xl
		);
		
		canvas.closePath();
		canvas.stroke();		
		
		canvas.fillStyle = "rgba( 255, 255, 255, 0.4 )";	

		canvas.beginPath();
		canvas.arc
		( 
			_flinger.position.x - yl, 
			_flinger.position.y + xl,
			5.0, 0, PI2, false 
		);			
		canvas.fill();
		canvas.closePath();	

		canvas.beginPath();
		canvas.arc
		( 
			_flinger.position.x + yl, 
			_flinger.position.y - xl,
			5.0, 0, PI2, false 
		);			
		canvas.fill();
		canvas.closePath();	
		
	
		//-----------------------------------
		// show slingshot harness
		//-----------------------------------
		canvas.translate
		( 
			_balls[ _flinger.ballIndex ].getPosition().x - xx - yy, 
			_balls[ _flinger.ballIndex ].getPosition().y - yy + xx 
		);
	
		var angle = -Math.PI * ONE_HALF + Math.atan2( yy, xx ); 
		canvas.rotate( angle );	
		canvas.scale( radius * 2.0, radius * 2.0 );
		canvas.drawImage( _flinger.image, ZERO, ZERO, ONE, ONE );
		canvas.resetTransform();
	}
	


	//--------------------------------
	this.mouseDown = function( x, y )
	{
		if ( USING_TEST_GUI )
		{
			if ( _grabbedBall == NULL_BALL )
			{
				_hackyBallsGUI.setMouseDown( x, y );
				globalParameters = _hackyBallsGUI.getParameters();			
				this.applyParameters();			
			}
		}
		
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
				else if ( t == TOOL_SPECIES )
				{
					var h = ( y - _toolButtons[t].position.y ) / _toolButtons[t].height;
					_selectedSpecies = Math.floor( h * NUM_BALL_SPECIES );
					
					if ( _selectedSpecies == 0 ) { _toolButtons[ TOOL_SPECIES ].image.src = "images/ball-type-0.png"; }
					if ( _selectedSpecies == 1 ) { _toolButtons[ TOOL_SPECIES ].image.src = "images/ball-type-1.png"; }
					if ( _selectedSpecies == 2 ) { _toolButtons[ TOOL_SPECIES ].image.src = "images/ball-type-2.png"; }
				}
				else if ( t != TOOL_SPECIES )
				{
					_toolButtons[ TOOL_SPECIES ].visible = false;
				}
			}
		}

		if ( ! buttonSelected )
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
					if ( _balls[b].getActive() )
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
								this.killBall(b);
							}
							else 
							{							
								if ( _currentTool == TOOL_MOVE )
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
		
		
		//----------------------------------
		// detect selecting flinger handle
		//----------------------------------
		if ( _flinger.state == FLINGER_STATE_WAITING )
		{
			if (( x > _flinger.handlePosition.x - FLINGER_HANDLE_SIZE )
			&&  ( x < _flinger.handlePosition.x + FLINGER_HANDLE_SIZE )
			&&  ( y > _flinger.handlePosition.y - FLINGER_HANDLE_SIZE )
			&&  ( y < _flinger.handlePosition.y + FLINGER_HANDLE_SIZE ))
			{
				_flinger.state = FLINGER_STATE_PULLING;
			}
		}

		this.updateMouse( x, y );
	}



	//---------------------------------
	this.putBallInFlinger = function(b)
	{
		if ( _useAudio ) { MOVE_FLING_SOUND.play(); }		

		_flinger.handleLength 		= _balls[b].getRadius() + 4.0;	
		_flinger.state 				= FLINGER_STATE_MOVING;
		_flinger.ballIndex			= b;
		_flinger.position.x 		= _balls[b].getPosition().x;
		_flinger.position.y 		= _balls[b].getPosition().y;
		_flinger.handlePosition.x	= _flinger.position.x;
		_flinger.handlePosition.y	= _flinger.position.y + _flinger.handleLength;
		_flinger.handleVelocity.clear();
		
		_score.ballIndex = b;
	}


	//-----------------------------
	this.selectTool = function(t)
	{
		if ( _useAudio ) { BUTTON_SOUND.play(); }		
	
		_currentTool = t;
		_flinger.ballIndex = NULL_BALL;
		_flinger.state = FLINGER_STATE_NULL;

		_toolButtons[ TOOL_MOVE		].image.src = "images/move-tool.png";
		_toolButtons[ TOOL_CREATE	].image.src = "images/create-tool.png";
		_toolButtons[ TOOL_DELETE	].image.src = "images/delete-tool.png";

			 if ( t == TOOL_MOVE 	) { _toolButtons[t].image.src = "images/move-tool-selected.png"; 	}
		else if ( t == TOOL_CREATE 	) { _toolButtons[t].image.src = "images/create-tool-selected.png"; 	}
		else if ( t == TOOL_DELETE 	) { _toolButtons[t].image.src = "images/delete-tool-selected.png"; 	}
	}



	//--------------------------------
	this.mouseMove = function( x, y )
	{
		if ( _grabbedBall == NULL_BALL )
		{
			if ( USING_TEST_GUI )
			{
				_hackyBallsGUI.setMouseMove( x, y );
				globalParameters = _hackyBallsGUI.getParameters();			
				this.applyParameters();
			}
		}

		if ( _flinger.state == FLINGER_STATE_PULLING )
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
			if ( _balls[b].getActive() )
			{
				if ( _grabbedBall == b )
				{
					//throw ball...
					_balls[b].setVelocity( _mouseVelocity );
					_grabbedBall = NULL_BALL
				}
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
			this.killBall( _flinger.ballIndex );
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
				
		_species[0].gravity			= globalParameters.gravity0;
		_species[0].radius			= globalParameters.radius0;
		_species[0].friction		= globalParameters.friction0;
		_species[0].collision		= globalParameters.collision0;
		_species[0].forces[0] 		= globalParameters.socialForce00;				
		_species[0].forces[1] 		= globalParameters.socialForce01;
		_species[0].forces[2] 		= globalParameters.socialForce02;	
		_species[0].touchDeath[0] 	= globalParameters.touchDeath00;				
		_species[0].touchDeath[1] 	= globalParameters.touchDeath01;
		_species[0].touchDeath[2] 	= globalParameters.touchDeath02;	
				
		_species[1].gravity			= globalParameters.gravity1;
		_species[1].radius			= globalParameters.radius1;
		_species[1].friction		= globalParameters.friction1;
		_species[1].collision		= globalParameters.collision1;
		_species[1].forces[0] 		= globalParameters.socialForce10;				
		_species[1].forces[1] 		= globalParameters.socialForce11;
		_species[1].forces[2] 		= globalParameters.socialForce12;	
		_species[1].touchDeath[0] 	= globalParameters.touchDeath10;				
		_species[1].touchDeath[1] 	= globalParameters.touchDeath11;
		_species[1].touchDeath[2] 	= globalParameters.touchDeath12;	

		_species[2].gravity			= globalParameters.gravity2;
		_species[2].radius			= globalParameters.radius2;
		_species[2].friction		= globalParameters.friction2;
		_species[2].collision		= globalParameters.collision2;
		_species[2].forces[0] 		= globalParameters.socialForce20;				
		_species[2].forces[1] 		= globalParameters.socialForce21;
		_species[2].forces[2] 		= globalParameters.socialForce22;	
		_species[2].touchDeath[0] 	= globalParameters.touchDeath20;				
		_species[2].touchDeath[1] 	= globalParameters.touchDeath21;
		_species[2].touchDeath[2] 	= globalParameters.touchDeath22;	
		
		for (var b=0; b<_numBalls; b++)
		{
			var s = _balls[b].getType();
			{
				_balls[b].setGravity	( _species[s].gravity 	);
				_balls[b].setRadius		( _species[s].radius 	);
				_balls[b].setCollision	( _species[s].collision	); 	
				_balls[b].setAirFriction( _species[s].friction	);	
			}
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
    hackyBalls.mouseDown( e.pageX - rect.left, e.pageY - rect.top );
}

//---------------------------------
document.onmousemove = function(e) 
{
	var rect = e.target.getBoundingClientRect();
    hackyBalls.mouseMove( e.pageX - rect.left, e.pageY - rect.top );
}

//-------------------------------
document.onmouseup = function(e) 
{
	var rect = e.target.getBoundingClientRect();
    hackyBalls.mouseUp( e.pageX - rect.left, e.pageY - rect.top );
}

//-------------------------------
document.onkeydown = function(e) 
{
    if ( e.keyCode === 32 ) { hackyBalls.spaceKeyPressed();  }
    if ( e.keyCode ===  8 ) { hackyBalls.deleteKeyPressed(); }
}


