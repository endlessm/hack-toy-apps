
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var BALL_MIN_RADIUS 		= 10.0;
var BALL_MAX_RADIUS 		= 50.0;

var BALL_MIN_GRAVITY 		= 0.0;
var BALL_MAX_GRAVITY 		= 0.8;

var BALL_MIN_COLLISION 		= 0.01;
var BALL_MAX_COLLISION 		= 0.2;

var BALL_MIN_AIR_FRICTION 	= 0.0;
var BALL_MAX_AIR_FRICTION 	= 0.3;

var WALL_SOUND = new Audio( "sounds/wall-bump.wav" ); 
var WALL_SOUND_THRESHOLD = 1.5;

//---------------
function Ball()
{	
	var _image			= new Image();
	var _position		= new Vector2D();
	var _grabPosition	= new Vector2D();
	var _velocity		= new Vector2D();
	var _hacked			= false;
	var _grabbed		= false;
	var _radius			= ZERO;
	var _leftWall 		= ZERO;
	var _topWall 		= ZERO;
	var _bottomWall 	= ZERO;
	var _rightWall 		= ZERO;
	var _gravity 		= ZERO;
	var _airFriction	= ZERO;
	var _collision 		= ZERO;
	var _type	 		= 0;
	var _active			= false;


	//--------------------------
	this.initialize = function()
    {	
		_active			= true;
		_image.src  	= "images/ball_0.png";
		_gravity 		= BALL_MIN_GRAVITY;
		_airFriction	= BALL_MIN_AIR_FRICTION;
		_radius	 		= BALL_MIN_RADIUS;
		_collision		= BALL_MIN_COLLISION;
		_position.clear();
		_velocity.clear();
    }


	//------------------------
	this.update = function()
	{	        
		if ( _grabbed )
		{
			_position.set( _grabPosition );

			//reset!
			_grabbed = false;
		}
		else
		{
			this.updatePhysics();
		}	 

		//----------------------------------
		// update wall collisions...
		//----------------------------------
		this.updateWallCollisions();
	}


	//-------------------------------
	this.updatePhysics = function()
	{
		//----------------------------
		// ball falls from gravity
		//----------------------------
		 _velocity.y += _gravity;

		//--------------------------------------
		// dampen velocity by air friction
		//--------------------------------------
		 _velocity.scale( 1.0 - _airFriction );
		
		//----------------------------------
		// update position by velocity...
		//----------------------------------
		_position.add( _velocity );
	}



	//-------------------------------------
	this.updateWallCollisions = function()
	{
		if ( _position.x > _rightWall - _radius ) 
		{ 
			_position.x = _rightWall - _radius;

			if ( _velocity.x > ZERO ) 
			{ 
				//if ( _velocity.x > WALL_SOUND_THRESHOLD ) { WALL_SOUND.play(); } 		
				_velocity.x *= -ONE; 
			} 
		}
		else if ( _position.x < _leftWall + _radius ) 
		{ 
			_position.x = _leftWall + _radius;

			if ( _velocity.x < ZERO ) 
			{ 
				//if ( _velocity.x < -WALL_SOUND_THRESHOLD ) { WALL_SOUND.play(); }		
				_velocity.x *= -ONE; 
			} 
		}

		if ( _position.y > _bottomWall - _radius ) 
		{ 
			_position.y = _bottomWall - _radius;

			if ( _velocity.y > ZERO ) 
			{ 
				//if ( _velocity.y > WALL_SOUND_THRESHOLD ) { WALL_SOUND.play(); } 		
				_velocity.y *= -ONE; 
			} 
		}
		else if ( _position.y < _topWall + _radius ) 
		{ 
			_position.y = _topWall + _radius;

			if ( _velocity.y < ZERO ) 
			{ 
				//if ( _velocity.y < -WALL_SOUND_THRESHOLD ) { WALL_SOUND.play(); }
				_velocity.y *= -ONE; 
			} 
		}
	}


	//-------------------------------------------------------
	// get methods
	//-------------------------------------------------------
	this.getPosition 	= function() { return _position; 	}
	this.getVelocity 	= function() { return _velocity; 	}
	this.getRadius   	= function() { return _radius; 		}
	this.getGravity 	= function() { return _gravity; 	}
	this.getAirFriction	= function() { return _airFriction; }
	this.getCollision	= function() { return _collision; 	}
	this.getGrabbed  	= function() { return _grabbed; 	}
	this.getType  		= function() { return _type; 		}
	this.getActive		= function() { return _active; 		}

	//-------------------------------------------------------
	// set methods
	//-------------------------------------------------------
	this.setPosition 	= function(p) { _position.set(p);	}
	this.setPosition 	= function(p) { _position.set(p);	}
	this.setVelocity 	= function(v) { _velocity.set(v);	}
	this.setRadius 		= function(r) { _radius  	 = r;	}
	this.setGravity 	= function(g) { _gravity 	 = g;	}
	this.setAirFriction	= function(a) { _airFriction = a;	}
	this.setCollision	= function(c) { _collision	 = c;	}

	//-------------------------------------------------------
	this.addVelocity 	= function(v) { _velocity.add(v);	}

	//-------------------------
	this.setType = function(t) 
	{ 
		_image.src = "images/ball_0.png"; 
		
		_type = t;	

			 if ( _type == 1 ) { _image.src = "images/ball_1.png"; }
		else if ( _type == 2 ) { _image.src = "images/ball_2.png"; }
	}

	//---------------------------------------------------
	this.setWalls = function( left, bottom, right, top )
	{
		_leftWall 	= left;
		_rightWall 	= right;
		_bottomWall = bottom;
		_topWall	= top;
	}

	//----------------------------
	this.setHacked = function(h) 
	{ 
		_hacked = h;		
	
		/*
		if ( _hacked )
		{
			_image.src = "images/ball_hacked.png";
		}
		else 
		{
			_image.src = "images/ball_1.png";
		}
		*/
	}

	//------------------------------------
	this.addCollisionForce = function(f) 
	{ 
		_velocity.addScaled( f, _collision );	
	}

	//--------------------------
	this.grab = function( p )
	{
		_grabbed = true;	 
		_grabPosition.set(p);
	}


	//--------------------------
	this.setActive = function(a)
	{
		_active = a;
	}

	//------------------------
	this.render = function()
	{
		//-----------------
		// show the ball
		//-----------------
		canvas.drawImage
		( 
			_image, 
			_position.x - _radius, 
			_position.y - _radius, 
			_radius * 2.0, 
			_radius * 2.0 
		); 
	}
}



