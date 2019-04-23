/* exported globalParameters, levelParameters,
EMPTY, WALL, PIT, NONE, riley */

/*
 * Global parameters exposed to the quests and toolbox
 */

/* Global constants */

// obstacle types
const EMPTY = 0;
const WALL = 1;
const PIT = 2;

// game types
const DEFAULTGAME = 0;
const PLAYTHRUGAME = 1;

// move types
const NONE = 0;
const FORWARD = 1;
const UP = 2;
const DOWN = 3;
const JUMP = 4;

class riley {
    constructor() {
        this.moves = [];
    }

    forward() {
        this.moves.push(FORWARD);
    }

    up() {
        this.moves.push(UP);
    }

    down() {
        this.moves.push(DOWN);
    }

    jump() {
        this.moves.push(JUMP);
    }
}

var globalParameters = {
    /* Number of available levels */
    // TODO: Where is this value being set? In Lightspeed, it's set to 0.
    availableLevels: 14,

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
    isDraggable: false,

    instructionCode: '',
};

/* Per Level defaults:
 * This parameters will override the ones defined in defaultParameters
 */
var defaultLevelParameters = [
    /* Title screen - Level 0 */
    {
    },

    /* Level 1 */
    {
        level: 1,
        playerYLocation: 2,
        goalYLocation: 1,
    },

    /* Level 2 */
    {
        level: 2,
        playerYLocation: 2,
        goalYLocation: 0,
    },

    /* Level 3 */
    {
        level: 3,
        playerYLocation: 2,
    },
    /* Level 4 */
    {
        level: 4,
        playerYLocation: 2,
    },

    /* Level 5 */
    {
        level: 5,
        playerYLocation: 3,
        goalYLocation: 0,
    },

    /* Level 6 */
    {
        level: 6,
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

    /* Level 7 */
    {
        level: 7,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        isDraggable: true,
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

    /* Level 8 */
    {
        level: 8,
        goalYLocation: 3,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        isDraggable: true,
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

    /* Level 9 */
    {
        level: 9,
        goalYLocation: 3,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        isDraggable: true,
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

    /* Level 10 */
    {
        level: 10,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        isDraggable: true,
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

    /* Level 11 */
    {
        level: 11,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        isDraggable: true,
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

    /* Level 12 */
    {
        level: 12,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        isDraggable: true,
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

    /* Level 13 */
    {
        level: 13,
        playerYLocation: 2,
        gameType: PLAYTHRUGAME,
        isDraggable: true,
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

    /* Level 14 */
    {
        level: 14,
        playerYLocation: 2,
        goalYLocation: 0,
        gameType: PLAYTHRUGAME,
        isDraggable: true,
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
];

/* Freeze default parameters */
Object.freeze(defaultParameters);
Object.freeze(defaultLevelParameters);

/* This array has references to globalLevel#Parameters for easy access */
var levelParameters = [];
