/* LightSpeed
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

/* exported SpawnAstronautScope, SpawnEnemyScope, UpdateEnemyScope,
    SpawnPowerupScope, ActivatePowerupScope */
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

    update(data) {
        this.tick = data.tick;
        this.time = data.tick * 0.33;
        return true;
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

    pickOne() {
        void this;
        // eslint-disable-next-line prefer-rest-params
        return arguments[Phaser.Math.RND.integerInRange(0, arguments.length - 1)];
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

    update(data) {
        super.update(data);
        this.ticksSinceSpawn++;
        return true;
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

class SpawnPowerupScope extends SpawnScope {
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

    update(data) {
        super.update(data);
        this.playerShip = data.playerShip;
        this.enemy = data.enemy;
        return true;
    }
}

class ActivatePowerupScope extends UserScope {
    constructor() {
        super();

        this.ship = {
            position: {x: 0, y: 0},
            invulnerableTimer: 0,
            shrinkTimer: 0,
            attractTimer: 0,
        };

        this._blowUpEnemies = false;
        this.powerUpType = null;
    }

    update(data) {
        this._blowUpEnemies = false;

        super.update(data);
        this.ship.position = data.shipPosition;
        this.powerUpType = data.powerUpType;
        return true;
    }

    blowUpEnemies() {
        this._blowUpEnemies = true;
    }
}

