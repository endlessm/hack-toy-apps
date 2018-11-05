
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

//----------------------
function NoteMyFace()
{	
	var NUM_PHOTOS				= 6;
	var MAX_STROKE_NODES		= 20;
	var MAX_PAINT_STROKES		= 12;
	var MAX_NODE_RADIUS			= 20.0;
	var STROKE_ROLLOVER_RADIUS	= 200.0;
	var BRUSH_SIZE 				= 100;
	var USE_AUDIO				= true;
	var BACKGROUND_COLOR 		= "rgb( 240, 235, 230 )";
	var MILLISECONDS_PER_UPDATE = 10;

	var PAINT_BRUSH_STATE_NULL 				= -1;
	var PAINT_BRUSH_STATE_SEARCHING_COLOR 	= 0;
	var PAINT_BRUSH_STATE_HOLDING_COLOR 	= 1;
	var PAINT_BRUSH_STATE_PAINTING_COLOR 	= 2;

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
		this.numColors		= 0;
		this.currentColor	= 0;
		this.position		= new Vector2D();
		this.width			= ZERO;
		this.height			= ZERO;
		this.image			= new Image();
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

	var _synthesizer 		= new Synthesizer();
	var _paintBrush			= new PaintBrush();
	var _paintStrokes		= new Array();
	var _numPaintStrokes	= 0;
	var _currentPaintStroke	= 0;
	var _seconds			= ZERO;
	var _photo				= new Photo();
	var _palette			= new Palette();
	var _logo				= new Image();
	var _userInterface 		= new UserInterface();
	var _flipped			= false;
    var _mousePosition		= new Vector2D();
    var _prevMousePosition	= new Vector2D();
    var _mouseVelocity		= new Vector2D();
    var _vector				= new Vector2D();
	var _startTime			= 0.0;
    
	

	//--------------------------
	this.initialize = function()
    {	  
		//----------------------------
		// get start time
		//----------------------------
		_startTime = (new Date).getTime();

		//----------------------------
		// initialize photo
		//----------------------------
		_photo.index			= 0;
		_photo.size				= 500.0;
		_photo.shootTime		= ZERO;
		_photo.shootDuration	= 0.7;
		_photo.image.src 		= "images/0.png";

		//----------------------------
		// initialize palette
		//----------------------------
		_palette.position.setXY( 100.0, canvasID.height - 80.0 );
		_palette.width 		= 500.0;
		_palette.height 	= 50.0;
		_palette.image.src  = "images/palette.png";
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

		//-------------------------------
		// initialize synthesizer
		//-------------------------------
		if ( USE_AUDIO )
		{
			_synthesizer.initialize();
		}
		
		//----------------------------
		// grab logo image
		//----------------------------
		_logo.src = "images/logo.png";

		//----------------------------------------
		// setup user interface elements
		//----------------------------------------
		_userInterface.createButton( 10, canvasID.height - 70,  80,	 40, "take selfie"	);
		_userInterface.createButton( canvasID.width - 120, 20, 100,  37, "flip to hack"	);

		//------------------------------------------------------------------------
		// start up the timer
		//------------------------------------------------------------------------
		this.timer = setTimeout( "noteMyFace.update()", MILLISECONDS_PER_UPDATE );		
    }




	//------------------------
	this.update = function()
	{	   
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
		this.timer = setTimeout( "noteMyFace.update()", MILLISECONDS_PER_UPDATE );
	} 



	//------------------------
	this.render = function()
	{
		//-------------------------------------------
		// clear the screen
		//-------------------------------------------
		canvas.fillStyle = BACKGROUND_COLOR;
		canvas.fillRect( 0, 0, canvasID.width, canvasID.height );	

		//-------------------------------------
		// render photo 
		//-------------------------------------
		canvas.drawImage
		( 
			_photo.image, 
			canvasID.width  * ONE_HALF - _photo.size * ONE_HALF, 
			canvasID.height * ONE_HALF - _photo.size * ONE_HALF, 
			_photo.size, 
			_photo.size 
		);

		//-------------------------------------
		// render photo flash
		//-------------------------------------
		var shootClock = ( _seconds - _photo.shootTime ) / _photo.shootDuration;
		if ( shootClock < ONE )
		{
			canvas.fillStyle = "rgba( 255, 255, 255, " + ( ONE - shootClock ) + " )";
			canvas.fillRect
			( 
				canvasID.width  * ONE_HALF - _photo.size * ONE_HALF, 
				canvasID.height * ONE_HALF - _photo.size * ONE_HALF, 
				_photo.size, 
				_photo.size 
			);
		}

		//-------------------------------------
		// render paint 
		//-------------------------------------
		this.renderPaint();

		//-------------------------------------
		// render palette 
		//-------------------------------------
		canvas.drawImage
		( 
			_palette.image, 
			_palette.position.x, 
			_palette.position.y, 
			_palette.width, 
			_palette.height 
		);

		//-------------------------------------------
		// title
		//-------------------------------------------
		canvas.font = '16px sans-serif';
		canvas.fillStyle = "rgb( 121, 121, 121 )";		
		canvas.fillText( "Play My Face", 10, 60 );

		//-------------------------------------
		// render logo 
		//-------------------------------------
		canvas.drawImage( _logo, 10, 10, 70, 30 );

		//-------------------------
		// render user interface
		//-------------------------
		_userInterface.render();

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



	//--------------------------
	this.clearBrushStrokes = function()
	{
		for (var s=0; s<_numPaintStrokes; s++)
		{
			_paintStrokes[s].numNodes = 0;
		}

		_numPaintStrokes = 0;
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

		if ( USE_AUDIO )
		{
			_synthesizer.turnOffAllNotes();

			var note     = 100;
			var duration = 0.01;
			var attack   = 0.0;
			var release  = 0.0;
			_synthesizer.playNote( note, duration, attack, release );

			var note     = 110;
			var duration = 0.015;
			var attack   = 0.0;
			var release  = 0.0;
			_synthesizer.playNote( note, duration, attack, release );

			var note     = 120;
			var duration = 0.018;
			var attack   = 0.0;
			var release  = 0.0;
			_synthesizer.playNote( note, duration, attack, release );
		}
		
		_photo.image.src = "images/" + _photo.index + ".png";

		this.clearBrushStrokes();
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


	//--------------------------------
	this.mouseDown = function( x, y )
	{
		_userInterface.setMouseDown( x, y );

		if ( _userInterface.buttonPressed( "take selfie" ) )
		{
			this.takePhoto();
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


	//--------------------------------
	this.mouseMove = function( x, y )
	{
		for (var s=0; s<_numPaintStrokes; s++)
		{
			_paintStrokes[s].highlighted = false;
		}


		_userInterface.setMouseMove( x, y );

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
		_userInterface.setMouseUp( x, y );

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

	//---------------------
	// start this puppy!
	//---------------------
	this.initialize();
}


//--------------------------------
document.onmousedown = function(e) 
{
	var rect = e.target.getBoundingClientRect();
    noteMyFace.mouseDown( e.pageX - rect.left, e.pageY - rect.top );
}

//---------------------------------
document.onmousemove = function(e) 
{
	var rect = e.target.getBoundingClientRect();
    noteMyFace.mouseMove( e.pageX - rect.left, e.pageY - rect.top );
}

//-------------------------------
document.onmouseup = function(e) 
{
	var rect = e.target.getBoundingClientRect();
    noteMyFace.mouseUp( e.pageX - rect.left, e.pageY - rect.top );
}



