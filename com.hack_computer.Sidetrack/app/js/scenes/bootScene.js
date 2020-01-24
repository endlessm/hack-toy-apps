/* exported BootScene */

/* global ToyApp */

class BootScene extends Phaser.Scene {
    create() {
        if (typeof ToyApp !== 'undefined') {
            console.debug('Loading game state.');
            ToyApp.requestState();
        }
        this.scene.launch('Loading');
    }
}
