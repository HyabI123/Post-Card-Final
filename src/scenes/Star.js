class Star extends Phaser.Scene {
    constructor() {
        super("starScene")
    }

    preload() {
        //load images
        this.load.image('starrynight', './assets/starry_night_v2.png')
        this.load.image('plane', './assets/plane.png')
        this.load.image('bullet', './assets/bullet.png')
        this.load.image('ladybug', './assets/evil_ladybug.png')

        //load audio
        this.load.audio('sfx-portal', './assets/dragon-studio-sci-fi-portal-jump-01-416163.mp3')
    }

    create() {
        //background
        this.add.image(game.config.width/2, game.config.height/2, 'starrynight').setOrigin(0.5).setDisplaySize(game.config.width, game.config.height)

        //play portal sound on enter
        this.sound.play('sfx-portal')

        //ladybugs stay above this (roughly 65% down the screen)
        this.BOUNDARY_Y = game.config.height * 0.65

        //plane sprite
        this.plane = this.add.image(game.config.width/2, game.config.height - 100, 'plane').setOrigin(0.5).setScale(0.5)

        //keyboard keys
        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }

        //plane speed
        this.planeSpeed = 4

        //bullet group
        this.bullets = this.add.group()

        //ladybug array
        this.ladybugs = []
        this.spawnLadybug() //spawn first one right away

        //spawn one new ladybug every 2.5 seconds (up to 23 more over 60 seconds)
        this.time.addEvent({
            delay: 2500,
            repeat: 23,
            callback: this.spawnLadybug,
            callbackScope: this
        })

        //points
        this.points = 0
        this.pointsText = this.add.text(game.config.width - 20, game.config.height - 20, 'Points: 0', {
            fontFamily: 'Georgia, serif',
            fontSize: '30px',
            color: '#ffffff'
        }).setOrigin(1, 1)

        //instruction text at the bottom center of the canvas
        this.add.text(game.config.width/2, game.config.height - 20, 'Use WASD or Arrows to move, and press SpaceBar to shoot the lady bugs!', {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            color: '#FF0000'
        }).setOrigin(0.5, 1)

        //countdown timer in seconds (not shown to player)
        this.timeLeft = 60

        //game over flag
        this.gameOver = false

        //tick down every second (player doesn't see the timer still)
        this.time.addEvent({
            delay: 1000,
            repeat: 59,
            callback: () => {
                this.timeLeft--
                if (this.timeLeft <= 0) {
                    this.endGame()
                }
            }
        })

        //shoot on spacebar — 500ms cooldown between shots
        this.nextShotTime = 0
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
            if (!this.gameOver && this.time.now >= this.nextShotTime) {
                let bullet = this.bullets.create(this.plane.x, this.plane.y - (this.plane.height * 0.25), 'bullet').setScale(0.2)
                bullet.setData('speed', 6)
                this.nextShotTime = this.time.now + 500
            }
        })

        //dev shortcut: "~"" skips to end
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === '~') {
                this.endGame()
            }
        })
    }

    //creates a new ladybug at a random position above the boundary
    spawnLadybug() {
        if (this.gameOver) return

        let x = Phaser.Math.Between(40, game.config.width - 40)
        let y = Phaser.Math.Between(30, this.BOUNDARY_Y - 40)

        let sprite = this.add.image(x, y, 'ladybug').setScale(0.5)
        let debug  = this.add.circle(x, y, 20, 0xff0000, 0)

        this.ladybugs.push({
            sprite,
            debug,
            alive: true,
            speed: Phaser.Math.Between(1, 3),
            direction: Math.random() > 0.5 ? 1 : -1,
            changeTime: Phaser.Math.Between(30, 120)  //frames until next direction change
        })
    }

    endGame() {
        this.gameOver = true

        //show the player's high score in the middle of the screen
        this.add.text(game.config.width/2, game.config.height/2 - 30, 'Your new High Score: ' + this.points + '!', {
            fontFamily: 'Georgia, serif',
            fontSize: '48px',
            color: '#FF0000'
        }).setOrigin(0.5)

        //prompt to restart beneath it
        this.add.text(game.config.width/2, game.config.height/2 + 40, 'Press R to try again', {
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            color: '#FF0000'
        }).setOrigin(0.5)

        //R key stops all scenes and restarts from menu (full reset)
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).once('down', () => {
            this.scene.manager.scenes.forEach(scene => {
                this.scene.stop(scene.sys.settings.key)
            })
            this.scene.start('menuScene')
        })
    }

    update() {
        if (this.gameOver) return

        //update points display every frame
        this.pointsText.setText('Points: ' + this.points)

        // --- PLANE MOVEMENT ---
        if ((this.cursors.left.isDown || this.wasd.left.isDown) && this.plane.x > 0){
            this.plane.x -= this.planeSpeed
        }
        if ((this.cursors.right.isDown || this.wasd.right.isDown) && this.plane.x < game.config.width){
            this.plane.x += this.planeSpeed
        }
        if ((this.cursors.up.isDown|| this.wasd.up.isDown) && this.plane.y > 0){
            this.plane.y -= this.planeSpeed
        }
        if ((this.cursors.down.isDown || this.wasd.down.isDown) && this.plane.y < game.config.height){
            this.plane.y += this.planeSpeed
        }

        //movement for lady bug
        this.ladybugs.forEach(bug => {
            if (!bug.alive) return

            bug.changeTime--
            if (bug.changeTime <= 0) {
                //pick a new random direction
                //Source for math documentation from phaser: https://docs.phaser.io/phaser/concepts/math
                bug.direction  = Math.random() > 0.5 ? 1 : -1
                bug.changeTime = Phaser.Math.Between(30, 120)
            }

            //moves the ladybug horizontally every frame 
            bug.sprite.x += bug.speed * bug.direction

            //keep ladybug within horizontal bounds of canvas
            if (bug.sprite.x < 0) {
                bug.sprite.x  = 0
                bug.direction = 1
            }
            if (bug.sprite.x > game.config.width) {
                bug.sprite.x  = game.config.width
                bug.direction = -1
            }

            //keep debug hitbox in sync
            bug.debug.x = bug.sprite.x
            bug.debug.y = bug.sprite.y
        })

        //bullet movement and detection of being hit
        this.bullets.getChildren().slice().forEach(bullet => {
            if (!bullet.active) return

            bullet.y -= bullet.getData('speed')

            //destroy if off screen
            if (bullet.y < 0) {
                bullet.destroy()
                return
            }

            //check against every living ladybug
            for (let bug of this.ladybugs) {
                if (!bug.alive) continue
                if (!bullet.active) break //bullet may have been destroyed by a previous hit

                let hit = Phaser.Geom.Intersects.CircleToRectangle(
                    new Phaser.Geom.Circle(bug.sprite.x, bug.sprite.y, 20),
                    bullet.getBounds()
                )
                if (hit) {
                    this.points++
                    bug.alive = false
                    bug.sprite.setVisible(false)
                    bug.debug.setVisible(false)
                    bullet.destroy()
                }
            }

            //remove killed ladybugs from the dict/array {still get the terms mixed up in js compared to python but i understand the functionality of it}
            this.ladybugs = this.ladybugs.filter(bug => bug.alive)
        })
    }
}