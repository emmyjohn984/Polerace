import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit, AfterViewInit {
  loading:boolean = true;
  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.loading=false;
    },500)
    throw new Error('Method not implemented.');
  }
}
