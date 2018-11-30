
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
        Sounds.stop('HackUnlock/ambient/front');
        Sounds.playLoop('HackUnlock/ambient/back');
        Sounds.playLoop('HackUnlock/wave');
        globalParameters.mode = MODE_SOLVING_PUZZLE;
    }
    else if ( globalParameters.mode === MODE_SUCCESS )
    {
        Sounds.play('HackUnlock/success');
        globalParameters.mode = MODE_FINISHED;
    }
    else if ( globalParameters.mode === MODE_SOLVING_PUZZLE )
    {
        Sounds.stop('HackUnlock/ambient/back');
        Sounds.stop('HackUnlock/wave');
        Sounds.playLoop('HackUnlock/ambient/front');
        globalParameters.mode = MODE_FIRST_SCREEN;
    }
}

function normalize(value, min, max, normalizedMin, normalizedMax) {
    const unityValue = (value - min) / (max - min);
    return unityValue * (normalizedMax - normalizedMin) + normalizedMin;
}

//----------------------
function Unlock()
{    
    var USING_TEST_GUI      = false;
    var USING_SYNTHESIZER   = false;

    var IDEAL_AMPLITUDE     = 0.615;
    var IDEAL_FREQUENCY     = 12.1;
    var IDEAL_PHASE         = -1.525;

    // Keep these in sync with hack-toolbox/HackUnlock/controlpanel.ui
    var MIN_AMPLITUDE       = 0;
    var MAX_AMPLITUDE       = 1.4;
    var MIN_FREQUENCY       = 0;  // wat
    var MAX_FREQUENCY       = 50;

    var AMPLITUDE_BUFFER    = 0.08;
    var FREQUENCY_BUFFER    = 1.50;
    var PHASE_BUFFER        = 0.20;

    var SUCCESS_DURATION        = 30;
    var FINISH_DURATION         = 50;
    var SINE_WAVE_RES           = 300;
    var SINE_WAVE_WIDTH         = 15;
    var BASE_NOTE               = 44;
    var SINE_WAVE_FREQ_SCALE    = 0.4;
    var SINE_WAVE_Y_OFFSET      = 23;
    var SINE_WAVE_Y_POSITION    = canvasID.height * ONE_HALF + SINE_WAVE_Y_OFFSET;
    var SINE_WAVE_AMP_SCALE     = 300;

    var _synthesizer            = new Synthesizer();
    var _glowImage              = new Image();
    var _testGUI                = new UnlockTestGUI();
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
    var _solutionSoundPlayed    = false;

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

        Sounds.play('HackUnlock/landing');
        Sounds.playLoop('HackUnlock/ambient/front');
    }


    //------------------------
    this.setBackground = function(background)
    {
        canvasID.style.backgroundImage = `url('${background}')`;
        canvasID.style.backgroundSize = '100% 100%';
    }


    //-----------------------------
    this.updateClocks = function()
    {
        if ( globalParameters.mode == MODE_SUCCESS )
        {
            _successClock = Math.min( _successClock + 1, SUCCESS_DURATION );
        }
        else
        {
            _successClock = Math.max( _successClock - 1, 0 );
        }

        if ( globalParameters.mode == MODE_FINISHED )
        {
            _finishClock ++;

            if ( _finishClock > FINISH_DURATION )
            {
                globalParameters.mode = MODE_VIDEO_PLAYBACK;
            }
        }
        else
        {
            _finishClock = 0;
        }
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
        }
        else if ( globalParameters.mode == MODE_FINISHED )
        {
            this.setBackground("images/gate.png");
        }
        else if ( globalParameters.mode == MODE_VIDEO_PLAYBACK )
        {
            this.ensureVideoPlayback();
        }

        this.updateClocks();
        
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
            if (!_solutionSoundPlayed) {
                Sounds.stop('HackUnlock/ambient/back');
                Sounds.stop('HackUnlock/wave');
                Sounds.play('HackUnlock/solution');
                _solutionSoundPlayed = true;
            }
        }
        else
        {
            globalParameters.mode = MODE_SOLVING_PUZZLE;

            if (_solutionSoundPlayed) {
                _solutionSoundPlayed = false;
                Sounds.playLoop('HackUnlock/ambient/back');
                Sounds.playLoop('HackUnlock/wave');
            }

            Sounds.updateSound('HackUnlock/wave', 100, {
                volume: normalize(_renderedAmplitude, MIN_AMPLITUDE, MAX_AMPLITUDE, 0.0, 1.0),
                rate: normalize(_renderedFrequency, MIN_FREQUENCY, MAX_FREQUENCY, 0.5, 1.5),
            });
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
            var f = _successClock / SUCCESS_DURATION;
            if ( f > 0 ) {
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
    }
    


    //------------------------------
    this.mouseUp = function( x, y )
    {    
        if ( USING_TEST_GUI )
        {
            _testGUI.setMouseUp( x, y );
        }
    }


    //---------------------------------
    this.applyParameters = function()
    {    
        _amplitude     = globalParameters.amplitude;
        _frequency     = globalParameters.frequency;
        _phase         = globalParameters.phase;    
    }

    // React to the window changing size (happens at least once on startup)
    window.addEventListener("resize", function () {
        // Resize canvas
        canvasID.width = window.innerWidth;
        canvasID.height = window.innerHeight;
        SINE_WAVE_Y_POSITION = canvasID.height * ONE_HALF + SINE_WAVE_Y_OFFSET;
    });

    //---------------------
    // start this puppy!
    //---------------------
    this.initialize();
}



var unlock = new Unlock();

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


