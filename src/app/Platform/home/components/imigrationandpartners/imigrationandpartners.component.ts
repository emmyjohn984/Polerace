import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-imigrationandpartners',
  templateUrl: './imigrationandpartners.component.html',
  styleUrls: ['./imigrationandpartners.component.scss']
})
export class ImigrationandpartnersComponent implements OnInit , AfterViewInit{

  loading:boolean = true;
  showScroll: boolean=true;
  constructor() { }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.loading=false;
    },500)
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {

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
