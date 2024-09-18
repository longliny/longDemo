export const GAMEOPTIONS = {
    life : {
        start_life : 3,
        max_life : 30
    },
    dpi:1,
    width_map:0,
    posY : 1000,
    lst_easy_level:[1,2,3],
    lst_hard_level:[1,2,3],
    scaleMap : 0.55,
    
    item :{  
        random_item :[30,50],
        speed_item:150,
        lst_item:['item1','item2','item3'],
        max_item : 3
    },
    
    //ball
    ball: {
        max_ball: 600,
        key_ball: 'ball0',
        scale_ball : 0.3,
        speed_ball: 400,
    },


    //pad
    pad:{
        key_pad:'pad0',
        scale_pad : 0.35,
    },
    
    // key datas
    level : {
        level_curent : 1,
        max_level : 431,
        
    },
    localStorageName:'level',
    level_easy_curent : 1,
    level_hard_curent : 1,
    level_type_menu: "easy",

    reward: {
        type:'ball',
      },
    
    fullAds:{
        type:'ball'
    },

    data : {
        ball:[0,0,1,0,1,1,0,0,1,0,0,1,0,1,1,0,1],
        pad: [0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0]
    },

    tabActive:'tabLevel',

    ads:{
        isAds:true,
        countAds:0
    },
    isPlaying:false,
    color:['0x04FF1D','0xFF7B02','0x00F6FF','0xFFFD0F','0xFF0000','0x009CFF','0xFF008A','0xFFBEAC','0xFF91F9','0xB8F47C','0x0066FF','0xEB00FF','0xFF4D00','0x00AF91','0x80FFDB','0xFFD369','0xB2FCFF'],
    lstColorID:[]

}
  