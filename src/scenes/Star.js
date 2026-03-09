class Star extends Phaser.Scene {
    constructor() {
        super("starScene")
    }

    preload() {
        //load images
        this.load.image('starrynight', './assets/starry_night.png')
        this.load.image('plane', './assets/plane.png')
        this.load.image('bullet', './assets/bullet.png')

    }

    create() {
        this.add.image(game.config.width/2, game.config.height/2, 'starrynight').setOrigin(0.5).setDisplaySize(game.config.width, game.config.height)

        //creates plane and scales it down half way
        this.plane = this.add.image(game.config.width/2, game.config.height/2, 'plane').setOrigin(0.5).setScale(0.5)

        //adds var for the keyboard keys
        this.cursors = this.input.keyboard.createCursorKeys()
        
        //movement for player
        this.wasd = 
        {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }
        
        //make the plane's speed to be 4
        this.planeSpeed = 4

        //creating a group for the bullet:
        this.bullets = this.add.group()

        // spawn ladybug at top middle
        this.ladybug = this.add.image(game.config.width/2, 50, 'ladybug').setScale(0.5)
        this.ladybugSpeed = 2
        this.ladybugDirection = 1
        this.ladybugChangeTime = 0

        //once the space bar is down, shoot that bullet
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
            let bullet = this.bullets.create(this.plane.x, this.plane.y - (this.plane.height * 0.25), 'bullet').setScale(0.2)
            bullet.setData('speed', 6)
        })
    }

    update() 
    {

        //move if the player hasnt reached the edge of canvas 
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
    
        // move bullets forward and destroy when offscreen
        this.bullets.getChildren().forEach(bullet => {
            bullet.y -= bullet.getData('speed')
            if (bullet.y > game.config.width) {
                bullet.destroy()
            }
        })

        // random left/right movement at top of screen
        this.ladybugChangeTime--
        if (this.ladybugChangeTime <= 0) {
            this.ladybugDirection = Math.random() > 0.5 ? 1 : -1
            this.ladybugChangeTime = Phaser.Math.Between(30, 120)
        }

        //make the x axis of the lady bug speed * direction (for now, might change later)
        this.ladybug.x += this.ladybugSpeed * this.ladybugDirection

        // keep ladybug in bounds
        if (this.ladybug.x < 0) {
            this.ladybug.x = 0
            this.ladybugDirection = 1
        }
        if (this.ladybug.x > game.config.width) {
            this.ladybug.x = game.config.width
            this.ladybugDirection = -1
        }

    }
}