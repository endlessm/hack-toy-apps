/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported enemyTypes, shipTypes, globalParameters, defaultParameters,
    defaultLevelParameters, levelParameters, resetGlobalUserCode,
    powerupTypes, upgradeTypes,resetGlobalCounters */

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

var powerupTypes = [
    'blowup',
    'invulnerable',
    'upgrade',
];

var upgradeTypes = [
    'shrink',
    'attraction',
    'engine',
];

/* Freeze constants */
Object.freeze(shipTypes);
Object.freeze(enemyTypes);
Object.freeze(powerupTypes);
Object.freeze(upgradeTypes);

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

function resetGlobalUserCode() {
    enemyTypes.forEach(name => {
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        const func = `update${capitalizedName}Code`;
        globalParameters[func] = '    enemy.position.y = enemy.position.y + 0;';
    });

    /* The beam gets a special update function, not the default one */
    globalParameters.updateBeamCode = `\
    if (playerShip.position.y > enemy.position.y) {
        enemy.position.y = enemy.position.y + 5;
    } else if (playerShip.position.y < enemy.position.y) {
        enemy.position.y = enemy.position.y - 5;
    }`;

    globalParameters.activatePowerupCode = `\
    if (powerUpType === 'invulnerable') {

    }`;
}

/* We need counters and min/max Y coordinate reached for each enemy type,
 * for the clubhouse to read in order to determine if quests have been solved.
 * We also define an update function for each enemy type except for ones which
 * were already defined above.
 *
 * FIXME: we need support for arrays and object recursion in clippy!
 */

function resetGlobalCounters() {
    enemyTypes.forEach((name, i) => {
        globalParameters[`enemyType${i}SpawnedCount`] = 0;
        globalParameters[`enemyType${i}MinY`] = +1e9;
        globalParameters[`enemyType${i}MaxY`] = -1e9;
    });

    powerupTypes.forEach(name => {
        globalParameters[`${name}PowerupSpawnCount`] = 0;
        globalParameters[`${name}PowerupPickedCount`] = 0;
        globalParameters[`${name}PowerupActivateCount`] = 0;
    });

    upgradeTypes.forEach(name => {
        globalParameters[`${name}UpgradeActivateCount`] = 0;
    });
}

(function() {
    resetGlobalCounters();
    resetGlobalUserCode();
}());

