var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

//---------------------------------
// flinger states
//---------------------------------
var FLINGER_STATE_NULL      = -1;
var FLINGER_STATE_MOVING    =  0;
var FLINGER_STATE_WAITING   =  1;
var FLINGER_STATE_PULLING   =  2;
var FLINGER_STATE_FLINGING  =  3;

//---------------------------------
// flinger constants
//---------------------------------
var FLINGER_SPRING_FORCE    = 10.0;
var FLINGER_FRICTION        = 20.0;
var FLINGER_GRAVITY         = 200.0;
var FLINGER_HOLD_FORCE      = 20.0;
var FLINGER_HOLD_FRICTION   = 10.0;
var FLINGER_MIN_PULL_RATIO  = 0.7;
var FLINGER_FLING_FORCE     = 8.0;
var FLINGER_FLING_DURATION  = 30;
var FLINGER_HANDLE_SIZE     = 30.0;
var FLINGER_SIZE            = 50.0;
var FLINGER_MIN_RADIUS      = 40.0;
var FLINGER_INITIAL_JOLT    = 4.0;

//------------------
function Flinger()
{        
    this.state          = FLINGER_STATE_NULL;
    this.ballIndex      = -1;
    this.position       = new Vector2D();
    this.handlePosition = new Vector2D();
    this.handleVelocity = new Vector2D();
    this.handleLength   = ZERO;
    this.image          = new Image();
    this.readyToFling   = false;
    this.image.src      = "images/flinger.png";


    //--------------------------------------------------------------
    this.setBall = function( ballIndex, ballPosition, ballRadius )
    {
        this.handleLength       = ballRadius + 4.0;    
        this.state              = FLINGER_STATE_MOVING;
        this.ballIndex          = ballIndex;
        this.position.x         = ballPosition.x;
        this.position.y         = ballPosition.y;
        this.handlePosition.x   = this.position.x;
        this.handlePosition.y   = this.position.y + this.handleLength;
        this.handleVelocity.clear();
    }
    
    
    //---------------------------------
    this.update = function( deltaTime )
    {    
        var xx = this.handlePosition.x - this.position.x;
        var yy = this.handlePosition.y - this.position.y;

        var currentLength = Math.sqrt( xx*xx + yy*yy );
        if ( currentLength > ZERO )
        {
            var springForce = ( this.handleLength - currentLength ) * FLINGER_SPRING_FORCE * deltaTime;
            
            xx /= currentLength;
            yy /= currentLength;
        
            this.handleVelocity.x += xx * springForce;    
            this.handleVelocity.y += yy * springForce;                    
        }

        this.handleVelocity.addY( FLINGER_GRAVITY * deltaTime );
        
        var friction = FLINGER_FRICTION * deltaTime;
        if ( friction < ONE )
        {
            this.handleVelocity.scale( ONE - friction );            
        }
        else
        {
            this.handleVelocity.clear();            
        }
        
        this.handlePosition.add( this.handleVelocity );
    }   
    
    
    //----------------------------------------------
    this.positionOverHandle = function( position )
    {
        if (( position.x > this.handlePosition.x - FLINGER_HANDLE_SIZE )
        &&  ( position.x < this.handlePosition.x + FLINGER_HANDLE_SIZE )
        &&  ( position.y > this.handlePosition.y - FLINGER_HANDLE_SIZE )
        &&  ( position.y < this.handlePosition.y + FLINGER_HANDLE_SIZE ))
        {
            return true;
        }
    
        return false;            
    }
    
    //----------------------------------------
    this.setReadyToFling = function( ready )
    {
        this.readyToFling = ready;
    }
    
    //---------------------------------
    this.getReadyToFling = function()
    {
        return this.readyToFling;
    }
    
    //----------------------------------------------
    this.setHover = function( hover )
    {
        if ( hover )
        {
            this.image.src = "images/flinger-hover.png";
        }
        else
        {
            this.image.src = "images/flinger.png";
        }    
    }
    
    
    //------------------------------------------
    this.render = function( ballPosition, radius )
    {            
        canvas.lineWidth = 4;         
                
        //var radius = _balls[ _flinger.ballIndex ].getRadius() * 1.5;
        var radius = radius * 1.5;
        
        if ( radius < FLINGER_MIN_RADIUS ) 
        {
            radius = FLINGER_MIN_RADIUS;
        }
                    
        var xx = this.handlePosition.x - ballPosition.x;
        var yy = this.handlePosition.y - ballPosition.y;    
        
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
        if ( this.readyToFling )
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
            this.position.x - yl, 
            this.position.y + xl
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
            this.position.x + yl, 
            this.position.y - xl
        );
    
        canvas.closePath();
        canvas.stroke();        
                
        canvas.beginPath();
        canvas.arc
        ( 
            this.position.x - yl, 
            this.position.y + xl,
            5.0, 0, PI2, false 
        );            
        canvas.fill();
        canvas.closePath();    

        canvas.beginPath();
        canvas.arc
        ( 
            this.position.x + yl, 
            this.position.y - xl,
            5.0, 0, PI2, false 
        );            
        canvas.fill();
        canvas.closePath();    
    
        
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
        canvas.drawImage( this.image, ZERO, ZERO, ONE, ONE );
        canvas.resetTransform();
    }    

    //-----------------------
    this.cancel = function()
    {    
        this.ballIndex  = -1;
        this.state      = FLINGER_STATE_NULL;
    }
}

