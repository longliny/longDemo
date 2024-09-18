import SquareText from '../js/SquareText.js'
// import * as adMob from '../../js/index.js'
import { GAMEOPTIONS } from '../js/GameOptions.js'

let item
export default class PopupReward extends Phaser.Scene {
    constructor() {
        super({ key: 'popup_reward' })
    }
    
    create() {

        this.data= JSON.parse(localStorage.getItem('data'))
        let rec = this.add.rectangle(this.game.config.width/2, this.game.config.height/2, 720 ,1280  , 0x000000,0.95)

        let light = this.add.image(360,620,'light').setScale(2)
        let tweenLight = this.tweens.add({
            targets: light,
            rotation: { from: 0, to: 360 },
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 800000,
            repeat: -1,            // -1: infinity
            yoyo: false
        });

        item = GAMEOPTIONS.reward.type
        
        let icon = this.add.image(light.x,light.y,item).setScale(0.3)
        let btnOK= this.add.image(360,900,'btnVideo').setInteractive();
            btnOK.tint='0xF66B0E'
        //let video_icon = this.add.image(290,898,'video_icon').setScale(0.04)
        let btnText = new SquareText(this,btnOK.x,btnOK.y+3,'font','OK',35)
            this.add.existing(btnText);

        let groupBtn=[btnOK,btnText]
        // let btnSkip = new SquareText(this,btnVideo.x,btnVideo.y+80,'font','Skip',30).setScale(0).setInteractive();
        // this.add.existing(btnSkip);
        let tweenOK = this.tweens.add({
            targets: groupBtn,
            scale: { from: 0, to: 1.2 },
            delay: 1500,
            ease: 'Bounce',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false
        });

        // btnVideo.on('pointerdown', function (pointer) { 
        //     GAMEOPTIONS.reward.type='item'
        //     adMob.showReward1()  
        //     //this.scene.scene.sleep()
        // })

        btnOK.on('pointerdown', function (pointer) { 
            console.log(1111)
            console.log(this.scene.data)
            switch (item) {
                case  'item1':
                    this.scene.data.item.item1++
                    localStorage.setItem('data',JSON.stringify(this.scene.data))
                    break;
                case  'item2':
                        this.scene.data.item.item2++
                        localStorage.setItem('data',JSON.stringify(this.scene.data))
                        break;
                case  'item3':
                        this.scene.data.item.item3++
                        localStorage.setItem('data',JSON.stringify(this.scene.data))
                        break;
                default:
                    break;
            }
           
            //console.log(JSON.parse(localStorage.getItem('data')))
            this.scene.scene.stop('popup_reward')
            //this.scene.scene.restart('PlayGame')
        })
        
    }

    
   
}