/* Gobble
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/*
 * Global parameters exposed to the quests and toolbox
 */
var globalParameters = {
    availableLevels: 2,
    currentLevel: 0,
    score: 0,
    success: false,
    playing: false
}

var defaultLevelParameters = {
    description: null,

    scoreTarget: 5,
    timeLimit: -1,

    astronautSize: 30,

    shipAsset: 'ship',
    shipSpeed: 500,
    shipSize: 50,
    shipAcceleration: 500,

    spawnAstronautCode: 'return (tick%230 === 0) ? { x: width+100+random(0,300), y: random(0, height) } : null;',
    spawnObstacleCode: 'return (tick%40 === 0) ? { x: width+100+random(0,300), y: random(0, height), scale: random(20, 60) } : null;',
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
        spawnObstacleCode: 'return (tick%40 === 0) ? { x: width+200+random(0,300), y: random(0, height), scale: 120 } : null;',
    },

    /* Level 4 */
    {
        spawnObstacleCode: 'return null;',
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


