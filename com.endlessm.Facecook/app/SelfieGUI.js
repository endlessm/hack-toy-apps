
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

//----------------------
function SelfieGUI()
{	
	var _userInterface 	= new UserInterface();
	var _flipped		= false;
	var _hackOverlay	= new Image();

	var _parameters	;


	//--------------------------------------
	this.initialize = function( parameters )
	{
		_parameters = parameters;
		
		_hackOverlay.src = "images/hack-overlay.png";
	
		//--------------------------------
		// grab the parameters
		//--------------------------------
		
// note that "parameters" is defined globally 		
		
		this.setParameters( parameters );
		
		//--------------------------------
		// build the UI components
		//--------------------------------
		_userInterface.createButton( canvasID.width - 120, 20, 100,  37, "flip to hack" );
		_userInterface.createButton( canvasID.width - 120, 20, 100,  37, "flip back"    );

		var panelWidth  = 320.0;
		var panelHeight = 560.0;
		var panelMargin = 10;

		var panelLeft   = canvasID.width  - ( panelWidth  + panelMargin );
		var panelTop    = 10;

		var panelRight  = panelLeft + panelWidth;
		var panelBottom = panelTop  + panelHeight;

		_userInterface.createPanel (  panelLeft,  panelTop, panelWidth, panelHeight, "hack panel"  );

		var x = panelLeft + 20;
		var y = panelTop;
		var w = 280;
		var h = 25;

		y += 40; _userInterface.createLabel ( x, y, "Hack this Game!" );
		y += 50; _userInterface.createLabel ( x, y, "Choose a background..." );

		y += 10; _userInterface.createButton( x + 55 * 0, y, 45, 30, "bg 1" );
		y +=  0; _userInterface.createButton( x + 55 * 1, y, 45, 30, "bg 2" );
		y +=  0; _userInterface.createButton( x + 55 * 2, y, 45, 30, "bg 3" );
		y +=  0; _userInterface.createButton( x + 55 * 3, y, 45, 30, "bg 4" );
		y +=  0; _userInterface.createButton( x + 55 * 4, y, 45, 30, "bg 5" );

		y += 70; _userInterface.createLabel ( x, y, "Choose which species of ball to hack..." );

		y += 10; _userInterface.createButton( x + 90 * 0, y, 80, 30, "species 1" );
		y +=  0; _userInterface.createButton( x + 90 * 1, y, 80, 30, "species 2" );
		y +=  0; _userInterface.createButton( x + 90 * 2, y, 80, 30, "species 3" );

		y += 70; _userInterface.createLabel ( x, y, "attractions/repulsions between species" );

		y += 10; _userInterface.createSlider( x, y, w, h, "0", -ONE, ONE, _parameters.socialForce_0_0 );
		y += 30; _userInterface.createSlider( x, y, w, h, "1", -ONE, ONE, _parameters.socialForce_0_1 );
		y += 30; _userInterface.createSlider( x, y, w, h, "2", -ONE, ONE, _parameters.socialForce_0_2 );

		y += 70; _userInterface.createLabel ( x, y, "physics parameters..." );

		y += 10; _userInterface.createSlider( x, y, w, h, "radius",    		0,	1, 0.5	);
		y += 30; _userInterface.createSlider( x, y, w, h, "gravity",   		0,	1, 0.5	);
		y += 30; _userInterface.createSlider( x, y, w, h, "collision", 		0, 	1, 0.5	);
		y += 30; _userInterface.createSlider( x, y, w, h, "air friction",	0, 	1, 0.5	);

		_userInterface.setButtonActive( "flip to hack", true );
		_userInterface.setButtonActive( "flip back", 	false );
		_userInterface.setPanelActive ( "hack panel",   false );
		_userInterface.setLabelActive ( "Hack this Game!", false );
		_userInterface.setLabelActive ( "Choose a background...", false );

		_userInterface.setButtonActive( "bg 1", false );
		_userInterface.setButtonActive( "bg 2", false );
		_userInterface.setButtonActive( "bg 3", false );
		_userInterface.setButtonActive( "bg 4", false );
		_userInterface.setButtonActive( "bg 5", false );

		_userInterface.setLabelActive( "Choose which species of ball to hack...", false );

		_userInterface.setButtonActive( "species 1", false );
		_userInterface.setButtonActive( "species 2", false );
		_userInterface.setButtonActive( "species 3", false );

		_userInterface.setLabelActive ( "attractions/repulsions between species", false );
		_userInterface.setSliderActive( "0",    		false );
		_userInterface.setSliderActive( "1",    		false );
		_userInterface.setSliderActive( "2",    		false );

		_userInterface.setLabelActive ( "physics parameters...", false );
		_userInterface.setSliderActive( "radius",    	false );
		_userInterface.setSliderActive( "gravity",   	false );
		_userInterface.setSliderActive( "collision", 	false );
		_userInterface.setSliderActive( "air friction", false );
	}
	

	//---------------------------------------------------
	this.updateSliders = function( species )
	{
		if ( species == 0 )
		{
			_userInterface.setSliderValue( "gravity", 		_parameters.gravity_0		);
			_userInterface.setSliderValue( "radius", 		_parameters.radius_0		);
			_userInterface.setSliderValue( "collision", 	_parameters.collision_0		);
			_userInterface.setSliderValue( "air friction", 	_parameters.friction_0		);
			_userInterface.setSliderValue( "0", 			_parameters.socialForce_0_0	);
			_userInterface.setSliderValue( "1", 			_parameters.socialForce_0_1	);
			_userInterface.setSliderValue( "2", 			_parameters.socialForce_0_2	);
		}
		else if ( species == 1 )
		{
			_userInterface.setSliderValue( "gravity", 		_parameters.gravity_1		);
			_userInterface.setSliderValue( "radius", 		_parameters.radius_1		);
			_userInterface.setSliderValue( "collision", 	_parameters.collision_1		);
			_userInterface.setSliderValue( "air friction", 	_parameters.friction_1		);
			_userInterface.setSliderValue( "0", 			_parameters.socialForce_1_0	);
			_userInterface.setSliderValue( "1", 			_parameters.socialForce_1_1	);
			_userInterface.setSliderValue( "2", 			_parameters.socialForce_1_2	);
		}
		else if ( species == 2 )
		{
			_userInterface.setSliderValue( "gravity", 		_parameters.gravity_2		);
			_userInterface.setSliderValue( "radius", 		_parameters.radius_2		);
			_userInterface.setSliderValue( "collision", 	_parameters.collision_2		);
			_userInterface.setSliderValue( "air friction", 	_parameters.friction_2		);
			_userInterface.setSliderValue( "0", 			_parameters.socialForce_2_0	);
			_userInterface.setSliderValue( "1", 			_parameters.socialForce_2_1	);
			_userInterface.setSliderValue( "2", 			_parameters.socialForce_2_2	);
		}
	}

	

	//--------------------------------------
	this.getValuesFromSliders = function()
	{	
		if ( _parameters.speciesIndex == 0 )
		{	
			_parameters.gravity_0		= _userInterface.getSliderValue( "gravity" 		);
			_parameters.radius_0		= _userInterface.getSliderValue( "radius" 		);
			_parameters.collision_0		= _userInterface.getSliderValue( "collision" 	);
			_parameters.friction_0		= _userInterface.getSliderValue( "air friction" );
			_parameters.socialForce_0_0	= _userInterface.getSliderValue( "0" 			);
			_parameters.socialForce_0_1	= _userInterface.getSliderValue( "1" 			);
			_parameters.socialForce_0_2	= _userInterface.getSliderValue( "2" 			);
		}
		else if ( _parameters.speciesIndex == 1 )
		{	
			_parameters.gravity_1		= _userInterface.getSliderValue( "gravity" 		);
			_parameters.radius_1		= _userInterface.getSliderValue( "radius" 		);
			_parameters.collision_1		= _userInterface.getSliderValue( "collision" 	);
			_parameters.friction_1		= _userInterface.getSliderValue( "air friction" );
			_parameters.socialForce_1_0	= _userInterface.getSliderValue( "0" 			);
			_parameters.socialForce_1_1	= _userInterface.getSliderValue( "1" 			);
			_parameters.socialForce_1_2	= _userInterface.getSliderValue( "2" 			);
		}
		else if ( _parameters.speciesIndex == 2 )
		{	
			_parameters.gravity_2		= _userInterface.getSliderValue( "gravity" 		);
			_parameters.radius_2		= _userInterface.getSliderValue( "radius" 		);
			_parameters.collision_2		= _userInterface.getSliderValue( "collision" 	);
			_parameters.friction_2		= _userInterface.getSliderValue( "air friction" );
			_parameters.socialForce_2_0	= _userInterface.getSliderValue( "0" 			);
			_parameters.socialForce_2_1	= _userInterface.getSliderValue( "1" 			);
			_parameters.socialForce_2_2	= _userInterface.getSliderValue( "2" 			);
		}
	}
	
	

	//-------------------------------
	this.getParameters = function()
	{		
		return _parameters;
	}
	
	
	//-----------------------------------------
	this.setParameters = function( parameters )
	{		
		_parameters.backgroundImageIndex 	= parameters.backgroundImageIndex;
		_parameters.speciesIndex 			= parameters.speciesIndex;

		_parameters.radius_0 			= parameters.radius_0;
		_parameters.gravity_0 			= parameters.gravity_0;
		_parameters.collision_0 		= parameters.collision_0;
		_parameters.friction_0 			= parameters.friction_0;
		_parameters.socialForce_0_0 	= parameters.socialForce_0_0;
		_parameters.socialForce_0_1 	= parameters.socialForce_0_1;
		_parameters.socialForce_0_2 	= parameters.socialForce_0_2;
		_parameters.touchDeath_0_0 		= parameters.touchDeath_0_0;
		_parameters.touchDeath_0_1 		= parameters.touchDeath_0_1;
		_parameters.touchDeath_0_2 		= parameters.touchDeath_0_2;
		_parameters.imageIndex_0		= parameters.imageIndex_0;

		_parameters.radius_1 			= parameters.radius_1;
		_parameters.gravity_1 			= parameters.gravity_1;
		_parameters.collision_1 		= parameters.collision_1;
		_parameters.friction_1 			= parameters.friction_1;
		_parameters.socialForce_1_0 	= parameters.socialForce_1_0;
		_parameters.socialForce_1_1 	= parameters.socialForce_1_1;
		_parameters.socialForce_1_2 	= parameters.socialForce_1_2;
		_parameters.touchDeath_1_0 		= parameters.touchDeath_1_0;
		_parameters.touchDeath_1_1 		= parameters.touchDeath_1_1;
		_parameters.touchDeath_1_2 		= parameters.touchDeath_1_2;
		_parameters.imageIndex_1		= parameters.imageIndex_1;

		_parameters.radius_2 			= parameters.radius_2;
		_parameters.gravity_2 			= parameters.gravity_2;
		_parameters.collision_2 		= parameters.collision_2;
		_parameters.friction_2 			= parameters.friction_2;
		_parameters.socialForce_2_0 	= parameters.socialForce_2_0;
		_parameters.socialForce_2_1 	= parameters.socialForce_2_1;
		_parameters.socialForce_2_2 	= parameters.socialForce_2_2;
		_parameters.touchDeath_2_0 		= parameters.touchDeath_2_0;
		_parameters.touchDeath_2_1 		= parameters.touchDeath_2_1;
		_parameters.touchDeath_2_2 		= parameters.touchDeath_2_2;
		_parameters.imageIndex_2		= parameters.imageIndex_2;	
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

				_userInterface.setButtonActive( "flip to hack", true  );
				_userInterface.setPanelActive ( "hack panel", 	false );
				_userInterface.setButtonActive( "flip back", 	false );
				_userInterface.setLabelActive ( "Hack this Game!", false );
				_userInterface.setLabelActive ( "Choose a background...", false );

				_userInterface.setButtonActive( "bg 1", false );
				_userInterface.setButtonActive( "bg 2", false );
				_userInterface.setButtonActive( "bg 3", false );
				_userInterface.setButtonActive( "bg 4", false );
				_userInterface.setButtonActive( "bg 5", false );

				_userInterface.setLabelActive( "Choose which species of ball to hack...", false );
				_userInterface.setButtonActive( "species 1", false );
				_userInterface.setButtonActive( "species 2", false );
				_userInterface.setButtonActive( "species 3", false );

				_userInterface.setLabelActive ( "attractions/repulsions between species", false );
				_userInterface.setSliderActive( "0",	 		false );
				_userInterface.setSliderActive( "1",	 		false );
				_userInterface.setSliderActive( "2",	 		false );

				_userInterface.setLabelActive ( "physics parameters...", false );
				_userInterface.setSliderActive( "radius", 		false );
				_userInterface.setSliderActive( "gravity", 		false );
				_userInterface.setSliderActive( "collision", 	false );
				_userInterface.setSliderActive( "air friction", false );
			}

			else if ( _userInterface.buttonPressed( "bg 1" ) ) { _parameters.backgroundImageIndex = 0; }
			else if ( _userInterface.buttonPressed( "bg 2" ) ) { _parameters.backgroundImageIndex = 1; }
			else if ( _userInterface.buttonPressed( "bg 3" ) ) { _parameters.backgroundImageIndex = 2; }
			else if ( _userInterface.buttonPressed( "bg 4" ) ) { _parameters.backgroundImageIndex = 3; }
			else if ( _userInterface.buttonPressed( "bg 5" ) ) { _parameters.backgroundImageIndex = 4; }
			else if ( _userInterface.buttonPressed( "species 1" ) ) { _parameters.speciesIndex = 0; }
			else if ( _userInterface.buttonPressed( "species 2" ) ) { _parameters.speciesIndex = 1; }
			else if ( _userInterface.buttonPressed( "species 3" ) ) { _parameters.speciesIndex = 2; }
		}
		else
		{
			if ( _userInterface.buttonPressed( "flip to hack" ) )
			{
				buttonSelected = true;
				_flipped = true;
				_userInterface.setButtonActive( "flip to hack", false );
				_userInterface.setPanelActive ( "hack panel", 	true  );
				_userInterface.setButtonActive( "flip back", 	true  );
				_userInterface.setLabelActive ( "Hack this Game!", true );
				_userInterface.setLabelActive ( "Choose a background...", true );

				_userInterface.setButtonActive( "bg 1", true );
				_userInterface.setButtonActive( "bg 2", true );
				_userInterface.setButtonActive( "bg 3", true );
				_userInterface.setButtonActive( "bg 4", true );
				_userInterface.setButtonActive( "bg 5", true );

				_userInterface.setLabelActive( "Choose which species of ball to hack...", true );
				_userInterface.setButtonActive( "species 1", true );
				_userInterface.setButtonActive( "species 2", true );
				_userInterface.setButtonActive( "species 3", true );

				_userInterface.setLabelActive ( "attractions/repulsions between species", true );
				_userInterface.setSliderActive( "0",	 		true  );
				_userInterface.setSliderActive( "1",	 		true  );
				_userInterface.setSliderActive( "2",	 		true  );

				_userInterface.setLabelActive ( "physics parameters...", true );
				_userInterface.setSliderActive( "radius", 		true  );
				_userInterface.setSliderActive( "gravity", 		true  );
				_userInterface.setSliderActive( "collision", 	true  );
				_userInterface.setSliderActive( "air friction", true  );
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
		if ( _flipped )
		{
			canvas.drawImage( _hackOverlay, 0, 0, canvasID.width, canvasID.height );
		}
			
		_userInterface.render();
	}
}
