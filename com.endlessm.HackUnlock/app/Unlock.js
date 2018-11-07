﻿
var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";

var MODE_FIRST_SCREEN   = 0;
var MODE_SOLVING_PUZZLE = 1;
var MODE_SUCCESS        = 2;
var MODE_FINISHED       = 3;
var MODE_VIDEO_PLAYBACK = 4;
var MODE_VIDEO_PLAYED   = 5;

//---------------------------------------------------------
// The object globalParameters contains all the data that
// must be exposed to and share with GTK so that the UI 
// can be handled externally (not using _testGUI).
//---------------------------------------------------------
var globalParameters = 
{
    minAmplitude    : 0.0,
    maxAmplitude    : 1.4,
    minFrequency    : 0.0,
    maxFrequency    : 50.0,
    minPhase        : -3.0,
    maxPhase        : 3.0,
    amplitude       : 0.0,
    frequency       : 0.0,
    phase           : 0.0,
    mode            : 0,
    unlocked        : false
}


//-----------------------------------------------------------------
// This function should be called from outside to tell this app
// to switch from the initial screen to the unlock screen
//-----------------------------------------------------------------
function flip()
{
    if ( globalParameters.mode === MODE_FIRST_SCREEN )
    {
        globalParameters.mode = MODE_SOLVING_PUZZLE;
    }
    else if ( globalParameters.mode === MODE_SUCCESS )
    {
        globalParameters.mode = MODE_FINISHED;
    }
    else if ( globalParameters.mode === MODE_SOLVING_PUZZLE )
    {
        globalParameters.mode = MODE_FIRST_SCREEN;
    }
}

