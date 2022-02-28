import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'Admin';

  // constructor(
  //   translate: TranslateService
  // ) {
  //   translate.setDefaultLang('en-US');

  //   // the lang to use, if the lang isn't available, it will use the current loader to get them
  //   translate.use('en-US');
  // }

  levelNum: number;
  levels: Array<Object> = [
    { num: 0, name: "AA" },
    { num: 1, name: "BB" }
  ];

  toNumber() {
    this.levelNum = +this.levelNum;
  }

  selectedLevel = this.levels[0];

  selectedLevelCustomCompare = { num: 1, name: "BB" }

  compareFn(a, b) {
    return a && b && a.num == b.num;
  }
}
