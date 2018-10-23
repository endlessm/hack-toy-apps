
//----------------------
function Synthesizer()
{    
    var NULL_NOTE     = -1;

//    var BASE_VOLUME    = 0.7;
//    var OVER_VOLUME    = 0.2;

    var BASE_VOLUME    = 0.9;
    var OVER_VOLUME    = 0.0;

    var MAX_SIMULTANEOUS_NOTES = 16;

    function Note()
    {
        this.baseTone        = null;
        this.overtone        = null;
        this.baseEnvelope    = null;
        this.overEnvelope    = null;
        this.attack            = ZERO;
        this.release        = ZERO;
        this.duration        = ZERO;
        this.playing        = false;
        this.startTime        = ZERO;
        this.volume            = ZERO;
    }    

    var _notes = new Array( MAX_SIMULTANEOUS_NOTES );

    //--------------------------
    this.initialize = function()
    {
        // patch up prefixes
        window.AudioContext=window.AudioContext||window.webkitAudioContext;

        var context = new AudioContext();

        for (var n=0; n<MAX_SIMULTANEOUS_NOTES; n++)
        {
            _notes[n] = new Note();
            
            _notes[n].volume = ZERO;

            _notes[n].baseTone = context.createOscillator();
            _notes[n].overtone = context.createOscillator();

            _notes[n].baseTone.type = "sine";
            _notes[n].overtone.type = "sine";

            _notes[n].baseEnvelope = context.createGain();
            _notes[n].overEnvelope = context.createGain();

            _notes[n].baseTone.connect( _notes[n].baseEnvelope );
            _notes[n].overtone.connect( _notes[n].overEnvelope );

            _notes[n].baseEnvelope.connect( context.destination );
            _notes[n].overEnvelope.connect( context.destination );

            _notes[n].baseEnvelope.gain.value = ZERO; 
            _notes[n].overEnvelope.gain.value = ZERO; 

            _notes[n].baseTone.start(0);
            _notes[n].overtone.start(0);

            _notes[n].playing = false;
            _notes[n].duration = ZERO;
        }
    }


    //--------------------------
    // update
    //--------------------------
    this.update = function()
    {
        for (var n=0; n<MAX_SIMULTANEOUS_NOTES; n++)
        {
            if ( _notes[n].playing )
            {
                var currentTime = new Date().getTime() / MILLISECONDS_PER_SECOND;

                var secondsSinceStarted = ( new Date().getTime() / MILLISECONDS_PER_SECOND ) - _notes[n].startTime;
        
                if ( secondsSinceStarted > _notes[n].duration )
                {
                    _notes[n].baseEnvelope.gain.cancelScheduledValues(0);
                    _notes[n].overEnvelope.gain.cancelScheduledValues(0);

                    _notes[n].baseEnvelope.gain.setTargetAtTime( 0.0, 0, _notes[n].release );
                    _notes[n].overEnvelope.gain.setTargetAtTime( 0.0, 0, _notes[n].release );

                    if ( secondsSinceStarted > _notes[n].duration + _notes[n].release )
                    {
                        _notes[n].playing = false;
                    }
                }
            }
        }
    }




    //-----------------------------
    this.getFreeNote = function()
    {
        var freeNote = NULL_NOTE;
        var looking = true;
        var n = 0;

        while ( looking )
        {
            if ( !_notes[n].playing )
            {
                freeNote = n;
                looking = false;
            }

            n ++;

            if ( n >= MAX_SIMULTANEOUS_NOTES )
            {
                looking = false;
            }
        }

        return freeNote;
    }


    //------------------------------------------------------------
    this.playNote = function( pitch, volume, duration, attack, release )
    {
        var n = this.getFreeNote();

        if ( n != NULL_NOTE )
        {
            var convertedPitch             = Math.floor( 440 * Math.pow(2,(pitch   -69)/12) );
            var convertedOvertonePitch     = Math.floor( 440 * Math.pow(2,(pitch+12-69)/12) );

            _notes[n].attack      = attack;
            _notes[n].release     = release;
            _notes[n].volume     = volume;

            _notes[n].baseTone.frequency.setValueAtTime( convertedPitch, 0 );
            _notes[n].overtone.frequency.setValueAtTime( convertedOvertonePitch, 0 );

              _notes[n].baseEnvelope.gain.cancelScheduledValues(0);
              _notes[n].overEnvelope.gain.cancelScheduledValues(0);

              _notes[n].baseEnvelope.gain.setTargetAtTime( _notes[n].volume, 0, _notes[n].attack );
              _notes[n].overEnvelope.gain.setTargetAtTime( _notes[n].volume, 0, _notes[n].attack );

            _notes[n].playing    = true;
            _notes[n].duration    = duration;
            _notes[n].startTime = new Date().getTime() / MILLISECONDS_PER_SECOND;
        }
    }



    //--------------------------------
    this.turnOffAllNotes = function()
    {
        for (var n=0; n<MAX_SIMULTANEOUS_NOTES; n++)
        {
            _notes[n].baseEnvelope.gain.value = ZERO;
            _notes[n].overEnvelope.gain.value = ZERO;
            _notes[n].playing = false;
        }
    }

}





