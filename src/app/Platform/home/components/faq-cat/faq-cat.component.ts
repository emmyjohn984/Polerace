import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq-cat',
  templateUrl: './faq-cat.component.html',
  styleUrls: ['./faq-cat.component.scss']
})
export class FaqCatComponent implements OnInit, AfterViewInit {
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
