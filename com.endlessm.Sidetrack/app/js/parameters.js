/* exported globalParameters, levelParameters,
EMPTY, WALL, PIT, ROBOTA, ROBOTB */

/*
 * Global parameters exposed to the quests and toolbox
 */

/* Global constants */

// obstacle types
const EMPTY = 0;
const WALL = 1;
const PIT = 2;
const ROBOTA = 3;
const ROBOTB = 4;

// game types
const DEFAULTGAME = 0;
const PLAYTHRUGAME = 1;


var globalParameters = {
    /* Number of available levels */
    // TODO: Where is this value being set? In Lightspeed, it's set to 0.
    availableLevels: 25,

    /* Current Level: read only property, 0 for title screen */
    currentLevel: 0,

    /* Next that will be started */
    nextLevel: 1,

    /* Level specific parameters */
    score: 0,
    success: false,
    playing: false,
    paused: false,

    /* Communication with Clubhouse */
    flipped: false,

    /* Quests can use this parameter to start any level at any time.
     * NOTE: Setting this will stop any current level.
     */
    startLevel: 0,
};

/* Level defaults values */
var defaultParameters = {
    level: 0,

    // goal location
    goalXLocation: 8,
    goalYLocation: 2,

    // player location
    playerXLocation: -1,
    playerYLocation: 0,

    gameType: DEFAULTGAME,
    instructionCode: '',
};

/* Per Level defaults:
 * This parameters will override the ones defined in defaultParameters
 */
var defaultLevelParameters = [
    /* Title screen - Level 0 */
    {
    },
    {
        level: 1,
        playerYLocation: 2,
        goalYLocation: 1,
    },

    {
        level: 2,
        playerYLocation: 2,
        goalYLocation: 0,
    },

    {
        level: 3,
        playerYLocation: 2,
    },
    {
        level: 4,
        playerYLocation: 2,
        goalYLocation: 3,
    },
    {
        level: 5,
        playerYLocation: 2,
    },
    {
        level: 6,
        playerYLocation: 3,
        goalYLocation: 0,
    },
    {
        level: 7,
        playerYLocation: 3,
    },
    {
        level: 8,
        playerYLocation: 3,
    },
    {
        level: 9,
        playerYLocation: 2,
    },
    {
        level: 10,
        playerYLocation: 2,
    },
    {
        level: 11,
        playerYLocation: 0,
        goalYLocation: 4,
    },
    {
        level: 12,
        playerYLocation: 3,
        goalYLocation: 1,
    },
    {
        level: 13,
        playerYLocation: 2,
        goalYLocation: 1,
    },
    {
        level: 14,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();`,
    },
    {
        level: 15,
        goalYLocation: 4,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.down();
    riley.forward();
    riley.down();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();`,
    },
    {
        level: 16,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.forward();
    riley.forward();
    riley.down();
    riley.up();
    riley.forward();
    riley.forward();
    riley.jump();`,
    },
    {
        level: 17,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.up();
    riley.up();
    riley.down();
    riley.down();
    riley.up();
    riley.down();
    riley.up();
    riley.down();`,
    },
    {
        level: 18,
        goalYLocation: 3,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.up();
    riley.forward();
    riley.down();
    riley.forward();
    riley.forward();
    riley.jump();
    riley.down();`,
    },
    {
        level: 19,
        goalYLocation: 3,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.jump();
    riley.up();
    riley.down();
    riley.up();
    riley.jump();
    riley.down();
    riley.down();
    riley.forward();`,
    },
    {
        level: 20,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.down();
    riley.up();
    riley.up();
    riley.down();
    riley.forward();
    riley.jump();
    riley.jump();
    riley.forward();`,
    },
    {
        level: 21,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.jump();
    riley.jump();
    riley.jump();
    riley.jump();
    riley.up();
    riley.up();
    riley.down();
    riley.down();`,
    },
    {
        level: 22,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.down();
    riley.jump();
    riley.down();
    riley.forward();
    riley.up();
    riley.up();
    riley.forward();`,
    },
    {
        level: 23,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.up();
    riley.up();
    riley.jump();
    riley.down();
    riley.down();
    riley.down();
    riley.down();
    riley.down();`,
    },
    {
        level: 24,
        playerYLocation: 3,
        goalYLocation: 0,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.jump();
    riley.jump();
    riley.down();
    riley.up();
    riley.up();
    riley.up();
    riley.up();`,
    },
    {
        level: 25,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.forward();
    riley.forward();
    riley.jumpp();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();`,
    },
];

/* Freeze default parameters */
Object.freeze(defaultParameters);
Object.freeze(defaultLevelParameters);

/* This array has references to globalLevel#Parameters for easy access */
var levelParameters = [];
