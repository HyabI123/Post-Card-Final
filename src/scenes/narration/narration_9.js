class Narration9 extends Phaser.Scene
{
    constructor() {
        super("narration9Scene")
    }

    preload() {
        // audio
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

        // flies sound
        this.fliesSound = this.sound.add('flies-sound')
        this.fliesSound.play()

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

        // type the reaction
        typeChunk('oh', 750, () => {
            typeChunk(' my', 750, () => {
                typeChunk(' god...', 750, () => {
                    this.typingDone = true
                    this.promptText.setVisible(true)
                })
            })
        })

        // click to continue to star scene
        this.input.on('pointerdown', () => {
            if (this.typingDone) {
                if (this.fliesSound) {
                    this.fliesSound.stop()
                }

                this.scene.start('starScene')
            }
        })

        // safety stop for audio
        this.events.on('shutdown', () => {
            if (this.fliesSound) {
                this.fliesSound.stop()
            }
        })
    }

    update() {

    }
}