/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported enemyTypes, shipTypes, globalParameters, defaultParameters,
    defaultLevelParameters, levelParameters */

/* Global constants */
var shipTypes = [
    'spaceship',
    'daemon',
    'unicorn',
];

var enemyTypes = [
    'asteroid',
    'spinner',
    'squid',
    'beam',
];

/* Freeze constants */
Object.freeze(shipTypes);
Object.freeze(enemyTypes);

/*
 * Global parameters exposed to the quests and toolbox
 */
var globalParameters = {
    /* Number of available levels */
    availableLevels: 1,

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

/* We need counters and min/max Y coordinate reached for each enemy type,
 * for the clubhouse to read in order to determine if quests have been solved.
 *
 * FIXME: can we add support for arrays in clippy!
 */
(function() {
    for (let i = 0, n = enemyTypes.length; i < n; i++) {
        globalParameters[`enemyType${i}SpawnedCount`] = 0;
        globalParameters[`enemyType${i}MinY`] = +1e9;
        globalParameters[`enemyType${i}MaxY`] = -1e9;
    }
}());

/* Level defaults values */
var defaultParameters = {
    description: 'Rescue Astronauts\nAvoid asteroids',

    scoreTarget: 10,
    timeLimit: -1,

    astronautSize: 30,

    shipAsset: 'spaceship',
    shipSpeed: 500,
    shipSize: 50,
    shipDrag: 1000,
    shipAcceleration: 500,

    /* Note, the code will appear exactly as indented here, with the correct
     * function spawnAstronaut() { ... } declaration surrounding it. */
    spawnAstronautCode: `\
    if (ticksSinceSpawn > 60) {
        return {
            x: width + random(50, 1000),
            y: random(0, height)
        };
    }

    return null;`,
    spawnEnemyCode: `\
    // A tick is a short amount of time.
    // Every tick, the game decides what should happen next.
    // There are 30 ticks in one second!
    // So, for example, 60 ticks means two seconds.
    if (ticksSinceSpawn > 40) {
        return null;
    }
    return null;`,
};

/* You can define an update function for each enemy type */
(function() {
    for (const o of enemyTypes) {
        const func = `update${o.charAt(0).toUpperCase()}${o.slice(1)}Code`;
        defaultParameters[func] = '    enemy.position.y = enemy.position.y + 0;';
    }
    defaultParameters['updateBeamCode'] = `\
    if (playerShipY > enemy.position.y) {
        enemy.position.y = enemy.position.y + 5;
    } else if (playerShipY < enemy.position.y) {
        enemy.position.y = enemy.position.y - 5;
    }`;
}());

/* Per Level defaults:
 * This parameters will override the ones defined in defaultParameters
 */
var defaultLevelParameters = [
    /* Title screen - Level 0 */
    {
    },

    /* Level 1 */
    {
        spawnEnemyCode: `\
    // A tick is a short amount of time.
    // Every tick, the game decides what should happen next.
    // There are 30 ticks in one second!
    // So, for example, 60 ticks means two seconds.
    if (ticksSinceSpawn > 70) {
        return 'asteroid';
    }`,
    },

    /* Level 2 */
    {
        shipSpeed: 6000,
        spawnEnemyCode: `\
    // A tick is a short amount of time.
    // Every tick, the game decides what should happen next.
    // There are 30 ticks in one second!
    // So, for example, 60 ticks means two seconds.
    if (ticksSinceSpawn > 40) {
        return 'asteroid';
    }`,
    },

    /* Level 3 */
    {
        spawnEnemyCode: `\
    // A tick is a short amount of time.
    // Every tick, the game decides what should happen next.
    // There are 30 ticks in one second!
    // So, for example, 60 ticks means two seconds.
    if (ticksSinceSpawn > 40) {
        return {
            type: 'asteroid',
            scale: 150
        };
    }`,
    },

    /* Level 4 */
    {
        spawnEnemyCode: `\
    // A tick is a short amount of time.
    // Every tick, the game decides what should happen next.
    // There are 30 ticks in one second!
    // So, for example, 60 ticks means two seconds.
    if (ticksSinceSpawn > 0) {
        return null;
    }`,
    },

    /* Level 5 */
    {
        spawnEnemyCode: `\
    // A tick is a short amount of time.
    // Every tick, the game decides what should happen next.
    // There are 30 ticks in one second!
    // So, for example, 60 ticks means two seconds.
    if (ticksSinceSpawn > 40) {
        return 'asteroid';
    }`,
    },

    /* Level 6 */
    {
    },

    /* Level 7 */
    {
    },

    /* Level 8 */
    {
    },

    /* Level 9 */
    {
    },

    /* Level 10 */
    {
    },
];

/* Freeze default parameters */
Object.freeze(defaultParameters);
Object.freeze(defaultLevelParameters);

/* This array has references to globalLevel#Parameters for easy access */
var levelParameters = [];

