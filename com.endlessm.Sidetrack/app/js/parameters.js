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
    availableLevels: 41,

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
    goalYLocation: 0,

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
    },

    {
        level: 3,
        playerYLocation: 2,
        goalYLocation: 2,
    },
    {
        level: 4,
        playerYLocation: 2,
        goalYLocation: 3,
    },
    {
        level: 5,
        playerYLocation: 2,
        goalYLocation: 2,
    },
    {
        level: 6,
        playerYLocation: 3,
    },
    {
        level: 7,
        playerYLocation: 3,
        goalYLocation: 2,
    },
    {
        level: 8,
        playerYLocation: 3,
        goalYLocation: 2,
    },
    {
        level: 9,
        playerYLocation: 2,
        goalYLocation: 2,
    },
    {
        level: 10,
        playerYLocation: 2,
        goalYLocation: 2,
    },
    {
        level: 11,
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
        goalYLocation: 2,
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
        playerYLocation: 2,
        goalYLocation: 4,
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
        goalYLocation: 2,
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
        goalYLocation: 2,
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
        playerYLocation: 2,
        goalYLocation: 3,
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
        playerYLocation: 2,
        goalYLocation: 3,
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
        playerYLocation: 1,
        goalYLocation: 4,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.forward();
    riley.forward();
    riley.down();
    riley.down();
    riley.down();
    riley.down();
    riley.down();`,
    },
    {
        level: 21,
        playerYLocation: 4,
        goalYLocation: 1,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.jump();
    riley.jump();
    riley.jump();
    riley.up();
    riley.up();
    riley.up();
    riley.up();
    riley.down();`,
    },
    {
        level: 22,
        playerYLocation: 3,
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
        level: 23,
        playerYLocation: 2,
        goalYLocation: 2,
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
    {
        level: 24,
        playerYLocation: 2,
        goalYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.down();
    riley.up();
    riley.fooorward();
    riley.forward();
    riley.Jump();
    riley.up();
    riley.jump();
    riley.down();`,
    },
    {
        level: 25,
        playerYLocation: 3,
        goalYLocation: 4,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.up();
    riley.Up();
    riley.down();
    riley.down();
    riley.forward();
    riley.down();
    riley.Jump();`,
    },
    {
        level: 26,
        playerYLocation: 2,
        goalYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.D0wn();
    riley.upp();
    riley.Jump();
    riley.dovvn();
    riley.farward();
    riley.jmup();
    riley.uP();
    riley.forw();`,
    },
    {
        level: 27,
        playerYLocation: 2,
        goalYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.down();
    riley.x0wna_Kms();
    riley.down();
    riley.forward();
    riley.up();
    riley.up();
    riley.pppasd();`,
    },
    {
        level: 28,
        playerYLocation: 2,
        goalYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.forward();
    riley.jump();
    riley.forward();
    riley.up();
    riley.forward();
    riley.forward();
    riley.down();`,
    },
    {
        level: 29,
        playerYLocation: 3,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.jump();
    riley.up();
    riley.up();
    riley.forward();
    riley.jump();
    riley.forward();
    riley.jump();
    riley.up();`,
    },
    {
        level: 30,
        playerYLocation: 1,
        goalYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.jump();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.jump();
    riley.jump();
    riley.down();`,
    },
    {
        level: 31,
        playerYLocation: 2,
        goalYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley._jump();
    riley.forward();
    riley.forward();`,
    },
    {
        level: 32,
        playerYLocation: 3,
        goalYLocation: 3,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.jump();
    riley.up();
    riley.jump();
    riley.forward();
    riley.forward();
    riley.gggggg();
    riley.down();`,
    },
    {
        level: 33,
        playerYLocation: 2,
        goalYLocation: 2,
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
        level: 34,
        playerYLocation: 2,
        goalYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.move_wall_away();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();`,
    },
    {
        level: 35,
        playerYLocation: 1,
        goalYLocation: 2,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.shove_objects();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.shove_walls_and_robots();
    riley.down();`,
    },
    {
        level: 36,
        playerYLocation: 2,
        goalYLocation: 2,
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
        level: 37,
        goalYLocation: 4,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.down();
    riley.down();
    riley.down();
    riley.move_it();
    riley.down();
    riley.forward();
    riley.forward();
    riley.jump();`,
    },
    {
        level: 38,
        playerYLocation: 2,
        goalYLocation: 3,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.forward();
    riley.up();
    riley.push();
    riley.jump();
    riley.jump();
    riley.down();
    riley.down();`,
    },
    {
        level: 39,
        playerYLocation: 3,
        goalYLocation: 1,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.up();
    riley.push();
    riley.jump();
    riley.forward();
    riley.Down();
    riley.down();
    riley.push();
    riley.up();`,
    },
    {
        level: 40,
        playerYLocation: 2,
        goalYLocation: 2,
        gameType: PLAYTHRUGAME,
    },
    {
        level: 41,
        goalYLocation: 4,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.forward();
    riley.down();
    riley.down();
    riley.push();
    riley.push();
    riley.down();
    riley.down();`,
    },
];

/* Freeze default parameters */
Object.freeze(defaultParameters);
Object.freeze(defaultLevelParameters);

/* This array has references to globalLevel#Parameters for easy access */
var levelParameters = [];
