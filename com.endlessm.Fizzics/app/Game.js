var canvasID = document.getElementById( 'canvas' );
var canvas = canvasID.getContext( '2d' );

"use strict";


var QUEST0 =  1000; // Episode 1: Fizzics2
var QUEST1 =  1001; // Episode 2: MakerIntro
var QUEST2 =  1002; // Episode 2: MakerQuest
var QUEST3 = 1003;  // Episode 3
var QUEST4 = 1004;  // Episode 3

var FONT_SIZE_SCALE = 0.45;
var FONT_Y_SCALE    = 0.65;
var UI_SCALE        = 0.4;

var GAME_ACTION_NULL        = -1;
var GAME_ACTION_RESET_LEVEL =  0;
var GAME_ACTION_NEXT_LEVEL  =  1;
var GAME_ACTION_PREV_LEVEL  =  2;


//--------------------------
function Game()
{
    var SUCCESS_BALL_RADIUS = 100.0;
    
    function UIElement()
    {    
        this.image         = new Image();
        this.imageHover    = new Image();
        this.imageDisabled = new Image();
        this.width   = 0;
        this.height  = 0;
        this.x       = 0;
        this.y       = 0;
        this.hover   = false;
        this.enabled = false;
    }
    
    var _level           = 0;
    var _score           = 0;
    var _ballDied        = false;
    var _ballReachedGoal = false;
    var _levelboard      = new UIElement();
    var _previousButton  = new UIElement();
    var _resetButton     = new UIElement();
    var _nextButton      = new UIElement();
    var _scoreboard      = new UIElement();
    var _flingboard      = new UIElement();
    var _successScreen   = new UIElement();
    var _levelData       = null;
    var _sucessBall      = new Image();
    
    this.setBallDied = function()
    {
        _ballDied = true;
        globalParameters.ballDied = true;
    }

    this.setBallReachedGoal = function()
    {
        _ballReachedGoal = true;
    }

    //----------------------------------------
    this.setLevelData = function( levelData )
    {                
        _levelData = levelData;
    }	


    
    //-------------------------------------------
    this.getMouseMoveAction = function( x, y )
    {
        //-----------------------------------
        // reset button
        //-----------------------------------
        if ( _resetButton.enabled )
        {
            if (( x > _resetButton.x )
            &&  ( x < _resetButton.x + _resetButton.width )
            &&  ( y > _resetButton.y )
            &&  ( y < _resetButton.y + _resetButton.height ))
            {
                if ( !_resetButton.hover )
                {
                    _resetButton.hover = true;
                }    
            }
            else if ( _resetButton.hover )
            {
                _resetButton.hover = false;
            }
        }

        //-----------------------------------
        // next button
        //-----------------------------------
        if ( _nextButton.enabled )
        {
            if (( x > _nextButton.x )
            &&  ( x < _nextButton.x + _nextButton.width )
            &&  ( y > _nextButton.y )
            &&  ( y < _nextButton.y + _nextButton.height ))
            {
                if ( !_nextButton.hover )
                {
                    _nextButton.hover = true;
                }
            }
            else if ( _nextButton.hover )
            {
                _nextButton.hover = false;
            }
        }

        //-----------------------------------
        // previous button
        //-----------------------------------
        if ( _previousButton.enabled )
        {
            if (( x > _previousButton.x )
            &&  ( x < _previousButton.x + _previousButton.width )
            &&  ( y > _previousButton.y )
            &&  ( y < _previousButton.y + _previousButton.height ))
            {
                if ( !_previousButton.hover )
                {
                    _previousButton.hover = true;
                }
            }
            else if ( _previousButton.hover )
            {
                _previousButton.hover = false;
            }
        }
    }
    
    
    //-------------------------------------------
    this.getMouseDownAction = function( x, y )
    {
        var action = GAME_ACTION_NULL;
        
        if (( x > _successScreen.x )
        &&  ( x < _successScreen.x + _successScreen.width )
        &&  ( y > _successScreen.y )
        &&  ( y < _successScreen.y + _successScreen.height ))
        {
            if ( gameState.success )
            {
                action = GAME_ACTION_NEXT_LEVEL;
            }    
        }
        
        //-----------------------------------
        // reset button
        //-----------------------------------
        if ( _resetButton.enabled )
        {
            if (( x > _resetButton.x )
            &&  ( x < _resetButton.x + _resetButton.width )
            &&  ( y > _resetButton.y )
            &&  ( y < _resetButton.y + _resetButton.height ))
            {
                action = GAME_ACTION_RESET_LEVEL;   
            }
        }
                
        //-----------------------------------
        // previous button
        //-----------------------------------
        if ( _previousButton.enabled )
        {
            if (( x > _previousButton.x )
            &&  ( x < _previousButton.x + _previousButton.width )
            &&  ( y > _previousButton.y )
            &&  ( y < _previousButton.y + _previousButton.height ))
            {
                action = GAME_ACTION_PREV_LEVEL;    
            }
        }

        //-----------------------------------
        // next button
        //-----------------------------------
        if ( _nextButton.enabled )
        {
            if (( x > _nextButton.x )
            &&  ( x < _nextButton.x + _nextButton.width )
            &&  ( y > _nextButton.y )
            &&  ( y < _nextButton.y + _nextButton.height ))
            {
                action = GAME_ACTION_NEXT_LEVEL;    
            }
        }
                
        return action;
    }
    
    
    //----------------------------------------
    this.initializeUserInterface = function()
    {                
        //-------------------------------------------
        // set up UI layout
        //-------------------------------------------
        _levelboard.width      = 668  * UI_SCALE;
        _levelboard.height     = 138  * UI_SCALE;

        _resetButton.width     = 106  * UI_SCALE;
        _resetButton.height    = 106  * UI_SCALE;

        _previousButton.width  = 126  * UI_SCALE;
        _previousButton.height = 106  * UI_SCALE;

        _nextButton.width      = 126  * UI_SCALE;
        _nextButton.height     = 106  * UI_SCALE;

        _scoreboard.width      = 264  * UI_SCALE;
        _scoreboard.height     = 138  * UI_SCALE;

        _flingboard.width      = 306  * UI_SCALE;
        _flingboard.height     = 138  * UI_SCALE;

        _successScreen.width   =  908 * UI_SCALE;
        _successScreen.height  = 1494 * UI_SCALE;
        
        var buttonHeight = _levelboard.y + _levelboard.height * 0.1;

        var left = canvasID.width * ONE_HALF - ( _levelboard.width + _scoreboard.width + _flingboard.width ) * ONE_HALF;
        var top = 0;
        
        _levelboard.x = left;
        _scoreboard.x = _levelboard.x + _levelboard.width;
        _flingboard.x = _scoreboard.x + _scoreboard.width;

        _previousButton.x = _levelboard.x + _levelboard.width * 0.02;
        _resetButton.x    = _levelboard.x + _levelboard.width * 0.65;
        _nextButton.x     = _levelboard.x + _levelboard.width * 0.8;
        
        _levelboard.y = top;
        _scoreboard.y = top;
        _flingboard.y = top;

        _previousButton.y = buttonHeight;
        _resetButton.y    = buttonHeight;
        _nextButton.y     = buttonHeight;
        
        _successScreen.x = canvasID.width  * ONE_HALF - _successScreen.width  * ONE_HALF;
        _successScreen.y = canvasID.height * ONE_HALF - _successScreen.height * ONE_HALF;
        
        _levelboard.hover     = false;
        _resetButton.hover    = false;
        _previousButton.hover = false;
        _nextButton.hover     = false;
        _scoreboard.hover     = false;
        _flingboard.hover     = false;
        _successScreen.hover  = false;        

        _levelboard.enabled     = true;
        _resetButton.enabled    = true;
        _previousButton.enabled = true;
        _nextButton.enabled     = true;
        _scoreboard.enabled     = true;
        _flingboard.enabled     = true;
        _successScreen.enabled  = true;        
        
        _levelboard.image.src             = "images/level_background.png";

        _resetButton.image.src            = "images/reset_enabled.png";
        _resetButton.imageDisabled.src    = "images/reset_disabled.png";
        _resetButton.imageHover.src       = "images/reset_hover.png";

        _previousButton.image.src         = "images/prev_enabled.png";
        _previousButton.imageDisabled.src = "images/prev_disabled.png";
        _previousButton.imageHover.src    = "images/prev_hover.png";

        _nextButton.image.src             = "images/next_enabled.png";
        _nextButton.imageDisabled.src     = "images/next_disabled.png";
        _nextButton.imageHover.src        = "images/next_hover.png";

        _scoreboard.image.src             = "images/score_background.png";
        _flingboard.image.src             = "images/flings_background.png";
        _successScreen.image.src          = "images/success-screen.png";
    }
    
    
    //----------------------------------------------------------------------------------
    this.setLevel = function( parent, levelID, collisionBalls, ballsWithSomeCollision )
    {                
        _level = levelID;
        if (_level < QUEST0)
            localStorage.furthestLevel = Math.max(_level, localStorage.furthestLevel);

        _score = 0;
        _ballDied = false;
        
        gameState.numFlings = 0;
        gameState.numBonus  = 0;
        gameState.running   = true; 
        gameState.success   = false; 
        globalParameters.flingCount = gameState.numFlings;
        _successScreen.enabled = false;
        

        if (_level >= QUEST0)
        {
            this.setPreviousButtonEnabled(false);
            this.setNextButtonEnabled(false);
        }
        else
        {
            this.setPreviousButtonEnabled(_level > 0);
            this.setNextButtonEnabled(_level < localStorage.furthestLevel);
        }

        this.applyLevel(_level, parent);

        if (_level >= QUEST0)
            this.initializeGameState(collisionBalls, ballsWithSomeCollision);
    };

    // In this function we can create balls programmatically, for example if
    // their positions need to depend on the canvas size. Balls created in this
    // function will appear in addition to balls specified in the level's
    // "balls" array in GameLevels.json.
    // Some levels have "balls": [], and in those levels all the balls are
    // created in this function.
    this._placeBallsProgrammatically = function(_level, parent) {
        if (_level === QUEST0) {
            var r = 300;
            this.createBallCircle( parent, 0.5 * canvasID.width, 0.5 * canvasID.height, 1, r, 20 );
        }

        else if ( _level == QUEST1 )
        {
            posX = 200;
            posY = 0.5*canvasID.height;
            parent.createBall( posX, posY, 0 );
            spacing = 80
            for (var i=0; i<5; i++)
            {
                parent.createBall( posX + 150 + i*spacing, posY, 4 );
            }
        }
        
        else if ( _level == QUEST2 )
        {
            posX = canvasID.width*0.3;
            parent.createBall( posX, 0.5 * canvasID.height, 1 );

            var num = 10;
            for (var i=0; i<num; i++)
            {
                var a = ( i / num ) * PI2;
                var r = 160.0;
                var x = posX + r * Math.sin(a);
                var y = 0.5 * canvasID.height + r * Math.cos(a);
                parent.createBall( x, y, 0 );
            }
        }
    }

    
    
      
    //-------------------------------------------
    this.applyLevel = function(levelId, parent) {
        const level = this.getLevelInfo(levelId);

        level.balls.forEach(({x, y, species}) => parent.createBall(x, y, species));
        this._placeBallsProgrammatically(levelId, parent);

        // set up the game state to detect collisions between species...
        const {
            period = NaN, // how many time steps are used to run this test?
            collisionSpecies = NaN,  // which species of balls do we care about for collisions?
            numCollisionsGoal = NaN,  // how many unique balls do we want to test for collisions?
        } = level;
        Object.assign(gameState, {period, collisionSpecies, numCollisionsGoal});
    }

    this.getLevelCount = function()
    {
        return _levelData.levels.filter(({ID}) => ID < QUEST0).length;
    }

    this.getLevelInfo = function(levelId) {
        return _levelData.levels.find(({ID}) => ID === levelId);
    };

    // "Blank" defaults for all levels
    this.defaultLevelParameters = (function() {
        const defaultLevelParameters = {
            backgroundImageIndex: 0,
        };
        for (let species = 0; species < 5; species++) {
            Object.assign(defaultLevelParameters, {
                [`usePhysics_${species}`]: false,
                [`gravity_${species}`]: 0,
                [`radius_${species}`]: 60,
                [`collision_${species}`]: 0.2,
                [`friction_${species}`]: 10,
                [`imageIndex_${species}`]: species,
                [`deathVisualGood_${species}`]: 0,
                [`deathVisualBad_${species}`]: 0,
                [`deathSoundGood_${species}`]: 0,
                [`deathSoundBad_${species}`]: 0,
            });
            for (let target = 0; target < 5; target++) {
                Object.assign(defaultLevelParameters, {
                    [`socialForce_${species}_${target}`]: 0,
                    [`touchDeath_${species}_${target}`]: 0,
                });
            }
        }
        return defaultLevelParameters;
    })();

    // Defaults for levels that are part of the main game (1 through "the end")
    // These levels have ID < 1000, QUEST0 is the first non-main level
    this.defaultMainLevelParameters = Object.assign({}, this.defaultLevelParameters, {
        backgroundImageIndex: 2,

        usePhysics_0: true,
        radius_0: 50,
        collision_0: 0.9,
        friction_0: 5,
        imageIndex_0: 6,
        touchDeath_0_1: 1,
        touchDeath_0_2: 2,
        deathVisualBad_0: 1,
        deathSoundGood_0: 4,
        deathSoundBad_0: 6,

        imageIndex_1: 8,

        collision_2: 0.5,
        imageIndex_2: 1,

        imageIndex_3: 9,

        usePhysics_4: true,
        radius_4: 35,
        imageIndex_4: 10,
        touchDeath_4_0: 1,
        deathVisualGood_4: 8,
        deathSoundGood_4: 5,
    });

    this.setLevelGlobalParams = function( levelID )
    {                
        const levelParameters = {};
        const {preset} = this.getLevelInfo(levelID);

        // Enable tool disabling flags if disableToolsOnlyInFurthestLevel is
        // true and we are in the furthest level!
        if (levelID < localStorage.furthestLevel &&
            preset.disableToolsOnlyInFurthestLevel) {
            delete preset.flingToolDisabled;
            delete preset.moveToolDisabled;
            delete preset.createToolDisabled;
            delete preset.deleteToolDisabled;
        }

        if (levelID < QUEST0)
            Object.assign(levelParameters, this.defaultMainLevelParameters, preset);
        else
            Object.assign(levelParameters, this.defaultLevelParameters, preset);

        /* Reset to default */
        globalParameters.flingToolDisabled = false;
        globalParameters.moveToolDisabled  = false;
        globalParameters.createToolDisabled= false;
        globalParameters.deleteToolDisabled= false;

        Object.assign(globalParameters, levelParameters);
    }



    //---------------------------------
    this.getCurrentLevel = function()
    {           
        return _level;
    }
    
    //------------------------------
    this.getNextLevel = function()
    {           
        const maxMainLevel = this.getLevelCount() - 1;

        if (_level == maxMainLevel)
            return maxMainLevel;
        if (_level === QUEST3)
            return QUEST3;  // QUEST3 loops back to itself
        return _level+1;
    }
    
    //------------------------------
    this.getPrevLevel = function()
    {           
        if (_level == 0)
            return 0;
        return _level - 1;
    }
    

    //----------------------------------------------
    this.setNextButtonEnabled = function( enabled )
    {
        _nextButton.enabled = enabled;
    }



    //----------------------------------------------
    this.setResetButtonEnabled = function( enabled )
    {
        _resetButton.enabled = enabled;
    }


    //----------------------------------------------
    this.setPreviousButtonEnabled = function( enabled )
    {
        _previousButton.enabled = enabled;
    }

        
    //----------------------------------------------------------------------------
    this.createBallCircle = function( parent, x, y, ballType, radius, ballCount )
    {
        for (var i=0; i<ballCount; i++)
        {
            var a = ( i / ballCount ) * PI2;
            var r = radius + 0.5 * radius * Math.random();
            var bx = x + r * Math.sin(a);
            var by = y + r * Math.cos(a);
            parent.createBall( bx, by, ballType );
        }
    }    
    
    //-------------------------------------------------------------------------------------------------------------------------
    this.initializeGameState = function(collisionBalls, ballsWithSomeCollision) {
        gameState.testBall            = NULL_BALL;
        gameState.testSpecies         = 0;
        gameState.running             = true;
        gameState.clock               = 0;
        gameState.timeInLevel         = 0.0;
        gameState.numCollisions       = 0;
        gameState.numFlings           = 0;
        gameState.numBonus            = 0;
        gameState.someCollisionsInPeriod = false;

        globalParameters.quest0Success = false;
        globalParameters.quest1Success = false;
        globalParameters.quest2Success = false;
        globalParameters.quest3Success = false;
        globalParameters.quest4Success = false;
        globalParameters.flingCount = 0;

        for (var c=0; c<gameState.numCollisionsGoal; c++)
        {
            collisionBalls[c] = NULL_BALL;
        }

        for (var i=0; i<MAX_BALLS; i++)
        {
            ballsWithSomeCollision[i] = false;
        }
        
        _score = 0;
        _ballDied = false;
    }
    
    
    
    //--------------------------------------------------------------------------------
    this.update = function( dt, collisionBalls, ballsWithSomeCollision, numBalls, balls )
    {        
        gameState.timeInLevel += dt;

        if ( gameState.running )
        {
            var type0BallCount = 0;
            var type1BallCount = 0;
            var type2BallCount = 0;
            var type4BallCount = 0;

            gameState.testBall = NULL_BALL;
        
            for (var i=0; i<numBalls; i++)
            {   
                switch (balls[i].getType())
                {
                    case 0:
                        type0BallCount++;
                        break;
                    case 1:
                        type1BallCount++;
                        gameState.testBall = i;
                        break;
                    case 2:
                        type2BallCount++;
                        break;
                    case 4:
                        type4BallCount++;
                        break;
                    default:
                        break;  
                }   
            }

            globalParameters.type0BallCount = type0BallCount;
            globalParameters.type1BallCount = type1BallCount;
            globalParameters.type2BallCount = type2BallCount;
            globalParameters.type4BallCount = type4BallCount;
            globalParameters.flingCount = gameState.numFlings;

            if (_level < QUEST0 || _level === QUEST3) {
                if ( globalParameters.type0BallCount == 0
                && !_ballDied
                && _ballReachedGoal )
                {
                    if (!globalParameters.quest3Success)
                        globalParameters.quest3Success = this.isQuest3GoalReached();

                    gameState.running = false;
                    gameState.success = true;
                    globalParameters.levelSuccess = true;
                    _successScreen.enabled = true;

                    // to do: this needs to be determined by which species the sound is associated with.
                    // Sounds.play( "fizzics/success1" );
                    Sounds.play( "fizzics/collision/winning" );
                    Sounds.playLoop( "fizzics/you_won" );
                }

                _ballReachedGoal = false;
            }

            // Quest level that doesn't require getting orange balls to the goal
            else
            {
                //----------------------------------
                // collect num collisions
                //----------------------------------
                gameState.numCollisions = 0;
                for (var c=0; c<gameState.numCollisionsGoal; c++)
                {                            
                    if ( collisionBalls[c] != NULL_BALL )
                    {
                        gameState.numCollisions ++;
                    }
                }
            
                if (!gameState.someCollisionsInPeriod)
                {
                    for (var i=0; i<MAX_BALLS; i++)
                    {
                        if ( ballsWithSomeCollision[i])
                        {
                            gameState.someCollisionsInPeriod = true;
                            break;
                        }
                    }
                }

                if (!globalParameters.quest0Success)
                {
                    globalParameters.quest0Success = this.isQuest0GoalReached();
                }
            
                if (!globalParameters.quest1Success)
                {
                    globalParameters.quest1Success = this.isQuest1GoalReached();
                }
                if (!globalParameters.quest2Success)
                {
                    globalParameters.quest2Success = this.isQuest2GoalReached();
                }
                if (!globalParameters.quest4Success)
                    globalParameters.quest4Success = this.isQuest4GoalReached();

                gameState.clock ++;
                if ( gameState.clock > gameState.period )
                {
                    gameState.clock = 0;
                    gameState.numCollisions    = 0;    
                    gameState.someCollisionsInPeriod = false;
                
                    for (var c=0; c<gameState.numCollisionsGoal; c++)
                    {                            
                        collisionBalls[c] = NULL_BALL;
                    }   
                 
                    for (var i=0; i<MAX_BALLS; i++)
                    {
                        ballsWithSomeCollision[i] = false;
                    }
                }
            }

            globalParameters.score = _score;
            globalParameters.currentLevel = _level;
        }    
    }
    
    
    //--------------------------------------
    this.isQuest0GoalReached = function()
    {
        // Don't accept the goal met before 5 seconds are up so things get a chance to settle down
        if (gameState.timeInLevel < 5)
            return false;

        if (gameState.clock < gameState.period-1)
            return false;

        if (globalParameters.type1BallCount < 20)
            return false;

        if ( gameState.someCollisionsInPeriod )
        {
            //console.log( "Some collisions");
            return false;
        }

        //console.log( "Goal met");
        return true;
    }


    // Success: Collect all 5 diamonds without any flings
    this.isQuest1GoalReached = function()
    {
        return (gameState.numBonus >= 5*2);
    }

    // Success: Whenever we have 10 green balls and 1 red ball, and all 10 green balls are touching the red ball at the same time
    this.isQuest2GoalReached = function()
    {
        // We need exactly 10 type 0 balls
        if (globalParameters.type0BallCount != 10)
            return false;

        // And exactly 1 type 1 (red) ball
        if (globalParameters.type1BallCount != 1)
            return false;

        if ( gameState.numCollisions >= gameState.numCollisionsGoal )
            return true;

        return false;
    }

    this.isQuest3GoalReached = function() {
        return _ballReachedGoal && this.getScore() >= 50;
    }

    this.isQuest4GoalReached = function() {
        // At least the original number of gems have been collected, no newly
        // added gems are left, and zero or one flings were used
        return gameState.numBonus >= 36 &&
            globalParameters.type4BallCount == 0 &&
            gameState.numFlings <= 1;
    }

    this.getScore = function()
    {
        return 10 - gameState.numFlings + gameState.numBonus;
    }

    //--------------------------
    this.isPositionOverButton = function(x, y)
    {
        const buttons = [ _resetButton, _previousButton, _nextButton,  _successScreen ];

        for (var i = 0, n = buttons.length; i < n; i++)
        {
            const button = buttons[i];
            if ( button.enabled &&
                 x > button.x && x < button.x + button.width &&
                 y > button.y && y < button.y + button.height)
                return true;
        }

        return false;
    }

    this._renderButton = function (b)
    {
        var image;

        if (b.enabled)
            image = b.blinkImage ? b.blinkImage : (b.hover ? b.imageHover : b.image);
        else
            image = b.imageDisabled;

        canvas.drawImageCached ( image, b.x, b.y, b.width, b.height );
    }

    //------------------------
    this.render = function()
    {
        canvas.fillStyle = "rgb( 255, 255, 255 )"
        
        //--------------------------------------
        // render levelboard
        //--------------------------------------
        canvas.drawImageCached
        ( 
            _levelboard.image, 
            _levelboard.x,
            _levelboard.y, 
            _levelboard.width, 
            _levelboard.height
        );
        
        canvas.font = eval( _levelboard.height * FONT_SIZE_SCALE ) + "px Arial";
        var levelString = _level+1;
        if (_level >= QUEST0)
            levelString = "Ꮘො";
        canvas.fillText( "Level " + levelString, _levelboard.x + _levelboard.width * 0.23, _levelboard.y + _levelboard.height * FONT_Y_SCALE );

        //------------------------------------------------------------
        // if ballDied is true, then make the reset button flash
        //------------------------------------------------------------
        if ( _ballDied )
        {
            const period = 500;
            var timer = (new Date).getTime() % period;

            _resetButton.blinkImage = timer > ( period * ONE_HALF) ? _resetButton.imageHover : _resetButton.image;
        }
        else
        {
            this.setResetButtonEnabled(_resetButton.enabled);   
        }

        //------------------------
        // render reset button
        //------------------------
        this._renderButton (_resetButton);

        //--------------------------------------
        // render previous button
        //--------------------------------------
        this._renderButton (_previousButton);

        //--------------------------------------
        // render next button
        //--------------------------------------
        this._renderButton (_nextButton);

        //--------------------------------------
        // render scoreboard
        //--------------------------------------
        canvas.drawImageCached
        ( 
            _scoreboard.image, 
            _scoreboard.x,
            _scoreboard.y, 
            _scoreboard.width,
            _scoreboard.height
        );        
        canvas.fillText( gameState.numBonus.toString(), _scoreboard.x + _scoreboard.width * 0.6, _scoreboard.y + _scoreboard.height * FONT_Y_SCALE );
        
        
        //--------------------------------------
        // render flingboard
        //--------------------------------------
        canvas.drawImageCached
        ( 
            _flingboard.image, 
            _flingboard.x,
            _flingboard.y, 
            _flingboard.width,
            _flingboard.height
        );
        canvas.fillText( gameState.numFlings.toString(), _flingboard.x + _flingboard.width * 0.6, _flingboard.y + _flingboard.height * FONT_Y_SCALE );

        //--------------------------------------
        // render success screen
        //--------------------------------------
        if ( gameState.success )
        {
            canvas.drawImageCached
            ( 
                _successScreen.image, 
                _successScreen.x,
                _successScreen.y, 
                _successScreen.width, 
                _successScreen.height
            );
            

            var score = this.getScore();
            var scoreX = _successScreen.x + _successScreen.width * 0.61;
            var scoreY = _successScreen.y + _successScreen.height * 0.683;
            canvas.font = "32px Arial";
            canvas.fillText( score.toString(),  scoreX, scoreY );


            var flingX = _successScreen.x + _successScreen.width  * 0.38;
            var bonusX = _successScreen.x + _successScreen.width  * 0.63;
            var fontY  = _successScreen.y + _successScreen.height * 0.76;
            
            canvas.font = "17px Times";
            canvas.fillText( "+ " + gameState.numBonus.toString(),  bonusX, fontY );
            canvas.fillText( "+ " + gameState.numFlings.toString(), flingX, fontY );

            //--------------------------------------
            // render success ball
            //--------------------------------------
            _sucessBall.src = "images/ball-" + globalParameters.imageIndex_0 + ".png";
            canvas.drawImageCached
            ( 
                _sucessBall, 
                _successScreen.x + _successScreen.width/2 - SUCCESS_BALL_RADIUS * ONE_HALF,
                _successScreen.y + _successScreen.height/2 - SUCCESS_BALL_RADIUS * ONE_HALF - 120,
                SUCCESS_BALL_RADIUS, 
                SUCCESS_BALL_RADIUS
            );            
        }
    }
}

