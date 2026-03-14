class Narration2 extends Phaser.Scene
{
    constructor() {
        super("narration2Scene")
    }

    create() {
        //white background
        this.cameras.main.setBackgroundColor('#ffffff')

        this.narrationDone = false
        this.displayed = ''

        //narration text object
        this.narrationText = this.add.text(game.config.width/2, game.config.height/2, '', {
            fontFamily: 'Palatino, serif',
            fontSize: '24px',
            color: '#3a2424',
            wordWrap: { width: 600 },
            align: 'center'
        }).setOrigin(0.5)

        //prompt text - hidden until narration is done
        this.promptText = this.add.text(game.config.width/2, game.config.height/2 + 120, 'Click to find the parts', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#6b3e2e'
        }).setOrigin(0.5).setVisible(false)

        //Source: https://phaser.discourse.group/t/how-to-reveal-text-word-by-word/9183
        //helper function to type one chunk of text, then wait before starting the next one, saw the example in source above, understoof the logic, and applied it to my own way
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

        //start the narration sequence
        typeChunk('Last tuesday I went to go fly my fighter jet', 750, () => {
            typeChunk(', you know', 500, () => {
                typeChunk(', the usual.\n\n', 750, () => {
                    typeChunk('When all of a sudden it ended up malfunctioning.', 1750, () => {
                        typeChunk("\n\nI ended up on this abandoned island near Hawaii and had to find the jet's parts to put it back together.", 0, () => {
                            this.narrationDone = true
                            this.promptText.setVisible(true)
                        })
                    })
                })
            })
        })

        //click to return to island once typing is done
        this.input.on('pointerdown', () => {
            if (this.narrationDone) {
                this.scene.stop()
                this.scene.resume('islandScene')
            }
        })
    }

    update() {

    }
}