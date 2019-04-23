/* global riley */
/* exported UserScope */

/* Base Classes */

class UserScope {
    constructor() {
        this.width = game.config.width;
        this.height = game.config.height;
        this.data = {};
        this.riley = new riley();
    }
}
