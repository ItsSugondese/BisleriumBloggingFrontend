import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonVariable } from '@shared/helper/inherit/common-variable';
import { Observable, Subscription, from } from 'rxjs';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { ManagementRouteConstant } from 'src/app/constant/routing/management-routing-constant.model';
import { DashboardService } from '../dashboard/dashboard-service/dashboard.service';
import { FoodMenuData, FoodMenuDataPayload } from '../dashboard/dashboard-service/model/food-menu-data.model';
import { OrderData, OrderDataPayload } from '../dashboard/dashboard-service/model/order-data.model';
import { RevenueData, RevenueDataPayload } from '../dashboard/dashboard-service/model/revenue-data.model';
import { UsersData, UsersDataPayload } from '../dashboard/dashboard-service/model/user-data.model';
import { ManageOrdersNavbarService, OrderNav } from '../management/manage-orders/manage-orders-navbar/manage-orders-navbar-service/manage-orders-navbar.service';
import { ManageUsersService } from '../management/people-management/manage-user-body/manage-users/manage-users-service/manage-users.service';
import { CalenderType } from 'src/app/templates/calender/calender.template.componenet';
import { TableData, TableDataPayload } from '../dashboard/dashboard-service/model/table-data.model';
import { setDate } from 'ngx-bootstrap/chronos/utils/date-setters';
import { UserFinanceData, UserFinancePaginationPayload } from '../dashboard/dashboard-service/model/user-finance-data.model';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { ReportService } from '../dashboard/report-service/report.service';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent extends CommonVariable implements OnInit, OnDestroy {
  rangeDates : Date[] = [

  ]

  revenueData !: RevenueData
  userData !: UsersData

  // usersDataSubscription$ !: Observable<ResponseData<UsersData>>
  orderDataSubscription$ !: Observable<ResponseData<OrderData>>
  // revenueDataSubscription$ !: Observable<ResponseData<RevenueData>>
  revenueDataSubscription$ !: Subscription
  revenueDataDownloadSubscription$ !: Subscription
  usersDataSubscription$ !: Subscription

  foodMenuDataSubscription$ !: Observable<ResponseData<FoodMenuData>>
  tableDataSubscription$ !: Observable<ResponseData<TableData>>

  userDataPayload : UsersDataPayload = {}
  revenueDataPayload : RevenueDataPayload = {}
  foodMenuDataPayload : FoodMenuDataPayload = {}
  tableDataPayload : TableDataPayload = {}

  orderDataPayload !: OrderDataPayload

  fromDate !: string 
  toDate !: string

  userDataSubscription$ !: Subscription
  financeDataPayload !: UserFinancePaginationPayload 
  users !: PaginatedData<UserFinanceData>;
  load: boolean = true;

  
  constructor(private dashboardService: DashboardService, public orderService: ManageOrdersNavbarService,
    private orderNavService: ManageOrdersNavbarService, private router: Router, private userService: ManageUsersService,
  private reportService: ReportService) {
    super()
  }


  ngOnInit() {
    this.fetchData()

  }

  onTableDataChange(event: any) {
    this.financeDataPayload.page = event
    this.fetchData();
  }
 

  typedUserToFilter(event: string){
      if(event.trim() != ''){
        this.financeDataPayload.name = event
      }else{
        this.financeDataPayload.name = undefined
      }
      this.fetchData()
    }

fetchData(){
  this.financeDataPayload = {
    row : 4,
    page: 1,
    fromDate: this.fromDate,
    toDate : this.toDate,
  }
this.userDataSubscription$ = this.userService.getFinanceData(this.financeDataPayload).subscribe(
  (res) => {
    this.users = res.data
    this.load = false
  }
)
}

  fetchApi(){
    // this.usersDataSubscription$ = this.dashboardService.getUsersData(this.userDataPayload);
  this.orderDataSubscription$ = this.dashboardService.getOrderData(this.orderDataPayload);
  this.foodMenuDataSubscription$ = this.dashboardService.getFoodMenuData(this.foodMenuDataPayload);
  this.tableDataSubscription$ = this.dashboardService.getTableData(this.tableDataPayload);
  this.revenueDataSubscription$ = this.dashboardService.getRevenueData(this.revenueDataPayload).subscribe(
    (res) => {
      this.revenueData = res.data
      this.revenueDataSubscription$.unsubscribe()
    }
  )
  this.usersDataSubscription$ = this.dashboardService.getUsersData(this.userDataPayload).subscribe(
    (res) => {
      this.userData = res.data
    }
  );
  this.fetchData()
  }

  onRangeSelect(event: Date[]) {
    
      const fromDate = event[0];
      const toDate = event[event.length - 1];

      this.dateToStringAndPayloadSet(fromDate, toDate)
      this.fetchApi()
     
  }

  dateToStringAndPayloadSet(fromDate : Date, toDate: Date){
    const fromDateString = fromDate.getFullYear() + '-' + ('0' + (fromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + fromDate.getDate()).slice(-2);
      const toDateString = toDate.getFullYear() + '-' + ('0' + (toDate.getMonth() + 1)).slice(-2) + '-' + ('0' + toDate.getDate()).slice(-2);

      this.fromDate = fromDateString
      this.toDate =toDateString
      const payloadData = { fromDate: fromDateString, toDate: toDateString };
      this.userDataPayload = {...payloadData}
      this.revenueDataPayload  = {...payloadData}
  this.foodMenuDataPayload  = {...payloadData}
  this.tableDataPayload = {...payloadData}
  this.orderDataPayload = {...payloadData, timeDifference: this.orderService.timeDifference}

  }

  goToManageOrder(selected : string){
    if(selected.toUpperCase() == "ONLINE".toUpperCase()){
    this.orderNavService.selectedNavbar = OrderNav.ONLINE
  }else{
      this.orderNavService.selectedNavbar = OrderNav.ONSITE
    }
    this.router.navigate(['/' + ManagementRouteConstant.orderManagement]);
  }
  
  navigateToFoodMenu(){
    this.router.navigate(['/' + ManagementRouteConstant.foodManagement]);
  }

  navigateToStaffManagement(){
    this.router.navigate(['/' + ManagementRouteConstant.staffManagement]);
  }

  navigateToUserManagement(val?: string){

    if(val != undefined){
    if(val.toUpperCase() == 'INTERNAL'.toUpperCase()){
      this.userService.selectedOption = 'INTERNAL'
    }else if(val.toUpperCase() == 'ALL'.toUpperCase()){
      this.userService.selectedOption = 'ALL'
    }else{
    this.userService.selectedOption = 'EXTERNAL_USER'
    }
  }
  }

  downloadRevenue(){
    this.revenueDataDownloadSubscription$ = this.reportService.getRevenueData(this.revenueDataPayload).subscribe(
      (res : any) => {
        this.revenueDataDownloadSubscription$.unsubscribe()
        const blob = new Blob([res], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'revenue_data.xlsx'; // Set your desired file name here
        link.click();
      }
    )
  }
  
  downloadFinance(){
    this.revenueDataDownloadSubscription$ = this.reportService.getFinanceData(this.financeDataPayload).subscribe(
      (res : any) => {
        this.revenueDataDownloadSubscription$.unsubscribe()
        const blob = new Blob([res], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'user_expense.xlsx'; // Set your desired file name here
        link.click();
      }
    )
  }


  ngOnDestroy(): void {
    if(this.revenueDataSubscription$){
      this.revenueDataSubscription$.unsubscribe()
    }
    if(this.revenueDataDownloadSubscription$){
      this.revenueDataDownloadSubscription$.unsubscribe()
    }
  }

}

