class Menu extends Phaser.Scene  //creates a class called "Menu" which extends Phaser's predefined Scene object
{
    constructor() {
      super("menuScene")
    }
    
    preload() 
    {
      // load spritesheet
      this.load.spritesheet('explosion', './assets/explosion.png', 
        {
        frameWidth: 64,
        frameHeight: 32,
        startFrame: 0,
        endFrame: 9
        }
        )

        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png')
        this.load.image('spaceship', './assets/spaceship.png')
        this.load.image('starfield', './assets/starfield.png')
        this.load.image('frontcard', './assets/front_post-card.png')
        this.load.image('backcard', './assets/back-post_card.png')


        // load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav')
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav')
        this.load.audio('sfx-shot', './assets/sfx-shot.wav')
      }

      create() {
        //bool. var. to check if post-card is currently flipped
        this.isFlipped = false
        
        //bool. var. to check if the back of the post-card has been seen
        this.hasSeenBack = false

        //counter for click count:
        this.clickCount = 0


        //adding both front and back card and scaling it for now since images weren't scaled right when I made them
        this.frontCard = this.add.image(game.config.width/2, game.config.height/2, 'frontcard').setOrigin(0.5).setDisplaySize(game.config.width, game.config.height)

        this.backCard = this.add.image(game.config.width/2, game.config.height/2, 'backcard').setOrigin(0.5).setDisplaySize(game.config.width, game.config.height).setVisible(false)
    

        //add text prompting player to flip it
        this.promptText = this.add.text(game.config.width/2, game.config.height - borderPadding*2, 'Click the post-card to flip it', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5)
    
        // define keys (ignore, just a note for me for future purposes)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    
        //when player clicks down
        this.input.on('pointerdown', () => {
          //increment click counter 
          this.clickCount++
          console.log("Player has clicked " + this.clickCount + " times")
          //if click count becomes 17, 
          if (this.clickCount >= 17) 
            {
              this.scene.start('islandScene')
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
                  this.promptText.setText('Click again to flip over')
                  this.promptText.setStyle({ color: '#ffffff' })
                  this.promptText.setVisible(true)
                  //only NOW set hasSeenBack to true so early clicks do nothing
                  this.hasSeenBack = true
              })
          } 
          else if (this.isFlipped && this.hasSeenBack) //if the player HAS seen the back AND has flipped it already
          {
              //set isFlipped to false
              this.isFlipped = false

              //make the text and the respectable cards visible
              this.backCard.setVisible(false)
              this.frontCard.setVisible(true)
              this.promptText.setVisible(false)
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
