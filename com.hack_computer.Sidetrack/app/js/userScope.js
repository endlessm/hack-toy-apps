/*
 * Copyright © 2020 Endless OS Foundation LLC.
 *
 * This file is part of hack-toy-apps
 * (see https://github.com/endlessm/hack-toy-apps).
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
/* global riley */
/* exported UserInstructionsCodeScope, UserLevelCodeScope, NONE */

/* Base Classes */

// move types
const NONE = 0;
const FORWARD = 1;
const UP = 2;
const DOWN = 3;
const JUMP = 4;
const PUSH = 5;
const ERROR = 6;

// obstacle types
const WALL = 1;
const PIT = 2;
const ROBOTA = 3;
const ROBOTB = 4;


class Obstacle {
    constructor(type, x, y) {
        this.type = type;
        this.xPosition = x;
        this.yPosition = y;
        this.sprite = null;

        // these are to determine which wall/pit image to use in spritesheet
        this.sameLeftObstacle = false;
        this.sameRightObstacle = false;
        this.sameTopObstacle = false;
        this.sameBottomObstacle = false;
        this.isDestroyed = false;
    }
}

class riley {
    constructor() {
        this.queue = [];
        this._badPropertyNames = [];
    }

    forward() {
        this.queue.push(FORWARD);
    }

    up() {
        this.queue.push(UP);
    }

    down() {
        this.queue.push(DOWN);
    }

    jump() {
        this.queue.push(JUMP);
    }

    push() {
        this.queue.push(PUSH);
    }

    error() {
        this.queue.push(ERROR);
    }
}

const handler = {
    get(target, name, receiver) {
        if (name in target)
            return Reflect.get(target, name, receiver);

        target._badPropertyNames.push(name);
        return target.error;
    },
};

class UserInstructionsCodeScope {
    constructor() {
        this.width = game.config.width;
        this.height = game.config.height;
        this.data = {};
        this.riley = new Proxy(new riley(), handler);
    }
}

class UserLevelCodeScope {
    constructor() {
        this.obstacles = [];
        this.rileyPosition = 0;
        this.goalPosition = 0;

        this.wall = WALL;
        this.pit = PIT;
        this.robotA = ROBOTA;
        this.robotB = ROBOTB;
    }

    add(obstacle, x, y) {
        if (obstacle)
            this.obstacles.push(new Obstacle(obstacle, x, y));
    }
}

