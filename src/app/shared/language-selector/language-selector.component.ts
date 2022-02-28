import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { ILanguage } from '../models/language';
import { AVAILABLE_LANGUAGES } from '../models/languages';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  currentLang: ILanguage;
  languageCode: string;
  languages: ILanguage[] = AVAILABLE_LANGUAGES;

  constructor(private languageService: LanguageService) {
    this.languageService.initTranslations();
    this.currentLang = this.languageService.currentLang;
    this.languages = AVAILABLE_LANGUAGES;
    this.languageCode = this.currentLang.code;
  }

  ngOnInit(): void { }

  onChangeLanguage(code: string, rtl?: boolean): void {
    this.languageService.setLanguage(code);
    this.currentLang = this.languageService.currentLang;
    this.languageCode = this.currentLang.code;
  }

  onChangeCode(code: string): void {
    const lang = this.languages.filter(x => x.code === code)[0];

    if (lang) {
      this.languageService.setLanguage(code);
      this.currentLang = lang;
    }
  }
}
