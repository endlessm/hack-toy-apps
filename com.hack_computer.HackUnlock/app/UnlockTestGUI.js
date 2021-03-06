/*
 * Copyright © 2020 Endless OS Foundation LLC.
 *
 * This file is part of hack-toy-apps
 * (see https://github.com/endlessm/hack-toy-apps).
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
﻿
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

//----------------------
function UnlockTestGUI()
{    
    var _userInterface         = new UserInterface();
    var _flipped            = false;
    var _parameters;

    //--------------------------------------
    this.initialize = function( parameters )
    {
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
        var panelHeight = 200.0;
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
        
        y += 70; _userInterface.createSlider( x, y, w, h, "amplitude",     _parameters.minAmplitude,     _parameters.maxAmplitude,     _parameters.amplitude     );
        y += 30; _userInterface.createSlider( x, y, w, h, "frequency",     _parameters.minFrequency,     _parameters.maxFrequency,     _parameters.frequency     );
        y += 30; _userInterface.createSlider( x, y, w, h, "phase",         _parameters.minPhase,         _parameters.maxPhase,         _parameters.phase         );
        
        _userInterface.setButtonActive( "flip to hack", true );
        _userInterface.setButtonActive( "flip back",       false );
        _userInterface.setPanelActive ( "hack panel",   false );
        _userInterface.setSliderActive( "amplitude",    false );
        _userInterface.setSliderActive( "frequency",    false );
        _userInterface.setSliderActive( "phase",        false );
                
    }
    

    //---------------------------------------
    this.updateSliders = function()
    {
        _userInterface.setSliderValue( "amplitude", _parameters.amplitude    );
        _userInterface.setSliderValue( "frequency", _parameters.frequency    );
        _userInterface.setSliderValue( "phase",     _parameters.phase        );
    }

    

    //--------------------------------------
    this.getValuesFromSliders = function()
    {    
        _parameters.amplitude    = _userInterface.getSliderValue( "amplitude"     );
        _parameters.frequency    = _userInterface.getSliderValue( "frequency"     );
        _parameters.phase        = _userInterface.getSliderValue( "phase"        );
    }
    
    

    //-------------------------------
    this.getParameters = function()
    {        
        return _parameters;
    }
    
    
    //-----------------------------------------
    this.setParameters = function( parameters )
    {        
        _parameters = parameters;

        _parameters.amplitude    = parameters.amplitude;
        _parameters.frequency    = parameters.frequency;
        _parameters.phase        = parameters.phase;
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
        var nameOfButtonPressed = "-";
        
        _userInterface.setMouseDown( x, y );

        if ( _flipped )
        {
            if ( _userInterface.buttonPressed( "flip back" ) )
            {
                _flipped = false;
                
                _userInterface.setButtonActive( "flip to hack", true  );
                _userInterface.setButtonActive( "flip back",       false );
                _userInterface.setPanelActive ( "hack panel",     false );
                _userInterface.setSliderActive( "amplitude",    false );
                _userInterface.setSliderActive( "frequency",    false );
                _userInterface.setSliderActive( "phase",        false );
            }
        }
        else
        {
            if ( _userInterface.buttonPressed( "flip to hack" ) )
            {
                _flipped = true;
                
                _userInterface.setButtonActive( "flip to hack", false);
                _userInterface.setButtonActive( "flip back",       true );
                _userInterface.setPanelActive ( "hack panel",     true );
                _userInterface.setSliderActive( "amplitude",    true );
                _userInterface.setSliderActive( "frequency",    true );
                _userInterface.setSliderActive( "phase",        true );
            }
        }        
        
        //---------------------------------------------
        // update sliders to reflect parameter values
        //---------------------------------------------
        this.updateSliders();    
        
        return nameOfButtonPressed;
    }


    //----------------------------------
    this.setMouseMove = function( x, y )
    {
        _userInterface.setMouseMove( x, y );
        
        if ( _userInterface.getTweakedSlider() != -1 )
        {                
            this.getValuesFromSliders();
        }
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
