
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var USING_TEST_GUI = true;

var IDEAL_AMPLITUDE 	= 0.484;
var IDEAL_FREQUENCY 	= 11.7;
var IDEAL_PHASE			= -1.538;	

//var AMPLITUDE_BUFFER 	= 0.1;
//var FREQUENCY_BUFFER 	= 0.5;
//var PHASE_BUFFER		= 1.7;

var AMPLITUDE_BUFFER 	= 1.0;
var FREQUENCY_BUFFER 	= 3.0;
var PHASE_BUFFER		= 6.0;

//---------------------------------------------------------
// The object globalParameters contains all the data that
// must be exposed to and share with GTK so that the UI 
// can be handled externally (not using _testGUI).
//---------------------------------------------------------
var globalParameters = 
{
	minAmplitude 	: 0.0,
	maxAmplitude 	: 20.0,
	
	minFrequency 	: 5.0,
	maxFrequency 	: 30.0,

	minPhase 		: -2.0,
	maxPhase 		: 2.0,
	
	amplitude		: 0.0,
	frequency		: 0.0,
	phase			: 0.0,
	
	unlocked		: false
}


//----------------------
function Unlock()
{	
	var MILLISECONDS_PER_UPDATE = 30;
	var SINE_WAVE_RES 			= 100;
	var BASE_NOTE 				= 44;
	var FREQUENCY_SCALAR 		= 0.2;
	var USE_SYNTHESIZER			= true;
	var SINE_WAVE_HEIGHT 		= canvasID.height * ONE_HALF + 20;
	var SUCCESS_SOUND 			= new Audio( "sounds/success.wav" ); 

	var _solvingPuzzle			= false;
	var _synthesizer 			= new Synthesizer();
	var _successScreen			= new Image();
	var _gateImage				= new Image();
	var _testGUI 				= new UnlockTestGUI();
    var _mousePosition			= new Vector2D();
    var _prevMousePosition		= new Vector2D();
    var _mouseVelocity			= new Vector2D();
    var _vector					= new Vector2D();
	var _startTime				= ZERO;
	var _frequency 				= ZERO;
	var _amplitude 				= ZERO;
	var _soundClock				= 0;


	//---------------------------
	this.initialize = function()
    {	  	      		
		//-------------------------------------
		// configure parameters to start
		//-------------------------------------
		globalParameters.amplitude	= 3.0;
		globalParameters.frequency	= 20.0;
		globalParameters.phase		= ZERO;
		globalParameters.unlocked	= false;
    		
		//---------------------------------------------
		// initialize user interface with parameters
		//---------------------------------------------
		if ( USING_TEST_GUI )
		{
			_testGUI.initialize( globalParameters );
		}
		//----------------------------
		// get start time
		//----------------------------
		_startTime = (new Date).getTime();

		//--------------------------------------
		// load images
		//--------------------------------------
		_gateImage.src	   = "images/sine-gate.png";			
		_successScreen.src = "images/success.png";
		
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

			var note     = BASE_NOTE + _frequency * FREQUENCY_SCALAR;
			var duration = 100;
			var attack   = 3.0;
			var release  = 0.0;

			_synthesizer.playNote( note, 0.7, duration, attack, release );
		}
				
		if ( USING_TEST_GUI )
		{
			//_testGUI.showPanel();
		}
		
		_solvingPuzzle = true;		
		
		//--------------------------------------------------------------------
		// start up the timer
		//--------------------------------------------------------------------
		this.timer = setTimeout( "unlock.update()", MILLISECONDS_PER_UPDATE );	
    }



	

	//------------------------
	this.update = function()
	{	
		//------------------------------------
		// this gets called all the time to 
		// catch any changes from the UI
		//------------------------------------
		this.applyParameters();	   							
				
		//---------------------------
		// update solving puzzle...
		//---------------------------
		if ( _solvingPuzzle )
		{
			this.updateSolvingPuzzle();
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
		_soundClock ++;

		if ( _soundClock > 2 )
		{
			_soundClock = 0;

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
			SUCCESS_SOUND.play();
			globalParameters.unlocked = true;
		}
	}
	

 

	//------------------------
	this.render = function()
	{
		if ( _solvingPuzzle )
		{
			//-------------------------------------------
			// show gate
			//-------------------------------------------
			canvas.drawImage( _gateImage, 0, 0, canvasID.width, canvasID.height );
				
			//-------------------------------------------
			// show sine wave
			//-------------------------------------------
			canvas.lineWidth = 15; 			
			canvas.strokeStyle = "rgba( 255, 100, 100, 0.3 )";	
			this.showSineWave();

			canvas.lineWidth = 7; 			
			canvas.strokeStyle = "rgba( 255, 255, 100, 0.3 )";	
			this.showSineWave();

			canvas.lineWidth = 3; 			
			canvas.strokeStyle = "rgba( 255, 255, 255, 0.3 )";	
			this.showSineWave();
		}
		else
		{
			//-------------------------------------------
			// show success screen
			//-------------------------------------------
			canvas.drawImage( _successScreen, 0, 0, canvasID.width, canvasID.height );
		}

		//-------------------------
		// show user interface
		//-------------------------
		if ( USING_TEST_GUI )
		{
			_testGUI.render();
		}
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
			var y = SINE_WAVE_HEIGHT + _amplitude * globalParameters.maxAmplitude * Math.sin( f * _frequency + _phase );
			
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


	//--------------------------------
	this.mouseDown = function( x, y )
	{
		if ( USING_TEST_GUI )
		{
			_testGUI.setMouseDown( x, y );
		}
		
		this.applyParameters();				
		this.updateMouse( x, y );
	}



	//--------------------------------
	this.mouseMove = function( x, y )
	{
		if ( USING_TEST_GUI )
		{
			if ( _testGUI.getTweakedSlider() != -1 )
			{		
				_testGUI.setMouseMove( x, y );
				globalParameters = _testGUI.getParameters();			
				this.applyParameters();
			}
		}

		this.updateMouse( x, y );
	}
	


	//------------------------------
	this.mouseUp = function( x, y )
	{	
		if ( USING_TEST_GUI )
		{
			_testGUI.setMouseUp( x, y );
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
	this.applyParameters = function()
	{	
		_amplitude 	= globalParameters.amplitude;
		_frequency 	= globalParameters.frequency;
		_phase 		= globalParameters.phase;	
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


