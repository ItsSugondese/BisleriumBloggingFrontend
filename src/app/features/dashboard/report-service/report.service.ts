import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { environment } from 'src/environments/environment';
import { FoodMenuDataPayload, FoodMenuData } from '../dashboard-service/model/food-menu-data.model';
import { OrderDataPayload, OrderData } from '../dashboard-service/model/order-data.model';
import { RevenueDataPayload, RevenueData } from '../dashboard-service/model/revenue-data.model';
import { SalesDataPayload, SalesData } from '../dashboard-service/model/sales-data.model';
import { TableDataPayload, TableData } from '../dashboard-service/model/table-data.model';
import { UsersDataPayload, UsersData } from '../dashboard-service/model/user-data.model';
import { UserFinancePaginationPayload } from '../dashboard-service/model/user-finance-data.model';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  moduleName = "report"
  backendUrl = environment.apiUrl
  constructor(private httpClient: HttpClient) { 
  }

  getSalesData(payload: SalesDataPayload){
    return this.httpClient.post(`${this.backendUrl}${this.moduleName}/sales`,  payload, {
      responseType: 'blob' // Set responseType to 'blob' to handle binary data
    })
  }
 
  getRevenueData(payload: RevenueDataPayload){
    return this.httpClient.post(`${this.backendUrl}${this.moduleName}/revenue`, payload, {
      responseType: 'blob' // Set responseType to 'blob' to handle binary data
    })
  }

  getFinanceData(paginationRequest : UserFinancePaginationPayload){
     return this.httpClient.post(`${this.backendUrl}${this.moduleName}/finance`, paginationRequest, {
      responseType: 'blob' // Set responseType to 'blob' to handle binary data
    });
  }

}
