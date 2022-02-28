import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit, AfterViewInit{
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
