/* exported fontConfig, game */

/*  global globalParameters, defaultLevelParameters, defaultParameters,
    BootScene, LoadingScene, HomeScene, StartScene, GameScene, ToyApp */

const fontConfig = {
    color: 'white',
    fontSize: '38px',
    align: 'center',
    shadow: {
        color: 'black',
        fill: true,
        offsetX: 2,
        offsetY: 2,
        blur: 8,
    },
};

// our game's configuration
var config = {
    title: 'Riley Maze',
    type: Phaser.AUTO,
    width: 1920,
    height: 1040,
    pixelArt: false,
    backgroundColor: 'ffffff',
    scene: [
        new BootScene('Boot'),
        new LoadingScene('Loading'),
        new HomeScene('Home'),
        new StartScene('Start'),
        new GameScene('Game'),
    ],
};

// create the game, and pass it the configuration
var game = new Phaser.Game(config);

/* Export one global parameter object for each level */
(function() {
    function objectNotify(obj) {
        obj._proxy = Object.create(
            Object.getPrototypeOf(obj),
            Object.getOwnPropertyDescriptors(obj)
        );

        Object.keys(obj).forEach(prop => {
            if (prop[0] === '_')
                return;

            Object.defineProperty(obj, prop, {
                get() {
                    return this._proxy[prop];
                },
                set(val) {
                    if (this._proxy[prop] !== val) {
                        this._proxy[prop] = val;
                        game.events.emit('global-property-change', obj, prop);
                    }
                },
            });
        });
    }

    /* Make object notify an event every time a property changes */
    objectNotify(globalParameters);

    for (var i = 0, n = defaultLevelParameters.length; i < n; i++) {
        /* Dup default object */
        var defaults = Object.assign({}, defaultParameters);

        /* Merge defaults with level parameters */
        var params = Object.assign(defaults, defaultLevelParameters[i]);

        /* Make object notify an event every time a property changes */
        objectNotify(params);

        /* Push to levels paramters array */
        levelParameters.push(params);

        /* And export as a global object */
        window[`globalLevel${i}Parameters`] = params;
    }
}());

/* Quests can start a level programatically */
game.events.on('global-property-change', (obj, property) => {
    if (Object.is(globalParameters, obj) && property === 'startLevel') {
        const startLevel = globalParameters.startLevel;

        if (startLevel < 0 || startLevel > globalParameters.availableLevels)
            return;

        /* Stop all active scenes just in case */
        game.scene.getScenes(true).forEach(function(key) {
            game.scene.stop(key);
        });

        globalParameters.currentLevel = startLevel;
        globalParameters.paused = false;

        if (startLevel) {
            globalParameters.playing = true;
            game.scene.start('Game', levelParameters[startLevel]);
        } else {
            globalParameters.playing = false;
            game.scene.start('Home');
        }
    }
});

/* External API */

window.flip = function() {
    globalParameters.flipped = !globalParameters.flipped;

    if (globalParameters.playing)
        /* Pause game automatically when flipped, and resume
         * automatically when flipped back */
        globalParameters.paused = globalParameters.flipped;

    if (!globalParameters.flipped)
        window.saveState();
};

window.reset = function() {
    const i = globalParameters.currentLevel;

    if (i < 0 || i > levelParameters.length)
        return;

    Object.assign(levelParameters[i], defaultParameters);
    Object.assign(levelParameters[i], defaultLevelParameters[i]);
};

window.saveState = function() {
    ToyApp.saveState({
        /* Global state */
        availableLevels: globalParameters.availableLevels,
        nextLevel: globalParameters.nextLevel,
        /* Level state */
        level: globalParameters.currentLevel,
        /* Per-level parameters */
        levelParameters,
    });
};

window.loadState = function(state) {
    /* Do some sanity checks before restoring game state */
    if (typeof state === 'object' &&
        typeof state.availableLevels === 'number' &&
        typeof state.nextLevel === 'number' &&
        typeof state.level === 'number' &&
        Array.isArray(state.levelParameters) &&
        state.levelParameters.every(obj => typeof obj === 'object') &&
        state.nextLevel < state.availableLevels &&
        state.level >= 0 && state.level <= state.availableLevels) {
        /* Restore global parameters */
        globalParameters.availableLevels = state.availableLevels;
        globalParameters.nextLevel = state.nextLevel;

        /* Restore current level parameters */
        state.levelParameters.forEach((levelState, ix) => {
            Object.assign(levelParameters[ix], levelState);
        });
    }
};
