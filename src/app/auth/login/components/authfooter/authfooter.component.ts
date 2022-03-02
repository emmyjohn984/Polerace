import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authfooter',
  templateUrl: './authfooter.component.html',
  styleUrls: ['./authfooter.component.scss']
})
export class AuthfooterComponent implements OnInit, AfterViewInit {

  loading:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  //   setTimeout(()=>{
  //     this.loading=false;
  //   },500)
    // throw new Error('Method not implemented.');
  }
}
