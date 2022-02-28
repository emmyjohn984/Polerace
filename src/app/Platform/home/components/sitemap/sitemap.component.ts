import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit , AfterViewInit{
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
