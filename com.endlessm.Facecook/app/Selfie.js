
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var USING_TEST_GUI = true;
var CANVAS_PIXEL_OFFSET = 8;

var WINDOW_WIDTH  = canvasID.width;
var WINDOW_HEIGHT = canvasID.height;

var newImage;

var testClock = 0;

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
	var NUM_PHOTOS = 6;

	var PAINT_BRUSH_STATE_NULL 				= -1;
	var PAINT_BRUSH_STATE_SEARCHING_COLOR 	=  0;
	var PAINT_BRUSH_STATE_HOLDING_COLOR 	=  1;
	var PAINT_BRUSH_STATE_PAINTING_COLOR 	=  2;

	var MAX_COLOR_VALUE			= 255;
	var MAX_STROKE_NODES		= 20;
	var MAX_PAINT_STROKES		= 12;
	var MAX_NODE_RADIUS			= 20.0;
	var STROKE_ROLLOVER_RADIUS	= 200.0;
	var BRUSH_SIZE 				= 100;

	var USE_AUDIO				= true;
	var INTERACTION_RADIUS 		= 200.0;
	var MILLISECONDS_PER_UPDATE = 10;

	var TOOL_PHOTO 		= 0;
	var TOOL_PAINT 	= 1;
	var TOOL_MUSIC 	= 2;
	var NUM_TOOLS		= 3;
	
	var PHOTO_SOUND			= new Audio( "sounds/photo.wav"			); 
	var BUTTON_SOUND		= new Audio( "sounds/button.wav"		); 
	var CREATE_SOUND		= new Audio( "sounds/create.wav"		); 
	var TOO_MANY_SOUND		= new Audio( "sounds/too-many.wav"		); 
	var KILL_SOUND			= new Audio( "sounds/kill.wav"  		); 
	var FLING_SOUND			= new Audio( "sounds/fling.wav" 		); 
	var MOVE_FLING_SOUND	= new Audio( "sounds/move-fling.wav"	); 
	var SUCCESS_SOUND		= new Audio( "sounds/success.wav"		); 

	function Photo()
	{	
		this.index			= 0;
		this.size			= ZERO;
		this.shootTime		= ZERO;
		this.shootDuration	= ZERO;
		this.image			= new Image();
	}

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
	function ToolButton()
	{	
		this.visible	= false;
		this.position	= new Vector2D();
		this.width		= ZERO;
		this.height		= ZERO;
		this.image		= new Image();
	}
	
	
	var _photo				= new Photo();
	var _seconds			= ZERO;
	var _synthesizer 		= new Synthesizer();
	var _palette			= new Palette();
	var _paintBrush			= new PaintBrush();
	var _paintStrokes		= new Array();
	var _numPaintStrokes	= 0;	
	var _toolButtons 		= new Array( NUM_TOOLS );
	var _selfieGUI 			= new SelfieGUI();
	var _currentTool		= TOOL_PHOTO;
    var _mousePosition		= new Vector2D();
    var _prevMousePosition	= new Vector2D();
    var _mouseVelocity		= new Vector2D();
    var _vector				= new Vector2D();
	var _startTime			= ZERO;
	var _useAudio			= false;

	//--------------------------
	this.initialize = function()
    {
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
		
		//-------------------------------
		// initialize synthesizer
		//-------------------------------
		if ( USE_AUDIO )
		{
			_synthesizer.initialize();
		}
		
		//----------------------------
		// initialize photo
		//----------------------------
		_photo.index			= 0;
		_photo.size				= 500.0;
		_photo.shootTime		= ZERO;
		_photo.shootDuration	= 0.4;		
 	  //_photo.image.crossOrigin = "anonymous";
		_photo.image.src 		= "images/photo-0.png";
		
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
			_toolButtons[t].image.src = "images/photo-tool.png";
		}
		
		_toolButtons[ TOOL_PHOTO	].image.src = "images/photo-tool.png";
		_toolButtons[ TOOL_PAINT	].image.src = "images/paint-tool.png";
		_toolButtons[ TOOL_MUSIC	].image.src = "images/music-tool.png";

		//----------------------------
		// apply parameters  
		//----------------------------
		this.applyParameters();
		
		//-----------------------------------------------------------------------------
		// turn this on only after creating the initial balls, because some browsers
		// don't want to have sounds played until the user has done some interaction. 
		//-----------------------------------------------------------------------------
		_useAudio = true;		
						
		//------------------------------------------------------------------------
		// start up the timer
		//------------------------------------------------------------------------
		this.timer = setTimeout( "selfie.update()", MILLISECONDS_PER_UPDATE );		
    }


