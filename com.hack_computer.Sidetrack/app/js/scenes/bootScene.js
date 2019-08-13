/* exported BootScene */

/* global ToyApp */

class BootScene extends Phaser.Scene {
    create() {
        if (typeof ToyApp !== 'undefined')
            ToyApp.requestState();
        this.scene.launch('Loading');
    }
}
