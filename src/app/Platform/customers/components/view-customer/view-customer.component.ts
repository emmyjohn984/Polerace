import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.scss']
})

export class ViewCustomerComponent implements OnInit {
  customerId:number;
  loading:boolean=true;
  customerData:any;
  constructor(private activateRoute:ActivatedRoute,public customerService:CustomerService,private router:Router) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(res=>{
      this.customerId=res.id
    });
    this.customerService.GetCustomerData(this.customerId).subscribe(res=>{
      this.customerData=res.body.data;
      this.loading=false;
    })
  }



  edit(){
    this.router.navigate(['/customers/addCustomer'], { queryParams: { customerId: this.customerId } });
  }

}
