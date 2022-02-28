import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-copy-right',
  templateUrl: './copy-right.component.html',
  styleUrls: ['./copy-right.component.scss']
})
export class CopyRightComponent implements OnInit, AfterViewInit {
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
