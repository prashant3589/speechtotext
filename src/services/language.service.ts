import { LanguageCode } from "./../Models/LanguageCode";
import { Platform } from 'ionic-angular';
export class LanguageService {
    public languageCode: LanguageCode;
    public languageCodes: Array<LanguageCode> = [];
    rawObject = [];
    initial: number = 0;
    constructor() {
       this
        this.rawObject = [{ key: 'English', value: 'en-US' }, { key: 'German', value: 'de' }, { key: 'Swedish', value: 'sv' }, { key: 'Marathi', value: 'mr-IN' }]
    }
    getlanguages():Array<LanguageCode> {
        this.rawObject.forEach(element => {
            this.languageCode=new LanguageCode();
            this.languageCode.LanguageCodes = { key: this.rawObject[this.initial].key, value: this.rawObject[this.initial].value }
            this.languageCodes.push(this.languageCode);
            this.initial++;
        });
        return this.languageCodes;
    }
}