//----------------------
function Unlock()
{    
    var USING_TEST_GUI      = false;
    var USING_SYNTHESIZER   = false;

    var IDEAL_AMPLITUDE     = 0.615;
    var IDEAL_FREQUENCY     = 12.1;
    var IDEAL_PHASE         = -1.525;

    var AMPLITUDE_BUFFER    = 0.1;
    var FREQUENCY_BUFFER    = 3.5;
    var PHASE_BUFFER        = 0.4;

    var SUCCESS_DURATION        = 30;
    var FINISH_DURATION         = 50;
    var SINE_WAVE_RES           = 300;
    var SINE_WAVE_WIDTH         = 15;
    var BASE_NOTE               = 44;
    var SINE_WAVE_FREQ_SCALE    = 0.4;
    var SINE_WAVE_Y_OFFSET      = 23;
    var SINE_WAVE_Y_POSITION    = canvasID.height * ONE_HALF + SINE_WAVE_Y_OFFSET;
    var SINE_WAVE_AMP_SCALE     = 300;
    var SUCCESS_SOUND_FADE_MS   = 200;
    var FIRST_FLIP_SOUND        = new Audio( "sounds/first-flip.wav" ); 
    var SUCCESS_SOUND           = new Audio( "sounds/success.wav" ); 
    
    var _synthesizer            = new Synthesizer();
    var _glowImage              = new Image();
    var _testGUI                = new UnlockTestGUI();
    var _mousePosition          = new Vector2D();
    var _prevMousePosition      = new Vector2D();
    var _mouseVelocity          = new Vector2D();
    var _vector                 = new Vector2D();
    var _startTime              = ZERO;
    var _amplitude              = ZERO;
    var _frequency              = ZERO;
    var _phase                  = ZERO;
    var _renderedAmplitude      = ZERO;
    var _renderedFrequency      = ZERO;
    var _renderedPhase          = ZERO;
    var _soundClock             = 0;
    var _successClock           = 0;
    var _finishClock            = 0;
    var _fadeOutTime            = ZERO;
    var _video                  = null;
    var _soundPlayed            = false;

    //---------------------------
    this.initialize = function()
    {                        
        canvasID.width  = window.innerWidth;
        canvasID.height = window.innerHeight;
        SINE_WAVE_Y_POSITION = canvasID.height * ONE_HALF + SINE_WAVE_Y_OFFSET;

        //-------------------------------------
        // configure parameters to start
        //-------------------------------------
        globalParameters.amplitude  = 0.2;
        globalParameters.frequency  = 20.0;
        globalParameters.phase      = ZERO;
        globalParameters.mode       = MODE_FIRST_SCREEN;
        globalParameters.unlocked   = false;
        
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
        // load background and glow images
        //--------------------------------------
        this.setBackground("images/gate.png");
        _glowImage.src  = "images/glow.png";            
        
        //----------------------------
        // apply parameters  
        //----------------------------
        this.applyParameters();
                
        //-------------------------------
        // initialize synthesizer
        //-------------------------------
        if ( USING_SYNTHESIZER )
        {
            _synthesizer.initialize();
        }
                
        //--------------------------------------------------------------------
        // start up the timer
        //--------------------------------------------------------------------
        window.requestAnimationFrame( this.update.bind(this) );
    }


    //------------------------
    this.setBackground = function(background)
    {
        canvasID.style.backgroundImage = `url('${background}')`;
        canvasID.style.backgroundSize = '100% 100%';
    }


    //------------------------
    this.update = function()
    {    
        //-----------------------------------------------------
        // this gets called all the time to catch any changes
        //-----------------------------------------------------
        this.applyParameters();
                
        //---------------------------
        // update solving puzzle...
        //---------------------------
        if ( globalParameters.mode == MODE_FIRST_SCREEN )
        {
            this.setBackground("images/gate.png");
        }
        else if ( globalParameters.mode == MODE_SOLVING_PUZZLE )
        {
            this.updateSolvingPuzzle();
        }
        else if ( globalParameters.mode == MODE_SUCCESS )
        {
            this.updateSolvingPuzzle();

            if ( USING_SYNTHESIZER )
            {
                _synthesizer.turnOffAllNotes();
            }
            
            _successClock ++;
        }
        else if ( globalParameters.mode == MODE_FINISHED )
        {
            this.setBackground("images/gate.png");

            _finishClock ++;

            if ( _finishClock > FINISH_DURATION )
            {
                globalParameters.mode = MODE_VIDEO_PLAYBACK;
            }
        }
        else if ( globalParameters.mode == MODE_VIDEO_PLAYBACK )
        {
            this.ensureVideoPlayback();
        }
        
        //---------------------------
        // render everything...
        //---------------------------
        this.render();

        //---------------------------
        // trigger next update...
        //---------------------------
        window.requestAnimationFrame( this.update.bind(this) );
    } 


    //-------------------------------------
    this.ensureVideoPlayback = function()
    {
        if (_video)
        {
            return;
        }

        _video = document.createElement("video");
        _video.src = "videos/success.webm";
        _video.addEventListener("ended", function() {
            globalParameters.unlocked = true;
            globalParameters.mode = MODE_VIDEO_PLAYED;
        });
        _video.play();
    }


    //-------------------------------------
    this.fadeOutSuccessSound = function()
    {
        _soundPlayed = false;

        if ( SUCCESS_SOUND.paused )
        {
            return;
        }

        if (_fadeOutTime == 0)
        {
            _fadeOutTime = (new Date).getTime();
        }

        // Do a 200ms fade out
        var curTime = (new Date).getTime();
        var volume = Math.max( 0, (SUCCESS_SOUND_FADE_MS - (curTime - _fadeOutTime)) / SUCCESS_SOUND_FADE_MS );

        if ( volume > 0 )
        {
            SUCCESS_SOUND.volume = volume;
        }
        else
        {
            SUCCESS_SOUND.pause();
            SUCCESS_SOUND.currentTime = 0;
            _fadeOutTime = 0;
        }
    }


    //-------------------------------------
    this.playSuccessSound = function()
    {
        if ( !_soundPlayed )
        {
            SUCCESS_SOUND.volume = 1;
            SUCCESS_SOUND.play();
            _soundPlayed = true;
        }
    }


    //-------------------------------------
    this.updateSolvingPuzzle = function()
    {
        this.setBackground("images/sine-gate.png");
    
        if ( USING_SYNTHESIZER )
        {
            _synthesizer.update();

            _soundClock ++;

            if ( _soundClock > 2 )
            {
                _soundClock = 0;

                _synthesizer.turnOffAllNotes();

                var note     = BASE_NOTE + _frequency * SINE_WAVE_FREQ_SCALE;
                var duration = 2.0;
                var attack   = 0.1;
                var release  = 0.0;

                _synthesizer.playNote( note, _amplitude, duration, attack, release );
            }
        }
        
        var amplitudeDiff   = Math.abs( _amplitude  - IDEAL_AMPLITUDE   );
        var frequencyDiff   = Math.abs( _frequency  - IDEAL_FREQUENCY   );
        var phaseDiff       = Math.abs( _phase      - IDEAL_PHASE       );

        var amplitudeSolved = ( amplitudeDiff < AMPLITUDE_BUFFER );
        if ( amplitudeSolved )
        {
            _renderedAmplitude = IDEAL_AMPLITUDE;
        }
        else
        {
            _renderedAmplitude = _amplitude;
        }

        var frequencySolved = ( frequencyDiff < FREQUENCY_BUFFER );
        if ( frequencySolved )
        {
            _renderedFrequency = IDEAL_FREQUENCY;
        }
        else
        {
            _renderedFrequency = _frequency;
        }

        var phaseSolved = ( phaseDiff < PHASE_BUFFER );
        if ( phaseSolved )
        {
            _renderedPhase = IDEAL_PHASE;
        }
        else
        {
            _renderedPhase = _phase;
        }

        if ( amplitudeSolved && frequencySolved && phaseSolved )
        {
            if ( USING_SYNTHESIZER )
            {            
                console.log( "OFF NOTES!" );
                _synthesizer.turnOffAllNotes();
            }

            globalParameters.mode = MODE_SUCCESS;
            this.playSuccessSound();
        }
        else
        {
            globalParameters.mode = MODE_SOLVING_PUZZLE;
            this.fadeOutSuccessSound();
        }
    }
    


    //------------------------
    this.render = function()
    {
        if ( globalParameters.mode == MODE_VIDEO_PLAYED )
        {
            return;
        }

        if ( globalParameters.mode == MODE_VIDEO_PLAYBACK )
        {
            if ( _video && !_video.ended )
            {
                canvas.drawImage( _video, 0, 0, canvasID.width, canvasID.height );
            }

            return;
        }

        //-------------------------------------------
        // clear background
        //-------------------------------------------
        canvas.clearRect( 0, 0, canvasID.width, canvasID.height );

        //-------------------------------------------
        // show puzzle solving
        //-------------------------------------------
        if (( globalParameters.mode == MODE_SOLVING_PUZZLE )
        ||  ( globalParameters.mode == MODE_SUCCESS ))        
        {       
            //-------------------------------------------
            // show success effect
            //-------------------------------------------
            if ( globalParameters.mode == MODE_SUCCESS )
            {
                var f = _successClock / SUCCESS_DURATION;
                //var wave = ONE_HALF - ONE_HALF * Math.cos( f * PI2 );
                canvas.globalAlpha = f;        
                canvas.drawImage( _glowImage, 0, 0, canvasID.width, canvasID.height );        
                canvas.globalAlpha = 1.0;        
            }    

            //-------------------------------------------
            // show composite sine wave
            //-------------------------------------------
            var sinePath = this.createSineWavePath();

            canvas.lineJoin = "round";
            canvas.lineWidth = SINE_WAVE_WIDTH;
            canvas.strokeStyle = "rgba( 255, 100, 100, 0.3 )";
            canvas.stroke(sinePath);

            canvas.lineWidth = Math.floor(SINE_WAVE_WIDTH / 2);
            canvas.strokeStyle = "rgba( 255, 255, 100, 0.3 )";    
            canvas.stroke(sinePath);

            canvas.lineWidth = Math.floor(SINE_WAVE_WIDTH / 5);
            canvas.strokeStyle = "rgba( 255, 255, 255, 0.3 )";    
            canvas.stroke(sinePath);
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
    this.createSineWavePath = function()
    {
        var path = new Path2D();

        for ( var i = 0; i < SINE_WAVE_RES; i++ )
        {                    
            var f = -ONE_HALF + i / SINE_WAVE_RES;            
            var x = canvasID.width * ONE_HALF + f * canvasID.width + SINE_WAVE_WIDTH / 2;
            var y = SINE_WAVE_Y_POSITION + _renderedAmplitude * SINE_WAVE_AMP_SCALE * Math.sin( f * _renderedFrequency + _renderedPhase );
            
            if ( i == 0 )
            {
                path.moveTo( x, y );
            }
            else
            {                
                path.lineTo( x, y );
            }        
        }

        return path;
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
        _amplitude     = globalParameters.amplitude;
        _frequency     = globalParameters.frequency;
        _phase         = globalParameters.phase;    
    }

    //---------------------
    // start this puppy!
    //---------------------
    this.initialize();
}



var unlock = new Unlock();


window.addEventListener("resize", function () {
     // Resize canvas
    canvasID.width = window.innerWidth; 
    canvasID.height = window.innerHeight;
    
    SINE_WAVE_Y_POSITION    = canvasID.height * ONE_HALF + 20;
});

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


