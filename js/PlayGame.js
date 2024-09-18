import {GAMEOPTIONS} from './GameOptions.js'
import SquareText from './SquareText.js'
// import * as adMob from '../js/index.js'
import PopupPause from '../scenes/popup_pause.js'
import eventsCenter from '../js/event.js'
import { updatePlayerBalance } from "../js/request.js";
//import * as FireBase from '../js/firebase.js'



let startAngle = 180
let line
let item3Wall
let balls

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//const analytics = getAnalytics();



export default class PlayGame extends Phaser.Scene {

	constructor() {
		super("PlayGame")
	}
  
    preload()
    { 
        // window.console.log = ()=>{}
        this.load.json('lv'+GAMEOPTIONS.level.level_curent,"assets/level/"+GAMEOPTIONS.level.level_curent+".json")
    }

	create() {
        lv = this.cache.json.get('lv'+GAMEOPTIONS.level.level_curent)
         console.log(GAMEOPTIONS.level.level_curent)
        createMap(this)
        // UIButton(this)
        eventsCenter.on('update-ball', this.updateImageBall,this)
        eventsCenter.on('update-pad', this.updateImagePad,this)

        this.data_game=JSON.parse(localStorage.getItem('data'))
        // console.log(this.data_game)
        GAMEOPTIONS.ball.key_ball= this.data_game.key_ball
        GAMEOPTIONS.pad.key_pad= this.data_game.key_pad
        this.max_item_on_scene=15
        this.number_item=0
        this.posY = 900
	    let dist;
        this.startGame = false;
        this.countItem=0
        this.scaleItem=0.2
        this.ball
        if (GAMEOPTIONS.level.level_curent<5){
             this.count_spawn_item= Phaser.Math.Between(5,10)
        }
        else{
                this.count_spawn_item= Phaser.Math.Between(20,35)
        }
        this.hit_mp3 = this.sound.add('hit');
        this.point_mp3= this.sound.add('point')
        this.saveData = localStorage.getItem(GAMEOPTIONS.localStorageName) == null ? { level: 1} : JSON.parse(localStorage.getItem(GAMEOPTIONS.localStorageName));

        //Top UI
        this.topBar=this.add.image(this.game.config.width/2,45,'topbar')
        this.topBar.tint='0x3D2C8D'

        this.heart=this.add.image(60, this.topBar.y ,'heart').setScale(1)
        this.heartText = new SquareText(this, this.heart.x + 40, this.heart.y+3, "font", GAMEOPTIONS.life.start_life, 40);
        this.levelText = new SquareText(this, this.game.config.width - 100, this.heart.y+3, "font",'Level '+ GAMEOPTIONS.level.level_curent, 40).setRightAlign();
        this.add.existing(this.heartText);
        this.add.existing(this.levelText);

        let btnPad = this.add.image(500,this.topBar.y,'btnPad').setScale(0.25).setInteractive();
            btnPad.on('pointerdown', function (pointer) {
                tweenAdd(this.scene,btnPad,'btnPad')
            })
        let btnBall = this.add.image(430,this.topBar.y,'btnBall').setScale(0.25).setInteractive();
            btnBall.on('pointerdown', function (pointer) {
                tweenAdd(this.scene,btnBall,'btnBall')
            })

         // Add Player
         this.player = this.physics.add.image(this.game.config.width/2,1000 , GAMEOPTIONS.pad.key_pad);
         this.player.setScale( GAMEOPTIONS.pad.scale_pad);
         this.player.setCollideWorldBounds(true);
         this.player.setImmovable(true);

        //this.borderItem=this.add.rectangle(this.heart.x+100,this.heart.y,45,45).setStrokeStyle(2, '0xffffff')

        // UI Item
        let recItem1 = this.add.rectangle(60, 870,60 , 60, '0xffffff',0 ).setInteractive();
        let btnItem1=this.add.image(recItem1.x, recItem1.y - 10,'item1').setScale(0.18)
        this.itemText1 = new SquareText(this, btnItem1.x , btnItem1.y+35, "font", 'x '+this.data_game.item.item1, 25);
        this.add.existing(this.itemText1);

        recItem1.on('pointerdown', function (pointer) {
            let data=JSON.parse(localStorage.getItem('data'))
            let b = data.item.item1

            if(this.scene.startGame){
                if( b <=0 )
                {
                    tweenAdd(this.scene,btnItem1,'btnPause')
                }
                else{
                    b--
                    this.scene.itemText1.updateText('x '+b)
                    data.item.item1=b
                    localStorage.setItem('data',JSON.stringify(data))

                    let a = balls.getMatching('visible',true)
                    for (let i = 0; i < a.length; i++) {
                        this.scene.spawBall(a[i].x,a[i].y,GAMEOPTIONS.ball.key_ball,'item1')
                    }
                }
            }
            else{
                if( b <=0 )
                {
                    tweenAdd(this.scene,btnItem1,'btnPause')
                }
            }
        });

        let recItem2 = this.add.rectangle(recItem1.x, recItem1.y + 80,60 , 60, '0xffffff',0 ).setInteractive();
        let btnItem2=this.add.image(recItem2.x, recItem2.y - 10 ,'item2').setScale(0.18)
        this.itemText2 = new SquareText(this, btnItem2.x , btnItem2.y+35, "font", 'x '+this.data_game.item.item2, 25);
        this.add.existing(this.itemText2);


        recItem2.on('pointerdown', function (pointer) {
        let data=JSON.parse(localStorage.getItem('data'))
        let b = data.item.item2
        if(this.scene.startGame){
            if( b <=0 )
            {
                tweenAdd(this.scene,btnItem2,'btnPause')
            }
            else{
                b--

                this.scene.itemText2.updateText('x '+b)
                data.item.item2=b
                localStorage.setItem('data',JSON.stringify(data))
                this.scene.spawBall(this.scene.player.x,this.scene.player.y-20,GAMEOPTIONS.ball.key_ball,'item2')
            }
        }
        else  {
            if( b <=0 )
            {
                tweenAdd(this.scene,btnItem2,'btnPause')
            }
        }
       });


       let recItem3 = this.add.rectangle(recItem1.x, recItem1.y + 160,60 , 60, '0xffffff',0 ).setInteractive();
       let btnItem3=this.add.image(recItem3.x, recItem3.y -10 ,'item3').setScale(0.18)
       this.itemText3 = new SquareText(this, btnItem3.x , btnItem3.y+35, "font", 'x '+this.data_game.item.item3, 25);
       this.add.existing(this.itemText3);


       recItem3.on('pointerdown', function (pointer) {
       let data=JSON.parse(localStorage.getItem('data'))
       let b = data.item.item3
       if(this.scene.startGame){
           if( b <=0 )
           {
                tweenAdd(this.scene,btnItem3,'btnPause')
           }
           else{
                b--
                this.scene.itemText3.updateText('x '+b)
                data.item.item3=b
                localStorage.setItem('data',JSON.stringify(data))
                addItem3(this.scene)
           }
       }
       else  {
           if( b <=0 )
           {
               tweenAdd(this.scene,btnItem3,'btnPause')
           }
       }
      });

        let btnPause= this.add.image(650,950,'btnPause').setScale(0.25).setInteractive();
        btnPause.on('pointerdown', function (pointer) {
            tweenAdd(this.scene,btnPause,'btnPause')
        })

        //Start Game



        // Add Buttom Wall
        this.bottomWall = this.physics.add.image(this.player.x, this.player.y+50 ,'block');
        this.bottomWall.setScale(6,0.05)
        this.bottomWall.tint='0xfff'
        this.bottomWall.alpha = 0
        this.bottomWall.setImmovable(true);

        //addItem3(this)
        //item3Wall.setScale(0)

        //let r = ray(this)
    //     //load map
        GAMEOPTIONS.width_map = 720
        let rec = this.add.rectangle(this.game.config.width/2, this.game.config.height/2,GAMEOPTIONS.width_map , this.game.config.height - 80, '0x1C0C5D',1).setDepth(-1).setInteractive();
            rec.y= this.game.config.height- rec.height/2-5
            line   =  this.add.image(this.player.x, this.player.y ,'line').setScale(0.7).setOrigin(0.5,1)
            rec.on("pointerdown", function (pointer){
                //startAiming(this)

                if(this.startGame==false)
                {
                    startAngle=0
                }

                dist= this.player.x - pointer.x;
            }, this);

            rec.on('pointerup', function (pointer)
            {
                if (this.startGame == false)
                {
                    this.startGame = true
                    GAMEOPTIONS.isPlaying=true
                    if(line!=null)
                    {
                        line.setVisible(false)
                    }

                    this.spawBall(this.player.x, this.player.y-20,GAMEOPTIONS.ball.key_ball,'firstball')
                }
                dist= this.player.x - pointer.x;
            }, this);

            rec.on('pointermove', function (pointer)
            {
                if (this.startGame == false)
                {
                    this.direction = Phaser.Math.Angle.Between(line.x, line.y, pointer.x, pointer.y);
                    line.angle = Phaser.Math.RadToDeg(this.direction) + 90;
                    if(line.angle<-80) line.angle = -80
                    if(line.angle>80) line.angle = 80
                    startAngle = line.angle
                    // console.log(startAngle)
                }

                if (pointer.isDown && this.startGame==true)
                {
                    this.player.setPosition(pointer.x + dist ,this.player.y);
                }
            }, this);

        this.bound =  this.physics.world.setBounds(this.game.config.width/2 - rec.width/2 , this.game.config.height- rec.height  , rec.width , rec.height);
        balls  =   this.physics.add.group()

        // this.physics.world.on('worldbounds', (balls, up, down, left, right) =>
        // {
        //     console.log('aaaa')
        //     const { gameObject } = balls;

        //     if (up) { gameObject.setAngle(90); }
        //     else if (down) { gameObject.setAngle(-90); }
        //     else if (left) { gameObject.setAngle(0); }
        //     else if (right) { gameObject.setAngle(180); }
        // });

        this.physics.add.collider(balls, this.player, this.hitPlayer, null, this);
        this.physics.add.collider(balls, blockGroup,this.destroyBlock,null,this);
        this.physics.add.collider(balls, blockBorder);
        this.physics.add.collider(balls, this.bottomWall, this.hitBottom,null,this)
        // this.physics.add.collider(balls, this.physics.world, this.hitBound, null, this);

        addBall(this)
    }

