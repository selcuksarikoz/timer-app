import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {AlertController} from "ionic-angular";
import {BackgroundMode} from "ionic-native";
import {Brightness} from "ionic-native";
import {TranslateService} from "ng2-translate";
import {Insomnia} from "ionic-native";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  title: string;
  totalSeconds: number;
  interval: any;
  isInterval: boolean = false;
  homeLabel: any;
  attentionCounter: number = 0;
  waitBool:boolean = false;
  last5minFinish:boolean = false;
  click:number;
  timeSpeed: number = 50; // Time Speed 1000 normal, 10 fast

  constructor(public platform: Platform, public translate: TranslateService, public navCtrl: NavController, public alertCtrl: AlertController) {

    window.localStorage.setItem("sleep", "enabled");
  
    this.title = "Easy Pomodoro Timer - Stay Focus"

    this.refresh();
    this.click = 0;

    if (this.totalSeconds) {
      let minutes: number = Math.floor((this.totalSeconds % 3600) / 60);
      let seconds: number = (this.totalSeconds % 3600) % 60;

      // this.homeLabel = this.addZero(minutes) + ":" + this.addZero(seconds);
      this.homeLabel = {
        "min":this.addZero(minutes),
        "sec":this.addZero(seconds),
      }
    }
  }

  resetTimer() {
    console.log("resetTimer");
    this.refresh();
  }

  resetTimer5Min(){ 
    console.log("resetTimer5Min");
    this.click = 0;
    this.refresh();
    this.last5minFinish = false;
  }

  
  intervalStart(){
    console.log("intervalStart");  
    BackgroundMode.enable();
    let brightnessValue: number = 1;
    Brightness.setBrightness(brightnessValue);

    this.interval = window.setInterval(()=> {
      this.totalSeconds--;
      this.checkTime(this.totalSeconds);
      // console.log(this.totalSeconds);
 
      let minutes: number = Math.floor((this.totalSeconds % 3600) / 60);
      let seconds: number = (this.totalSeconds % 3600) % 60;
      // this.homeLabel = this.addZero(minutes) + ":" + this.addZero(seconds);
      this.homeLabel = {
        "min":this.addZero(minutes),
        "sec":this.addZero(seconds),
      }
      this.attentionCounter++;

      if (this.totalSeconds == 0) {
        if(this.click == 0) {
          this.homeLabel = {
            done:this.translate.instant("done")
          };
        } else {
          this.homeLabel = {
            work:this.translate.instant("work")
          };
        }
      }

    }, this.timeSpeed)

    this.isInterval = true;
  }

  start() {
    
    // let touch = <HTMLAudioElement>document.getElementById("touch");
    // touch.play();
   

    if (!this.isInterval) {
      console.log("Start başladı")

      let sleepMode = window.localStorage.getItem("sleep");

      if (sleepMode == "enabled") {
        console.log("ekran acık")
        Insomnia.keepAwake()
          .then(
            () => console.log('success'),
            (error) => alert(error)
          );
      }



      if (this.totalSeconds > 0) {

        this.intervalStart();
        this.waitBool = false;
        this.last5minFinish = false;
        console.log("Total second 0 dan büyük");
        

      } else if (this.totalSeconds == 0) {

        console.log("Total second 0");

        let settings = JSON.parse(window.localStorage.getItem("settings"));
        
         if(this.platform.is('android')) {

            let confirm = this.alertCtrl.create({
              title: this.translate.instant("additionalTime"),
              message: this.translate.instant("additionalTimeQuest"),
              buttons: [
                {
                  text: this.translate.instant("no"),
                  handler: () => {
                    this.refresh();
                  }
                },
                {
                  text: this.translate.instant("yes"),
                  handler: () => {
                    this.totalSeconds = settings.extraSeconds;
                    this.intervalStart();
                  }
                }
              ]
            });

            confirm.present();    

         } else {
           if(this.click == 0) {
             this.totalSeconds = settings.extraSeconds;
             this.click += 1;
             console.log(this.click);

             console.log("!!!!!Burada Son 5 dk ya başladı!!!!!!");
             this.waitBool = false; // reset butonunu gizliyoruz.
             this.last5minFinish = false; // last 5 min i açıyoruz.

             this.intervalStart();
           } else {
             this.click = 0;
             this.refresh();
           }
         }


      } else {

        console.log("süre 0");
        this.isInterval = true;

      }
    } else {
      console.log("başlamıştı duraklatıldı");
      window.clearInterval(this.interval);
      this.isInterval = false;
      this.waitBool = true;

      if (this.click > 0 ) {
        this.last5minFinish = true;
        this.waitBool = false;
      }

    }
  }

  checkTime(param: any) {
    let audio = <HTMLAudioElement>document.getElementById("beepaudio");
    // let endaudio = <HTMLAudioElement>document.getElementById("endaudio");
    // let endaudio2 = <HTMLAudioElement>document.getElementById("endaudio2");
    // let first25 = <HTMLAudioElement>document.getElementById("first25");
    let settings = JSON.parse(window.localStorage.getItem("settings"));
    
    if (param == 0) {
      window.clearInterval(this.interval);
      console.log("timer bitti");
      this.isInterval = false;
      
      if(this.click == 0 ) {
            console.log("audio");
            // endaudio.play();
          } else {
            console.log("audio2");
            // endaudio2.play();
      }

      BackgroundMode.disable();
      let brightnessValue: number = 0.3;
      Brightness.setBrightness(brightnessValue);
    } else if (param == 300) {
      if(this.platform.is('android')) {
        console.log("son 5 dakika kaldı")
        // audio.play();
      }
    }

    if (this.attentionCounter == settings.attention) {
      if(this.platform.is('android')) {
        console.log("uyarı sesi");
        console.log(this.attentionCounter ,settings.attention);
        this.attentionCounter = 0;
        if (settings.sound == "true") {
          audio.play();
        }
      }
    }

  }

  addZero(param) {
    return (param < 10 ? '0' : '') + param;
  }

  ionViewWillEnter() {
    let settings = JSON.parse(window.localStorage.getItem("settings"));
    if (this.totalSeconds !== settings.totalSeconds) {      
      this.totalSeconds = settings.totalSeconds;
      if (settings) {
        let minutes: number = Math.floor((settings.totalSeconds % 3600) / 60);
        let seconds: number = (settings.totalSeconds % 3600) % 60;

        // this.homeLabel = this.addZero(minutes) + ":" + this.addZero(seconds);
        this.homeLabel = {
          "min":this.addZero(minutes),
          "sec":this.addZero(seconds),
        }
      }
    } else {
      console.log("timer başlamış daha sonra");
    }
  }

  settingsPage() {
    this.navCtrl.push(SettingsPage, {});
  }

  refresh() {
    this.isInterval = false;
    window.clearInterval(this.interval);
    this.waitBool = false;
    let settings = JSON.parse(window.localStorage.getItem("settings"));
    this.totalSeconds = settings.totalSeconds;
    this.attentionCounter = 0;
    let minutes: number = Math.floor((settings.totalSeconds % 3600) / 60);
    let seconds: number = (settings.totalSeconds % 3600) % 60;
    // this.homeLabel = this.addZero(minutes) + ":" + this.addZero(seconds);
    this.homeLabel = {
      "min":this.addZero(minutes),
      "sec":this.addZero(seconds),
    }
    // this.start();
  }




}
