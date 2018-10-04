"use strict";

function UserInterface()
{
	var SLIDER_LEFT_MARGIN    = 80.0;
	var SLIDER_RIGHT_MARGIN   = 10.0;
	var SLIDER_WIDTH		  = 10.0;
	var SLIDER_HEIGHT  	      = 18.0;

	var WIDGET_PANEL_COLOR    = "rgb( 160, 160, 160 )";
	var WIDGET_NORMAL_COLOR   = "rgb( 170, 165, 160 )";
	var WIDGET_ROLLED_COLOR   = "rgb( 190, 185, 180 )";
	var WIDGET_PRESSED_COLOR  = "rgb( 190, 185, 180 )";
	var WIDGET_LIGHT_COLOR 	  = "rgb( 280, 260, 240 )";
	var WIDGET_SHADE_COLOR 	  = "rgb( 100, 105, 110 )";
	var WIDGET_TEXT_COLOR 	  = "rgb(  50,  50,  50 )";

	var WIDGET_STATUS_NULL			= -1;
	var WIDGET_STATUS_NORMAL		=  0;
	var WIDGET_STATUS_ROLLED_OVER	=  1;
	var WIDGET_STATUS_PRESSED		=  2;
	var NUM_WIDGET_STATUSES			=  3;

	function Panel()
	{	
		this.x		= ZERO;
		this.y		= ZERO;
		this.width	= ZERO;
		this.height	= ZERO;
		this.status	= WIDGET_STATUS_NULL;
	}

	function Label()
	{	
		this.x		= ZERO;
		this.y		= ZERO;
		this.name	= "-";
		this.status	= WIDGET_STATUS_NULL;
	}

	function Button()
	{	
		this.x		= ZERO;
		this.y		= ZERO;
		this.width	= ZERO;
		this.height	= ZERO;
		this.name	= "-";
		this.status	= WIDGET_STATUS_NULL;
	}

	function Slider()
	{	
		this.x		= ZERO;
		this.y		= ZERO;
		this.min	= ZERO;
		this.max	= ZERO;
		this.value	= ZERO;
		this.width	= ZERO;
		this.height	= ZERO;
		this.name	= "-";
		this.status	= WIDGET_STATUS_NULL;
	}

	var _labels  		= new Array(); 
	var _panels  		= new Array(); 
	var _buttons 		= new Array(); 
	var _sliders 		= new Array(); 
	var _numLabels		= 0;
	var _numPanels		= 0;
	var _numButtons 	= 0;
	var _numSliders 	= 0;
	var _tweakedSlider  = -1;
	var _widgetSelected	= false;

	//-------------------------------------------------------
	// create panel
	//-------------------------------------------------------
	this.createPanel = function( x, y, width, height, name )
	{
		_panels[ _numPanels ] 			= new Panel(); 
		_panels[ _numPanels ].x 		= x;
		_panels[ _numPanels ].y 		= y;
		_panels[ _numPanels ].width 	= width;
		_panels[ _numPanels ].height	= height;
		_panels[ _numPanels ].name 		= name;
		_panels[ _numPanels ].status	= WIDGET_STATUS_NORMAL;

		_numPanels ++;
	}


	//-------------------------------------------------------
	// create label
	//-------------------------------------------------------
	this.createLabel = function( x, y, name )
	{
		_labels[ _numLabels ]			= new Label(); 
		_labels[ _numLabels ].x			= x;
		_labels[ _numLabels ].y			= y;
		_labels[ _numLabels ].name		= name;
		_labels[ _numLabels ].status 	= WIDGET_STATUS_NORMAL;

		_numLabels ++;
	}

	//---------------------------------------------------------
	// create button
	//---------------------------------------------------------
	this.createButton = function( x, y, width, height, name )
	{
		_buttons[ _numButtons ] 		= new Button(); 
		_buttons[ _numButtons ].x 		= x;
		_buttons[ _numButtons ].y 		= y;
		_buttons[ _numButtons ].width 	= width;
		_buttons[ _numButtons ].height 	= height;
		_buttons[ _numButtons ].name 	= name;
		_buttons[ _numButtons ].status	= WIDGET_STATUS_NORMAL;

		_numButtons ++;
	}

	//--------------------------------------------------------------------------
	// create slider
	//--------------------------------------------------------------------------
	this.createSlider = function( x, y, width, height, name, min, max, value )
	{
		_sliders[ _numSliders ] 		= new Slider(); 
		_sliders[ _numSliders ].x 		= x;
		_sliders[ _numSliders ].y 		= y;
		_sliders[ _numSliders ].min		= min;
		_sliders[ _numSliders ].max		= max;
		_sliders[ _numSliders ].value	= value;
		_sliders[ _numSliders ].width 	= width;
		_sliders[ _numSliders ].height 	= height;
		_sliders[ _numSliders ].name 	= name;
		_sliders[ _numSliders ].status	= WIDGET_STATUS_NORMAL;

		_numSliders ++;
	}

	//------------------------
	// render
	//------------------------
	this.render = function()
	{
		//----------------------------------
		// render panels
		//----------------------------------
		for (var p=0; p<_numPanels; p++)
		{
			if ( _panels[p].status != WIDGET_STATUS_NULL )
			{
				canvas.fillStyle = WIDGET_PANEL_COLOR;		

				if ( _panels[p].status == WIDGET_STATUS_ROLLED_OVER )
				{
					canvas.fillStyle = WIDGET_ROLLED_COLOR;
				}
				else if ( _panels[p].status == WIDGET_STATUS_PRESSED )
				{
					canvas.fillStyle = WIDGET_PRESSED_COLOR;
				}

				this.renderBox( _panels[p].x, _panels[p].y, _panels[p].width, _panels[p].height );
			}
		}

		//----------------------------------
		// render buttons
		//----------------------------------
		for (var b=0; b<_numButtons; b++)
		{
			if ( _buttons[b].status != WIDGET_STATUS_NULL )
			{
				canvas.fillStyle = WIDGET_NORMAL_COLOR;		

				//if ( _tweakedSlider != -1 )
				{
					if ( _buttons[b].status == WIDGET_STATUS_ROLLED_OVER )
					{
						canvas.fillStyle = WIDGET_ROLLED_COLOR;
					}
					else if ( _buttons[b].status == WIDGET_STATUS_PRESSED )
					{
						canvas.fillStyle = WIDGET_PRESSED_COLOR;
					}
				}

				this.renderBox( _buttons[b].x, _buttons[b].y, _buttons[b].width, _buttons[b].height );

				canvas.font = '15px sans-serif';
				canvas.fillStyle = WIDGET_TEXT_COLOR;		
				canvas.fillText( _buttons[b].name, _buttons[b].x + 5, _buttons[b].y + 20 );
			}
		}

		//----------------------------------
		// render sliders
		//----------------------------------
		for (var s=0; s<_numSliders; s++)
		{
			if ( _sliders[s].status != WIDGET_STATUS_NULL )
			{
				canvas.fillStyle = WIDGET_NORMAL_COLOR;		

				if ( _tweakedSlider == s )
				{
					canvas.fillStyle = WIDGET_PRESSED_COLOR;
				}
				else
				{
					if ( _tweakedSlider == -1 )
					{
						if ( _sliders[s].status == WIDGET_STATUS_ROLLED_OVER )
						{
							canvas.fillStyle = WIDGET_ROLLED_COLOR;
						}
						else if ( _sliders[s].status == WIDGET_STATUS_PRESSED )
						{
							canvas.fillStyle = WIDGET_PRESSED_COLOR;
						}
					}
				}
				this.renderBox( _sliders[s].x, _sliders[s].y, _sliders[s].width, _sliders[s].height );

				canvas.font = '15px sans-serif';
				canvas.fillStyle = WIDGET_TEXT_COLOR;		
				canvas.fillText( _sliders[s].name, _sliders[s].x + 5, _sliders[s].y + 20 );

				var left  = _sliders[s].x + SLIDER_LEFT_MARGIN;
				var right = _sliders[s].x + SLIDER_LEFT_MARGIN + ( _sliders[s].width - ( SLIDER_LEFT_MARGIN + SLIDER_RIGHT_MARGIN ) );
				var midY  = _sliders[s].y + _sliders[s].height * ONE_HALF;

				canvas.lineWidth = 1.0;
				canvas.strokeStyle = "rgb( 0, 0, 0 )";		
				canvas.beginPath();
				canvas.moveTo( left,  midY );
				canvas.lineTo( right, midY );
				canvas.stroke();
				canvas.closePath();

				canvas.lineWidth = 1.0;
				canvas.strokeStyle = WIDGET_LIGHT_COLOR;		
				canvas.beginPath();
				canvas.moveTo( left,  midY + 1 );
				canvas.lineTo( right, midY + 1 );
				canvas.stroke();
				canvas.closePath();

				//--------------------------------
				// render slider knob
				//--------------------------------
				var v = ( _sliders[s].value - _sliders[s].min ) / ( _sliders[s].max - _sliders[s].min );
				canvas.fillStyle = WIDGET_NORMAL_COLOR;
				this.renderBox
				( 
					left + v * ( right - left ) - SLIDER_WIDTH * ONE_HALF, 
					midY - SLIDER_HEIGHT * ONE_HALF, 
					SLIDER_WIDTH, 
					SLIDER_HEIGHT
				);
			}
		}

		//----------------------------------
		// render labels
		//----------------------------------
		for (var l=0; l<_numLabels; l++)
		{
			if ( _labels[l].status != WIDGET_STATUS_NULL )
			{
				canvas.font = '15px sans-serif';
				canvas.fillStyle = WIDGET_TEXT_COLOR;		
				canvas.fillText( _labels[l].name, _labels[l].x, _labels[l].y );
			}
		}
	}


	//---------------------------------------
	// render box
	//---------------------------------------
	this.renderBox = function( x, y, w, h )
	{
		canvas.fillRect( x, y, w, h );

		canvas.lineWidth = 1.0;
		canvas.strokeStyle = WIDGET_LIGHT_COLOR;		
		canvas.beginPath();
		canvas.moveTo( x, y );
		canvas.lineTo( x + w, y );
		canvas.lineTo( x + w, y + h );
		canvas.stroke();
		canvas.closePath();

		canvas.lineWidth = 1.0;
		canvas.strokeStyle = WIDGET_SHADE_COLOR;		
		canvas.beginPath();
		canvas.moveTo( x, y );
		canvas.lineTo( x, y + h );
		canvas.lineTo(x + w, y + h );
		canvas.stroke();
		canvas.closePath();

	}

	//---------------------------------------------
	// cursor over slider
	//---------------------------------------------
	this.cursorIsOverSlider = function( x, y, s )
	{
		if (( x > _sliders[s].x )
		&&  ( y > _sliders[s].y )
		&&  ( x < _sliders[s].x + _sliders[s].width )
		&&  ( y < _sliders[s].y + _sliders[s].height ))
		{
			return true;
		}

		return false;
	}


	//---------------------------------------------
	// cursor over button
	//---------------------------------------------
	this.cursorIsOverButton = function( x, y, b )
	{
		if (( x > _buttons[b].x )
		&&  ( y > _buttons[b].y )
		&&  ( x < _buttons[b].x + _buttons[b].width )
		&&  ( y < _buttons[b].y + _buttons[b].height ))
		{
			return true;
		}

		return false;
	}



	//---------------------------------------------
	// set mouseDown
	//---------------------------------------------
	this.setMouseDown = function( x, y )
	{
		for (var b=0; b<_numButtons; b++)
		{
			if ( _buttons[b].status != WIDGET_STATUS_NULL )
			{
				if ( this.cursorIsOverButton( x, y, b ) )
				{
					_buttons[b].status = WIDGET_STATUS_PRESSED;
					_widgetSelected = true;
				}
			}
		}

		for (var s=0; s<_numSliders; s++)
		{
			if ( _sliders[s].status != WIDGET_STATUS_NULL )
			{
				if ( this.cursorIsOverSlider( x, y, s ) )
				{
					_tweakedSlider = s;
					_sliders[s].status = WIDGET_STATUS_PRESSED;
					_widgetSelected = true;
					this.tweakSlider( _sliders[s].name, x );
				}
			}
		}
	}

	//---------------------------------------------
	// set mouseMove
	//---------------------------------------------
	this.setMouseMove = function( x, y )
	{
		//if ( _tweakedSlider != -1 )
		{
			for (var b=0; b<_numButtons; b++)
			{
				if ( _buttons[b].status != WIDGET_STATUS_NULL )
				{
					if ( this.cursorIsOverButton( x, y, b ) )
					{
						if ( _buttons[b].status != WIDGET_STATUS_PRESSED )
						{
							_buttons[b].status = WIDGET_STATUS_ROLLED_OVER;
						}
					}
					else
					{
						_buttons[b].status = WIDGET_STATUS_NORMAL;
					}
				}
			}
		}


		for (var s=0; s<_numSliders; s++)
		{
			if ( _sliders[s].status == WIDGET_STATUS_PRESSED )
			{
				_tweakedSlider = s;
				this.tweakSlider( _sliders[s].name, x );
			}
			else if ( _sliders[s].status != WIDGET_STATUS_NULL )
			{
				if ( this.cursorIsOverSlider( x, y, s ) )
				{
					_sliders[s].status = WIDGET_STATUS_ROLLED_OVER;
				}
				else
				{
					_sliders[s].status = WIDGET_STATUS_NORMAL;
				}
			}


			/*
			if ( _sliders[s].status != WIDGET_STATUS_NULL )
			{
				if ( this.cursorIsOverSlider( x, y, s ) )
				{
					if ( _sliders[s].status == WIDGET_STATUS_PRESSED )
					{
						this.tweakSlider( _sliders[s].name, x );
					}
					else
					{
						_sliders[s].status = WIDGET_STATUS_ROLLED_OVER;
					}
				}
				else
				{
					_sliders[s].status = WIDGET_STATUS_NORMAL;
				}
			}
			*/
		}
	}


	//---------------------------------------------
	// set mouseUp
	//---------------------------------------------
	this.setMouseUp = function( x, y )
	{
		for (var b=0; b<_numButtons; b++)
		{
			if ( _buttons[b].status != WIDGET_STATUS_NULL )
			{
				if ( this.cursorIsOverButton( x, y, b ) )
				{
					_buttons[b].status = WIDGET_STATUS_ROLLED_OVER;
				}
				else
				{
					_buttons[b].status = WIDGET_STATUS_NORMAL;
				}
			}
		}

		_tweakedSlider = -1;

		for (var s=0; s<_numSliders; s++)
		{
			if ( _sliders[s].status != WIDGET_STATUS_NULL )
			{
				if ( this.cursorIsOverSlider( x, y, s ) )
				{
					_sliders[s].status = WIDGET_STATUS_ROLLED_OVER;
				}
				else
				{
					_sliders[s].status = WIDGET_STATUS_NORMAL;
				}
			}
		}

		_widgetSelected = false;
	}


	//---------------------------------------------
	// clear mouse interaction
	//---------------------------------------------
	this.clearMouseInteraction = function()
	{
		for (var s=0; s<_numSliders; s++)
		{
			if ( _sliders[s].status != WIDGET_STATUS_NULL )
			{
				_sliders[s].status = WIDGET_STATUS_NORMAL;
			}
		}

		for (var b=0; b<_numButtons; b++)
		{
			if ( _buttons[b].status != WIDGET_STATUS_NULL )
			{
				_buttons[b].status = WIDGET_STATUS_NORMAL;
			}
		}
	}



	//---------------------------------------------
	// set button name
	//---------------------------------------------
	this.setButtonName = function( name, newName )
	{
		var b = this.getButtonByName( name );	
		_buttons[b].name = newName;
	}

	//---------------------------------------------
	// set panel active
	//---------------------------------------------
	this.setPanelActive = function( name, active )
	{
		var p = this.getPanelByName( name );

		if ( active ) 
		{ 
			_panels[p].status = WIDGET_STATUS_NORMAL;
		}
		else
		{
			_panels[p].status = WIDGET_STATUS_NULL;
		}
	}


	//---------------------------------------------
	// set button active
	//---------------------------------------------
	this.setButtonActive = function( name, active )
	{
		var b = this.getButtonByName( name );

		if ( active ) 
		{ 
			_buttons[b].status = WIDGET_STATUS_NORMAL;
		}
		else
		{
			_buttons[b].status = WIDGET_STATUS_NULL;
		}
	}



	//---------------------------------------------
	// set slider active
	//---------------------------------------------
	this.setSliderActive = function( name, active )
	{
		for (var s=0; s<_numSliders; s++)
		{
			if ( name === _sliders[s].name )
			{
				if ( active ) 
				{ 
					_sliders[s].status = WIDGET_STATUS_NORMAL;
				}
				else
				{
					_sliders[s].status = WIDGET_STATUS_NULL;
				}

				break;
			}
		}		
	}



	//---------------------------------------------
	// set label active
	//---------------------------------------------
	this.setLabelActive = function( name, active )
	{
		for (var l=0; l<_numLabels; l++)
		{
			if ( name === _labels[l].name )
			{
				if ( active ) 
				{ 
					_labels[l].status = WIDGET_STATUS_NORMAL;
				}
				else
				{
					_labels[l].status = WIDGET_STATUS_NULL;
				}

				break;
			}
		}		
	}



	//---------------------------------------------
	// tweak slider
	//---------------------------------------------
	this.tweakSlider = function( name, x )
	{
		for (var s=0; s<_numSliders; s++)
		{
			if ( name === _sliders[s].name )
			{
				var left  = _sliders[s].x + SLIDER_LEFT_MARGIN;
				var right = _sliders[s].x + _sliders[s].width - SLIDER_RIGHT_MARGIN;
				var fraction = ( x - left ) / ( right - left );

					 if ( fraction < 0.0 ) { fraction = 0.0; }
				else if ( fraction > 1.0 ) { fraction = 1.0; }

				_sliders[s].value = _sliders[s].min + ( _sliders[s].max - _sliders[s].min ) * fraction;
			}
		}
	}


	//---------------------------------------------
	// get slider value
	//---------------------------------------------
	this.getSliderValue = function( name )
	{
		for (var s=0; s<_numSliders; s++)
		{
			if ( name === _sliders[s].name )
			{
				return _sliders[s].value;
			}
		}

		return 0.0;
	}



	//---------------------------------------------
	// set slider value
	//---------------------------------------------
	this.setSliderValue = function( name, v )
	{
		for (var s=0; s<_numSliders; s++)
		{
			if ( name === _sliders[s].name )
			{
				_sliders[s].value = v;
			}
		}

		return 0.0;
	}


	//------------------------------------
	// selected button
	//------------------------------------
	this.buttonPressed = function( name )
	{
		var b = this.getButtonByName( name );

		if ( _buttons[b].status != WIDGET_STATUS_NULL )
		{
			if ( _buttons[b].status == WIDGET_STATUS_PRESSED )
			{
				return true;
			}
		}

		return false;
	}


	//----------------------------------------------
	// check whether anything was just selected...
	//----------------------------------------------
	this.getWidgetJustSelected = function()
	{
		return _widgetSelected;
	}
	



	//--------------------------------------
	// get button index by name
	//--------------------------------------
	this.getButtonByName = function( name )
	{
		for (var b=0; b<_numButtons; b++)
		{
			if ( name === _buttons[b].name )
			{
				return b;
			}
		}

		return -1;
	}



	//--------------------------------------
	// get panel index by name
	//--------------------------------------
	this.getPanelByName = function( name )
	{
		for (var p=0; p<_numPanels; p++)
		{
			if ( name === _panels[p].name )
			{
				return p;
			}
		}

		return -1;
	}



	//--------------------------------------
	// get tweaked slider
	//--------------------------------------
	this.getTweakedSlider = function()
	{
		return _tweakedSlider;
	}

}// end of class



