import Preload from './scenes/preload.js'
import PlayGame from './js/PlayGame.js'
import StartMenu from './scenes/start_menu.js'
import LevelTypeMenu from './scenes/level_type_menu.js'
import SelectLevel from './scenes/select_level.js'
import PopupGameOver from './scenes/popup_gameover.js'
import PopupNextLevel from './scenes/popup_nextlevel.js'
import PopupPause from './scenes/popup_pause.js'
import PopupBall from './scenes/popup_ball.js'
import PopupPad from './scenes/popup_pad.js'
import PopupReward from './scenes/popup_reward.js'
import PopupLevel from './scenes/popup_level.js'
import Map from './js/test_map.js'
// import eventsCenter from './js/event.js'
// import { GAMEOPTIONS } from './js/GameOptions.js'
// import SquareText from './js/SquareText.js'

    
let game
window.onload = function() {
let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "game",
        width:720,
        height:1280,
        //height:innerHeight*window.devicePixelRatio,
    },
    
    physics: {
                default: 'arcade',   
                arcade: {
                    // debug: true
                  }             
            },
    //backgroundColor: '#03396c',
    transparent:true,
    // pixelArt : true,
    powerPreference :'default',
    fps: 60,
    enableDebug: false,
    //autoRound: true,

    // antialias:true,

    scene: [Preload,Map, StartMenu, LevelTypeMenu,SelectLevel, PlayGame,PopupGameOver,PopupNextLevel, PopupBall,PopupPad,PopupReward,PopupLevel]
}
game = new Phaser.Game(config);
//window.focus();
}