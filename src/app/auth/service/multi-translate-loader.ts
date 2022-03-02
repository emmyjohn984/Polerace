import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient,
    public resources: { prefix: string, suffix: string }[] = [{
      prefix: '/assets/i18n/',
      suffix: '.json'
    }]) { }

  /**
   * Gets the translations from the server
   * @param lang
   * @returns {any}
   */
  // tslint:disable-next-line:no-any
  public getTranslation(lang: string): any {
    const resourceBatch = [];
    this.resources.forEach(config => {
      resourceBatch.push(this.http.get(`${config.prefix}${lang}${config.suffix}`));
    });

    return forkJoin(resourceBatch).pipe(map(response => {
      return response.reduce((a, b) => {
        return Object.assign(a, b);
      });
    }));
  }
}
