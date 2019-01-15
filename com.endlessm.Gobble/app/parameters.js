/* Gobble
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

var levelIndex = 0;

var levelParameters = [
   {
       shipAsset: 'ship',
       shipSpeed: 256,
       shipSize: 50,
       shipAcceleration: 196,

       setParamsCode: null,
       spawnObstacleCode: 'return (tick%120 === 0) ? { x: width+300, y: random(0, height), scale: random(20, 60) } : null;',
       spawnAstronautCode: 'return (tick%256 === 0) ? { x: width+100, y: random(0, height) } : null;',
       updateEnemyCode: null,
   },
];

var nLevels = levelParameters.length;

/* Export every param object in the global name space */
for (var i = 0; i < nLevels; i++)
    window[`globalLevel${i}Parameters`] = levelParameters[i];

