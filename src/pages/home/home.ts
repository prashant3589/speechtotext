import { AppModule } from './../../app/app.module';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Observable } from 'rxjs/Observable';
import { ChangeDetectorRef } from '@angular/core';
import { LanguageCode } from '../../models/languagecode';
import { LanguageService } from '../../services/language.service'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  matches: String[];
  isRecording = false;
  match: string;
  savecontent: String;
  language: string;
  languages: Array<LanguageCode> = [];
  languageload = [];
  toggleswitch:boolean=false;
  constructor(public navCtrl: NavController, private speechRecognition: SpeechRecognition, private plt: Platform, private cd: ChangeDetectorRef, private languageService: LanguageService) {
    this.getPermission();
    this.savecontent = ' ';
    this.isRecording = false;
    this.languages = this.languageService.getlanguages();
    this.languages.forEach(element => {
    this.languageload.push({ key: element.LanguageCodes.key, value: element.LanguageCodes.value })
    });
  }

  isIos() {
    return this.plt.is('ios');
  }

  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }

  getPermission() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission();
        }
      });
  }

  startListening() {
    try {
      let options = {
        language: this.language,
        showPopup: false,
        enableWordTimeOffsets: true,
        continuous:true,
        interimResults:true
      }
      this.speechRecognition.startListening(options).subscribe(matches => {
        this.isRecording = true;
        this.matches = matches;
        if (this.matches.length > 0) {
          this.match = matches[0];
          this.isRecording = false;
          this.push();
        }
        else {
          this.match = "";
        }
        this.cd.detectChanges();

      });
    }
    catch (e) {
      this.match = "";     
      console.log(e+'----');
      if (this.speechRecognition.isRecognitionAvailable) {
        this.startListening();
    }

    }
    
  }
  push() {
    if (!this.match) {
      this.match = '';
    }
    this.savecontent = this.savecontent + ' ' + this.match;

    if (this.speechRecognition.isRecognitionAvailable) {
        this.startListening();
    }
  }
  pop() {
    if (this.savecontent.length > 0) {
      var startindex = this.savecontent.indexOf(this.match);
      this.savecontent = this.savecontent.slice(0, startindex);
    }
  }
  save() { } //to do
}

