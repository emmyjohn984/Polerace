import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productandfeatures',
  templateUrl: './productandfeatures.component.html',
  styleUrls: ['./productandfeatures.component.scss']
})
export class ProductandfeaturesComponent implements OnInit, AfterViewInit {

  loading:boolean = true;
  showScroll: boolean=true;
  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.loading=false;
    },500)
    throw new Error('Method not implemented.');
  }
  scrollToTop() {
    (function smoothscroll() {
      const currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 5);
      }
    })();

  }

}