/* User functions tick explanation */
const TICK_COMMENT = `// A tick is a short amount of time.
    // Every tick, the game decides what should happen next.
    // There are 30 ticks in one second!
    // So, for example, 60 ticks means two seconds.`;

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
    ${TICK_COMMENT}
    if (ticksSinceSpawn > 40) {
        return null;
    }
    return null;`,

    spawnPowerupCode: '',
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
        spawnEnemyCode: `\
    ${TICK_COMMENT}
    if (ticksSinceSpawn > 70) {
        return 'asteroid';
    }`,
    },

    /* Level 2 */
    {
        shipSpeed: 6000,
        spawnEnemyCode: `\
    ${TICK_COMMENT}
    if (ticksSinceSpawn > 40) {
        return 'asteroid';
    }`,
    },

    /* Level 3 */
    {
        spawnEnemyCode: `\
    ${TICK_COMMENT}
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
    ${TICK_COMMENT}
    if (ticksSinceSpawn > 0) {
        return null;
    }`,
    },

    /* Level 5 */
    {
        spawnEnemyCode: `\
    ${TICK_COMMENT}
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

    /* Level 11 */
    {
        spawnEnemyCode: `\
    ${TICK_COMMENT}
    if (ticksSinceSpawn > 40) {
        return 'asteroid';
    }`,

        spawnPowerupCode: `\
    ${TICK_COMMENT}
    if (ticksSinceSpawn > random(60, 240))
        return null;`,
    },

    /* Level 12 */
    {
        spawnEnemyCode: `\
    ${TICK_COMMENT}
    if (ticksSinceSpawn > 40) {
        return 'asteroid';
    }`,

        spawnPowerupCode: `\
    ${TICK_COMMENT}
    if (ticksSinceSpawn > random(60, 240))
        return 'invulnerable';`,
    },

    /* Level 13 */
    {
        spawnEnemyCode: `\
    ${TICK_COMMENT}
    if (ticksSinceSpawn > 40) {
        return 'asteroid';
    }`,

        spawnPowerupCode: `\
    ${TICK_COMMENT}
    if (ticksSinceSpawn > random(60, 240))
        return 'upgrade';

    return null;`,
    },

    /* Level 14 */
    {
        spawnPowerupCode: `\
    ${TICK_COMMENT}
    if (ticksSinceSpawn > random(60, 240)) {
        return pickOne('invulnerable', 'blowup', 'upgrade');
    }`,

        spawnEnemyCode: `\
    ${TICK_COMMENT}
    if (ticksSinceSpawn > 40) {
        return 'asteroid';
    }`,
    },

    /* Level 15 - Obstacle course of Beam enemies */
    {
        // eslint-disable-next-line max-len
        spawnEnemyCode: `const squids = [86, 121, 179, 417, 58, 925, 490, 806, 445, 203, 726, 437, 684, 984, 949, 541, 1020, 158, 1070, 1007, 1304, 319, 1330, 116, 1315, 870, 1590, 993, 1686, 802, 1725, 158, 1899, 553, 1913, 967, 2069, 733, 2063, 90, 2370, 944, 2429, 93, 2587, 462, 2720, 1049, 2748, 214, 3112, 214, 3115, 913, 3408, 798, 3501, 307, 3673, 987, 3662, 118, 3859, 716, 4177, 930, 4237, 716, 4290, 96, 4490, 679, 4581, 973, 4758, 806, 4772, 107, 5190, 674, 5209, 956, 5582, 392, 5711, 688, 5937, 434, 6007, 953, 6281, 617, 6461, 868, 6845, 104, 7124, 395, 7248, 155, 7290, 677, 7519, 457, 7603, 713, 7643, 161, 8012, 541, 8122, 248, 8477, 82, 8579, 299, 8562, 973, 8894, 843, 9100, 651, 9126, 101, 9250, 984, 9470, 798, 9653, 992];
    const lastSquid = squids.length - 2;
    var shipX = data.shipX || 0;
    var i = data.i || 0;

    /* Keep track of ship progress */
    data.shipX = shipX + globalLevel15Parameters.shipSpeed / 30;

    if (i > lastSquid) {
        /* Reset state after the last enemy appeared on screen */
        if (data.shipX - squids[lastSquid] > width) {
            data.shipX = 0;
            data.i = 0;
        }
        return null;
    }

    /* Do not spawn far away enemies */
    if (shipX - squids[i] > width)
        return null;

    /* Spawn next enemy next time */
    data.i = i + 2;

    return {
        type: 'squid',
        scale: random(40, 60),
        velocity: {x: 0, y: 0},
        x: width + squids[i],
        y: height - squids[i + 1]
    };`,
    },

    /* Level 16 - Super fast astronauts that are also very small */
    {
        spawnEnemyCode: `\
    if (ticksSinceSpawn > 120) {
        return 'asteroid';
    }`,

        spawnAstronautCode: `\
    if (ticksSinceSpawn > 60) {
        return {
            scale: random(2, 8),
            velocity: { x: 1600 },
            x: width + random(50, 1000),
            y: random(0, height)
        };
    }

    return null;`,
    },

    /* Level 17 - Big walls of enemies */
    {
        spawnEnemyCode: `\
    if (ticksSinceSpawn > 10) {
        return pickOne('asteroid', 'squid', 'asteroid', 'spinner', 'asteroid');
    }`,

        spawnPowerupCode: `\
    if (ticksSinceSpawn > random(30, 90)) {
        return pickOne('invulnerable', 'blowup', 'upgrade');
    }`,
    },
];

/* Freeze default parameters */
Object.freeze(defaultParameters);
Object.freeze(defaultLevelParameters);

/* This array has references to globalLevel#Parameters for easy access */
var levelParameters = [];

