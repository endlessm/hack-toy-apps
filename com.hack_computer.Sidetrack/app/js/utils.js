/* exported Button */

class Button extends Phaser.GameObjects.Sprite {
    constructor(_scene, x, y, spritesheet, defaultFrame, spritesheetOffset, maxFrames,
        scaleX, scaleY, callback) {
        super(_scene, x, y, spritesheet, defaultFrame, spritesheetOffset, maxFrames);

        this.x = x;
        this.y = y;
        this.defaultFrame = defaultFrame;
        this.spritesheetOffset = spritesheetOffset;
        this.maxFrames = maxFrames;
        this.myCallback = callback;
        this.myScope = _scene;

        this.disabled = false;

        this.setInteractive({useHandCursor: true});
        this.setScale(scaleX, scaleY);
        this.on('pointerup', this.pointerUp, this);
        this.on('pointerdown', this.pointerDown, this);
        this.on('pointerover', this.pointerOver, this);
        this.on('pointerout', this.pointerOut, this);

        _scene.add.existing(this);
    }

    pointerUp() {
        if (this.disabled)
            return;

        this.setFrame(this.defaultFrame);
        this.myCallback();
    }

    pointerDown() {
        if (this.disabled)
            return;

        let frame = this.defaultFrame + this.spritesheetOffset * 2;
        if (frame > this.maxFrames)
            frame = this.defaultFrame;
        this.setFrame(frame);
    }

    pointerOver() {
        if (this.disabled)
            return;

        let frame = this.defaultFrame + this.spritesheetOffset;
        if (frame > this.maxFrames)
            frame = this.defaultFrame;

        this.setFrame(frame);
    }

    pointerOut() {
        if (this.disabled)
            return;

        this.setFrame(this.defaultFrame);
    }
}
