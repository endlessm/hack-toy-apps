/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported SpawnAstronautScope, SpawnEnemyScope, UpdateEnemyScope */
/* global game, enemyTypes, shipTypes */

/* Base Classes */

/*
 * Keep this in sync with COMMON_SCOPE in
 * hack-toolbox-app/src/LightSpeed/controlpanel.js
 */
class UserScope {
    constructor() {
        this.tick = 0;
        this.time = 0;
        this.width = game.config.width;
        this.height = game.config.height;
        this.shipTypes = shipTypes;
        this.enemyTypes = enemyTypes;
        this.data = {};
    }

    update(tick) {
        this.tick = tick;
        this.time = tick * 0.33;
    }

    postUpdate(retval) {
        void this;
        void retval;
    }

    random(min, max) {
        void this;
        return Phaser.Math.RND.integerInRange(min, max);
    }

    sin(theta) {
        void this;
        return Math.sin(theta);
    }

    cos(theta) {
        void this;
        return Math.cos(theta);
    }
}

/*
 * Keep this in sync with COMMON_SPAWN_SCOPE in
 * hack-toolbox-app/src/LightSpeed/controlpanel.js
 */
class SpawnScope extends UserScope {
    constructor() {
        super();
        this.ticksSinceSpawn = 0;
    }

    update(tick) {
        super.update(tick);
        this.ticksSinceSpawn++;
    }

    postUpdate(retval) {
        if (retval)
            this.ticksSinceSpawn = 0;
    }
}

/* User Scope Classes */
class SpawnAstronautScope extends SpawnScope {
}

class SpawnEnemyScope extends SpawnScope {
}

/*
 * Keep this in sync with COMMON_UPDATE_SCOPE in
 * hack-toolbox-app/src/LightSpeed/controlpanel.js
 */
class UpdateEnemyScope extends UserScope {
    constructor() {
        super();
        this.playerShip = {
            position: {x: 0, y: 0},
        };
        this.enemy = {
            position: {x: 0, y: 0},
            velocity: {x: 0, y: 0},
            data: {},
        };
    }

    update(tick, playerShip, enemy) {
        super.update(tick);
        this.playerShip = playerShip;
        this.enemy = enemy;
    }
}

