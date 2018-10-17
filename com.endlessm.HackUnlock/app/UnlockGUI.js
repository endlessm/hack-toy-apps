
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

//----------------------
function UnlockGUI()
{	
	var _userInterface 	= new UserInterface();
 	var _parameters		= new UnlockParameters();
	var _flipped		= false;


	//--------------------------------------
	this.initialize = function( parameters )
	{	
		//--------------------------------
		// grab the parameters
		//--------------------------------
		this.setParameters( parameters );
		
		//--------------------------------
		// build the UI components
		//--------------------------------
		var panelWidth  = 260.0;
		var panelHeight = 180.0;

		var panelLeft   = canvasID.width  * ONE_HALF - panelWidth * ONE_HALF;
		var panelTop    = canvasID.height - panelHeight - 20;

		var panelRight  = panelLeft + panelWidth;
		var panelBottom = panelTop  + panelHeight;

		_userInterface.createPanel (  panelLeft,  panelTop, panelWidth, panelHeight, "hack panel"  );

		_userInterface.createButton( canvasID.width - 120, 20, 100,  37, "flip to hack" );
		_userInterface.createButton( canvasID.width - 120, 20, 100,  37, "flip back"    );

		var x = panelLeft + 20;
		var y = panelTop;
		var w = 220;
		var h = 30;

		y += 30; _userInterface.createLabel ( x, y, "Unlock the Gate!" );
		y += 20; _userInterface.createSlider( x, y, w, h, "amplitude", 	ZERO, ONE, 	_parameters.amplitude 	);
		y += 40; _userInterface.createSlider( x, y, w, h, "frequency", 	ZERO, 40,  	_parameters.frequency 	);
		y += 40; _userInterface.createSlider( x, y, w, h, "phase", 		-2,   2,	_parameters.phase 		);
		
		_userInterface.setButtonActive( "flip to hack", 	false );
		_userInterface.setPanelActive ( "hack panel", 		false );
		_userInterface.setButtonActive( "flip back", 		false );
		_userInterface.setLabelActive ( "Unlock the Gate!", false );
		_userInterface.setSliderActive( "amplitude",		false );
		_userInterface.setSliderActive( "frequency",		false );
		_userInterface.setSliderActive( "phase",			false );				
	}


	//--------------------------
	this.showPanel = function()
	{	
		_userInterface.setPanelActive ( "hack panel", 		true );
		_userInterface.setLabelActive ( "Unlock the Gate!", true );
		_userInterface.setSliderActive( "amplitude",		true );
		_userInterface.setSliderActive( "frequency",		true );
		_userInterface.setSliderActive( "phase",			true );
	}


	//--------------------------
	this.hidePanel = function()
	{	
		_userInterface.setPanelActive ( "hack panel", 		false );
		_userInterface.setLabelActive ( "Unlock the Gate!", false );
		_userInterface.setSliderActive( "amplitude",		false );
		_userInterface.setSliderActive( "frequency",		false );
		_userInterface.setSliderActive( "phase",			false );
	}

	//-----------------------------------------
	this.updateSliders = function( species )
	{
		_userInterface.setSliderValue( "amplitude", _parameters.amplitude );
		_userInterface.setSliderValue( "frequency", _parameters.frequency );
		_userInterface.setSliderValue( "phase", 	_parameters.phase 	  );
	}

	

	//--------------------------------------
	this.getValuesFromSliders = function()
	{	
		_parameters.amplitude	= _userInterface.getSliderValue( "amplitude"	);
		_parameters.frequency	= _userInterface.getSliderValue( "frequency"	);
		_parameters.phase		= _userInterface.getSliderValue( "phase"		);
	}
	
	
	//-------------------------------
	this.getParameters = function()
	{		
		return _parameters;
	}
	
	
	//-----------------------------------------
	this.setParameters = function( parameters )
	{		
		_parameters.amplitude	= parameters.amplitude;
		_parameters.frequency	= parameters.frequency;
		_parameters.phase		= parameters.phase;
	}
	
	
	
	//---------------------------------
	this.getTweakedSlider = function()
	{
		return _userInterface.getTweakedSlider();
	}
		
	//--------------------------------------
	this.clearMouseInteraction = function()
	{
		_userInterface.clearMouseInteraction();
	}



	//----------------------------------
	this.setMouseDown = function( x, y )
	{
		_userInterface.setMouseDown( x, y );
	
		if ( _flipped )
		{
			if ( _userInterface.buttonPressed( "flip back" ) )
			{
				buttonSelected = true;
				_flipped = false;
								
				_userInterface.setButtonActive( "flip to hack", 	true  );
				_userInterface.setPanelActive ( "hack panel", 		false );
				_userInterface.setButtonActive( "flip back", 		false );
				_userInterface.setLabelActive ( "Unlock the Gate!", false );
				_userInterface.setSliderActive( "amplitude",		false );
				_userInterface.setSliderActive( "frequency",		false );
				_userInterface.setSliderActive( "phase",			false );				
			}
		}
		else
		{
			if ( _userInterface.buttonPressed( "flip to hack" ) )
			{
				buttonSelected = true;
				_flipped = true;
				
				_userInterface.setButtonActive( "flip to hack", 	false );
				_userInterface.setPanelActive ( "hack panel", 		true  );
				_userInterface.setButtonActive( "flip back", 		true  );
				_userInterface.setLabelActive ( "Unlock the Gate!", true  );
				_userInterface.setSliderActive( "amplitude",		true  );
				_userInterface.setSliderActive( "frequency",		true  );
				_userInterface.setSliderActive( "phase",			true  );
			}
		}		
		
		//---------------------------------------------
		// update sliders to reflect parameter values
		//---------------------------------------------
		this.updateSliders( _parameters.speciesIndex );	
	}


	//----------------------------------
	this.setMouseMove = function( x, y )
	{
		_userInterface.setMouseMove( x, y );
		
		this.getValuesFromSliders();
	}
	
	//----------------------------------
	this.setMouseUp = function( x, y )
	{
		_userInterface.setMouseUp( x, y );
	}

	//-------------------------
	this.render = function()
	{
		_userInterface.render();
	}
}
