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
        this.moves = [];
        this._badPropertyNames = [];
    }

    forward() {
        this.moves.push(FORWARD);
    }

    up() {
        this.moves.push(UP);
    }

    down() {
        this.moves.push(DOWN);
    }

    jump() {
        this.moves.push(JUMP);
    }

    push() {
        this.moves.push(PUSH);
    }

    error() {
        this.moves.push(ERROR);
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

