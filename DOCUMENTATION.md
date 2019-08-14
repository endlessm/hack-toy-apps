# Contents

1. [ToyApps](#toyapps)
2. [The Magic of Clippy](#the-magic-of-clippy)
3. [The Toolbox](#the-toolbox)

**NOTE**: this document is meant to be read in its entirety.

# ToyApps

ToyApps are simple-games specially-crafted to have their visuals and behaviors modified by our users, and monitored by our quests. Essentially, these are browser-games written in JavaScript, running in a WebKit webview, available as desktop applications and distributed as Flatpak bundles.

Therefore, these are made of the following parts:

1. The JavaScript game.
2. The desktop-integration and distribution files.
3. The webview and app runner.

## The Javascript Game

The game is just a regular HTML/JavaScript browser-game. The only thing needed to turn a browser-game into a ToyApp is having one or more **hackable objects**.

### Hackable Objects

These are global Javascript objects that contain parameters the game wants exposed to our users and quests. See the following "bouncing ball" game example:

```html
<script>
var context;
var canvasWidth = 800;
var canvasHeight = 600;
var x = 0;
var y = 0;
var stepX = 10;
var stepY = 10;

var hackable = {
  color: 'red',
  radius: 100,
}

function init() {
  context = canvas.getContext('2d');
  setInterval(draw, 10);
}

function draw() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  context.beginPath();
  context.fillStyle = hackable.color;
  context.arc(x, y, hackable.radius, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();

  if( x < 0 || x > canvasWidth)
    stepX = stepX * -1;
  x += stepX;

  if( y < 0 || y > canvasHeight)
    stepY = stepY * -1;
  y += stepY;
}
</script>

<body onLoad="init();">
  <canvas id="canvas" width="800" height="600" ></canvas>
</body>
```

This game exposes the ball's radius and color as a hackable object. These objects can use arbitrary names, the only requirement is that it must be globally accessible. That's it (for now).

## The Desktop-integration and Distribution Files

ToyApps are built and distributed as regular desktop apps, using flatpak. Therefore, there is a minimum set of metadata and project structure that must be provided. A more detailed description of what goes into a ToyApp would be:

1. Game files.
2. Desktop file.
3. App icon.
4. AppStream metadata.
5. Splashscreen.
6. Runner metadata.

### Game Files

To integrate the JavaScript game files to the project, and make them available to the building pipeline, the files must be added to the [ToyApps repository](https://github.com/endlessm/hack-toy-apps) under its own project directory, named for its application ID. Assuming "com.endlessm.Bouncing" as the application ID from the previous example, the game files must added to:

```
com.endlessm.Bouncing/app/index.html
```

The `index.html` file can reference other JavaScript or asset files using relative locations. It is recommended to keep the index.html short.

### Desktop File

This is just a regular desktop file, except for a few custom entries:

* `X-Endless-Hackable` is used by the Endless shell to determine if this app is actually hackable app. It can take `true` or `false`.
* `X-Endless-HackShader` is also used by the shell to determine which visual effect should be applied on top of the app window, while it's in its "flipped" state. It can take `none`, `desaturate` or `fizzics`.

To integrate this file to the project, it must be added to:

```
com.endlessm.Bouncing/data/app.desktop
```

### Icon, AppStream Data and Splashscreen

These are regular files of each kind. To integrate these files to the project:

```
com.endlessm.Bouncing/data/app.icon.png
com.endlessm.Bouncing/data/appdata.xml
com.endlessm.Bouncing/data/splashscreen.jpg
```

**NOTE**: All the file paths mentioned in this document are defined by convention and are required by the meson building scripts.

### Runner Metadata

This file contains settings used to customize the behavior of the ToyApp (see more details about runner below), each project can include a json file to:

```
com.endlessm.Bouncing/data/metadata.json
```

For now, it only supports `use-load-notify`, a boolean property used by the runner to keep the splashscreen visible until the JavaScript game is completely loaded.
When enabled, if the game is using the game state service to save its state, it must request for the state to be loaded with `ToyApp.requestState()`.
It must also update its status using `ToyApp.loadNotify();`.
These are both helper functions (more details about helper functions below).

## The Webview and App Runner

This is the GTK+ application that glues everything together, to present the JavaScript game as a desktop application and to provide interfaces to the game and to other components of the desktop. These interfaces are:

* Helper JavaScript functions, that are available to the game to interact with the app runner and other components of the desktop.
* A DBus service and Gio actions, used by other components of the desktop to interact with the game.

### Helper Functions

These functions provide the JavaScript game with interfaces to the runner it-self and to other desktop components:

* `window.ToyApp` provides
  * a `requestState` function to request that the runner load its state from the game state service, and call `window.loadState(state)` when finished
  * a `loadNotify` function to let the runner know when the game is done loading
  * a `setHackable` function to update the hackable property from the hackable interface (see the examples below)
  * a `setAspectRatio` to enforce a specific aspect ratio to the GTK+ window.
* `window.Sounds` provides a `play`, `playLoop`, `updateSound` and `stop` functions to interact with the desktop sound server (see the example below).

### DBus Interface and Gio Actions

* The DBus **hackable** interface provides a `Hackable` property that the Shell (and possibly other desktop components) can use to determine if the ToyApp is in a state where it can be "flipped" to hack.
* The `flip` Gio action is used to inform the ToyApp that it's in a "flipped" state.
* The `reset` Gio action is used to inform the ToyApp that it should restore the default values of its hackable properties.

#### Hackable Interface Example

To update its hackable state, the JavaScript game must update the app runner `Hackable` property using the `setHackable` helper function:

```javascript
window.ToyApp.setHackable(true);
```

Then, to access and monitor this property from another component of the desktop:

```javascript
const {Gio} = imports.gi;
const HackableIface = `
<node>
  <interface name='com.hack_computer.Hackable'>
    <property name="Hackable" type="b" access="read"/>
  </interface>
</node>
`;
const HackableProxy = Gio.DBusProxy.makeProxyWrapper(HackableIface);
const proxy = new HackableProxy(Gio.DBus.session, 'com.endlessm.Bouncing', '/com/endlessm/Bouncing');
proxy.connect('g-properties-changed', () => { print(proxy.Hackable); });
```

**NOTE**: That this is currently used by the Shell to hide the Flip-To-Hack button for the HackUnlock ToyApp.

#### Flip Action Example

To connect this action to the JavaScript game, the game must implement a `flip` global function:

```javascript
function flip() {
    window.Sounds.playLoop('/toyapp/bouncing/background/flipped');
}
```

Then, to trigger this from another component of the desktop:

```javascript
const {Gio, GLib} = imports.gi;

let bus = Gio.bus_get_sync(Gio.BusType.SESSION, null);
let param = new GLib.Variant('b', true);
let data = new GLib.Variant('a{sv}');
let action = Gio.DBusActionGroup.get(bus, 'com.endlessm.Bouncing', '/com/endlessm/Bouncing')
action.activate_action_full('flip', param, data);
```

**NOTE**: This is currently used by the Shell to inform ToyApps that these are in the "flipped" state.

#### Reset Action Example

To connect this to the JavaScript game, the game must implement a `reset` global function:

```javascript
function reset() {
    hackable.radius = 100;
    hackable.color = 'red';
}
```

Then, to trigger this from another component of the desktop:

```javascript
const {Gio, GLib} = imports.gi;

let bus = Gio.bus_get_sync(Gio.BusType.SESSION, null);
let data = new GLib.Variant('a{sv}');
let action = Gio.DBusActionGroup.get(bus, 'com.endlessm.Bouncing', '/com/endlessm/Bouncing')
action.activate_action_full('reset', null, data);
```

**NOTE**: This is currently used by the Fizzics toolbox, to reset the game hackable parameters to their defaults.

**TODO**: consider moving these Gio actions into the DBus hackable interface.

## Debugging

To debug a ToyApp, you can enable the webkit inspector:

```
$ TOY_APP_ENABLE_INSPECTOR=1 flatpak run com.endlessm.Bouncing
```

Then with the app running, right-click on the canvas and then click in "Inspect Element" to open the inspector.

# The Magic of Clippy

If you got to this point, you have realized that it was never explained how other components of the desktop communicate with the ToyApps to access their hackable parameters, e.g. the `hackable.radius` in our Bouncing example. This is because the ToyApp them-selves don't do that. Instead, the communication relies on a external library called [Clippy](https://github.com/endlessm/clippy) that is injected into the ToyApps in run-time. The benefit of this approach is that the same communication mechanism can be re-used with other applications, even if they were not designed to be ToyApps. See the example below:


To run the ToyApp with Clippy:

```
$ flatpak run --env=GTK3_MODULES=libclippy-module.so com.endlessm.Bouncing
```

In essence, what Clippy does, is to export a DBus service under the `com.hack_computer.Clippy` interface. With this interface, other components of the desktop can access all sort of functionalities from the ToyApp, including JavaScript objects from the webview.


To access a hackable object from another component of the desktop:

```javascript
const {Gio, GObject} = imports.gi;

const ClippyViewName = 'view.JSContext.hackable';
const ClippyObjectPath = '/com/hack_computer/Clippy';
const ClippyIface = `
<node xmlns:doc="http://www.freedesktop.org/dbus/1.0/doc.dtd">
  <interface name='com.hack_computer.Clippy'>
    <method name='Export'>
      <arg type='s' name='object' />
      <arg type='s' name='path' direction='out'/>
      <arg type='s' name='iface' direction='out'/>
    </method>
  </interface>
</node>
`;
const Proxy = Gio.DBusProxy.makeProxyWrapper(ClippyIface);
const proxy = new Proxy(Gio.DBus.session, 'com.endlessm.Bouncing', ClippyObjectPath);
const [path, iface] = proxy.ExportSync(ClippyViewName);

const ProxyObj = Gio.DBusProxy.makeProxyWrapper(iface);
const proxyObj = new ProxyObj(Gio.DBus.session, 'com.endlessm.Bouncing', path);
print(proxyObj.radius);
print(proxyObj.color);
```

What this example does is to tell the ToyApp, using the DBus service created by Clippy, to export the JavaScript object `view.JSContext.hackable`. By `view` it refers to the runner webview, by `JSContent` refers to the objects from the execution context of the JavaScript game, and by `hackable` it literally refers to the hackable object defined in the Bouncing example.

**NOTE**: The current users of clippy are, the [toolboxes](https://github.com/endlessm/hack-toolbox-app) that implement the hackable UI for the ToyApps, the [clubhouse](https://github.com/endlessm/clubhouse) that implements the quests around the ToyApps, and the [gnome-initial-setup](https://github.com/endlessm/gnome-initial-setup) that launches the HackUnlock app.

# The Toolbox

At this point it should be clear that, because of the way Clippy works, the ToyApps are mostly agnostic about the fact that they are being modified by our users and monitored by our quests. And by "modified by our users" it refers to a specific piece of software called [The Toolbox](https://github.com/endlessm/hack-toolbox-app).

The Toolbox is a separate GTK+ application, which uses Clippy to enable users to manipulate the hackable parameters of a ToyApp. For each ToyApp there is a manually-crafted GTK+ user-interface. These user-interfaces are created using Glade and its logic written with GJS.

These user-interfaces are not particularly special, they follow some guidelines from the Design team and are styled a bit different from the default GTK+ Adwaita theme. What's really important is the Model-object these user-interfaces interact with.

Not all the Toolboxes interact with ToyApps, but for those that do, the Model acts like the bridge between Toolbox user-interface widgets and the hackable parameters from the ToyApp. These Models use Clippy to do all the synchronization magic, but to make things ever easier, the Toolbox common library provides a [clippyWrapper](https://github.com/endlessm/hack-toolbox-app/blob/master/src/clippyWrapper.js) helper.

What clippyWrapper does is to generate a real GObject object that represents the hackable object and its parameters, on the Toolbox side. See the example below:

```javascript
const {GObject} = imports.gi;
const {ClippyWrapper} = imports.clippyWrapper;

const _propFlags = GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT;

var BouncingModel = GObject.registerClass({
    Properties: {
        radius: GObject.ParamSpec.double(
            'radius', 'radius', '',
            _propFlags, 0, 100.0, 10.0),
        color: GObject.ParamSpec.string(
            'color', 'color', '',
            _propFlags, 'red'),
    },
}, class BouncingModel extends ClippyWrapper {
    _init(props = {}) {
        super._init('com.endlessm.Bouncing', props);
    }
});
```

This `BouncingModel` class, with its `radius` and `color` properties, can be used by GTK+ widgets to connect and bind the widgets properties to the JavaScript game hackable parameters. See example below:

```javascript
const model = new BouncingModel();

print(model.radius);
print(model.color);

const flags = GObject.BindingFlags.BIDIRECTIONAL | GObject.BindingFlags.SYNC_CREATE;
model.bind_property('radius', this._radiusAdjustment, 'value', flags);
model.bind_property('color', this._editor, 'color', flags);
```

**NOTE**: The current limitation of this approach is that only supports plain/basic parameter types.

**NOTE**: Good luck!
