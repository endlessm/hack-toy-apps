/* global riley */
/* exported UserScope, NONE */

/* Base Classes */

// move types
const NONE = 0;
const FORWARD = 1;
const UP = 2;
const DOWN = 3;
const JUMP = 4;
const PUSH = 5;
const ERROR = 6;

class riley {
    constructor() {
        this.moves = [];
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
        return target.error;
    },
};

class UserScope {
    constructor() {
        this.width = game.config.width;
        this.height = game.config.height;
        this.data = {};
        this.riley = new Proxy(new riley(), handler);
    }
}

