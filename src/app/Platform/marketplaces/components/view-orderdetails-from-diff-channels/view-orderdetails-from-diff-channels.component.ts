import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MarketplacesService } from '../../services/marketplaces.service';

@Component({
  selector: 'app-view-orderdetails-from-diff-channels',
  templateUrl: './view-orderdetails-from-diff-channels.component.html',
  styleUrls: ['./view-orderdetails-from-diff-channels.component.scss']
})
export class ViewOrderdetailsFromDiffChannelsComponent implements OnInit {
  orderId:number;
  loading:boolean = true;
  sub : any;
  order:any;
  globalmarketplaceID:number
  constructor( private route:ActivatedRoute, private router:Router, private notificationservice:NotificationService, private marketplaceService:MarketplacesService ) { }

  ngOnInit(): void {
    this.readQuery();
    if (this.orderId > 0 && this.globalmarketplaceID > 0) {
      this.loading = true;
      this.getOrderDetailsFromChannel(this.globalmarketplaceID,this.orderId);
    }
  }

  private readQuery(){
    this.sub = this.route.queryParams.subscribe(params => {
        this.orderId = params['orderId'];
        this.globalmarketplaceID = params['globalMarketplaceId'];
      });
  }

  getOrderDetailsFromChannel(globalmarketplaceID,orderId){
    this.marketplaceService.getOrderDetailsFromDiffrentChannel(globalmarketplaceID,orderId).subscribe(res=>{
      this.order = res.body.data;
      this.loading=false;
    })
  }

  back(){
    this.router.navigate(['/marketplaces/manageordersfromglobalmarketplaces']);
  }

  print(){
    window.print();
  }

}