    // hitBound(){
    //     console.log('aa')
    // }

    updateImageBall()
    {
        if(GAMEOPTIONS.isPlaying)
        {
            let b = balls.getMatching('visible',true)
            b.forEach(element => {
                element.setTexture(GAMEOPTIONS.ball.key_ball)
            });
            let a = balls.getMatching('visible',false)
            a.forEach(element => {
                element.setTexture(GAMEOPTIONS.ball.key_ball)
            });
        }

    }

    updateImagePad()
    {
        if(GAMEOPTIONS.isPlaying)
        {
            this.player.setTexture(GAMEOPTIONS.pad.key_pad)
        }
    }

    checkClearMap()
    {
        //console.log(blockGroup.length)
        if(blockGroup.length<=0)  return true
        return false


    }


    spawBall(x,y, key,item)
    {
        let b = balls.getMatching('visible',true)
        if (b.length > GAMEOPTIONS.ball.max_ball) {
            return
        }
        let angel = Phaser.Math.Between(0, 359)
        //let ball = balls.get(x, y, key)
        switch (item) {
            case 'firstball':
                let ball = balls.get(x, y, key)
                ball.setVisible(true)
                ball.setActive(true)
                ball.setScale(GAMEOPTIONS.ball.scale_ball);
                ball.setBounce(1).setCollideWorldBounds(true);
                ball.allowGravity = false
                angel=startAngle
                this.physics.velocityFromAngle(angel-90, GAMEOPTIONS.ball.speed_ball , ball.body.velocity);
                break;
            case 'item1':
                for (let i = 0; i < 3; i++) {
                    let ball = balls.get(x, y, key)
                    ball.setVisible(true)
                    ball.setActive(true)
                    ball.setScale(GAMEOPTIONS.ball.scale_ball);
                    ball.setBounce(1).setCollideWorldBounds(true);
                    ball.allowGravity = false
                    angel = Phaser.Math.Between(0, 359)
                    this.physics.velocityFromAngle(angel, GAMEOPTIONS.ball.speed_ball , ball.body.velocity);
                }
                break;

            case 'item2':
                angel = -45
                for (let i = 0; i < 3; i++) {
                    let ball = balls.get(x, y, key)
                    ball.setVisible(true)
                    ball.setActive(true)
                    ball.setScale(GAMEOPTIONS.ball.scale_ball);
                    ball.setBounce(1).setCollideWorldBounds(true);
                    ball.allowGravity = false

                    this.physics.velocityFromAngle(angel-90, GAMEOPTIONS.ball.speed_ball , ball.body.velocity);
                    angel += 45
                }
                break;

            default:
                break;
        }

    }

