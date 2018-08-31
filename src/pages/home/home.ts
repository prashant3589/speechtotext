

import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { LanguageCode } from "../../models/LanguageCode";
import { LanguageService } from '../../services/language.service'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

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
  @ViewChild('content') content :ElementRef;
  pdfObj = null;
  constructor(public navCtrl: NavController, private speechRecognition: SpeechRecognition, private plt: Platform, private cd: ChangeDetectorRef, private languageService: LanguageService ,private file: File, private fileOpener: FileOpener) {
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
  save() {
    //let doc= new jspdf();
    //let specialElementHandlers ={
    //  '#editor':function(element,render){return true;}
    //}
    //let content=this.content.nativeElement;
    //doc.fromHTML(content.innerHTML,15,15,{
    //  'width':190,
    //  'elementHandlers':specialElementHandlers
    //});
    //doc.save('notes.pdf');
    //pdfmake

    var docDefinition = {
      content: this.savecontent,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
   }
   this.pdfObj = pdfMake.createPdf(docDefinition);
   this.pdfObj.getBuffer((buffer) => {
    var blob = new Blob([buffer], { type: 'application/pdf' });

    // Save the PDF to the data Directory of our App
    this.file.writeFile(this.file.dataDirectory, 'notes.pdf', blob, { replace: true }).then(fileEntry => {
      // Open the PDf with the correct OS tools
      this.fileOpener.open(this.file.dataDirectory + 'notes.pdf', 'application/pdf');
    })
  });
  }
}

