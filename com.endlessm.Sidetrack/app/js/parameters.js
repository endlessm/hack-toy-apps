/* exported globalParameters, levelParameters,

/*
 * Global parameters exposed to the quests and toolbox
 */

/* Global constants */

// game types
const DEFAULTGAME = 0;
const PLAYTHRUGAME = 1;


var globalParameters = {
    // Number of levels that have been revealed to the player
    availableLevels: 50,

    highestAchievedLevel: 1,

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
    controlsCutscene: false,
    escapeCutscene: false,

    /* Quests can use this parameter to start any level at any time.
     * NOTE: Setting this will stop any current level.
     */
    startLevel: 0,
};

/* Level defaults values */
var defaultParameters = {
    level: 0,

    robotADirection: 'down',
    robotBDirection: 'up',

    gameType: DEFAULTGAME,
    instructionCode: '',
    levelCode: '',
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 1;
    add(wall, 4, 0);
    add(wall, 1, 1);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(wall, 4, 1);
    add(wall, 3, 2);
    add(wall, 6, 2);
    add(wall, 6, 3);
    add(wall, 6, 4);`,
    },
    {
        level: 2,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 0;
    add(wall, 4, 0);
    add(wall, 5, 0);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(wall, 4, 1);
    add(wall, 6, 1);
    add(wall, 6, 2);
    add(wall, 2, 3);
    add(wall, 3, 3);
    add(wall, 4, 3);`,
    },
    {
        level: 3,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 4, 0);
    add(wall, 1, 1);
    add(wall, 4, 1);
    add(wall, 0, 2);
    add(wall, 1, 2);
    add(wall, 3, 2);
    add(wall, 5, 2);
    add(wall, 6, 2);
    add(wall, 3, 3);
    add(wall, 5, 3);
    add(wall, 2, 4);
    add(wall, 4, 4);`,
    },
    {
        level: 4,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 3;
    add(wall, 1, 0);
    add(wall, 1, 1);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(pit, 2, 2);
    add(wall, 1, 3);
    add(wall, 2, 3);
    add(wall, 3, 3);
    add(pit, 6, 3);
    add(wall, 1, 4);
    add(pit, 6, 4);`,
    },
    {
        level: 5,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(pit, 5, 0);
    add(wall, 1, 1);
    add(wall, 4, 1);
    add(wall, 5, 1);
    add(pit, 2, 2);
    add(wall, 3, 2);
    add(pit, 5, 2);
    add(wall, 6, 2);
    add(wall, 2, 3);
    add(wall, 4, 3);
    add(wall, 5, 3);
    add(pit, 5, 4);`,
    },
    {
        level: 6,
        levelCode: `\
    rileyPosition = 3;
    goalPosition = 0;
    add(wall, 1, 1);
    add(pit, 4, 1);
    add(pit, 6, 1);
    add(wall, 1, 2);
    add(wall, 2, 2);
    add(pit, 4, 2);
    add(wall, 6, 2);
    add(pit, 2, 3);
    add(wall, 1, 4);`,
    },
    {
        level: 7,
        levelCode: `\
    rileyPosition = 3;
    goalPosition = 2;
    add(robotA, 2, 0);
    add(robotA, 4, 0);
    add(robotA, 6, 0);`,
    },
    {
        level: 8,
        levelCode: `\
    rileyPosition = 3;
    goalPosition = 2;
    add(robotA, 2, 0);
    add(wall, 3, 0);
    add(robotA, 4, 0);
    add(robotA, 6, 0);
    add(pit, 5, 1);
    add(wall, 0, 2);
    add(wall, 3, 2);
    add(wall, 5, 3);
    add(wall, 0, 4);
    add(wall, 3, 4);
    add(wall, 5, 4);`,
    },
    {
        level: 9,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 3, 0);
    add(wall, 3, 1);
    add(robotA, 6, 1);
    add(robotA, 4, 2);
    add(wall, 3, 3);
    add(wall, 3, 4);
    add(robotA, 6, 4);`,
    },
    {
        level: 10,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(robotB, 6, 0);
    add(robotA, 3, 2);
    add(robotA, 3, 3);
    add(robotB, 1, 4);`,
    },
    {
        level: 11,
        levelCode: `\
    rileyPosition = 0;
    goalPosition = 4;
    add(wall, 2, 0);
    add(robotB, 6, 0);
    add(robotA, 3, 2);
    add(wall, 4, 2);
    add(robotA, 3, 3);
    add(pit, 4, 3);
    add(robotB, 1, 4);
    add(pit, 4, 4);`,
    },
    {
        level: 12,
        levelCode: `\
    rileyPosition = 3;
    goalPosition = 1;
    add(robotA, 2, 0);
    add(robotB, 5, 0);
    add(robotA, 2, 1);
    add(robotB, 5, 1);
    add(robotA, 2, 2);
    add(robotB, 5, 2);
    add(robotB, 5, 3);
    add(robotA, 2, 4);`,
    },
    {
        level: 13,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 1;
    add(robotB, 2, 0);
    add(pit, 3, 0);
    add(pit, 4, 0);
    add(pit, 5, 0);
    add(pit, 0, 1);
    add(pit, 1, 1);
    add(pit, 0, 2);
    add(pit, 1, 2);
    add(pit, 3, 2);
    add(pit, 4, 2);
    add(pit, 5, 2);
    add(pit, 0, 3);
    add(pit, 1, 3);
    add(pit, 3, 3);
    add(pit, 4, 3);
    add(pit, 5, 3);
    add(robotA, 6, 3);
    add(pit, 3, 4);
    add(pit, 4, 4);
    add(pit, 5, 4);
    add(robotA, 6, 4);`,
    },
    {
        level: 14,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(robotA, 0, 0);
    add(pit, 5, 0);
    add(pit, 2, 1);
    add(wall, 4, 1);
    add(robotB, 6, 1);
    add(wall, 1, 3);
    add(pit, 3, 3);
    add(wall, 5, 3);
    add(pit, 7, 3);
    add(wall, 3, 4);`,
    },
    {
        level: 15,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 4;
    add(robotA, 6, 1);
    add(wall, 3, 2);
    add(wall, 4, 2);
    add(wall, 5, 3);
    add(robotB, 0, 4);`,
    },
    {
        level: 16,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 3, 0);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(pit, 3, 2);
    add(wall, 2, 3);
    add(wall, 3, 3);
    add(wall, 3, 4);`,
    },
    {
        level: 17,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 4, 0);
    add(wall, 1, 1);
    add(wall, 4, 1);
    add(wall, 0, 2);
    add(wall, 1, 2);
    add(wall, 3, 2);
    add(wall, 5, 2);
    add(wall, 6, 2);
    add(wall, 3, 3);
    add(wall, 5, 3);
    add(wall, 2, 4);
    add(wall, 4, 4);`,
    },
    {
        level: 18,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 3;
    add(wall, 1, 0);
    add(wall, 1, 1);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(pit, 2, 2);
    add(wall, 1, 3);
    add(wall, 2, 3);
    add(wall, 3, 3);
    add(pit, 6, 3);
    add(wall, 1, 4);
    add(pit, 6, 4);`,
    },
    {
        level: 19,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 3;
    add(wall, 1, 0);
    add(wall, 1, 1);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(pit, 2, 2);
    add(robotA, 4, 2);
    add(wall, 1, 3);
    add(wall, 2, 3);
    add(wall, 3, 3);
    add(pit, 6, 3);
    add(wall, 1, 4);
    add(pit, 6, 4);`,
    },
    {
        level: 20,
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
        levelCode: `\
    rileyPosition = 1;
    goalPosition = 4;
    add(wall, 0, 1);
    add(wall, 1, 1);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(wall, 4, 1);
    add(robotB, 5, 1);
    add(wall, 2, 2);
    add(wall, 3, 2);
    add(wall, 4, 2);
    add(robotB, 5, 2);
    add(wall, 3, 3);
    add(wall, 4, 3);`,
    },
    {
        level: 21,
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
        levelCode: `\
    rileyPosition = 4;
    goalPosition = 1;
    add(robotB, 3, 0);
    add(wall, 5, 1);
    add(pit, 2, 2);
    add(pit, 4, 2);
    add(wall, 5, 2);
    add(wall, 5, 3);
    add(robotB, 6, 3);
    add(wall, 2, 4);`,
    },
    {
        level: 22,
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
        levelCode: `\
    rileyPosition = 3;
    goalPosition = 0;
    add(wall, 1, 1);
    add(pit, 4, 1);
    add(pit, 6, 1);
    add(wall, 1, 2);
    add(wall, 2, 2);
    add(pit, 4, 2);
    add(wall, 6, 2);
    add(pit, 2, 3);
    add(wall, 1, 4);`,
    },
    {
        level: 23,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(pit, 3, 0);
    add(pit, 3, 1);
    add(pit, 3, 2);
    add(pit, 3, 3);
    add(pit, 3, 4);`,
    },
    {
        level: 24,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 0, 1);
    add(wall, 1, 1);
    add(pit, 6, 1);
    add(wall, 0, 2);
    add(robotA, 3, 2);
    add(pit, 4, 2);
    add(wall, 6, 2);
    add(wall, 6, 3);
    add(wall, 6, 4);`,
    },
    {
        level: 25,
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
        levelCode: `\
    rileyPosition = 3;
    goalPosition = 4;
    add(robotB, 0, 0);
    add(robotB, 1, 0);
    add(robotB, 2, 0);
    add(robotA, 4, 0);
    add(robotA, 7, 0);
    add(pit, 3, 1);
    add(robotA, 4, 1);
    add(robotA, 5, 1);
    add(robotA, 6, 1);
    add(wall, 3, 3);
    add(wall, 3, 4);`,
    },
    {
        level: 26,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 0, 0);
    add(pit, 4, 0);
    add(wall, 5, 0);
    add(robotB, 6, 0);
    add(wall, 1, 1);
    add(pit, 5, 1);
    add(pit, 2, 2);
    add(pit, 4, 2);
    add(pit, 5, 2);
    add(wall, 2, 3);
    add(wall, 5, 3);
    add(wall, 1, 4);
    add(robotA, 3, 4);`,
    },
    {
        level: 27,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(pit, 5, 0);
    add(wall, 1, 1);
    add(wall, 4, 1);
    add(wall, 5, 1);
    add(pit, 2, 2);
    add(wall, 3, 2);
    add(pit, 5, 2);
    add(wall, 6, 2);
    add(wall, 2, 3);
    add(wall, 4, 3);
    add(wall, 5, 3);
    add(pit, 5, 4);`,
    },
    {
        level: 28,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 2, 0);
    add(wall, 2, 1);
    add(wall, 2, 2);
    add(wall, 6, 2);
    add(wall, 2, 3);
    add(wall, 2, 4);`,
    },
    {
        level: 29,
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
        levelCode: `\
    rileyPosition = 3;
    goalPosition = 0;
    add(wall, 0, 0);
    add(wall, 6, 0);
    add(wall, 0, 1);
    add(robotA, 4, 1);
    add(wall, 6, 1);
    add(wall, 0, 2);
    add(wall, 6, 2);
    add(wall, 0, 3);
    add(wall, 6, 3);
    add(wall, 0, 4);    
    add(wall, 6, 4);`,
    },
    {
        level: 30,
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
        levelCode: `\
    rileyPosition = 1;
    goalPosition = 2;
    add(wall, 0, 0);
    add(wall, 1, 0);
    add(wall, 5, 0);
    add(wall, 6, 0);
    add(wall, 1, 1);
    add(wall, 6, 1);
    add(wall, 0, 2);
    add(wall, 1, 2);
    add(wall, 5, 2);
    add(wall, 6, 2);
    add(wall, 5, 3);
    add(wall, 5, 4);
    add(wall, 6, 4);`,
    },
    {
        level: 31,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(robotA, 1, 0);
    add(pit, 5, 0);
    add(robotA, 6, 0);
    add(robotB, 3, 1);
    add(pit, 5, 1);
    add(pit, 5, 2);
    add(pit, 5, 3);
    add(pit, 5, 4);
    add(robotB, 7, 4);`,
    },
    {
        level: 32,
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
        levelCode: `\
    rileyPosition = 3;
    goalPosition = 3;
    add(robotB, 1, 0);
    add(wall, 5, 0);
    add(wall, 6, 0);
    add(wall, 6, 1);
    add(wall, 6, 2);
    add(robotA, 3, 3);
    add(wall, 6, 3);
    add(pit, 5, 4);
    add(pit, 6, 4);`,
    },
    {
        level: 33,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 1, 0);
    add(wall, 1, 1);
    add(robotB, 4, 1);
    add(pit, 7, 1);
    add(wall, 1, 2);
    add(robotB, 5, 2);
    add(pit, 7, 2);
    add(wall, 1, 3);
    add(pit, 7, 3);
    add(wall, 1, 4);`,
    },
    {
        level: 34,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 1, 0);
    add(pit, 1, 1);
    add(wall, 2, 1);
    add(robotB, 5, 1);
    add(pit, 6, 1);
    add(wall, 1, 2);
    add(robotB, 5, 2);
    add(pit, 1, 3);
    add(wall, 2, 3);
    add(pit, 6, 3);
    add(wall, 1, 4);`,
    },
    {
        level: 35,
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
        levelCode: `\
    rileyPosition = 1;
    goalPosition = 2;
    add(robotA, 0, 0);
    add(wall, 6, 0);
    add(wall, 6, 1);
    add(wall, 6, 2);
    add(wall, 6, 3);
    add(wall, 7, 3);`,
    },
    {
        level: 36,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(pit, 1, 0);
    add(pit, 2, 0);
    add(robotA, 5, 0);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(wall, 4, 1);
    add(robotA, 5, 1);
    add(robotA, 5, 2);
    add(wall, 6, 2);
    add(wall, 2, 3);
    add(wall, 3, 3);
    add(wall, 4, 3);
    add(pit, 1, 4);
    add(pit, 2, 4);`,
    },
    {
        level: 37,
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
        levelCode: `\
    rileyPosition = 0;
    goalPosition = 4;
    add(wall, 2, 0);
    add(robotB, 6, 0);
    add(robotA, 3, 2);
    add(wall, 4, 2);
    add(robotA, 3, 3);
    add(pit, 4, 3);
    add(robotB, 1, 4);
    add(pit, 4, 4);`,
    },
    {
        level: 38,
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
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 3;
    add(robotA, 0, 0);
    add(robotA, 1, 0);
    add(robotA, 2, 0);
    add(pit, 4, 0);
    add(pit, 5, 0);
    add(robotA, 0, 1);
    add(robotA, 1, 1);
    add(pit, 4, 1);
    add(pit, 5, 1);
    add(robotB, 3, 2);
    add(wall, 4, 2);
    add(wall, 5, 2);
    add(robotB, 3, 3);
    add(wall, 4, 3);
    add(wall, 5, 3);
    add(wall, 4, 4);
    add(wall, 5, 4);
    add(robotB, 6, 4);
    add(robotB, 7, 4);`,
    },
    {
        level: 39,
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
        levelCode: `\
    rileyPosition = 3;
    goalPosition = 1;
    add(wall, 5, 0);
    add(robotA, 6, 0);
    add(robotA, 7, 0);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(robotB, 4, 1);
    add(wall, 5, 1);
    add(robotA, 6, 1);
    add(pit, 3, 2);
    add(robotB, 4, 2);
    add(pit, 5, 2);
    add(wall, 3, 3);
    add(robotA, 1, 4);
    add(robotB, 2, 4);
    add(wall, 3, 4);
    add(wall, 5, 4);
    add(robotA, 6, 4);`,
    },
    {
        level: 40,
        gameType: PLAYTHRUGAME,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(pit, 0, 0);
    add(pit, 1, 0);
    add(wall, 5, 0);
    add(pit, 0, 1);
    add(pit, 1, 1);
    add(wall, 5, 1);
    add(robotA, 7, 1);
    add(wall, 5, 2);
    add(robotB, 0, 3);
    add(robotB, 1, 3);
    add(wall, 2, 3);
    add(pit, 3, 3);
    add(pit, 4, 3);
    add(wall, 5, 3);
    add(robotB, 7, 3);
    add(robotB, 0, 4);
    add(robotB, 1, 4);
    add(wall, 2, 4);
    add(robotA, 3, 4);
    add(robotA, 4, 4);
    add(wall, 5, 4);`,
    },
    {
        level: 41,
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
        levelCode: `\
    rileyPosition = 0;
    goalPosition = 4;
    add(robotA, 0, 0);
    add(robotA, 1, 0);
    add(wall, 4, 0);
    add(robotB, 6, 0);
    add(wall, 1, 1);
    add(wall, 4, 1);
    add(robotA, 5, 1);
    add(robotB, 6, 1);
    add(robotB, 7, 1);
    add(robotB, 2, 2);
    add(wall, 4, 2);
    add(robotB, 3, 3);
    add(wall, 4, 3);
    add(robotA, 5, 3);
    add(wall, 4, 4);
    add(robotB, 6, 4);`,
    },
    {
        level: 42,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.push();
    riley.down();
    riley.down();
    riley.jump();
    riley.down();
    riley.push();
    riley.up();
    riley.forward();`,
        levelCode: `\
    rileyPosition = 0;
    goalPosition = 2;
    add(wall, 0, 0);
    add(robotA, 6, 0);
    add(robotB, 7, 0);
    add(wall, 3, 1);
    add(robotB, 5, 1);
    add(robotA, 7, 1);
    add(pit, 3, 2);
    add(robotA, 7, 2);
    add(wall, 3, 3);
    add(robotA, 7, 3);
    add(pit, 3, 4);
    add(robotB, 7, 4);`,
    },
    {
        level: 43,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.up();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.forward();
    riley.up();
    riley.up();`,
        levelCode: `\
    rileyPosition = 4;
    goalPosition = 0;
    add(robotA, 1, 0);
    add(robotB, 5, 0);
    add(wall, 2, 1);
    add(pit, 3, 1);
    add(robotB, 5, 1);
    add(robotB, 0, 2);
    add(robotA, 1, 2);    
    add(pit, 2, 2);
    add(wall, 3, 2);
    add(robotB, 5, 2);
    add(robotB, 0, 3);
    add(robotB, 5, 3);`,
    },
    {
        level: 44,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.up();
    riley.down();
    riley.push();
    riley.jump();
    riley.push();
    riley.jump();
    riley.forward();
    riley.jump();`,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(pit, 0, 0);
    add(pit, 1, 0);
    add(wall, 2, 0);
    add(wall, 4, 0);
    add(robotB, 6, 0);
    add(wall, 7, 0);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(pit, 5, 1);
    add(wall, 0, 2);
    add(wall, 2, 2);
    add(pit, 3, 2);
    add(wall, 4, 2);
    add(wall, 5, 2);
    add(pit, 7, 2);
    add(wall, 0, 3);
    add(pit, 2, 3);
    add(wall, 3, 3);
    add(pit, 4, 3);
    add(robotA, 6, 3);
    add(pit, 7, 3);
    add(pit, 0, 4);
    add(robotB, 1, 4);
    add(wall, 2, 4);
    add(pit, 3, 4);
    add(wall, 5, 4);
    add(wall, 7, 4);`,
    },
    {
        level: 45,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.push();
    riley.up();
    riley.jump();
    riley.down();
    riley.down();
    riley.up();
    riley.push();
    riley.push();`,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(pit, 2, 1);
    add(wall, 3, 1);
    add(pit, 4, 1);
    add(wall, 0, 2);
    add(wall, 6, 2);
    add(pit, 7, 2);
    add(pit, 2, 3);
    add(wall, 3, 3);
    add(pit, 3, 4);`,
    },
    {
        level: 46,
        gameType: PLAYTHRUGAME,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 0, 0);
    add(pit, 1, 0);
    add(wall, 2, 0);
    add(wall, 3, 0);
    add(wall, 4, 0);
    add(robotB, 5, 0);
    add(wall, 2, 1);
    add(robotB, 6, 1);
    add(wall, 0, 2);
    add(pit, 1, 2);
    add(wall, 2, 2);
    add(wall, 3, 2);
    add(wall, 4, 2);
    add(pit, 7, 2);
    add(wall, 0, 3);
    add(wall, 1, 3);
    add(robotB, 5, 3);
    add(wall, 0, 4);
    add(robotB, 5, 4);`,
    },
    {
        level: 47,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.jump();
    riley.forward();
    riley.psh();  
    riley.psh();  
    riley.up();
    riley.forward();
    riley.down();`,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;
    add(wall, 3, 0);
    add(wall, 4, 0);
    add(robotA, 6, 0);
    add(wall, 3, 1);
    add(wall, 4, 1);
    add(pit, 1, 2);
    add(wall, 3, 2);
    add(wall, 4, 2);
    add(wall, 3, 3);
    add(wall, 4, 3);
    add(wall, 3, 4);
    add(wall, 4, 4);`,
    },
    {
        level: 48,
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
        levelCode: `\
    rileyPosition = 0;
    goalPosition = 4;
    add(robotA, 0, 0);
    add(robotA, 1, 0);
    add(wall, 4, 0);
    add(robotB, 6, 0);
    add(wall, 1, 1);
    add(wall, 4, 1);
    add(robotA, 5, 1);
    add(robotB, 6, 1);
    add(robotB, 7, 1);
    add(robotB, 2, 2);
    add(wall, 4, 2);
    add(robotB, 3, 3);
    add(wall, 4, 3);
    add(robotA, 5, 3);
    add(wall, 4, 4);
    add(robotB, 6, 4);`,
    },
    {
        level: 49,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.up();
    riley.down();
    riley.push();
    riley.jump();
    riley.push();
    riley.jump();
    riley.forward();
    riley.jump();`,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;

    add(pit, 0, 0);
    add(pit, 1, 0);
    add(wall, 2, 0);
    add(wall, 3, 0);
    add(wall, 4, 0);
    add(pit, 5, 0);
    add(robotB, 6, 0);
    add(wall, 7, 0);
    add(pit, 0, 1);
    add(wall, 2, 1);
    add(wall, 3, 1);
    add(pit, 5, 1);
    add(wall, 0, 2);
    add(robotB, 1, 2);
    add(wall, 2, 2);
    add(pit, 3, 2);
    add(wall, 4, 2);
    add(wall, 5, 2);
    add(pit, 7, 2);
    add(wall, 0, 3);
    add(pit, 2, 3);
    add(wall, 3, 3);
    add(wall, 4, 3);
    add(pit, 5, 3);
    add(robotA, 6, 3);
    add(pit, 7, 3);
    add(pit, 0, 4);
    add(robotB, 1, 4);
    add(wall, 2, 4);    
    add(pit, 3, 4);
    add(wall, 5, 4);
    add(wall, 7, 4);`,
    },
    {
        level: 50,
        gameType: PLAYTHRUGAME,
        instructionCode: `\
    riley.forward();
    riley.push();
    riley.down();
    riley.jump();
    riley.down();
    riley.push();
    riley.up();
    riley.up();`,
        levelCode: `\
    rileyPosition = 2;
    goalPosition = 2;`,
    },
];

/* Freeze default parameters */
Object.freeze(defaultParameters);
Object.freeze(defaultLevelParameters);

/* This array has references to globalLevel#Parameters for easy access */
var levelParameters = [];
