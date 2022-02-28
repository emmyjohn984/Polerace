import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from '../models/languages';
import { ILanguage } from '../models/language';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private languageKey = 'language';
    private languages = AVAILABLE_LANGUAGES;
    private defaultLang: ILanguage = DEFAULT_LANGUAGE;
    public currentLang = this.defaultLang;

    constructor(private translate: TranslateService) { }

    public initTranslations() {
        this.translate.setDefaultLang(this.defaultLang.code);

        const theLanguage = localStorage.getItem(this.languageKey)?localStorage.getItem(this.languageKey):sessionStorage.getItem(this.languageKey);
        if (theLanguage && this.isValidLanguage(theLanguage)) {
            this.translate.use(theLanguage);
            this.currentLang = this.languages.filter(x => x.code === theLanguage)[0];
            this.setBodyLanguageClass(this.getCurrentLangObject().code);
            return;
        }

        let browserLang;
        if (navigator.languages) {
            browserLang = navigator.languages[0];
        } else {
            browserLang = navigator.language;
        }
        const lang = this.getValidLanguage(browserLang);

        this.setLanguage(lang.code, false);
    }

    public getCurrentLang(): string {
        return this.translate.currentLang;
    }

    public getCurrentLangObject(): ILanguage {
        return this.currentLang;
    }

    public setLanguage(code: string, reload = true): void {
        localStorage.removeItem('locations'); // workaround for changing language

        if (this.isValidLanguage(code)) {
            localStorage.setItem(this.languageKey, code);
            this.translate.use(code);
            this.setBodyLanguageClass(this.getCurrentLangObject().code);

            if (reload)
                location.reload();

            return;
        }

        this.translate.use(this.defaultLang.code);
        this.setBodyLanguageClass(this.defaultLang.code);

        if (reload)
            location.reload();
    }

    private isValidLanguage(code: string): boolean {
        return this.languages.some(x => x.code === code);
    }

    private getValidLanguage(code: string): ILanguage {
        const initialCheck = this.languages.filter(x => x.code.toUpperCase() === code.toUpperCase());
        if (initialCheck.length > 0) {
            return initialCheck[0];
        }

        const defaultCheck = this.languages.filter(
            x => x.defaults && x.defaults.some(y => y.toUpperCase() === code.toUpperCase())
        );
        if (defaultCheck.length > 0) {
            return defaultCheck[0];
        }

        const secondCheck = this.languages.filter(
            x => x.code.substring(0, 1).toUpperCase() === code.substring(0, 1).toUpperCase()
        );
        if (secondCheck.length > 0) {
            return secondCheck[0];
        }

        return this.defaultLang;
    }

    private setBodyLanguageClass(code: string) {
        const classList = document.body.classList;
        while (classList.length > 0) {
            classList.remove(classList.item(0));
        }
        document.body.classList.add(code);
    }
}
