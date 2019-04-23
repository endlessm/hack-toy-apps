/* exported BootScene */

class BootScene extends Phaser.Scene {
    preload() {
        this.load.image('logo', 'assets/images/player.png');
    }

    create() {
        this.scene.launch('Loading');
    }
}
