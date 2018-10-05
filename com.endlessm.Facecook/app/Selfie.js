
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var USING_TEST_GUI = true;
var CANVAS_PIXEL_OFFSET = 8;
var MAX_FORCE = 0.5;



var WINDOW_WIDTH  = canvasID.width;
var WINDOW_HEIGHT = canvasID.height;

//---------------------------------------------------------
// The object globalParameters contains all the data that
// must be exposed to and share with GTK so that the UI 
// can be handled externally (not using _selfieGUI).
//---------------------------------------------------------
var globalParameters = 
{
	//min and max values
	minRadius			:  0,
	maxRadius			:  0,
	minGravity			:  0,
	maxGravity			:  0,
	minCollision		:  0,
	maxCollision		:  0,
	minFriction			:  0,
	maxFriction			:  0,
	minSocialForce		:  0,
	maxSocialForce		:  0,
	
	// overall parameters
	backgroundImageIndex: 0,
	speciesIndex		: 0,

	// parameters for species 0 balls
	radius_0 			: ZERO,
	gravity_0 			: ZERO,
	collision_0 		: ZERO,
	friction_0 			: ZERO,
	socialForce_0_0 	: ZERO,
	socialForce_0_1 	: ZERO,
	socialForce_0_2 	: ZERO,
	touchDeath_0_0 		: false,
	touchDeath_0_1 		: false,
	touchDeath_0_2 		: false,
	imageIndex_0		: 0,

	// parameters for species 1 balls
	radius_1 			: ZERO,
	gravity_1 			: ZERO,
	collision_1 		: ZERO,
	friction_1 			: ZERO,
	socialForce_1_0 	: ZERO,
	socialForce_1_1 	: ZERO,
	socialForce_1_2 	: ZERO,
	touchDeath_1_0 		: false,
	touchDeath_1_1 		: false,
	touchDeath_1_2 		: false,
	imageIndex_1		: 0,

	// parameters for species 2 balls
	radius_2 			: ZERO,
	gravity_2 			: ZERO,
	collision_2 		: ZERO,
	friction_2 			: ZERO,
	socialForce_2_0 	: ZERO,
	socialForce_2_1 	: ZERO,
	socialForce_2_2 	: ZERO,
	touchDeath_2_0 		: false,
	touchDeath_2_1 		: false,
	touchDeath_2_2 		: false,
	imageIndex_2		: 0
}


