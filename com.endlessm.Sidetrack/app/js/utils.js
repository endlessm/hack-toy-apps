/* exported Button */

class Button extends Phaser.GameObjects.Sprite {
    constructor(_scene, x, y, spritesheet, defaultFrame, spritesheetOffset,
        scaleX, scaleY, callback) {
        super(_scene, x, y, spritesheet, defaultFrame, spritesheetOffset);

        this.x = x;
        this.y = y;
        this.defaultFrame = defaultFrame;
        this.spritesheetOffset = spritesheetOffset;
        this.myCallback = callback;
        this.myScope = _scene;

        this.setInteractive({useHandCursor: true});
        this.setScale(scaleX, scaleY);
        this.on('pointerup', this.pointerUp, this);
        this.on('pointerdown', this.pointerDown, this);
        this.on('pointerover', this.pointerOver, this);
        this.on('pointerout', this.pointerOut, this);

        _scene.add.existing(this);
    }

    pointerUp() {
        this.setFrame(this.defaultFrame);
        this.myCallback();
    }

    pointerDown() {
        this.setFrame(this.defaultFrame + this.spritesheetOffset * 2);
    }

    pointerOver() {
        this.setFrame(this.defaultFrame + this.spritesheetOffset);
    }

    pointerOut() {
        this.setFrame(this.defaultFrame);
    }
}
