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
    availableLevels: 1,
    currentLevel: 1,

    /* Level specific parameters */
    score: 0,
    success: false,
    playing: false,
    paused: false,

    /* Communication with Clubhouse */
    flipped: false,
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

    scoreTarget: 5,
    timeLimit: -1,

    astronautSize: 30,

    shipAsset: 'spaceship',
    shipSpeed: 500,
    shipSize: 50,
    shipAcceleration: 500,

    /* Note, the code will appear exactly as indented here, with the correct
     * function spawnAstronaut() { ... } declaration surrounding it. */
    spawnAstronautCode: `\
    if (tick%230 === 0) {
        return {
            x: width + random(100, 400),
            y: random(0, height)
        };
    }

    return null;`,
    spawnEnemyCode: `\
    if (tick%40 === 0) {
        return null;
    }
    return null;`,
};

/* You can define an update function for each enemy type */
(function() {
    for (const o of enemyTypes) {
        const func = `update${o.charAt(0).toUpperCase()}${o.slice(1)}Code`;
        defaultParameters[func] = '';
    }
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
    if (tick%40 === 0) {
        return {
            type: 'asteroid',
            x: width + random(100, 400),
            y: random(0, height),
            scale: random(20, 60)
        };
    }
    return null;`,
    },

    /* Level 2 */
    {
        shipSpeed: 6000,
        spawnEnemyCode: `\
    if (tick%40 === 0) {
        return {
            type: 'asteroid',
            x: width + random(100, 400),
            y: random(0, height),
            scale: random(20, 60)
        };
    }
    return null;`,
    },

    /* Level 3 */
    {
        spawnEnemyCode: `\
    if (tick%40 === 0) {
        return {
            type: 'asteroid',
            x: width + random(200, 500),
            y: random(0, height),
            scale: 150
        };
    }
    return null;`,
    },

    /* Level 4 */
    {
        spawnEnemyCode: '   return null;',
    },

    /* Level 5 */
    {
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

