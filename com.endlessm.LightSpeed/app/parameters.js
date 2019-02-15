/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported globalParameters, defaultLevelParameters, levelParametersOverride,
    levelParameters */

/*
 * Global parameters exposed to the quests and toolbox
 */
var globalParameters = {
    availableLevels: 2,
    currentLevel: 0,

    /* Level specific parameters */
    score: 0,
    success: false,
    playing: false,
    paused: false,
    obstacleSpawnedCount: 0,

    /* Communication with Clubhouse */
    flipped: false,
};

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
                x: width + random(100, 400),
                y: random(0, height),
                scale: random(20, 60)
            };
        }
        return null;
    `,
    updateObstacleCode: null,
    setParamsCode: null,
};

var defaultLevelParameters = [
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
                    x: width + random(200, 500),
                    y: random(0, height),
                    scale: 120
                };
            }

            return null;
        `,
    },

    /* Level 4 */
    {
        spawnObstacleCode: null,
    },
];

var levelParameters = [];
