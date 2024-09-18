import { GAMEOPTIONS } from '../js/GameOptions.js';
import SquareText from '../js/SquareText.js'
// import * as adMob from '../../js/index.js'
import eventsCenter from '../js/event.js'
import { updatePlayerBalance } from "../js/request.js";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class PopupBall extends Phaser.Scene {
    constructor() {
        super({
            key: 'popup_ball'
        })
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'plugins/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        eventsCenter.on('ads-ball', function (index) {
            onComplete('select', index)
        })

        this.data = JSON.parse(localStorage.getItem('data'))
        this.scene.sleep(this)
        var scrollablePanel = this.rexUI.add.scrollablePanel({
            x: this.game.config.width / 2,
            y: 730,
            width: 570,
            height: 730,

            scrollMode: 0,

            background: this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 520, 660, '0x112B3C', 1).setDepth(-1),

            panel: {
                child: createGrid(this),
                mask: {
                    mask: true,
                    padding: 1,
                }
            },


            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
            }
        })
            .layout()

    }


}

let textgroup = []
let btngroup = []

var createGrid = function (scene) {

    // Create table body
    var sizer = scene.rexUI.add.gridSizer({
        column: 2,  // col: 0
        row: 3,
        space: { column: 20, row: 20 },

    })
    //.addBackground(scene.rexUI.add.roundRectangle(0, 0, 10, 10, 0, COLOR_DARK))

    for (var i = 0; i < scene.data.ball.length; i++) {
        sizer.add(Row(scene, i, scene.data.ball[i]));
    }

    return sizer;
}

var Row = function (scene, index, data_ball) {

    var background = scene.add.rectangle(0, 0, 200, 200, 0x205375);
    var button
    var text_button

    var icon = scene.add.image(0, 100, 'ball' + index).setScale(1);
    if (data_ball == 0) {
        button = scene.add.image(0, 0, 'btnVideo').setScale(0.9, 1).setInteractive();
        button.type = 'select'
        button.name = index
        text_button = new SquareText(scene, 0, 0, "font", 'Select', 25).setOrigin(0.5);
        scene.add.existing(text_button);
        text_button.text = 'Select'
        button.tint = '0xF66B0E'
    }
    else {
        button = scene.add.image(0, 0, 'btnVideo').setScale(0.9, 1).setInteractive();
        button.type = 'watch_ads'
        // button.type = 'select'
        button.name = index
        text_button = new SquareText(scene, 0, 0, "font", 'Select', 25).setOrigin(0.5);
        scene.add.existing(text_button);
        text_button.text = '-200 UPOY'
        button.tint = '0x112B3C'
    }

    textgroup.push(text_button)
    btngroup.push(button)
    var sizer = scene.rexUI.add.sizer({
        orientation: 'y',
        width: 270,
        height: 200,
        space: { item: 30 }
    })
        .addBackground(background)
        .add(icon, {
            align: 'center',
            padding: { left: 0, right: 0, top: 40, bottom: 0 },
        })
        .add(button, {
            align: 'center',
        })

        .add(text_button, {
            align: 'center',
            padding: { left: 0, right: 0, top: -68, bottom: 0 },
        })

    button.on('pointerdown', function (pointer) {
        switch (button.type) {
            case 'select':
                tweenAdd(this.scene, button, 'select', index)
                break;
            case 'watch_ads':
                tweenAdd(this.scene, button, 'watch_ads', index)
                break;
            default:
                break;
        }
    });
    return sizer;
}

export var UpdateText = function (index) {
    let data = JSON.parse(localStorage.getItem('data'))
    for (let i = 0; i < data.ball.length; i++) {
        if (data.ball[i] == 0) {
            textgroup[i].text = 'Select'
            btngroup[i].tint = '0xF66B0E'
            btngroup[i].type = 'select'
        }
    }
    textgroup[index].updateText('Selected')
    btngroup[index].tint = '0xF66B0E'
    btngroup[index].type = 'select'
}

function onComplete(btnType, index) {
    let data = JSON.parse(localStorage.getItem('data'))
    switch (btnType) {
        case 'select':
            GAMEOPTIONS.ball.key_ball = 'ball' + index
            data.key_ball = GAMEOPTIONS.ball.key_ball
            data.ball[index] = 0
            localStorage.setItem('data', JSON.stringify(data))
            UpdateText(index)
            eventsCenter.emit('update-ball', GAMEOPTIONS.ball.key_ball)
            break;
        case 'watch_ads':
            const balance = localStorage.getItem('Balance')
            if (balance > 200) {
                updatePlayerBalance(-200)

                GAMEOPTIONS.ball.key_ball = 'ball' + index
                data.key_ball = GAMEOPTIONS.ball.key_ball
                data.ball[index] = 0
                localStorage.setItem('data', JSON.stringify(data))
                UpdateText(index)
                eventsCenter.emit('update-ball', GAMEOPTIONS.ball.key_ball)
            }
            // if (GAMEOPTIONS.ads.isAds) {
            //     GAMEOPTIONS.reward.type = 'ball'
            //     //adMob.showInterstitialAd1(this,index)  
            //     // adMob.showReward1(this,index)  
            // }
            break;
        default:
            break;
    }

}

function tweenAdd(scene, a, btnType, index) {
    scene.tweens.add({
        targets: a,
        scale: { from: a.scale - 0.15, to: a.scale },
        ease: 'Bounce',
        duration: 500,
        onComplete: onComplete.bind(scene, btnType, index),
    })
}
