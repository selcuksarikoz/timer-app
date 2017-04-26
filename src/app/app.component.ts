import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import {StatusBar, Splashscreen, BackgroundMode} from 'ionic-native';
import {TranslateService} from "ng2-translate";

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(public translate: TranslateService, platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      BackgroundMode.enable();
    });

    let settings1 = window.localStorage.getItem("settings");

    if (!settings1) {
      let data = {
        totalSeconds: 1500,
        extraSeconds: 300,
        attention: 300,
        sound:true,
      }
      window.localStorage.setItem("settings", JSON.stringify(data));
    }

    var settings = {
      "language":"en",
      "push":"false"
    }

    let settingsStorage = JSON.parse(window.localStorage.getItem("language"));

    if (settingsStorage) {
      translate.use(settingsStorage.language);
    } else {

      let language = window.navigator.language.split("-")[0];
      if (language == "en") {
        translate.use('en');
        console.log("varsayılan dil en")
      } else if (language == "tr") {
        translate.use('tr');
        console.log("dil tr")
      } else {
        translate.use('en');
        console.log("bulunamadı en oldu")
      }
      window.localStorage.setItem("language",JSON.stringify(settings));

    }

  }
}
