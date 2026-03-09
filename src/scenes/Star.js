class Star extends Phaser.Scene {
    constructor() {
        super("starScene")
    }

    preload() {
        this.load.image('starrynight', './assets/starry_night.png')
    }

    create() {
        this.add.image(game.config.width/2, game.config.height/2, 'starrynight').setOrigin(0.5).setDisplaySize(game.config.width, game.config.height)
    }

    update() {}
}