//----------------------
function Selfie()
{	
	var PAINT_BRUSH_STATE_NULL 				= -1;
	var PAINT_BRUSH_STATE_SEARCHING_COLOR 	=  0;
	var PAINT_BRUSH_STATE_HOLDING_COLOR 	=  1;
	var PAINT_BRUSH_STATE_PAINTING_COLOR 	=  2;

	var MAX_STROKE_NODES		= 20;
	var MAX_PAINT_STROKES		= 12;
	var MAX_NODE_RADIUS			= 20.0;
	var STROKE_ROLLOVER_RADIUS	= 200.0;
	var BRUSH_SIZE 				= 100;

	var USE_AUDIO				= true;
	var CURSOR_SIZE				= 40.0;
	var NUM_BALL_SPECIES 		= 3;
	var NULL_BALL 				= -1;
	var MAX_BALLS				= 100;
	var INTERACTION_RADIUS 		= 200.0;
	var SCORE_EFFECT_DURATION 	= 60; 
	var MILLISECONDS_PER_UPDATE = 10;

	var TOOL_MOVE 		= 0;
	var TOOL_CREATE 	= 1;
	var TOOL_DELETE 	= 2;
	var TOOL_SPECIES  	= 3;
	var NUM_TOOLS		= 4;
	
	var BUTTON_SOUND		= new Audio( "sounds/button.wav"		); 
	var CREATE_SOUND		= new Audio( "sounds/create.wav"		); 
	var TOO_MANY_SOUND		= new Audio( "sounds/too-many.wav"		); 
	var KILL_SOUND			= new Audio( "sounds/kill.wav"  		); 
	var FLING_SOUND			= new Audio( "sounds/fling.wav" 		); 
	var MOVE_FLING_SOUND	= new Audio( "sounds/move-fling.wav"	); 
	var SUCCESS_SOUND		= new Audio( "sounds/success.wav"		); 

	//--------------------
	function Palette()
	{	
		this.position		= new Vector2D();
		this.width			= ZERO;
		this.height			= ZERO;
		this.image			= new Image();		
		this.numColors		= 0;
		this.currentColor	= 0;
		this.colors			= new Array();
	}

	function PaintStrokeNode()
	{	
		this.position	= new Vector2D();
		this.radius		= ZERO;
	}

	function PaintStroke()
	{	
		this.nodes			= new Array();
		this.numNodes		= 0;
		this.color			= 0;
		this.colorindex		= 0;
		this.highlighted 	= false;
	}

	function PaintBrush()
	{	
		this.state = PAINT_BRUSH_STATE_NULL;
		this.image = new Image();
	}
	
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
	
	var _synthesizer 		= new Synthesizer();
	var _palette			= new Palette();
	var _species			= new Array( NUM_BALL_SPECIES );
	var _paintBrush			= new PaintBrush();
	var _paintStrokes		= new Array();
	var _numPaintStrokes	= 0;	
	var _background			= new Image();
	var _logo				= new Image();
	var _cursor				= new Image();
	var _success			= new Image();
	var _balls 				= new Array();
	var _toolButtons 		= new Array( NUM_TOOLS );
	var _numBalls			= 0;
	var _selfieGUI 			= new SelfieGUI();
	var _leftWall 			= 90;
	var _topWall 			= ZERO;
	var _bottomWall 		= WINDOW_HEIGHT;
	var _rightWall 			= WINDOW_WIDTH;
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
		globalParameters.radius_0 			= 0;
		globalParameters.gravity_0 			= 0;
		globalParameters.collision_0 		= 0;
		globalParameters.friction_0 		= 0;
		globalParameters.socialForce_0_0 	= 0;
		globalParameters.socialForce_0_1 	= 0;
		globalParameters.socialForce_0_2 	= 0;
		globalParameters.touchDeath_0_0 	= 0;
		globalParameters.touchDeath_0_1 	= 0;
		globalParameters.touchDeath_0_2 	= 0;
		globalParameters.imageIndex_0		= 0;
		
		// parameters for species 1 balls
		globalParameters.radius_1 			= 0;
		globalParameters.gravity_1 			= 0;
		globalParameters.collision_1 		= 0;
		globalParameters.friction_1 		= 0;
		globalParameters.socialForce_1_0 	= 0;
		globalParameters.socialForce_1_1 	= 0;
		globalParameters.socialForce_1_2 	= 0;
		globalParameters.touchDeath_1_0 	= 0;
		globalParameters.touchDeath_1_1 	= 0;
		globalParameters.touchDeath_1_2 	= 0;
		globalParameters.imageIndex_1		= 0;

		// parameters for species 2 balls
		globalParameters.radius_2 			= 0;
		globalParameters.gravity_2 			= 0;
		globalParameters.collision_2 		= 0;
		globalParameters.friction_2 		= 0;
		globalParameters.socialForce_2_0 	= 0;	
		globalParameters.socialForce_2_1 	= 0;
		globalParameters.socialForce_2_2 	= 0;	
		globalParameters.touchDeath_2_0 	= 0;
		globalParameters.touchDeath_2_1 	= 0;
		globalParameters.touchDeath_2_2 	= 0;
		globalParameters.imageIndex_2		= 0;

		//---------------------------------------------
		// initialize user interface with parameters
		//---------------------------------------------
		if ( USING_TEST_GUI )
		{
			_selfieGUI.initialize( globalParameters );
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
		_background.src 	= "images/0.png";
		
		//-------------------------------
		// initialize synthesizer
		//-------------------------------
		if ( USE_AUDIO )
		{
			_synthesizer.initialize();
		}
		
		//----------------------------
		// initialize palette
		//----------------------------
		_palette.width		= 900;
		_palette.height		= 90;
		_palette.position.x = WINDOW_WIDTH * ONE_HALF - _palette.width * ONE_HALF;
		_palette.position.y = WINDOW_HEIGHT - _palette.height;
		_palette.image.src	= "images/palette.png";
		_palette.numColors	= 9;
		_palette.colors[0] 	= "rgb( 255, 255, 255 )";
		_palette.colors[1] 	= "rgb( 200,  50,  50 )";
		_palette.colors[2] 	= "rgb( 240, 240,  50 )";
		_palette.colors[3] 	= "rgb(  90, 100, 210 )";
		_palette.colors[4] 	= "rgb(  50, 180,  50 )";
		_palette.colors[5] 	= "rgb(  30,  30,  30 )";
		_palette.colors[6] 	= "rgb( 130, 130, 130 )";
		_palette.colors[7] 	= "rgb( 270, 170,  50 )";
		_palette.colors[8] 	= "rgb( 140,  70, 190 )";		

		//----------------------------
		// initialize paint brush
		//----------------------------
		_paintBrush.image.src = "images/paint-brush.png";
		_paintBrush.state = PAINT_BRUSH_STATE_NULL;
		
		
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
		var y = WINDOW_HEIGHT - r;
		var species = 0;
		
		
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
		// start up the timer
		//------------------------------------------------------------------------
		this.timer = setTimeout( "selfie.update()", MILLISECONDS_PER_UPDATE );		
    }



	//-------------------------------------------
	this.positionOverPalette = function( x, y )
	{
		if (( x > _palette.position.x )
		&&  ( x < _palette.position.x + _palette.width )
		&&  ( y > _palette.position.y )
		&&  ( y < _palette.position.y + _palette.height ) )
		{
			return true;
		}

		return false;
	}


	//-------------------------------------------
	this.startPaintStroke = function( x, y )
	{
		if ( _numPaintStrokes < MAX_PAINT_STROKES )
		{
			_currentPaintStroke = _numPaintStrokes;
			_numPaintStrokes ++;

			_paintStrokes[ _currentPaintStroke ] = new PaintStroke();
			this.addPaintStrokeNode( x, y );
		}
	}



	//--------------------------
	this.clearBrushStrokes = function()
	{
		for (var s=0; s<_numPaintStrokes; s++)
		{
			_paintStrokes[s].numNodes = 0;
		}

		_numPaintStrokes = 0;
	}


	//-----------------------------------------
	this.addPaintStrokeNode = function( x, y )
	{
		var n = _paintStrokes[ _currentPaintStroke ].numNodes;

		if ( n == 1 )
		{
			if ( USE_AUDIO )
			{
				var note     = 60 + _palette.currentColor * 2;
				var duration = 0.5;
				var attack   = 0.05;
				var release  = 0.02;
				_synthesizer.playNote( note, duration, attack, release );
			}
		}
		
		//var wave = ONE_HALF - ONE_HALF * Math.cos( n / MAX_STROKE_NODES  * PI2 );
		var wave = 0.7 - ONE_HALF * Math.cos( n / MAX_STROKE_NODES  * PI2 );

		_paintStrokes[ _currentPaintStroke ].nodes[n] = new PaintStrokeNode();
		_paintStrokes[ _currentPaintStroke ].nodes[n].position.x = x;
		_paintStrokes[ _currentPaintStroke ].nodes[n].position.y = y;
		_paintStrokes[ _currentPaintStroke ].nodes[n].radius = MAX_NODE_RADIUS * wave;
		_paintStrokes[ _currentPaintStroke ].colorIndex = _palette.currentColor;
		_paintStrokes[ _currentPaintStroke ].color = _palette.colors[ _paintStrokes[ _currentPaintStroke ].colorIndex ];
		_paintStrokes[ _currentPaintStroke ].numNodes ++;
	}


	//------------------------------------------------------------
	this.getClosestStrokeWithinRadius = function( x, y, radius )
	{
		var closestStroke = -1;
		var smallestDistanceSquared = 100000.0;

		for (var s=0; s<_numPaintStrokes; s++)
		{
			for (var n=0; n<_paintStrokes[s].numNodes; n++)
			{
				var xx = x - _paintStrokes[s].nodes[n].position.x;
				var yy = y - _paintStrokes[s].nodes[n].position.y;

				var distanceSquared = xx*xx + yy*yy;

				if ( distanceSquared < smallestDistanceSquared )
				{
					smallestDistanceSquared - distanceSquared;

					if ( distanceSquared < radius )
					{
						closestStroke = s;
					}
				}	
			}
		}

		return closestStroke;
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
			
		//---------------------------
		// update synthesizer...
		//---------------------------
		if ( USE_AUDIO )
		{
			_synthesizer.update();
		}
			
		//---------------------------
		// render everything...
		//---------------------------
		this.render();

		//---------------------------
		// trigger next update...
		//---------------------------
		this.timer = setTimeout( "selfie.update()", MILLISECONDS_PER_UPDATE );
	} 


	
	//---------------------------
	this.killBall = function(b)
	{	
	}
	
	
	
	
	//------------------------
	this.render = function()
	{	
		//-------------------------------------------
		// show background
		//-------------------------------------------
		canvas.drawImage( _background, 0, 0, WINDOW_WIDTH, WINDOW_HEIGHT );

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

		//--------------------
		// show palette
		//--------------------
		canvas.drawImage
		( 
			_palette.image, 
			_palette.position.x, 
			_palette.position.y, 
			_palette.width, 
			_palette.height 
		);
		
		
		//-------------------------------------
		// show paint 
		//-------------------------------------
		this.renderPaint();		
		
		//-------------------------
		// show user interface
		//-------------------------
		if ( USING_TEST_GUI )
		{
			_selfieGUI.render();
		}
		

		//-------------------------------------
		// render paint brush 
		//-------------------------------------
		if ( _paintBrush.state != PAINT_BRUSH_STATE_NULL )
		{
			canvas.drawImage( _paintBrush.image, _mousePosition.x, _mousePosition.y - BRUSH_SIZE, BRUSH_SIZE, BRUSH_SIZE );
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
				WINDOW_WIDTH  * ONE_HALF - size * ONE_HALF, 
				WINDOW_HEIGHT * ONE_HALF - size * ONE_HALF, 
				size, 
				size 
			);
			
			_score.clock --;
		}
	}
	
	

	//----------------------------
	this.renderPaint = function()
	{
		for (var s=0; s<_numPaintStrokes; s++)
		{
			if ( _paintStrokes[s].highlighted )
			{
				for (var n=0; n<_paintStrokes[s].numNodes; n++)
				{
					canvas.fillStyle = "rgb( 255, 255, 255 )";	
					canvas.beginPath();
					canvas.arc( _paintStrokes[s].nodes[n].position.x, _paintStrokes[s].nodes[n].position.y, _paintStrokes[s].nodes[n].radius + 10.0, 0, PI2, false );
					canvas.fill();
					canvas.closePath();	
				}	
			}

			for (var n=0; n<_paintStrokes[s].numNodes; n++)
			{
				canvas.fillStyle = _paintStrokes[s].color;	
				canvas.beginPath();
				canvas.arc( _paintStrokes[s].nodes[n].position.x, _paintStrokes[s].nodes[n].position.y, _paintStrokes[s].nodes[n].radius, 0, PI2, false );
				canvas.fill();
				canvas.closePath();	
			}	
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
		canvas.fillText( "Selfie", 10, 50 );
	}



	//--------------------------------
	this.mouseDown = function( x, y )
	{
		if ( USING_TEST_GUI )
		{
			if ( _grabbedBall == NULL_BALL )
			{
				_selfieGUI.setMouseDown( x, y );
				globalParameters = _selfieGUI.getParameters();			
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

		if ( this.positionOverPalette( x, y ) )
		{
			_paintBrush.state = PAINT_BRUSH_STATE_HOLDING_COLOR;
			var f = ( x - _palette.position.x ) / _palette.width;
			_palette.currentColor = Math.floor( f * _palette.numColors );

			if ( USE_AUDIO )
			{
				var note     = 60 + _palette.currentColor * 2;
				var duration = 0.04;
				var attack   = 0.01;
				var release  = 0.01;
				_synthesizer.playNote( note, duration, attack, release );
			}
		}
		else
		{
			if ( _paintBrush.state == PAINT_BRUSH_STATE_HOLDING_COLOR )
			{
				_paintBrush.state = PAINT_BRUSH_STATE_PAINTING_COLOR;
				this.startPaintStroke( x, y );
			}
			else if ( _paintBrush.state == PAINT_BRUSH_STATE_NULL )
			{
				for (var s=0; s<_numPaintStrokes; s++)
				{
					if ( _paintStrokes[s].highlighted )
					{
						if ( USE_AUDIO )
						{
							var note     = 60 + _paintStrokes[s].colorIndex * 2;
							var duration = 0.5;
							var attack   = 0.05;
							var release  = 0.02;
							_synthesizer.playNote( note, duration, attack, release );
						}
					}
				}				
			}
		}


		this.updateMouse( x, y );
	}



	//-----------------------------
	this.selectTool = function(t)
	{
		if ( _useAudio ) { BUTTON_SOUND.play(); }		
	
		_currentTool = t;

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
		this.updateMouse( x, y );
				
		for (var s=0; s<_numPaintStrokes; s++)
		{
			_paintStrokes[s].highlighted = false;
		}

		if ( USING_TEST_GUI )
		{
			_selfieGUI.setMouseMove( x, y );
			globalParameters = _selfieGUI.getParameters();			
			this.applyParameters();
		}

		if ( _paintBrush.state == PAINT_BRUSH_STATE_PAINTING_COLOR )
		{			
			if ( _paintStrokes[ _currentPaintStroke ].numNodes < MAX_STROKE_NODES )
			{
				this.addPaintStrokeNode( x, y );
			}
		}
		else 
		{
			if ( _paintBrush.state == PAINT_BRUSH_STATE_NULL )
			{	
				var strokeToPlay = this.getClosestStrokeWithinRadius( x, y, STROKE_ROLLOVER_RADIUS );	

				if ( strokeToPlay != -1 )
				{
					_paintStrokes[ strokeToPlay ].highlighted = true;
				}
			}

			if ( _paintBrush.state != PAINT_BRUSH_STATE_HOLDING_COLOR )
			{
				if ( this.positionOverPalette( x, y ) )
				{
					_paintBrush.state = PAINT_BRUSH_STATE_SEARCHING_COLOR;
					_paintBrush.image.src = "images/paint-brush.png";
				}
				else
				{
					_paintBrush.state = PAINT_BRUSH_STATE_NULL;
				}
			}
		}

		this.updateMouse( x, y );
		
		
		
	}
	


	//------------------------------
	this.mouseUp = function( x, y )
	{	
		if ( USING_TEST_GUI )
		{
			_selfieGUI.setMouseUp( x, y );
		}

		if ( _paintBrush.state == PAINT_BRUSH_STATE_PAINTING_COLOR ) 
		{
			_paintBrush.state = PAINT_BRUSH_STATE_NULL;
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
	}
	
	//---------------------------------
	this.spaceKeyPressed = function()
	{	
	}
	

	//---------------------------------
	this.applyParameters = function()
	{	
		_background.src = "images/background-" + globalParameters.backgroundImageIndex + ".png";
				
		_species[0].gravity			= globalParameters.gravity_0;
		_species[0].radius			= globalParameters.radius_0;
		_species[0].friction		= globalParameters.friction_0;
		_species[0].collision		= globalParameters.collision_0;
		_species[0].forces[0] 		= globalParameters.socialForce_0_0;				
		_species[0].forces[1] 		= globalParameters.socialForce_0_1;
		_species[0].forces[2] 		= globalParameters.socialForce_0_2;	
		_species[0].touchDeath[0] 	= globalParameters.touchDeath_0_0;				
		_species[0].touchDeath[1] 	= globalParameters.touchDeath_0_1;
		_species[0].touchDeath[2] 	= globalParameters.touchDeath_0_2;	
				
		_species[1].gravity			= globalParameters.gravity_1;
		_species[1].radius			= globalParameters.radius_1;
		_species[1].friction		= globalParameters.friction_1;
		_species[1].collision		= globalParameters.collision_1;
		_species[1].forces[0] 		= globalParameters.socialForce_1_0;				
		_species[1].forces[1] 		= globalParameters.socialForce_1_1;
		_species[1].forces[2] 		= globalParameters.socialForce_1_2;	
		_species[1].touchDeath[0] 	= globalParameters.touchDeath_1_0;				
		_species[1].touchDeath[1] 	= globalParameters.touchDeath_1_1;
		_species[1].touchDeath[2] 	= globalParameters.touchDeath_1_2;	

		_species[2].gravity			= globalParameters.gravity_2;
		_species[2].radius			= globalParameters.radius_2;
		_species[2].friction		= globalParameters.friction_2;
		_species[2].collision		= globalParameters.collision_2;
		_species[2].forces[0] 		= globalParameters.socialForce_2_0;				
		_species[2].forces[1] 		= globalParameters.socialForce_2_1;
		_species[2].forces[2] 		= globalParameters.socialForce_2_2;	
		_species[2].touchDeath[0] 	= globalParameters.touchDeath_2_0;				
		_species[2].touchDeath[1] 	= globalParameters.touchDeath_2_1;
		_species[2].touchDeath[2] 	= globalParameters.touchDeath_2_2;	
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
    var xOffset = -rect.left;
    var yOffset = -rect.top;

	// overwrite the above (for now). It's not working! 
    xOffset = -CANVAS_PIXEL_OFFSET;
    yOffset = -CANVAS_PIXEL_OFFSET;
    
    selfie.mouseDown( e.pageX + xOffset, e.pageY + yOffset );
}

//---------------------------------
document.onmousemove = function(e) 
{
	var rect = e.target.getBoundingClientRect();
    var xOffset = -rect.left;
    var yOffset = -rect.top;

	// overwrite the above (for now). It's not working! 
    xOffset = -CANVAS_PIXEL_OFFSET;
    yOffset = -CANVAS_PIXEL_OFFSET;

    selfie.mouseMove( e.pageX + xOffset, e.pageY + yOffset );
}

//-------------------------------
document.onmouseup = function(e) 
{
	var rect = e.target.getBoundingClientRect();
    var xOffset = -rect.left;
    var yOffset = -rect.top;

	// overwrite the above (for now). It's not working! 
    xOffset = -CANVAS_PIXEL_OFFSET;
    yOffset = -CANVAS_PIXEL_OFFSET;

    selfie.mouseUp( e.pageX + xOffset, e.pageY + yOffset );
}

//-------------------------------
document.onkeydown = function(e) 
{
    if ( e.keyCode === 32 ) { selfie.spaceKeyPressed();  }
    if ( e.keyCode ===  8 ) { selfie.deleteKeyPressed(); }
}

