class Menu extends Phaser.Scene  //creates a class called "Menu" which extends Phaser's predefined Scene object
{
    constructor() {
      super("menuScene")
    }
    
    //Source: https://docs.phaser.io/api-documentation/3.88.2/namespace/types-scenes
    // Runs when the scene starts and checks whether data was passed in from another scene.
    // If returnFromNarration was passed in, save it as true.
    // If no data was passed, default to false.
    init(data) 
    {
      this.returnFromNarration = data?.returnFromNarration || false
    }

    preload() 
    {
        // load images/tile sprites
        this.load.image('starfield', './assets/starfield.png')
        this.load.image('frontcard', './assets/front_post-card.png')
        this.load.image('backcard', './assets/back-post_card.png')

        // load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav')
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav')
        this.load.audio('sfx-shot', './assets/sfx-shot.wav')
        this.load.audio('sfx-portal', './assets/dragon-studio-sci-fi-portal-jump-01-416163.mp3')
    }

    create() {
        //bool. var. to check if post-card is currently flipped
        this.isFlipped = false
        
        //bool. var. to check if the back of the post-card has been seen
        this.hasSeenBack = false
        this.hasSeenFront = false

        //counter for click count:
        this.clickCount = 0

        //adding both front and back card and scaling it for now since images weren't scaled right when I made them
        this.frontCard = this.add.image(game.config.width/2, game.config.height/2, 'frontcard').setOrigin(0.5)
        this.backCard = this.add.image(game.config.width/2, game.config.height/2, 'backcard').setOrigin(0.5).setDisplaySize(game.config.width, game.config.height).setVisible(false)

        //add text prompting player to flip it
        this.promptText = this.add.text(game.config.width/2, game.config.height - borderPadding*2, 'Click the post-card to flip it', {
            fontFamily: 'Georgia, serif',
            fontSize: '50px',
            color: '#FC2F05'
        }).setOrigin(0.5)

        if (this.returnFromNarration) //if player has returned from narration, 
        {
          this.hasSeenBack = true
          this.hasSeenFront = true
          this.promptText.setText('Click to look closer')
        }

        // define keys (ignore, just a note for me for future purposes)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS).on('down', () => {
            this.scene.start('islandScene')
        })

        //when player clicks down
        this.input.on('pointerdown', () => {
            //increment click counter 
            this.clickCount++
            console.log("Player has clicked " + this.clickCount + " times")

            //if click count becomes >= 17, play the sound after a short delay
            if (this.clickCount >= 17) {
                this.sound.play('sfx-portal')
                this.time.delayedCall(1000, () => {
                    this.scene.start('islandScene')
                })
            }

            if (!this.isFlipped && !this.hasSeenBack) //if the card hasnt been flipped and the player hasnt seen the back
            {
                //change isFlipped to true so we know it has been flipped
                this.isFlipped = true

                //make the text and the respectable cards visible
                this.frontCard.setVisible(false)
                this.backCard.setVisible(true)
                this.promptText.setVisible(false)

                //after 3 second delay, tell the player to flip card over again
                this.time.delayedCall(3000, () => {
                  this.promptText.setText('Click to continue')
                    this.promptText.setStyle({ color: '#FC2F05' })
                    this.promptText.setVisible(true)
                    //only NOW set hasSeenBack to true so early clicks do nothing
                    this.hasSeenBack = true
                })
            }
            else if (this.isFlipped && this.hasSeenBack) //if the player has flipped the card and has seen the back of the card, start the narration scene
              {
                  this.scene.start('narrationScene')
              }
            else if (!this.isFlipped && this.hasSeenFront) //if the player has seen the front after the back
            {
                // go to island scene
                this.scene.start('islandScene')
            }
        })
    }
    
    update() {
      if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
        // easy mode
        game.settings = {
          spaceshipSpeed: 3,
          gameTimer: 60000    
        }
        this.sound.play('sfx-select')
        this.scene.start('playScene')    
      }
      if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
        // hard mode
        game.settings = {
          spaceshipSpeed: 4,
          gameTimer: 45000    
        }
        this.sound.play('sfx-select')
        this.scene.start('playScene')    
      }
    }
}