    despawBall(ball)
    {
        ball.setBounce(0)
        ball.setPosition(-100,-100)
        balls.killAndHide(ball)
    }

    hitPlayer(player,ball)
    {
        if (ball.x>player.x) {
            this.physics.velocityFromAngle(Phaser.Math.Between(270, 310), GAMEOPTIONS.ball.speed_ball , ball.body.velocity)
        }
        else {
            this.physics.velocityFromAngle(Phaser.Math.Between(230,270 ), GAMEOPTIONS.ball.speed_ball , ball.body.velocity)
        }
    }

    //Add Item
    additem(x,y,item_type)
    {

        switch (item_type) {
            case 'item1':
                let item1 = this.physics.add.image(x,y,item_type).setScale(this.scaleItem)
                item1.setVelocityY(GAMEOPTIONS.item.speed_item)
                item1.name='item1'
                this.physics.add.collider(this.player, item1, this.hitItem, null,this);
                this.physics.add.collider(this.bottomWall,item1,this.itemhitBottom,null,this);
                break;

            case 'item2':
                let item2 = this.physics.add.image(x,y,item_type).setScale(this.scaleItem)
                item2.name='item2'
                item2.setVelocityY(GAMEOPTIONS.item.speed_item)
                this.physics.add.collider(this.player, item2, this.hitItem, null,this);
                this.physics.add.collider(this.bottomWall,item2,this.itemhitBottom,null,this);
                break;

            case 'item3':
                let item3 = this.physics.add.image(x,y,item_type).setScale(this.scaleItem)
                item3.name='item3'
                item3.setVelocityY(GAMEOPTIONS.item.speed_item)
                this.physics.add.collider(this.player, item3, this.hitItem, null,this);
                this.physics.add.collider(this.bottomWall,item3,this.itemhitBottom,null,this);
                break;

            default:
                break;
        }

    }

