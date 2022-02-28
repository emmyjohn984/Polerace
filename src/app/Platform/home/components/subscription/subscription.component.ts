import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, AfterViewInit {
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