/*
canvas.drawImage( _originalImage, REFERENCE_X, REFERENCE_Y, IMAGE_RES, IMAGE_RES );  

_referenceData = canvas.getImageData( REFERENCE_X, REFERENCE_Y, IMAGE_RES, IMAGE_RES );

_resultingData = canvas.createImageData( IMAGE_RES, IMAGE_RES );

for (var i=0; i<_referenceData.data.length; i+=4)
{
	var r = _referenceData.data[ i + 0 ];
	var g = _referenceData.data[ i + 1 ];
	var b = _referenceData.data[ i + 2 ];
	var a = _referenceData.data[ i + 3 ];
	
	//-------------------------------------------------------
	// for all non-transparent pixels, invert the colors 
	//-------------------------------------------------------
	if ( a != 0 )
	{
		_resultingData.data[ i + 0 ] = MAX_COLOR_VALUE - r;
		_resultingData.data[ i + 1 ] = MAX_COLOR_VALUE - g;
		_resultingData.data[ i + 2 ] = MAX_COLOR_VALUE - b;  
	}
	_resultingData.data[ i + 3 ] = MAX_COLOR_VALUE;            
}

canvas.putImageData( _resultingData, RESULTING_X, RESULTING_Y );

_closestMatch = this.getDifferenceBetweenImages( _referenceData, _resultingData );

bestData = canvas.getImageData( RESULTING_X, RESULTING_Y, IMAGE_RES, IMAGE_RES );


var imageData = canvas.getImageData
( 
	Math.floor( x - size * ONE_HALF ), 
	Math.floor( y - size * ONE_HALF ), 
	Math.floor( size ),
	Math.floor( size )
);
*/

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

		testClock ++;
		
		if ( testClock == 40 )
		{		
			this.changePhoto();
		}
		
		if ( newImage != null )
		{
    		canvas.putImageData( newImage, 100, 100 );		
	    }		
	}




	//--------------------------
	this.takePhoto = function()
	{
		_photo.index ++;
		_photo.shootTime = _seconds;

		if ( _photo.index >= NUM_PHOTOS )
		{
			_photo.index = 0;
		}
		
		if ( _useAudio ) { PHOTO_SOUND.play(); }		
		
		_photo.image.src = "images/photo-" + _photo.index + ".png";

		this.clearBrushStrokes();
	}


	//---------------------------
	this.changePhoto = function()
	{	
		var imageData = canvas.getImageData( 300, 300, 600, 600 );

		for (var i=0; i<imageData.data.length; i+=4)
		{
			var r = imageData.data[ i + 0 ];
			var g = imageData.data[ i + 1 ];
			var b = imageData.data[ i + 2 ];
			var a = imageData.data[ i + 3 ];

			//console.log(g);
		}
		
		newImage = canvas.createImageData( 600, 600 );

		for (var i=0; i<newImage.data.length; i+=4)
		{
			
			newImage.data[ i + 0 ] = Math.floor( Math.random() * MAX_COLOR_VALUE );
			newImage.data[ i + 1 ] = Math.floor( Math.random() * MAX_COLOR_VALUE );
			newImage.data[ i + 2 ] = Math.floor( Math.random() * MAX_COLOR_VALUE ); 
			newImage.data[ i + 3 ] = MAX_COLOR_VALUE;    
		
            /*
			newImage.data[ i + 0 ] = imageData.data[ i + 0 +   0 ];
			newImage.data[ i + 1 ] = imageData.data[ i + 1 + 200 ];
			newImage.data[ i + 2 ] = imageData.data[ i + 2 + 200 ];
			newImage.data[ i + 3 ] = MAX_COLOR_VALUE;    
			*/
		}		
	}
	
	//------------------------
	this.render = function()
	{	
		//-------------------------------------------
		// show background
		//-------------------------------------------
		canvas.drawImage( _photo.image, 0, 0, WINDOW_WIDTH, WINDOW_HEIGHT );


		//-------------------------------------
		// render photo flash
		//-------------------------------------
		var shootClock = ( _seconds - _photo.shootTime ) / _photo.shootDuration;
		if ( shootClock < ONE )
		{
			canvas.fillStyle = "rgba( 255, 255, 255, " + ( ONE - shootClock ) + " )";
			canvas.fillRect( 0, 0, canvasID.width, canvasID.height );
		}


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
	

	

	//--------------------------------
	this.mouseDown = function( x, y )
	{
		if ( USING_TEST_GUI )
		{
			_selfieGUI.setMouseDown( x, y );
			globalParameters = _selfieGUI.getParameters();			
			this.applyParameters();			
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

		_toolButtons[ TOOL_PHOTO ].image.src = "images/photo-tool.png";
		_toolButtons[ TOOL_PAINT ].image.src = "images/paint-tool.png";       
		_toolButtons[ TOOL_MUSIC ].image.src = "images/music-tool.png";

			 if ( t == TOOL_PHOTO ) { _toolButtons[t].image.src = "images/photo-tool-selected.png"; 	}
		else if ( t == TOOL_PAINT ) { _toolButtons[t].image.src = "images/paint-tool-selected.png"; 	}
		else if ( t == TOOL_MUSIC ) { _toolButtons[t].image.src = "images/music-tool-selected.png"; 	}
		
		if ( _currentTool == TOOL_PHOTO )
		{
			this.takePhoto();
		}
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
		/*
		//_photo.image.src = "images/photo-" + globalParameters.backgroundImageIndex + ".png";
		
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
		*/
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

