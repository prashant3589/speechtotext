import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Observable } from 'rxjs/Observable';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  matches: String[];
  isRecording = false;
  match: string;
  savecontent :String;
  constructor(public navCtrl: NavController, private speechRecognition: SpeechRecognition, private plt: Platform, private cd: ChangeDetectorRef) {
    this.getPermission();
    this.savecontent=' ';    
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
    let options = {
      language: 'en-US'
    }
    this.speechRecognition.startListening().subscribe(matches => {

      this.matches = matches;
      if (this.matches.length > 0) {
        this.match = matches[0];
      }
      else {
        this.match = "";
      }
      this.cd.detectChanges();
    });
    this.isRecording = true;

  }
  push()
  {
  if(!this.match)
  {
    this.match='';
  }
    this.savecontent=this.savecontent+this.match;
  }
  pop()
  {
    if(this.savecontent.length>0)
    {
      var startindex=this.savecontent.indexOf(this.match);
    console.log(startindex);
    console.log(this.match);
      
    this.savecontent=this.savecontent.slice(0,startindex);
    }
  }
  save()
  {}

}