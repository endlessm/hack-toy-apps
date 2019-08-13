
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var ImageCache = {};

//---------------
function Ball()
{    
	var _image		= null;
    var _lastPosition    = new Vector2D();
    var _position        = new Vector2D();
    var _grabPosition    = new Vector2D();
    var _velocity        = new Vector2D();
    var _grabbed        = false;
    var _radius            = ZERO;
    var _leftWall         = ZERO;
    var _topWall         = ZERO;
    var _bottomWall     = ZERO;
    var _rightWall         = ZERO;
    var _gravity         = ZERO;
    var _airFriction    = ZERO;
    var _collision         = ZERO;
    var _type             = 0;
    var _usingPhysics    = false;
    var _wasCollidingWithWalls = false;
    var _isCollidingWithWalls = false;

    //----------------------------------
    this.update = function( deltaTime )
    {                
        _lastPosition.set( _position );
        if ( _grabbed )
        {
            _position.set( _grabPosition );

            //reset!
            _grabbed = false;
        }
        else
        {
            if ( _usingPhysics )
            {
                this.updatePhysics( deltaTime );
            }     
        }
        
        //----------------------------------
        // update wall collisions...
        //----------------------------------
        this.updateWallCollisions();
    }


    //------------------------------------------
    this.updatePhysics = function( deltaTime )
    {
        //-------------------------------------
        // ball falls from gravity
        //-------------------------------------
         _velocity.y += _gravity * deltaTime;

        //--------------------------------------
        // dampen velocity by air friction
        //--------------------------------------
         _velocity.scale( ONE - _airFriction );

        if (_velocity.getMagnitudeSquared() < 0.01)
            _velocity.clear();

        //----------------------------------
        // update position by velocity...
        //----------------------------------
        // We're doing this weird division by 0.03 because the code initially was adding the velocity every frame
        // which means that velocities are tuned for about 30ms frames. Instead of changing them everywhere
        // this seemed a simpler step. We can change it later if we want to.
        var deltaPos = new Vector2D();
        deltaPos.set( _velocity );
        deltaPos.scale( deltaTime/0.03 );
        _position.add( deltaPos );
    }

    //-------------------------------------
    this.updateWallCollisions = function()
    {
        _wasCollidingWithWalls = _isCollidingWithWalls;

        _isCollidingWithWalls = false;
        if ( _position.x > _rightWall - _radius ) 
        { 
            _position.x = _rightWall - _radius;
            _isCollidingWithWalls = true;

            if ( _velocity.x > ZERO ) 
            { 
                _velocity.x *= -ONE; 
            } 
        }
        else if ( _position.x < _leftWall + _radius ) 
        { 
            _position.x = _leftWall + _radius;
            _isCollidingWithWalls = true;

            if ( _velocity.x < ZERO ) 
            { 
                _velocity.x *= -ONE; 
            } 
        }


        if ( _position.y > _bottomWall - _radius ) 
        { 
            _position.y = _bottomWall - _radius;
            _isCollidingWithWalls = true;

            if ( _velocity.y > ZERO ) 
            { 
                _velocity.y *= -ONE; 
            } 
        }
        else if ( _position.y < _topWall + _radius ) 
        { 
            _position.y = _topWall + _radius;
            _isCollidingWithWalls = true;

            if ( _velocity.y < ZERO ) 
            { 
                _velocity.y *= -ONE; 
            } 
        }
    }

    //---------------------------------------------------------------
    // get methods
    //---------------------------------------------------------------
    this.getMaxDistanceToCorner = function()
    {
        const maxWidth = Math.max(
            Math.abs(_position.x - _leftWall),
            Math.abs(_position.x - _rightWall)
        );
        const maxHeight = Math.max(
            Math.abs(_position.y - _bottomWall),
            Math.abs(_position.y - _topWall)
        );
        const distance = Math.hypot(maxWidth, maxHeight);
        return Math.abs(distance - _radius);
    }

    this.getLastPosition         = function() { return _lastPosition;         }
    this.getPosition         = function() { return _position;         }
    this.getVelocity         = function() { return _velocity;         }
    this.getRadius           = function() { return _radius;             }
    this.getGravity         = function() { return _gravity;         }
    this.getAirFriction        = function() { return _airFriction;     }
    this.getCollision        = function() { return _collision;         }
    this.getUsingPhysics    = function() { return _usingPhysics;    }
    this.getGrabbed          = function() { return _grabbed;         }
    this.getType              = function() { return _type;             }
    this.isCollidingWithWalls = function() { return _isCollidingWithWalls; }
    this.wasCollidingWithWalls = function() { return _wasCollidingWithWalls; }

    //---------------------------------------------------------------
    // set methods
    //---------------------------------------------------------------
    this.setPosition         = function(p) { _position.set(p);        }
    this.setVelocity         = function(v) { _velocity.set(v);        }
    this.setRadius             = function(r) { _radius           = r;    }
    this.setGravity         = function(g) { _gravity          = g;    }
    this.setAirFriction        = function(a) { _airFriction     = a;    }
    this.setCollision        = function(c) { _collision         = c;    }
    this.setUsingPhysics    = function(p) { _usingPhysics    = p;     }

    //-------------------------------------------------------
    this.addVelocity   = function(v) { _velocity.add(v);    }
    this.scaleVelocity = function(s) { _velocity.scale(s);  }

    //-------------------------
    this.setType = function(t) 
    { 
        _type = t;    
    }

    //-------------------------------
    this.setImageID = function( id ) 
    { 
		var imageID = "images/ball-" + id + ".png";

		_image = ImageCache[imageID];

		if (!_image)
		{
			_image = new Image();
			_image.src = imageID;
			ImageCache[imageID] = _image;
		}
    }

    //---------------------------------------------------
    this.setWalls = function( left, bottom, right, top )
    {
        _leftWall     = left;
        _rightWall     = right;
        _bottomWall = bottom;
        _topWall    = top;
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

    //------------------------
    this.render = function()
    {
        //-----------------
        // show the ball
        //-----------------
	canvas.drawImageCached
        ( 
            _image, 
            _position.x - _radius, 
            _position.y - _radius, 
            _radius * 2.0, 
            _radius * 2.0 
        ); 
    }
}