    //add ball at ball in scene
    hitItem(player,item)
    {
        item.destroy()
        this.number_item--
        if(!this.point_mp3.isPlaying) this.point_mp3.play()
        switch (item.name) {
            case 'item1':
                let a = balls.getMatching('visible',true)
                    for (let i = 0; i < a.length; i++) {
                        this.spawBall(a[i].x,a[i].y,GAMEOPTIONS.ball.key_ball,'item1')
                    }
            break;
            case 'item2':
                this.spawBall(player.x,player.y-20,GAMEOPTIONS.ball.key_ball, 'item2')
            break;

            case 'item3':
                addItem3(this)

            break;

            default:
                break;
        }


    }

    hitBottom(a,ball)
    {
        this.despawBall(ball)
        let b = balls.getMatching('visible',true)
        // console.log(b)
        if (b.length==1){
            this.physics.velocityFromAngle(Phaser.Math.Between(270, 310), GAMEOPTIONS.ball.speed_ball , ball.body.velocity)
            console.log('bbbb')
        }
        if (b.length<=0) {
            GAMEOPTIONS.life.start_life --;
            if (GAMEOPTIONS.life.start_life <= 0) {
                //GAMEOPTIONS.ads.countAds++
                this.heartText.updateText(GAMEOPTIONS.life.start_life)
                if (GAMEOPTIONS.ads.isAds) {
                    //GAMEOPTIONS.ads.countAds=0
                    GAMEOPTIONS.reward.type='popup'
                    // adMob.showInterstitialAd1()
                }
                //raycaster.clearObstacle();
                // cordova.plugins.firebase.analytics.logEvent("level", {level_loss: "lv " + GAMEOPTIONS.level.level_curent});

                this.scene.launch('popup_gameover')
            }
            else {
                if(line!=null)
                {
                    line.setPosition(this.player.x,this.player.y)
                    line.setVisible(true)
                    line.angle=0
                    //console.log(line.angle)
                    startAngle = line.angle

                }
                this.heartText.updateText(GAMEOPTIONS.life.start_life)
                this.startGame=false

            }

        }
    }

