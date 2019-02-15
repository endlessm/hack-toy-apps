/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported obstacleTypes, shipTypes, globalParameters, defaultParameters,
    defaultLevelParameters, levelParameters */

/* Global constants */
var shipTypes = [
    'spaceship',
    'daemon',
    'unicorn',
];

var obstacleTypes = [
    'asteroid',
    'spinner',
    'beam',
    'squid',
];

/* Freeze constants */
Object.freeze(shipTypes);
Object.freeze(obstacleTypes);

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

/* We need a counter for each obstacle types
 * FIXME: can we add support for arrays in clippy!
 */
(function() {
    for (var i = 0, n = obstacleTypes.length; i < n; i++)
        globalParameters[`obstacleType${i}SpawnedCount`] = 0;
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

    spawnAstronautCode: `
        if (tick%230 === 0) {
            return {
                x: width + random(100, 400),
                y: random(0, height)
            };
        }

        return null;
    `,
    spawnObstacleCode: `
        if (tick%40 === 0) {
            return {
                type: 'asteroid',
                x: width + random(100, 400),
                y: random(0, height),
                scale: random(20, 60)
            };
        }
        return null;
    `,

    setParamsCode: null,
};

/* You can define an update function for each obstacle types */
(function() {
    for (const o of obstacleTypes) {
        const func = `update${o.charAt(0).toUpperCase()}${o.slice(1)}Code`;
        defaultParameters[func] = null;
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
    },

    /* Level 2 */
    {
        shipSpeed: 6000,
    },

    /* Level 3 */
    {
        spawnObstacleCode: `
            if (tick%40 === 0) {
                return {
                    type: 'asteroid',
                    x: width + random(200, 500),
                    y: random(0, height),
                    scale: 150
                };
            }
            return null;
        `,
    },

    /* Level 4 */
    {
        spawnObstacleCode: 'return null;',
    },

    /* Level 5 */
    {
        spawnObstacleCode: `
            if (tick%40 === 0) {
                return null;
            }
            return null;
        `,
    },

    /* Level 6 */
    {
    },
];

/* Freeze default parameters */
Object.freeze(defaultParameters);
Object.freeze(defaultLevelParameters);

/* This array has references to globalLevel#Parameters for easy access */
var levelParameters = [];

