/* Phaser utils
 *
 * Copyright (C) 2019 Endless Mobile, Inc.
 *
 * Author: Juan Pablo Ugarte <ugarte@endlessm.com>
 */

class TransparentBox extends Phaser.GameObjects.Graphics {

    constructor (scene, w, h, radius=8, fill=0x00000, alpha=0.5) {
        super(scene);
        this.fillStyle(fill, 1);
        this.setAlpha(alpha);
        this.fillRoundedRect(0, 0, w, h, radius);
    }
}

class Button extends Phaser.GameObjects.Container {

    constructor (scene, name, label) {
        super(scene, 0, 0);

        this.hoverTint = 0xffff00;
        this.disabledTint = 0xd2d2d2;

        this._enabled = `${name}_enabled`;
        if (scene.textures.exists(`${name}_hover`))
            this._hover = `${name}_hover`;
        if (scene.textures.exists(`${name}_disabled`))
            this._disabled = `${name}_disabled`;

        this._image = new Phaser.GameObjects.Image(scene, 0, 0, this._enabled);
        this.setSize(this._image.width, this._image.height);
        this.add(this._image);

        this.sensitive = true;

        if (label) {
            this._label = new Phaser.GameObjects.Text(scene, 0, 0, label, fontConfig);
            this._label.setFontSize('32px');
            this._label.setOrigin(0.5,0.5);
            Phaser.Display.Align.In.Center(this._label, this._image);
            this.add(this._label);
        }

        this.on('pointerover', function (event) {
            if (!this._sensitive)
                return;

            if (this._hover)
                this._image.setTexture(this._hover);
            else
                this._image.setTint(this.hoverTint);
        });

        this.on('pointerout', function (event) {
            if (this._disabled)
                this._image.setTexture(this._sensitive ? this._enabled : this._disabled);
            else {
                this._image.setTexture(this._enabled);
                this._image.clearTint();
            }
        });
    }

    set sensitive (value) {
        this._sensitive = value;

        if (value) {
            this.setInteractive({ cursor: 'pointer' });
            this._image.setTexture(this._enabled);
            return;
        }

        this.disableInteractive();

        if (this._disabled)
            this._image.setTexture(this._disabled);
        else
            this._image.setTint(this.disabledTint);
    }

    get sensitive () {
        return this._sensitive;
    }
}

var Utils = {
    TransparentBox: TransparentBox,
    Button: Button,
    load_button: function (scene, name) {

        /* Load button state images */
        scene.load.image(`${name}_enabled`, `assets/ui/${name}_enabled.png`);
        scene.load.image(`${name}_disabled`, `assets/ui/${name}_disabled.png`);
        scene.load.image(`${name}_hover`, `assets/ui/${name}_hover.png`);
    }
};


