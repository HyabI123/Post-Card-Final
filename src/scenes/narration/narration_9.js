class Narration9 extends Phaser.Scene
{
    constructor() {
        super("narration9Scene")
    }

    preload() {
        // audio
        this.load.audio('airplane-shot', './assets/airplane_gettingShot.mp3')
        this.load.audio('flies-sound', './assets/flies_sound.mp3')
    }

    create() {
        // black background
        this.cameras.main.setBackgroundColor('#000000')

        this.typingDone = false
        this.displayed = ''

        // main text
        this.narrationText = this.add.text(game.config.width / 2, game.config.height / 2, '', {
            fontFamily: 'Palatino, serif',
            fontSize: '24px',
            color: '#ffffff',
            wordWrap: { width: 700 },
            align: 'center'
        }).setOrigin(0.5)

        // continue prompt
        this.promptText = this.add.text(game.config.width / 2, game.config.height / 2 + 100, 'Click to continue', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false)

        // sound objects
        this.flightSound1 = this.sound.add('airplane-shot')
        this.flightSound2 = this.sound.add('airplane-shot')
        this.fliesSound = this.sound.add('flies-sound')

        // helper function for chunked text
        const typeChunk = (chunk, waitTime, nextStep) => {
            let i = 0

            this.time.addEvent({
                delay: 50,
                repeat: chunk.length - 1,
                callback: () => {
                    this.displayed += chunk[i]
                    this.narrationText.setText(this.displayed)
                    i++

                    if (i >= chunk.length) {
                        if (nextStep) {
                            this.time.delayedCall(waitTime, nextStep)
                        }
                    }
                }
            })
        }

        // play first airplane audio
        this.flightSound1.play()

        // halfway through the first loop, show this text
        const durationSeconds = this.flightSound1.totalDuration || this.flightSound1.duration || 4
        const halfDelay = durationSeconds * 500

        this.time.delayedCall(halfDelay, () => {
            this.narrationText.setText('Is something shooting at me??')
        })

        // after first loop finishes, play it one more time
        this.flightSound1.once('complete', () => {
            this.flightSound2.play()

            // after second loop finishes, play flies sound and type reaction
            this.flightSound2.once('complete', () => {
                this.fliesSound.play()
                this.narrationText.setText('')
                this.displayed = ''

                typeChunk('oh', 750, () => {
                    typeChunk(' my', 750, () => {
                        typeChunk(' god...', 750, () => {
                            this.typingDone = true
                            this.promptText.setVisible(true)
                        })
                    })
                })
            })
        })

        // click to continue to star scene
        this.input.on('pointerdown', () => {
            if (this.typingDone) {
                if (this.flightSound1) 
                {
                    this.flightSound1.stop()
                }
                if (this.flightSound2) 
                {
                    this.flightSound2.stop()
                }
                if (this.fliesSound) 
                {
                    this.fliesSound.stop()
                }
        
                this.scene.start('starScene')
            }
        })
    }

    update() {

    }
}