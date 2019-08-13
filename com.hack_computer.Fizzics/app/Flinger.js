var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

//---------------------------------
// flinger states
//---------------------------------
var FLINGER_STATE_NULL      = -1;
var FLINGER_STATE_WAITING   =  0;
var FLINGER_STATE_PULLING   =  1;
var FLINGER_STATE_FLINGING  =  2;

//---------------------------------
// flinger constants
//---------------------------------
var FLINGER_SPRING_FORCE    = 10.0;
var FLINGER_FRICTION        = 20.0;
var FLINGER_GRAVITY         = 200.0;
var FLINGER_HOLD_FORCE      = 20.0;
var FLINGER_MIN_PULL_RATIO  = 0.7;
var FLINGER_FLING_FORCE     = 0.15;
var FLINGER_FLING_DURATION  = 30;
var FLINGER_HANDLE_SIZE     = 30.0;
var FLINGER_SIZE            = 50.0;
var FLINGER_MIN_RADIUS      = 50.0;
var FLINGER_INITIAL_JOLT    = 6.0;

//------------------
function Flinger()
{        
    var _position       = new Vector2D();
    var _handlePosition = new Vector2D();
    var _handleVelocity = new Vector2D();
    var _pullPosition   = new Vector2D();
    var _handleLength   = ZERO;
    var _deltaTime      = ZERO;
    var _radius         = ZERO;
    var _image          = new Image();
    var _ballIndex      = NULL_BALL;
    var _state          = FLINGER_STATE_NULL;
    var _readyToFling   = false;
    var _flingingBall   = NULL_BALL;
    var _clickCount     = 0;

    
    _image.src = "images/flinger.png";


    //--------------------------------------------------------------
    this.setBall = function( ballIndex, ballPosition, ballRadius )
    {
        _handleLength       = ballRadius + 4.0;    
        _state              = FLINGER_STATE_WAITING;
        _clickCount         = 0;
        _ballIndex          = ballIndex;
        _position.x         = ballPosition.x;
        _position.y         = ballPosition.y;
        _radius             = ballRadius;
        
        _handlePosition.x   = _position.x;
        _handlePosition.y   = _position.y + _handleLength;
        _handleVelocity.clear();
    }
    
    
    //---------------------------------
    this.update = function( deltaTime )
    {    
        _deltaTime = deltaTime;
    
        var xx = _handlePosition.x - _position.x;
        var yy = _handlePosition.y - _position.y;

        var currentLength = Math.sqrt( xx*xx + yy*yy );
        if ( currentLength > ZERO )
        {
            var springForce = ( _handleLength - currentLength ) * FLINGER_SPRING_FORCE * _deltaTime;
            
            xx /= currentLength;
            yy /= currentLength;
        
            _handleVelocity.x += xx * springForce;    
            _handleVelocity.y += yy * springForce;                    
        }

        _handleVelocity.addY( FLINGER_GRAVITY * _deltaTime );
        
        var friction = FLINGER_FRICTION * _deltaTime;
        if ( friction < ONE )
        {
            _handleVelocity.scale( ONE - friction );            
        }
        else
        {
            _handleVelocity.clear();            
        }
        
        _handlePosition.add( _handleVelocity );
    }   
    
    
    
    
    
    //--------------------------------------------------------------------------
    this.updateInteractionsWithBall = function( ballPosition, mousePosition )
    {
        resultingBallForce = new Vector2D();

        //-------------------------------------------------
        // waiting
        //-------------------------------------------------
        if ( _state == FLINGER_STATE_WAITING )
        {
            if ( this.positionOverHandle( mousePosition ) )
            {
                _image.src = "images/flinger-hover.png";
            }
            else
            {
                _image.src = "images/flinger.png";
            }
        
            var force = new Vector2D();

            force.setToDifference( _position, ballPosition );
            force.scale( FLINGER_HOLD_FORCE * _deltaTime );
            resultingBallForce = force;
        }
        //-------------------------------------------------
        // pulling
        //-------------------------------------------------
        else if ( _state == FLINGER_STATE_PULLING )
        {    
            _handlePosition.x = mousePosition.x;
            _handlePosition.y = mousePosition.y;                
             
            var xx = _position.x - _handlePosition.x;
            var yy = _position.y - _handlePosition.y;
            
            var length = Math.sqrt( xx*xx + yy*yy );
                            
            if ( length > ZERO )
            {
                xx /= length;
                yy /= length;
            }
            
            resultingBallForce.scale( ZERO );
            
            _pullPosition.setXY
            (
                _handlePosition.x + xx * _handleLength,
                _handlePosition.y + yy * _handleLength
            );
  
            var offset = new Vector2D();
            offset.setToDifference( _position, ballPosition );

            if ( offset.getMagnitude() > _radius * FLINGER_MIN_PULL_RATIO )
            {                
                _readyToFling = true;
            }
            else
            {                
                _readyToFling = false;
            }
        }
        //-------------------------------------------------
        // flinging
        //-------------------------------------------------
        else if ( _state == FLINGER_STATE_FLINGING )
        {
            if ( _readyToFling )
            {                
                var offset = new Vector2D();
                offset.setToDifference( _position, ballPosition );
            
                var force = new Vector2D();
                force.setToScaled( offset, FLINGER_FLING_FORCE );
                 _ballIndex = NULL_BALL;

                resultingBallForce.add( force );
                _state = FLINGER_STATE_NULL;
            }
            else
            {
                _state = FLINGER_STATE_WAITING;
            }
        }    
        
        return resultingBallForce;
    }


    
    //----------------------
    this.fling = function()
    {
        _state = FLINGER_STATE_FLINGING;
        _flingingBall = _ballIndex;
    }

    this.getDistanceToBall = function()
    {
        return Math.hypot(
            _position.x - _handlePosition.x,
            _position.y - _handlePosition.y
        );
    }

    //------------------------------------------------------
    this.getFlingingBallPastFlinger = function( ballPosition )
    {
        var flingerAxis = new Vector2D();
        flingerAxis.setToDifference( _pullPosition, _position );
        
        var ballToFlingerEnd = new Vector2D();
        ballToFlingerEnd.setToDifference( ballPosition, _position );
        
        var dot = flingerAxis.dotWith( ballToFlingerEnd );
  
        return ( dot < 0 );
    }
    
    
    
    //-----------------------------
    this.finishFling = function()
    {
        _flingingBall = NULL_BALL;
    }
    
    
    //------------------------------
    this.getFlingingBall = function()
    {
        return _flingingBall;
    }
    
    
    
    //--------------------------------
    this.getPullPosition = function()
    {
        return _pullPosition;
    }

    
    //----------------------------------------------
    this.positionOverHandle = function( position )
    {
        if (( position.x > _handlePosition.x - FLINGER_HANDLE_SIZE )
        &&  ( position.x < _handlePosition.x + FLINGER_HANDLE_SIZE )
        &&  ( position.y > _handlePosition.y - FLINGER_HANDLE_SIZE )
        &&  ( position.y < _handlePosition.y + FLINGER_HANDLE_SIZE ))
        {
            return true;
        }
    
        return false;            
    }
    
    
    //---------------------------------
    this.getReadyToFling = function()
    {
        return _readyToFling;
    }
    
    //---------------------------------
    this.setHover = function( hover )
    {
        if ( hover )
        {
            _image.src = "images/flinger-hover.png";
        }
        else
        {
            _image.src = "images/flinger.png";
        }    
    }
    
    
    //-------------------------------------
    this.render = function( ballPosition )
    {            
        canvas.save();
        canvas.lineWidth = 4;         
                
        var radius = _radius * 1.5;
        
        if ( radius < FLINGER_MIN_RADIUS ) 
        {
            radius = FLINGER_MIN_RADIUS;
        }
                    
        var xx = _handlePosition.x - ballPosition.x;
        var yy = _handlePosition.y - ballPosition.y;    
        
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
        var alpha = 0.2;
        if ( _readyToFling )
        {
            alpha = 0.6;
        }

        canvas.fillStyle   = "rgba( 255, 255, 255, " + alpha + " )";  
        canvas.strokeStyle = "rgba( 200, 230, 255, " + alpha + " )";  
        
        canvas.beginPath();
        canvas.moveTo
        ( 
            ballPosition.x - yl, 
            ballPosition.y + xl
        );

        canvas.lineTo
        ( 
            _position.x - yl, 
            _position.y + xl
        );

        canvas.closePath();
        canvas.stroke();

        canvas.beginPath();
        canvas.moveTo
        ( 
            ballPosition.x + yl, 
            ballPosition.y - xl
        );

        canvas.lineTo
        ( 
            _position.x + yl, 
            _position.y - xl
        );
    
        canvas.closePath();
        canvas.stroke();        
                
        canvas.beginPath();
        canvas.arc
        ( 
            _position.x - yl, 
            _position.y + xl,
            5.0, 0, PI2, false 
        );            
        canvas.fill();
        canvas.closePath();    

        canvas.beginPath();
        canvas.arc
        ( 
            _position.x + yl, 
            _position.y - xl,
            5.0, 0, PI2, false 
        );            
        canvas.fill();
        canvas.closePath();    
        
        /*
        //-----------------------------------------------------------
        // show translucent region within flinger pull area
        //-----------------------------------------------------------
        if ( _readyToFling )
        {        
            var midX = ( ballPosition.x - yl + ballPosition.x + yl + _position.x - yl + _position.x + yl ) / 4;
            var midY = ( ballPosition.y - xl + ballPosition.y + xl + _position.y - xl + _position.y + xl ) / 4;
            
            canvas.fillStyle = "rgba( 255, 255, 255, 0.1 )"
            canvas.beginPath();
            canvas.moveTo( ballPosition.x - yl, ballPosition.y + xl );
            canvas.lineTo( ballPosition.x + yl, ballPosition.y - xl );
            canvas.lineTo( _position.x    + yl, _position.y    - xl );
            canvas.lineTo( midX, midY );
            canvas.lineTo( _position.x    - yl, _position.y    + xl );
            canvas.closePath();
            canvas.fill();    
        }
        */
        
        //-----------------------------------
        // show slingshot harness
        //-----------------------------------
        canvas.translate
        ( 
            ballPosition.x - xx - yy, 
            ballPosition.y - yy + xx 
        );
        
        var flingerRadius = radius * 2.0;
    
        var angle = -Math.PI * ONE_HALF + Math.atan2( yy, xx ); 
        canvas.rotate( angle );    
        canvas.scale( flingerRadius, flingerRadius );
        canvas.drawImage( _image, ZERO, ZERO, ONE, ONE );
        canvas.restore();
    }    

    //-----------------------
    this.cancel = function()
    {    
        _ballIndex = NULL_BALL;
        _readyToFling = false;
        _state = FLINGER_STATE_NULL;
    }
    
    
    //-----------------------------
    this.getBallIndex = function()
    {
        return _ballIndex;
    }
    
    //-------------------------------
    this.setState = function(state )
    {
        _state = state;
    }
    //--------------------------
    this.getState = function()
    {
        return _state;
    }

    this.getPosition = function()
    {
        return _position;
    }

    this.getClickCount = function()
    {
        return _clickCount;
    }

    this.increaseClickCount = function()
    {
        _clickCount++;
    }
}

