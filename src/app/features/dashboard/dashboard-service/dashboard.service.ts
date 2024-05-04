import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { environment } from 'src/environments/environment';
import { SalesData, SalesDataPayload } from './model/sales-data.model';
import { UsersDataPayload, UsersData } from './model/user-data.model';
import { OrderData, OrderDataPayload, SumData } from './model/order-data.model';
import { RevenueData, RevenueDataPayload } from './model/revenue-data.model';
import { FoodMenuData, FoodMenuDataPayload } from './model/food-menu-data.model';
import { TableData, TableDataPayload } from './model/table-data.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  moduleName = "dashboard"
  backendUrl = environment.apiUrl
  constructor(private httpClient: HttpClient) { 
  }

  getSalesData(payload: SalesDataPayload){
    return this.httpClient.post<ResponseData<SalesData>>(`${this.backendUrl}admin/${this.moduleName}/sales-data`, payload)
  }
  getTableData(payload: TableDataPayload){
    return this.httpClient.post<ResponseData<TableData>>(`${this.backendUrl}admin/${this.moduleName}/table-data`, payload)
  }

  getUsersData(payload: UsersDataPayload){
    return this.httpClient.post<ResponseData<UsersData>>(`${this.backendUrl}admin/${this.moduleName}/users-data`, payload)
  }
  getOrderData(payload: OrderDataPayload){
    return this.httpClient.post<ResponseData<OrderData>>(`${this.backendUrl}admin/${this.moduleName}/order-data`, payload)
  }
  getRevenueData(payload: RevenueDataPayload){
    return this.httpClient.post<ResponseData<RevenueData>>(`${this.backendUrl}admin/${this.moduleName}/revenue-data`, payload)
  }
  getSumData(payload: RevenueDataPayload){
    return this.httpClient.post<ResponseData<SumData>>(`${this.backendUrl}${this.moduleName}/sum-data`, payload)
  }
  getFoodMenuData(payload: FoodMenuDataPayload){
    return this.httpClient.post<ResponseData<FoodMenuData>>(`${this.backendUrl}admin/${this.moduleName}/food-menu-data`, payload)
  }
}
