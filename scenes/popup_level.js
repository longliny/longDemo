import {GAMEOPTIONS} from '../js/GameOptions.js'

export default class PopupLevel extends Phaser.Scene {

    constructor() {
        super({ key: 'popup_level' })
    }

    preload ()
    {
        // console.log(GAMEOPTIONS.level.level_curent)
        this.load.json('lv'+GAMEOPTIONS.level.level_curent,"assets/level/"+GAMEOPTIONS.level.level_curent+".json")
    }

    create()
    {
        // console.log('aaa')
        lv = this.cache.json.get('lv'+GAMEOPTIONS.level.level_curent)
        
        createMap(this)
        //testmap(this)
        // UIButton(this)

    }

    
}

// map 
let lv
let level = 1
let tileW
let tileH
let tilePixel
let lstColor
let lstColorID
let width
let height

let blockGroup
let blockBorder




function createMap(scene) {
    // if(lv==null) return
    blockGroup= scene.add.group()
    blockBorder= scene.add.group()
    lstColor=GAMEOPTIONS.color
    lstColorID = []

    width = 500
    height = 500
    tileW = width/lv.nWidth
    tileH = height/ lv.nHeight
    lv.nWidth > lv.nHeight ? tilePixel = tileW : tilePixel = tileH
    lv.nWidth > lv.nHeight ? width = width : width = tilePixel * lv.nWidth
    lv.nWidth > lv.nHeight ? height = height  : height = tilePixel * lv.nHeight
    

    for (let i = 0; i <lv.vBrick.length; i++) {
        const e = lv.vBrick[i];
        let my_array = e.split(",")
      
        if(my_array[5]==2189591295)
        {        

        let block = scene.physics.add.image(tileDestination(my_array[0])+(700-width)/2+5, tileDestination(my_array[1]) + (lv.nHeight- lv.nWidth)*tilePixel + 400, "block_white")
            block.displayHeight = tilePixel + 5
            block.displayWidth = tilePixel + 5

            block.tint='0xB6B6B6' // xam
            block.setImmovable(true);
            blockBorder.add(block)

        }
        else
        {
        let block = scene.physics.add.image(tileDestination(my_array[0])+(700-width)/2+5, tileDestination(my_array[1]) + (lv.nHeight- lv.nWidth)*tilePixel + 400, "block_white")
            block.displayHeight = tilePixel + 5
            block.displayWidth = tilePixel + 5
            let index =lstColorID.indexOf(my_array[5])

            if(index == -1)
            {
                lstColorID.push(my_array[5])
                index =lstColorID.indexOf(my_array[5])
            } 
            
    
            blockGroup.add(block)
            block.setImmovable(true);
            block.tint=lstColor[index]
        }
      
         
    }
    scene.cache.json.remove('lv'+GAMEOPTIONS.level.level_curent)

    //countBlock = blockGroup.getLength()
   


}

function tileDestination(pos) {
    let a = width- pos * (tilePixel)
    return a
}

function  UIButton(scene) {
    let btnNext = scene.add.image(500,1200,'btnNext').setScale(1.5).setInteractive();
        btnNext.on('pointerdown', function (pointer) {
            level++
            scene.scene.restart('popup_level')
        })

    let btnPre = scene.add.image(200,1200,'btnNext').setScale(1.5).setAngle(180).setInteractive();
        btnPre.on('pointerdown', function (pointer) {
            if(level>0)
            {
                level--
                scene.scene.restart('popup_level')
            } 
            
        })
    
}
