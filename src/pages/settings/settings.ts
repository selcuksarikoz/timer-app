import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {TranslateService} from "ng2-translate";
import { Insomnia } from '@ionic-native/insomnia';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  title:string;
  totalSeconds:any;
  extraSeconds:any;
  attention:any;
  language:any;
  sleepMode:string;
  attentionSound:boolean;

  constructor(public translate:TranslateService, public navCtrl: NavController, private insomnia: Insomnia) {

    let settings = JSON.parse(window.localStorage.getItem("settings"));
    let sleep = window.localStorage.getItem("sleep");
    let lang = JSON.parse(window.localStorage.getItem("language"));
    console.log(sleep)

    this.totalSeconds = Math.floor(settings.totalSeconds / 60);
    this.extraSeconds = Math.floor(settings.extraSeconds / 60);
    this.attention  = Math.floor(settings.attention / 60);
    this.language = lang.language
    this.sleepMode = sleep,
    this.attentionSound = settings.sound;
  }

  ionViewDidLoad() {
    console.log('Hello SettingsPage Page');
    this.title = "Settings"
  }

  customize(param:any,type:number){
    let settings = JSON.parse(window.localStorage.getItem("settings"));
    let lang = JSON.parse(window.localStorage.getItem("language"));
    if (type == 1) {
      settings.totalSeconds = param * 60;
    }
    if (type == 2) {
      settings.extraSeconds = param * 60;
    }
    if (type == 3) {
      settings.attention  = param * 60;
    }
    if (type == 4) {
      lang.language = param;
      window.localStorage.setItem("language",JSON.stringify(lang));
      this.translate.use(param);
      this.translate.get("language").subscribe((da)=>{
        this.title = da;
      })
    }
    if (type == 5) {

      if (param == "disabled") {
        this.insomnia.allowSleepAgain()
          .then(
            () => console.log('success'),
            (error) => alert(error)
          );
      }
      this.sleepMode = param;
      window.localStorage.setItem("sleep",param);
    }
    if (type == 6) {
      settings.sound = param;
    }
    window.localStorage.setItem("settings",JSON.stringify(settings));
  }

}
