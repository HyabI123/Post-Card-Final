class Star extends Phaser.Scene {
    constructor() {
        super("starScene")
    }

    preload() {
        //load images
        this.load.image('starrynight', './assets/starry_night.png')
        this.load.image('plane', './assets/plane.png')
        this.load.image('bullet', './assets/bullet.png')
        this.load.image('ladybug', './assets/evil_ladybug.png')
    }

    create() {
        //background
        this.add.image(game.config.width/2, game.config.height/2, 'starrynight').setOrigin(0.5).setDisplaySize(game.config.width, game.config.height)

        //creates plane and scales it down
        this.plane = this.add.image(game.config.width/2, game.config.height - 100, 'plane').setOrigin(0.5).setScale(0.5)

        //keyboard keys
        this.cursors = this.input.keyboard.createCursorKeys()

        //determins direction for W A S D, respectively
        this.wasd = 
        {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }

        //plane speed
        this.planeSpeed = 4

        //bullet group
        this.bullets = this.add.group()

        //ladybug
        this.ladybug = this.add.image(game.config.width/2, 50, 'ladybug').setScale(0.5)
        this.ladybugSpeed = 2
        this.ladybugDirection = 1
        this.ladybugChangeTime = 0
        this.ladybugHP = 3

        //debug hitbox
        this.ladybugDebug = this.add.circle(this.ladybug.x, this.ladybug.y, 20, 0xff0000, 0.5)

        //game state
        this.gameWon = false

        //shoot on spacebar
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
            if (!this.gameWon) 
            {
                let bullet = this.bullets.create(this.plane.x, this.plane.y - (this.plane.height * 0.25), 'bullet').setScale(0.2)
                bullet.setData('speed', 6)
            }
        })
    }

    update() {
        //move plane if game is not won
        if (!this.gameWon) 
        {
            if ((this.cursors.left.isDown || this.wasd.left.isDown) && this.plane.x > 0) {
                this.plane.x -= this.planeSpeed
            }
            if ((this.cursors.right.isDown || this.wasd.right.isDown) && this.plane.x < game.config.width) {
                this.plane.x += this.planeSpeed
            }
            if ((this.cursors.up.isDown || this.wasd.up.isDown) && this.plane.y > 0) {
                this.plane.y -= this.planeSpeed
            }
            if ((this.cursors.down.isDown || this.wasd.down.isDown) && this.plane.y < game.config.height) {
                this.plane.y += this.planeSpeed
            }
        }

        //move ladybug randomly left and right
        this.ladybugChangeTime--
        if (this.ladybugChangeTime <= 0) 
        {
            this.ladybugDirection = Math.random() > 0.5 ? 1 : -1
            this.ladybugChangeTime = Phaser.Math.Between(30, 120)
        }

        //helps w/ movement for lady bug
        this.ladybug.x += this.ladybugSpeed * this.ladybugDirection

        //keep ladybug in bounds
        if (this.ladybug.x < 0) 
        {
            this.ladybug.x = 0
            this.ladybugDirection = 1
        }
        if (this.ladybug.x > game.config.width) 
        {
            this.ladybug.x = game.config.width
            this.ladybugDirection = -1
        }

        //keep debug hitbox following ladybug
        this.ladybugDebug.x = this.ladybug.x
        this.ladybugDebug.y = this.ladybug.y

        //move bullets up, check collision, destroy if offscreen
        this.bullets.getChildren().slice().forEach(bullet => {
        bullet.y -= bullet.getData('speed')

            if (bullet.y < 0) 
            {
                bullet.destroy()
            } 
            else if (this.ladybug.visible && Phaser.Geom.Intersects.CircleToRectangle(new Phaser.Geom.Circle(this.ladybug.x, this.ladybug.y, 20), bullet.getBounds())) 
            {                
                bullet.destroy()
                this.ladybugHP--
                if (this.ladybugHP <= 0) {
                    this.gameWon = true
                    this.ladybug.setVisible(false)
                    this.ladybugDebug.setVisible(false)
                    this.add.text(game.config.width/2, game.config.height/2, 'YOU WIN!', {
                        fontFamily: 'Georgia, serif',
                        fontSize: '48px',
                        color: '#ffffff'
                    }).setOrigin(0.5)
                }
            }
        })
    }
}