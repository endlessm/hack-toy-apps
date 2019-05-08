/* exported BootScene */

class BootScene extends Phaser.Scene {
    create() {
        this.scene.launch('Loading');
    }
}
