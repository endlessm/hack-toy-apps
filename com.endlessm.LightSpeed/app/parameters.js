/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported globalParameters */

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

var defaultLevelParameters = {
    description: 'Rescue Astronauts\nAvoid asteroids',

    scoreTarget: 5,
    timeLimit: -1,

    astronautSize: 30,

    shipAsset: 'ship',
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
    updateEnemyCode: null,
    setParamsCode: null,
};

var levelParameters = [
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

var nLevels = levelParameters.length;

for (var i = 0; i < nLevels; i++) {
    /* Dup default object */
    var defaults = Object.assign({}, defaultLevelParameters);

    /* Merge with level params */
    levelParameters[i] = Object.assign(defaults, levelParameters[i]);

    /* Export every level params as a diferent object */
    window[`globalLevel${i}Parameters`] = levelParameters[i];
}

window.flip = function() {
    globalParameters.flipped = !globalParameters.flipped;

    /* Pause game automatically when flipped */
    globalParameters.paused = globalParameters.flipped;
};
