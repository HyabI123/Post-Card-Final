class Island extends Phaser.Scene {
    constructor() {
        super("islandScene")
    }

    preload() {
        this.load.image('island', './assets/island-background.png')
    }

    create() {
        this.add.image(game.config.width/2, game.config.height/2, 'island').setOrigin(0.5).setDisplaySize(game.config.width, game.config.height)
    }

    update() {

    }
}