    itemhitBottom(a, item)
    {
        this.number_item--
        item.destroy()
    }

    destroyBlock(b)
    {
        if(!this.startGame) return
        this.hit_mp3.play()
        this.countItem++;
        // console.log(GAMEOPTIONS.level.level_curent)
        if  (this.countItem == this.count_spawn_item)
        {
            let item
            let i=0
            if(GAMEOPTIONS.item.max_item <0 )
            {
                 i = Phaser.Math.Between(0,80)
            }
            else
            {
                 i = Phaser.Math.Between(0,100)
            }

            if(i>=0 && i <=60) item=GAMEOPTIONS.item.lst_item[0]
            if(i>60 && i <=80) item=GAMEOPTIONS.item.lst_item[1]
            if(i>80 && i <=100)
            {
                item=GAMEOPTIONS.item.lst_item[2]
                GAMEOPTIONS.item.max_item --
            }

            // let item = Phaser.Utils.Array.GetRandom(GAMEOPTIONS.item.lst_item)
            if(this.number_item<this.max_item_on_scene){
                this.additem(b.x,b.y,item)
                this.number_item++
                // console.log(this.number_item)
            }
            this.countItem = 0
            if (GAMEOPTIONS.level.level_curent<5){
                this.count_spawn_item= Phaser.Math.Between(1,3)
            }
            else if (GAMEOPTIONS.level.level_curent>4 && GAMEOPTIONS.level.level_curent<8)
            {
                this.count_spawn_item= Phaser.Math.Between(5,10)
            }
            else if (GAMEOPTIONS.level.level_curent>7 && GAMEOPTIONS.level.level_curent<13)
            {
                this.count_spawn_item= Phaser.Math.Between(15,25)
            }
            else{
                this.count_spawn_item= Phaser.Math.Between(GAMEOPTIONS.item.random_item[0],GAMEOPTIONS.item.random_item[1])
            }


        }
        Phaser.Utils.Array.Remove(blockGroup,b)
        b.setVisible(false)

        if (this.checkClearMap() == true) {

            //GAMEOPTIONS.ads.countAds++
            GAMEOPTIONS.level.level_curent ++
            if (GAMEOPTIONS.level.level_curent > this.saveData.level) {

                localStorage.setItem(GAMEOPTIONS.localStorageName, JSON.stringify({
                    level: GAMEOPTIONS.level.level_curent}))
            }
            if (GAMEOPTIONS.ads.isAds ) {
                // GAMEOPTIONS.ads.countAds=0
                GAMEOPTIONS.reward.type='popup'
                // adMob.showInterstitialAd1()
            }


            // raycaster.clearObstacle();
            //  cordova.plugins.firebase.analytics.logEvent("level", {level_pass: "lv " + GAMEOPTIONS.level.level_curent});
             this.scene.launch('popup_nextlevel')
//            this.scene.launch('popup_leader_board')
        }


    }
}

 function addBall(scene)
    {
        for (let i = 0; i < 20; i++) {
            let ball = scene.physics.add.image(-100 , -100,GAMEOPTIONS.ball.key_ball);
            balls.add(ball)
            ball.visible = false
            ball.active = false
        }
        //console.log(balls)

    }

var RunRaycaster = function (raycast, x, y, angle, debugGraphics) {
    //console.log('a')
    debugGraphics
        .clear()
        .fillStyle(0xC4C400)
        .fillCircle(x, y, 0);
    const MaxReflectionCount = 2;
    for (var i = 0; i < MaxReflectionCount; i++) {
        var result = raycast.rayToward(x, y, angle);
        debugGraphics
            .lineStyle(2, 0xffffff)
            .strokeLineShape(raycast.ray);
        if (result) {

            debugGraphics
                .fillStyle(0xffffff)
                .fillPoint(result.x, result.y, 6)
            x = result.x;
            y = result.y;
            angle = result.reflectAngle;
        } else {
            break;
        }
    }
}

