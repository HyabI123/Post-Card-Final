class Island extends Phaser.Scene {
    constructor() {
        super("islandScene")
    }

    preload() {
        //assets
        this.load.image('islandFake', './assets/island-background-fake.png')
        this.load.image('islandReal', './assets/island-background.png')
        this.load.image('propeller', './assets/propeller_island.png')
        this.load.image('starrynight', './assets/starry_night.png')
        this.load.image('ladybug', './assets/evil_ladybug.png')

        //audio
        this.load.audio('sfx-ding', './assets/dragon-studio-ding-402325.mp3')
        this.load.audio('sfx-portal', './assets/dragon-studio-sci-fi-portal-jump-01-416163.mp3')
    }

    create() {
        //start off scene as black
        this.cameras.main.setBackgroundColor('#000000')
        this.sound.play('sfx-portal')
        
        //delcaring vars.
        this.isIslandFlipped = false
        this.propellerFound = false

        //key inputs
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

        //after a second, add the island image
        this.time.delayedCall(1000, () => {
            this.islandImage = this.add.image(game.config.width/2, game.config.height/2, 'islandFake').setOrigin(0.5).setDisplaySize(game.config.width, game.config.height)

            //Prompt user to click F to flip card
            this.flipPrompt = this.add.text(game.config.width/2, borderPadding*2, 'Click F to flip card, left click the differences!', {
                fontFamily: 'Georgia, serif',
                fontSize: '30px',
                color: '#FC2F05'
            }).setOrigin(0.5).setVisible(false)

            this.propeller = this.add.image(game.config.width - 50, 30, 'propeller').setOrigin(0.5).setInteractive()
            this.propeller.setVisible(false) //make propeller invisible by default
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
                this.propellerFound = true
                this.partsFound++
                this.sound.play('sfx-ding')
                this.partsText.setText('Parts: ' + this.partsFound + '/5')

                this.scene.pause()
                this.scene.launch('narration3Scene')
            })
    
            //+X IS LEFT -X IS RIGHT, +Y IS DOWN, -Y IS UP
            //visible hitbox for debugging/testing purposes:
            const spots = [
                { x: 500, y: 425, radius: 50 },   // middle bush
                { x: 80, y: 340, radius: 60},     // tree
                { x: 850, y: 750, radius: 100},   // river bubbles
                { x: 1243, y: 472, radius: 40 },  // sand crack
            ]
    
            //hitboxes, the index order is based on the order in const spots []
            spots.forEach((spot, index) => {
                let hitbox = this.add.circle(spot.x, spot.y, spot.radius, 0xff0000, 0.5).setInteractive()
                hitbox.on('pointerdown', () => {
                    if (!this.clickedSpots[index]) {
                        this.clickedSpots[index] = true
                        this.partsFound++
                        this.sound.play('sfx-ding')
                        this.partsText.setText('Parts: ' + this.partsFound + '/5')
            
                        if (index === 0) {   // bush
                            this.scene.pause()
                            this.scene.launch('narration4Scene')
                        }
                        else if (index === 1) {   // tree
                            this.scene.pause()
                            this.scene.launch('narration5Scene')
                        }
                        else if (index === 2) {   // bubbles
                            this.scene.pause()
                            this.scene.launch('narration6Scene')
                        }
                        else if (index === 3) {   // sand crack
                            this.scene.pause()
                            this.scene.launch('narration7Scene')
                        }
                    }
                })
            })
        
            //so text doesnt show before narration
            this.time.delayedCall(10000, () => {
            //†ext for player instructions

                })
    

        //after the player is on the island for 3 seconds, show the second narration scene
        this.time.delayedCall(2000, () => {
            this.scene.pause()
            this.scene.launch('narration2Scene')
        })
        })
    }

    update() {
        //Source for just-down function: https://phaser.io/examples/v3.55.0/input/keyboard/view/just-down 
        //if user is pressing F, change vars 
        if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
            this.isIslandFlipped = !this.isIslandFlipped
        
            if (this.isIslandFlipped) 
                {
                    this.islandImage.setTexture('islandReal')
                    this.propeller.setVisible(false) //hide propeller on real island
                } 
                else 
                {
                    this.islandImage.setTexture('islandFake')
                    this.propeller.setVisible(!this.propellerFound) //show propeller on fake island if not found yet
                }
        }

    }
}