import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MarketplacesService } from '../../services/marketplaces.service';

@Component({
  selector: 'app-marketplace-listing',
  templateUrl: './marketplace-listing.component.html',
  styleUrls: ['./marketplace-listing.component.scss']
})
export class MarketplaceListingComponent implements OnInit {
  loading: boolean = false;
  userData: any;
  dataSource: any;
  deleteId:number;
  marketplaces:any;
  constructor(private Service: MarketplacesService,private notificationService:NotificationService, private router:Router) { }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser')? localStorage.getItem('currentUser'): sessionStorage.getItem('currentUser'))
    this.getAllUserMarketPlace();
  }
  getAllUserMarketPlace() {
    this.loading = true;
    this.Service.getAllUserMarketPlace().subscribe(res => {
      if(res.body.data != null){
        this.marketplaces = res.body.data;
        this.dataSource = this.marketplaces;
      }else{
        this.notificationService.Info(res.body.data);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
    this.loading=false;
  }

  showId(userMarketplaceId:number){
    this.deleteId = userMarketplaceId;
  }


  deleteMarketPlace(userMarketplaceId){
    this.Service.deleteUserMarketplace(userMarketplaceId).subscribe(response=>{
      if (response.body.status == 200) {
        this.getAllUserMarketPlace();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      console.log('this.error', error);
      this.notificationService.Error(error.message);
    });
  }

  edit(userMarketplaceId){
    this.router.navigate(['/marketplaces/add-marketplace'], { queryParams: { userMarketplaceId: userMarketplaceId } });
  }


}
