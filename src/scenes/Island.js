class Island extends Phaser.Scene {
    constructor() {
        super("islandScene")
    }

    preload() {
        this.load.image('island', './assets/island-background.png')
        this.load.image('propeller', './assets/propeller_island.png')
    }

    create() {
        //adding images
        this.add.image(game.config.width/2, game.config.height/2, 'island').setOrigin(0.5).setDisplaySize(game.config.width, game.config.height)
        this.propeller = this.add.image(game.config.width - 50, 30, 'propeller').setOrigin(0.5).setInteractive()

        //declaring vars.
        this.partsFound = 0
        this.clickedSpots = [] //empty array (dict? list? not sure what its called in js i always get it mixed up)



        //add text
        this.partsText = this.add.text(game.config.width - borderUISize, game.config.height - borderUISize, 'Parts: 0/5', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(1, 0)

        //when the pointer is down, make the visibility false and add to parts found text
        this.propeller.on('pointerdown', () => {
            this.propeller.setVisible(false)
            this.partsFound++
            this.partsText.setText('Parts: ' + this.partsFound + '/5')
            })

        //+X IS LEFT -X IS RIGHT, +Y IS DOWN, -Y IS UP
        const spots = [
            { x: 80, y: 225 },   // top left bush
            { x: 65, y: 340 },   // bottom left tree
            { x: 320, y: 440 },  // river bubbles
            { x: 600, y: 300 },  // sand crack
        ]

        spots.forEach((spot, index) => {
            let hitbox = this.add.circle(spot.x, spot.y, 40, 0xff0000, 0.5).setInteractive()
            hitbox.on('pointerdown', () => {
                if (!this.clickedSpots[index]) {
                    this.clickedSpots[index] = true
                    this.partsFound++
                    this.partsText.setText('Parts: ' + this.partsFound + '/5')
                }
            })
        })

    }

    update() {

    }
}