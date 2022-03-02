import { Component, OnInit, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-authheader',
  templateUrl: './authheader.component.html',
  styleUrls: ['./authheader.component.scss']
})
export class AuthheaderComponent implements OnInit{

  loading:boolean = true;
  constructor() { }

  ngOnInit(): void {
  }


}
