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
    currentScore: 0,
    success: false
}

var defaultLevelParameters = {
    description: null,

    scoreTarget: 1,
    timeLimit: -1,

    shipAsset: 'ship',
    shipSpeed: 256,
    shipSize: 50,
    shipAcceleration: 196,

    spawnAstronautCode: 'return (tick%256 === 0) ? { x: width+100, y: random(0, height) } : null;',
    spawnObstacleCode: null,
    updateEnemyCode: null,
    setParamsCode: null,
};

var levelParameters = [
    {
        description: 'Rescue 4 astronauts in less than a minute!',
        scoreTarget: 4,
        timeLimit: 60
    },
    {
        description: 'Rescue 8 astronauts without being hit by an asteroid!',
        scoreTarget: 8,
        timeLimit: 120,
        spawnObstacleCode: 'return (tick%120 === 0) ? { x: width+300, y: random(0, height), scale: random(20, 60) } : null;',
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

