import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {
  sub: any;
  OrderId:number;
  loading:boolean = false;
  order:any;

  constructor(private route:ActivatedRoute, private router:Router, private notificationservice:NotificationService,private orderService:OrderService) { }

  ngOnInit(): void {
    this.readQuery();
    if (this.OrderId > 0) {
      this.loading = true;
      this.getOrderById(this.OrderId);
    }
  }

  private readQuery(){
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.OrderId = params['OrderId'];
      });
  }

  getOrderById(OrderId){
    this.orderService.getPurchaseOrdersById(OrderId).subscribe(res=>{
      this.order = res.body.data;
    })
  }

  print(){
    window.print();
  }
  back(){
    this.router.navigateByUrl("orders/order-listing")
  }

}
