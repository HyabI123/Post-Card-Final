class Narration6 extends Phaser.Scene
{
    constructor() {
        super("narration6Scene")
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
            wordWrap: { width: 750 },
            align: 'center'
        }).setOrigin(0.5)

        //prompt text
        this.promptText = this.add.text(game.config.width/2, game.config.height/2 + 110, 'Click to continue', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#6b3e2e'
        }).setOrigin(0.5).setVisible(false)

        //helper function to type one chunk of text, then wait before starting the next one
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
        typeChunk("Thank goodness I found my Aircraft Battery wasn't too drained", 1000, () => {
            typeChunk(".", 1000, () => {
                typeChunk(".", 1000, () => {
                    typeChunk(".", 1000, () => {
                        this.time.delayedCall(1000, () => {
                            typeChunk(" I do not remember this river flowing this fast...", 0, () => {
                                this.narrationDone = true
                                this.promptText.setVisible(true)
                            })
                        })
                    })
                })
            })
        })

        //click to return to island once typing is done
        this.input.on('pointerdown', () => {
            if (this.narrationDone) {
                const islandScene = this.scene.get('islandScene')
        
                //if parts found on the island is 5 or more (for some reason, bc setting it to = doesn't work? idk i js tried it and it works...), go to narration8
                if (islandScene.partsFound >= 5) 
                {
                    this.scene.stop('islandScene')
                    this.scene.start('narration8Scene')
                } 
                else 
                {
                    this.scene.stop()
                    this.scene.resume('islandScene')
                }
            }
        })
    }

    update() {

    }
}