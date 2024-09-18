import {GAMEOPTIONS} from './GameOptions.js'
import eventsCenter from '../js/event.js'

'use strict'

let lastAdTime = 0

const app = {
  initialize() {
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false,
    )

    document.addEventListener(
      'admob.ad.load',
      (evt) => {
        const { ad } = evt
        console.log('admob.ad.load', ad.id, ad instanceof admob.AppOpenAd)
      },
      false,
    )
    document.addEventListener(
      'admob.ad.dismiss',
      (evt) => {
        console.log('admob.ad.dismiss', evt.ad.id)
      },
      false,
    )
    document.addEventListener(
      'admob.ad.show',
      (evt) => {
        console.log('admob.ad.show', Object.keys(evt))
      },
      false,
    )
    
  },

  onDeviceReady() {
    this.receivedEvent('deviceready')
    if (cordova.platformId === 'ios') {
      admob.requestTrackingAuthorization().then(console.log)
    }

    admob
      .start()
      .then(() => this.initAppOpenAd())
      .then(() =>
        admob.BannerAd.config({
          backgroundColor: '#A7A7A7',
          //marginTop: 10,
          //marginBottom: 10,
        }),
      )
      .catch(alert)
      // this.showBannerAd()
      this.customShowBannerAd();
      // this.showBannerAdAdaptiveInline()
      this.RequestRewardAd();
      this.RequestInterstitial();
      
  },

  initAppOpenAd() {
    const ad = new admob.AppOpenAd({
      adUnitId: 'ca-app-pub-1346177099717961/4998117529',
      orientation: admob.AppOpenAd.Orientation.Portrait,
      // orientation: admob.AppOpenAd.Orientation.LandscapeLeft,
    })

    document.addEventListener(
      'resume',
      () => {
        const shouldSkip = Date.now() - lastAdTime <= 1000 * 40
        console.log('app resumed', lastAdTime, shouldSkip)
        if (shouldSkip) return;
        ad.isLoaded().then((loaded) => (loaded ? ad.show() : ad.load()))
      },
      false,
    )
  },

  customShowBannerAd() {
    const banner = new admob.BannerAd({
      adUnitId: 'ca-app-pub-1346177099717961/2266096686',
       //position: 'top',
       offset: 0,
       size: {
        // width: int,
        // height: int,
        //widthInPixels: 150,
        //heightInPixels: 50
        maxHeight: 60
      }
      //height: 50
      //maxHeight: 60
    })
    return banner.show()
  },


  showBannerAd() {
    const banner = new admob.BannerAd({
      adUnitId: 'ca-app-pub-1346177099717961/2266096686',
      size: {
        maxHeight: 60
      }
    })
    const unsubscribe = banner.on('load', ({ ad }) => {
      console.log('banner loaded', ad.id)
    })
    setTimeout(() => {
      console.log("unsubscribe banner event")
      unsubscribe()
    }, 60 * 1000)
    return banner.show()
  },

  showBannerAdOffset() {
    const banner = new admob.BannerAd({
      adUnitId: 'ca-app-pub-1346177099717961/2266096686',
      offset: 0,
    })
    return banner.show()
  },

  showBannerAdTop() {
    const banner = new admob.BannerAd({
      adUnitId: 'ca-app-pub-1346177099717961/2266096686',
      position: 'top',
      offset: 0,
      maxHeight: 300
    })
    return banner.show()
  },

  showBannerAdAdaptive() {
    const banner = new admob.BannerAd({
      adUnitId: 'ca-app-pub-1346177099717961/2266096686',
      size: {
        adaptive: "anchored",
        offset: 0,
        
        //width: 720
      }
    })
    return banner.show()
  },

  showBannerAdAdaptiveInline() {
    const banner = new admob.BannerAd({
      adUnitId: 'ca-app-pub-1346177099717961/2266096686',
      position: 'top',
      size: {
        adaptive: "inline",
        //adaptive:'anchored',
        maxHeight: 150,
        //position: 'top'
      }
    })
    return banner.show()
  },


RequestInterstitial()
{
    interstitial = new admob.InterstitialAd({
    adUnitId: 'ca-app-pub-1346177099717961/2074524992',
  })
  interstitial.load()
  cordova.plugins.firebase.analytics.logEvent("ads_request", {interstitial: "interstitial_request"});

},

