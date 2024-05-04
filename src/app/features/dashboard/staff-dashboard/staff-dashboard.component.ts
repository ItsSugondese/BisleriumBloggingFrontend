import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonVariable } from '@shared/helper/inherit/common-variable';
import { Observable, Subscription } from 'rxjs';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { ManagementRouteConstant } from 'src/app/constant/routing/management-routing-constant.model';
import { ManageOrdersNavbarService, OrderNav } from '../../management/manage-orders/manage-orders-navbar/manage-orders-navbar-service/manage-orders-navbar.service';
import { ManageUsersService } from '../../management/people-management/manage-user-body/manage-users/manage-users-service/manage-users.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FoodMenuData, FoodMenuDataPayload } from '../dashboard-service/model/food-menu-data.model';
import { OrderData, OrderDataPayload, SumData } from '../dashboard-service/model/order-data.model';
import { RevenueData, RevenueDataPayload } from '../dashboard-service/model/revenue-data.model';
import { UsersData, UsersDataPayload } from '../dashboard-service/model/user-data.model';
import { UserManagementPaymentService } from '../../management/people-management/user-management-payment/user-management-payment-service/user-management-payment.service';
import { Blog, BlogPagination, BlogReactionPayload } from '../../blog-inspect/blog-service/model/blog.model';
import { BlogService } from '../../blog-inspect/blog-service/blog.service';
import { UserProfileService } from '@shared/service/user-profile-service/user-profile.service';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.scss']
})
export class StaffDashboardComponent 

extends CommonVariable implements OnInit, OnDestroy {

  fromDate !: string 
  toDate !: string
  revenueDataSubscription$ !: Observable<ResponseData<SumData>>
  revenueDataPayload : RevenueDataPayload = {}

  isChecked: boolean = true;
  blogPagination !: BlogPagination
  blogFetch$ !: Subscription

  reactionPayload !: BlogReactionPayload
  blogListPaginated !: PaginatedData<Blog>
  imageDataMap: { [key: string]: string } = {};
  getUserPicture$ !: Subscription

  load = true


  constructor(private dashboardService: DashboardService,
    public blogService: BlogService, public userService: UserProfileService
  ) {
    super()
  }


  ngOnInit() {
    this.revenueDataPayload = {
      isAll: this.isChecked
    }

    this.blogPagination = {
      page: 1,
      row: 10,
sort: "POPULAR",
      name:  '',
      isAll: this.isChecked
    }
  
    this.fetchApi()
    
  }

  onCheckboxChange() {
    this.revenueDataPayload.isAll = this.isChecked
    this.blogPagination.isAll = this.isChecked
    this.fetchApi()
  }
  onTableDataChange(event: any) {
    this.blogPagination.page = event
    
    this.fetchApi();
  }
 
  
  fetchApi(){

    this.revenueDataSubscription$ = this.dashboardService.getSumData(this.revenueDataPayload);
    this.getBlog()
  }

  getBlog(){
    this.load = true;
    this.blogFetch$ = this.blogService.getBlogPaginated(this.blogPagination).subscribe(
      (response ) => {
        
        this.blogListPaginated = response.data;
          this.load = false

        this.blogListPaginated.content.forEach((menu) => {
          if(menu.userProfile){
            this.getUserPicture$ = this.userService.getUserPicture(menu.userId).subscribe((imageBlob: Blob) => {


            this.createImageFromBlob(imageBlob, menu.id)
             .then((imageData) => {
              this.imageDataMap[menu.userId] = imageData;
              
          })
          .catch((error) => {
              console.log("error when trying to access")
          });
          });
        }
        }); 
      }
    )
  }
 

  onRangeSelect(event: Date[]) {
    
    const fromDate = event[0];
    const toDate = event[event.length - 1];

    this.dateToStringAndPayloadSet(fromDate, toDate)
    if(!this.isChecked){
      this.fetchApi()
    }
}

dateToStringAndPayloadSet(fromDate : Date, toDate: Date){
  const fromDateString = fromDate.getFullYear() + '-' + ('0' + (fromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + fromDate.getDate()).slice(-2);
    const toDateString = toDate.getFullYear() + '-' + ('0' + (toDate.getMonth() + 1)).slice(-2) + '-' + ('0' + toDate.getDate()).slice(-2);

    this.fromDate = fromDateString
    this.toDate =toDateString
    const payloadData = { fromDate: fromDateString, toDate: toDateString };
    this.revenueDataPayload  = {...payloadData}
    this.blogPagination.fromDate = fromDateString
    this.blogPagination.toDate = toDateString

}
  


  ngOnDestroy(): void {
    if(this.getUserPicture$){
      this.getUserPicture$.unsubscribe()
    }
    if(this.blogFetch$){
      this.blogFetch$.unsubscribe()
    }
  }



}
