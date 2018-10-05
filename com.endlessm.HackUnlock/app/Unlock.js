
var frontCanvasID = document.getElementById( 'frontCanvas' );
var backCanvasID  = document.getElementById( 'backCanvas' );

var frontCanvas = frontCanvasID.getContext( '2d' );
var backCanvas  = backCanvasID.getContext ( '2d' );

var canvas    = frontCanvas;
var canvasID  = frontCanvasID;

"use strict";

//----------------------
function Unlock()
{	
	var MILLISECONDS_PER_UPDATE = 30;
	//var FLIP_DURATION	 		= 60;
	var FLIP_DURATION	 		= 0;
	var GATE_EFFECT_DURATION	= 60;
	var IDEAL_AMPLITUDE 		= 0.484;
	var IDEAL_FREQUENCY 		= 11.7;
	var IDEAL_PHASE				= -1.538;	
	var AMPLITUDE_BUFFER 		= 0.1;
	var FREQUENCY_BUFFER 		= 0.5;
	var PHASE_BUFFER			= 1.7;
	var SINE_WAVE_RES 			= 100;
	var BASE_NOTE 				= 44;
	var SUCCESS_CLOCK_DURATION 	= 50;
	var FREQUENCY_SCALAR 		= 0.2;
	var GATE_MOTION_RATE		= 6.0;
	var MAX_AMPLITUDE 			= 300.0;
	var USE_SYNTHESIZER			= false;
	var SINE_WAVE_HEIGHT 		= canvasID.height * ONE_HALF + 20;
	var SUCCESS_SOUND 			= new Audio( "sounds/success.wav" ); 
	var FLIP_SOUND 				= new Audio( "sounds/first-flip.wav" ); 

	var FLIP_STATE_NULL		= -1;
	var FLIP_STATE_START 	=  0;
	var FLIP_STATE_FLIPPING =  1;
	var FLIP_STATE_PUZZLE 	=  2;
	var FLIP_STATE_SOLVED 	=  3;
	var FLIP_STATE_TO_GATE 	=  4;
	var FLIP_STATE_GATE 	=  5;

	//----------------
	function Gate()
	{	
		this.flipping		= false;
		this.flipClock		= 0;
		this.image 			= new Image();
	    this.centerPosition	= new Vector2D();
		this.width			= ZERO;
		this.height			= ZERO;
		
		//--------------------------
		this.updateFlipping = function()
		{	  	
			//-----------------------------------
			// update math of the flip
			//-----------------------------------
			this.flipClock ++;			
//var f 		= this.flipClock / FLIP_DURATION;
//var wave 	= ONE_HALF + ONE_HALF * Math.cos( f * PI2 );
//this.width	= wave * canvasID.width;

			
			//-----------------------------------
			// switch in the middle of the flip
			//-----------------------------------
			if ( this.flipClock > FLIP_DURATION * ONE_HALF )
			{
				if ( _flipState == FLIP_STATE_FLIPPING )
				{
					_gate.image.src	= "images/sine-gate.png";	
					_flipState = FLIP_STATE_PUZZLE;
					console.log( "_flipState = FLIP_STATE_PUZZLE" );
				}
				else if ( _flipState == FLIP_STATE_SOLVED )
				{
					_gate.image.src	= "images/circle-door-bright.png";	
					_flipState = FLIP_STATE_TO_GATE;
					console.log( "_flipState = FLIP_STATE_TO_GATE" );
					_unlockGUI.hidePanel();
				}
			}

			//-----------------------------------
			// done flipping
			//-----------------------------------
			if ( this.flipClock > FLIP_DURATION )
			{
				this.flipClock = FLIP_DURATION;
				this.flipping = false;
				
				if ( _flipState == FLIP_STATE_PUZZLE )
				{
					_solvingPuzzle = true;
					_unlockGUI.showPanel();
				}
				else if ( _flipState == FLIP_STATE_TO_GATE )
				{
					_flipState = FLIP_STATE_GATE;
					_gateEffectStartTime = _seconds;
				}
						
				if ( USE_SYNTHESIZER )
				{
					var note     = BASE_NOTE + _frequency * FREQUENCY_SCALAR;
					var duration = 100;
					var attack   = 3.0;
					var release  = 0.0;
		
					_synthesizer.playNote( note, 0.7, duration, attack, release );
				}	
			}
		}		
	}

	//--------------------
	function FlipButton()
	{	
		this.active		= false;
		this.image 		= new Image();
	    this.position	= new Vector2D();
		this.width		= ZERO;
		this.height		= ZERO;
	}
	
	//----------------------
	function AvatarHint()
	{	
		this.image 		= new Image();
	    this.position	= new Vector2D();
		this.width		= ZERO;
		this.height		= ZERO;
	}
		
	var _flipState				= FLIP_STATE_NULL;
	var _solvingPuzzle			= false;
	var _avatarHint				= new AvatarHint();
	var _synthesizer 			= new Synthesizer();
	var _parameters				= new UnlockParameters();
	var _background				= new Image();
	var _gate					= new Gate();
	var _flipButton				= new FlipButton();
	var _logo					= new Image();
	var _unlockGUI 				= new UnlockGUI();
    var _mousePosition			= new Vector2D();
    var _prevMousePosition		= new Vector2D();
    var _mouseVelocity			= new Vector2D();
    var _vector					= new Vector2D();
	var _startTime				= ZERO;
	var _frequency 				= ZERO;
	var _amplitude 				= ZERO;
	var _clock					= 0;
	var _successClock			= ZERO;
	var _gateEffectStartTime	= ZERO;

	//--------------------------
	this.initialize = function()
    {	  	      		
		//-------------------------------------
		// configure parameters to start
		//-------------------------------------
		_parameters.amplitude	= 0.3;
		_parameters.frequency	= 20.0;
		_parameters.phase		= ZERO;
    		
		//---------------------------------------------
		// initialize user interface with parameters
		//---------------------------------------------
		_unlockGUI.initialize( _parameters );

		//----------------------------
		// get start time
		//----------------------------
		_startTime = (new Date).getTime();

		//--------------------------------------
		// grab images
		//--------------------------------------
		_logo.src		= "images/logo.png";
		_background.src	= "images/background.png";
				
		//--------------------------------------
		// initialize gate
		//--------------------------------------
		//_gate.image.src	= "images/circle-door-dim.png";
		
		_gate.image.src	= "images/circle-door-dim.png";
	    _gate.centerPosition.setXY( canvasID.width * ONE_HALF, canvasID.height * ONE_HALF );
		_gate.width  = canvasID.width;
		_gate.height = canvasID.height;
		
		//--------------------------------------
		// initialize flip button
		//--------------------------------------
		_flipButton.active		= true;
		_flipButton.width  		= 80.0;
		_flipButton.height 		= 80.0;
		_flipButton.image.src 	= "images/flip-button.png";
	    _flipButton.position.setXY( canvasID.width - _flipButton.width * ONE_HALF, canvasID.height - _flipButton.height * ONE_HALF );

		_flipState = FLIP_STATE_START;
		console.log( "_flipState = FLIP_STATE_START" );

		//----------------------------
		// apply parameters  
		//----------------------------
		_avatarHint.image.src = "images/hint-1.png";
		_avatarHint.width  = 390;
		_avatarHint.height = 170;
		_avatarHint.position.x = canvasID.width;
		_avatarHint.position.y = 0.0;

		//----------------------------
		// apply parameters  
		//----------------------------
		this.applyParameters();
				
		//-------------------------------
		// initialize synthesizer
		//-------------------------------
		if ( USE_SYNTHESIZER )
		{
			_synthesizer.initialize();
		}
		
		//------------------------------------------------------------------------
		// start up the timer
		//------------------------------------------------------------------------
		this.timer = setTimeout( "unlock.update()", MILLISECONDS_PER_UPDATE );		
    }



	

	//------------------------
	this.update = function()
	{	   
		_clock ++;
		
		//-------------------------------------
		// get seconds since started...
		//-------------------------------------
		_seconds = ( (new Date).getTime() - _startTime ) / MILLISECONDS_PER_SECOND;
						
		//---------------------------
		// update gate
		//---------------------------
		if ( _gate.flipping )
		{
			_gate.updateFlipping();
		}
						
		//---------------------------
		// update solving puzzle...
		//---------------------------
		if ( _solvingPuzzle )
		{
			this.updateSolvingPuzzle();
		}
		else
		{
			var avatarStartTime = 5.0;		
			var avatarEndTime   = 6.0;		
			if (( _seconds > avatarStartTime )
			&&  ( _seconds < avatarEndTime   ))
			{
				var f = ( _seconds - avatarStartTime )/ ( avatarEndTime - avatarStartTime ); 
				var wave = ONE_HALF - ONE_HALF * Math.cos( f * Math.PI );
				_avatarHint.position.x = canvasID.width - _avatarHint.width * wave;
			}
		
			if ( _flipState == FLIP_STATE_SOLVED )
			{
				//console.log( "success" );		
				//_successClock ++;
			}
		}
		
		//---------------------------
		// render everything...
		//---------------------------
		this.render();

		//---------------------------
		// trigger next update...
		//---------------------------
		this.timer = setTimeout( "unlock.update()", MILLISECONDS_PER_UPDATE );
	} 



	//-------------------------------------
	this.updateSolvingPuzzle = function()
	{			
		if ( USE_SYNTHESIZER )
		{
			_synthesizer.update();
		}
		
		var amplitudeDiff 	= Math.abs( _amplitude 	- IDEAL_AMPLITUDE 	);
		var frequencyDiff 	= Math.abs( _frequency 	- IDEAL_FREQUENCY 	);
		var phaseDiff 		= Math.abs( _phase 		- IDEAL_PHASE 		);

		if (( amplitudeDiff < AMPLITUDE_BUFFER 	)
		&&  ( frequencyDiff < FREQUENCY_BUFFER 	)
		&&  ( phaseDiff     < PHASE_BUFFER		))
		{
			if ( USE_SYNTHESIZER )
			{			
				_synthesizer.turnOffAllNotes();
			}

			_solvingPuzzle = false;
			_flipState = FLIP_STATE_SOLVED;
			console.log( "_flipState = FLIP_STATE_SOLVED" );				
			SUCCESS_SOUND.play();
			
			_gate.flipping = true;
			
canvas = frontCanvas;
canvasID = frontCanvasID;
			
//var flipImage = document.querySelector('#flipImage');
//flipImage.src = "images/circle-door-bright.png";
	
var card = document.querySelector('.card');
card.classList.toggle('is-flipped');

							
			
			_gate.flipClock = 0;
		}
	}
	



	//------------------------
	this.render = function()
	{
		//-------------------------------------------
		// show background
		//-------------------------------------------
		canvas.drawImage( _background, 	0, 0, canvasID.width, canvasID.height );

		//-------------------------------------------
		// show gate
		//-------------------------------------------
		canvas.drawImage
		( 
			_gate.image, 
			_gate.centerPosition.x - _gate.width  * ONE_HALF, 
			_gate.centerPosition.y - _gate.height * ONE_HALF, 
			_gate.width, 
			_gate.height 
		);

		//-------------------------------------------
		// show flip button
		//-------------------------------------------
		if ( _flipButton.active )
		{
			canvas.drawImage
			( 
				_flipButton.image,			
				_flipButton.position.x - _flipButton.width  * ONE_HALF, 
				_flipButton.position.y - _flipButton.height * ONE_HALF, 
				_flipButton.width, 
				_flipButton.height 
			);
		}

		//--------------------------------------
		// show sine wave while solving puzle
		//--------------------------------------
		if ( _solvingPuzzle )
		{
//if ( _successClock < SUCCESS_CLOCK_DURATION )
			{
				var f = _successClock / SUCCESS_CLOCK_DURATION;
				
				f = 0.0;
			
				var alpha = 0.3 - 0.3 * f;
			
				canvas.lineWidth = 15 + f * 45; 			
				canvas.strokeStyle = "rgba( 255, 100, 100, " + alpha + " )";	
				this.showSineWave();

				canvas.lineWidth =  7 + f * 21; 			
				canvas.strokeStyle = "rgba( 255, 255, 100, " + alpha + " )";	
				this.showSineWave();

				canvas.lineWidth = 3 + f * 9; 			
				canvas.strokeStyle = "rgba( 255, 255, 255, " + alpha + " )";	
				this.showSineWave();
			}
		}
		
		if ( _flipState == FLIP_STATE_GATE )
		{
			//console.log( "gate" );	
			this.showGateEffect();	
		}
		
		//----------------
		// show info 
		//----------------
		this.showInfo();
		
		//-------------------------
		// show user interface
		//-------------------------
		_unlockGUI.render();
		
		//-------------------------------------------
		// show avatar hint
		//-------------------------------------------
		canvas.drawImage( _avatarHint.image, _avatarHint.position.x, _avatarHint.position.y, _avatarHint.width, _avatarHint.height );	
	}
	
	
	
	//-------------------------
	this.showSineWave = function()
	{
		canvas.lineJoin = "round";
		canvas.beginPath();
		
		for (var i=0; i<SINE_WAVE_RES; i++)
		{					
			var f = -ONE_HALF + i / SINE_WAVE_RES;			
			var x = canvasID.width * ONE_HALF + f * canvasID.width;
			var y = SINE_WAVE_HEIGHT + _amplitude * MAX_AMPLITUDE * Math.sin( f * _frequency + _phase );
			
			if ( i == 0 )
			{
				canvas.moveTo( x, y );			
			}
			else
			{				
				canvas.lineTo( x, y );
			}		
		}
		
		canvas.stroke();	
		canvas.closePath();
	}


	
	//-------------------------------
	this.showGateEffect = function()
	{	
		canvas.lineWidth = 15; 	
		canvas.strokeStyle = "rgb( 255, 255, 60 )";	
				
		canvas.lineJoin = "round";
		canvas.beginPath();
		
		var f = ( _seconds - _gateEffectStartTime ) / GATE_EFFECT_DURATION;
		
		for (var i=0; i<SINE_WAVE_RES; i++)
		{			
			var mid = SINE_WAVE_RES * ONE_HALF;
			
			var diff = Math.abs( i - mid );
			
			if ( diff > 40 )
			{
				var f = -ONE_HALF + i / SINE_WAVE_RES;			
				var x = canvasID.width * ONE_HALF + f * canvasID.width;
				var y = SINE_WAVE_HEIGHT + IDEAL_AMPLITUDE * MAX_AMPLITUDE * Math.sin( f * IDEAL_FREQUENCY + IDEAL_PHASE );
			
				if ( i == 0 )
				{
					canvas.moveTo( x, y );			
				}
				else
				{				
					canvas.lineTo( x, y );
				}		
			}
			else
			{
				canvas.moveTo( x, y );					
			}
		}
		
		canvas.stroke();	
		canvas.closePath();		
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
		canvas.fillText( "Unlock v0.4", 10, 50 );
	}




	//--------------------------------
	this.mouseDown = function( x, y )
	{
		_unlockGUI.setMouseDown( x, y );
		_parameters = _unlockGUI.getParameters();			
		this.applyParameters();		
		
		if ( _flipButton.active )
		{
			if (( x > _flipButton.position.x - _flipButton.width  * ONE_HALF )
			&&  ( x < _flipButton.position.x + _flipButton.width  * ONE_HALF )
			&&  ( y > _flipButton.position.y - _flipButton.height * ONE_HALF )
			&&  ( y < _flipButton.position.y + _flipButton.height * ONE_HALF ))
			{
				_flipButton.active = false;
				_flipState = FLIP_STATE_FLIPPING;
				console.log( "_flipState = FLIP_STATE_FLIPPING" );
				_gate.flipping = true;

				FLIP_SOUND.play();
				
_avatarHint.position.x = canvasID.width;
				
canvas = backCanvas;				
canvasID = backCanvasID;				
				
var card = document.querySelector('.card');
card.classList.toggle('is-flipped');

				
				
				
				_gate.flipClock = 0;
			}
		}
		
		this.updateMouse( x, y );
	}



	//--------------------------------
	this.mouseMove = function( x, y )
	{
		if ( _unlockGUI.getTweakedSlider() != -1 )
		{		
			if ( _solvingPuzzle )
			{
				if ( _clock > 2 )
				{
					_clock = 0;

					if ( USE_SYNTHESIZER )
					{
						_synthesizer.turnOffAllNotes();
			
						var note     = BASE_NOTE + _frequency * FREQUENCY_SCALAR;
						var duration = 10.0;
						var attack   = 0.0;
						var release  = 0.0;
		
						_synthesizer.playNote( note, _amplitude, duration, attack, release );
					}
				}
					
				_unlockGUI.setMouseMove( x, y );
				_parameters = _unlockGUI.getParameters();			
				this.applyParameters();
			}
		}

		this.updateMouse( x, y );
	}
	


	//------------------------------
	this.mouseUp = function( x, y )
	{	
		_unlockGUI.setMouseUp( x, y );
		
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
	this.applyParameters = function()
	{	
		_amplitude 	= _parameters.amplitude;
		_frequency 	= _parameters.frequency;
		_phase 		= _parameters.phase;	
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
    unlock.mouseDown( e.pageX - rect.left, e.pageY - rect.top );

/*    
var card = document.querySelector('.card');

  card.classList.toggle('is-flipped');
*/
    
}

//---------------------------------
document.onmousemove = function(e) 
{
	var rect = e.target.getBoundingClientRect();
    unlock.mouseMove( e.pageX - rect.left, e.pageY - rect.top );
}

//-------------------------------
document.onmouseup = function(e) 
{
	var rect = e.target.getBoundingClientRect();
    unlock.mouseUp( e.pageX - rect.left, e.pageY - rect.top );
}

//-------------------------------
document.onkeydown = function(e) 
{
    if ( e.keyCode === 32 ) { unlock.spaceKeyPressed();  }
    if ( e.keyCode ===  8 ) { unlock.deleteKeyPressed(); }
}