showInterstitialAd(scene,index) {
    // interstitial = new admob.InterstitialAd({
    //   adUnitId: 'ca-app-pub-1346177099717961/2074524992',
    // })
    
    interstitial.on('dismiss', () => {
    cordova.plugins.firebase.analytics.logEvent("ads_impression", {interstitial: "interstitial_impression"});

      lastAdTime = Date.now()
      this.RequestInterstitial()
      this.data=JSON.parse(localStorage.getItem('data'))      
      switch (GAMEOPTIONS.reward.type) {
        case 'ball':
          eventsCenter.emit('ads-ball',index)
          break;
        case 'pad':
          eventsCenter.emit('ads-pad',index)
          break;
        case 'item1':
          scene.scene.launch('popup_reward')
          break;
        case 'item2':
          scene.scene.launch('popup_reward')
          break;
        case 'item3':
          scene.scene.launch('popup_reward')
          break;
        default:
          break;
      }
    })
    //return interstitial.load().then(() => interstitial.show())
    interstitial.isLoaded().then((loaded) => (loaded ? interstitial.show() : interstitial.load()))
    //return interstitial.show()
  },


  RequestRewardAd()
  {
    rewarded = new admob.RewardedAd({
      adUnitId: 'ca-app-pub-1346177099717961/5822198311',
    })
    rewarded.load()
    cordova.plugins.firebase.analytics.logEvent("ads_request", {rewarded: "rewarded_request"});

  
  },
  // showRewardedAd2(scene,index, txtButton) {
  //   const rewarded = new admob.RewardedAd({
  //     adUnitId: 'ca-app-pub-3940256099942544/5224354917',
  //   })
  //   rewarded.on('dismiss', () => {
  //     lastAdTime = Date.now()
  //   })
  //   return rewarded.load().then(() => rewarded.show())
  // },

  showRewardedAd(scene,index) {
      // rewarded = new admob.RewardedAd({
      //   adUnitId: 'ca-app-pub-1346177099717961/5822198311',
      // })

      rewarded.on('dismiss', () => {
        lastAdTime = Date.now()
        this.RequestRewardAd()
        cordova.plugins.firebase.analytics.logEvent("ads_impression", {rewarded: "rewarded_impression"});

      })
  
      rewarded.on('reward', () => {
      cordova.plugins.firebase.analytics.logEvent("ads_impression", {rewarded: "rewarded_complete"});

        //console.log(GAMEOPTIONS.reward.type)
        switch (GAMEOPTIONS.reward.type) {
          case 'ball':
            eventsCenter.emit('ads-ball',index)
            break;
          case 'pad':
            eventsCenter.emit('ads-pad',index)
            break;
          case 'item1':
            scene.scene.launch('popup_reward')
            break;
          case 'item2':
            scene.scene.launch('popup_reward')
            break;
          case 'item3':
            scene.scene.launch('popup_reward')
            break;

          default:
            break;
        }
        
      })
      // return rewarded.load().then(() => rewarded.show())
    //rewarded.isLoaded().then((loaded) =>(loaded))
    rewarded.isLoaded().then((loaded) => (loaded ? rewarded.show() : interstitial.show()))
  },

  showRewardedInterstitialAd() {
    const rewardedInterstitial = new admob.RewardedInterstitialAd({
      adUnitId: 'ca-app-pub-1346177099717961/5822198311',
    })
    rewardedInterstitial.on('dismiss', () => {
      lastAdTime = Date.now()
    })  
    return rewardedInterstitial.load().then(() => rewardedInterstitial.show())
  },

  showNativeAd() {
    const ad = new admob.NativeAd({
      adUnitId: 'ca-app-pub-3940256099942544/3986624511',
    })

    return ad
      .load()
      .then(() =>
        ad.show({
          x: 0,
          y: 30,
          width: window.screen.width,
          height: 300,
        }),
      )
      .then(
        () =>
          new Promise((resolve) =>
            setTimeout(() => {
              ad.hide()
              resolve()
            }, 5000),
          ),
      )
      .then(() => ad.showWith(document.getElementById('native-ad')))
  },

  receivedEvent(id) {
    const parentElement = document.getElementById(id)
    const listeningElement = parentElement.querySelector('.listening')
    const receivedElement = parentElement.querySelector('.received')

    listeningElement.setAttribute('style', 'display:none;')
    receivedElement.setAttribute('style', 'display:block;')

    console.log(`Received Event: ${id}`)
  },

  // initButton(id, displayAd) {
  //   /**
  //    * @type {HTMLButtonElement}
  //    */
  //   const btn = document.getElementById(id)
  //   btn.addEventListener('click', function () {
  //     btn.disabled = true

  //     displayAd()
  //       .catch(alert)
  //       .then(function () {
  //         btn.disabled = false
  //       })
  //   })
  // },
//  export {showInterstitialAd};
}


app.initialize()
//export {showInterstitialAd};
let rewarded
let interstitial

export function showInterstitialAd1(scene,index){
      app.showInterstitialAd(scene,index);
}

export function showReward1(scene,index, text,){
  app.showRewardedAd(scene,index,text);
  //app.showRewardedAd2(scene,index, text)
}