function onComplete(btnType) {
    // raycaster.clearObstacle();
    switch (btnType) {
        case 'btnPause':

            this.scene.pause('PlayGame')
            //console.log(this.scene.scene.isActive('popup_pause'))
            if(this.scene.isActive('popup_pause')==null)
            {
                this.scene.add('popup_pause',PopupPause,true);
            }
            else{
                this.scene.run('popup_pause');
            }
            break;
        case 'btnBall':
            GAMEOPTIONS.tabActive='tabBall'
            eventsCenter.emit('tabActive')
            this.scene.run('select_level')
            this.scene.pause('PlayGame')
            this.scene.sendToBack();
            break;

        case 'btnPad':
            GAMEOPTIONS.tabActive='tabPad'
            eventsCenter.emit('tabActive')
            this.scene.run('select_level')
            this.scene.pause('PlayGame')
            //this.scene.run('popup_pad')
            this.scene.sendToBack();
            break;

        default:
            break;
    }

}

function tweenAdd(scene,a,btnType)
{
    scene.tweens.add({
        targets: a,
        scale: { from : a.scale-0.15, to : a.scale},
        ease: 'Bounce',
        duration: 500,
        onComplete: onComplete.bind(scene,btnType),
    })
}


// map
let lv
let level = 1
let tileW
let tileH
let tilePixel
let lstColor
let lstColorID
let blockGroup
let blockBorder
let width
let height
let raycaster


function createMap(scene) {
    blockGroup = []
    blockBorder = []
    lstColor=GAMEOPTIONS.color
    lstColorID = []

    width = 700
    height = 700
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
            if (GAMEOPTIONS.level.level_curent>11){
                let block = scene.physics.add.sprite(tileDestination(my_array[0])+(700-width)/2+5, tileDestination(my_array[1]) + (lv.nHeight- lv.nWidth)*tilePixel + 85, "block_white")
                block.tint='0xB6B6B6' // xam
                block.displayHeight = tilePixel + 5
                block.displayWidth = tilePixel  + 5
                block.body.setSize(block.displayWidth-3, block.displayHeight-3)
                block.setImmovable(true);
                blockBorder.push(block)
            }

        }
        else
        {
            let block = scene.physics.add.sprite(tileDestination(my_array[0])+(700-width)/2+5, tileDestination(my_array[1]) + (lv.nHeight- lv.nWidth)*tilePixel + 85, "block_white")
            block.displayHeight = tilePixel + 5
            block.displayWidth = tilePixel + 5
            block.body.setSize(block.displayWidth-3, block.displayHeight-3)
            let index =lstColorID.indexOf(my_array[5])
            if(index == -1)
            {
                lstColorID.push(my_array[5])
                index =lstColorID.indexOf(my_array[5])
            } 
            
            blockGroup.push(block)
            block.setImmovable(true);
            block.tint=lstColor[index]
        }
    }
    scene.cache.json.remove('lv'+GAMEOPTIONS.level.level_curent)
    //Phaser.Cache.BaseCache.remove('lv'+GAMEOPTIONS.level.level_curent)

}
function tileDestination(pos) {
    let a = width - pos * (tilePixel) 
    return a
}

function addItem3(scene) {
    item3Wall = scene.physics.add.image(360, scene.player.y+40 ,'block');
    item3Wall.setScale(6,0.03)
    item3Wall.displayWidth=720
    item3Wall.tint='0xF66B0E'
    item3Wall.setImmovable(true);
    scene.physics.add.collider(balls, item3Wall);
    scene.tweens.add({
        targets: item3Wall,
        scaleX: 0,
        ease: 'Linear',
        delay:3000,
        duration: 3000,
        onComplete:function () {
            item3Wall.destroy()
        },
    });
}



function  UIButton(scene) {

    let btnNext = scene.add.image(500,1200,'btnNext').setScale(1.5).setInteractive();
        btnNext.alpha = 0.02
        btnNext.on('pointerdown', function (pointer) {
            // raycaster.clearObstacle();
            GAMEOPTIONS.level.level_curent++
            scene.scene.restart('PlayGame')
        })

    let btnPre = scene.add.image(200,1200,'btnNext').setScale(1.5).setAngle(180).setInteractive();
        btnPre.alpha = 0.02
        btnPre.on('pointerdown', function (pointer) {
            if(GAMEOPTIONS.level.level_curent>0)
            {
                // raycaster.clearObstacle();
                GAMEOPTIONS.level.level_curent--
                scene.scene.restart('PlayGame')
            } 
            
        })
    
}




 

