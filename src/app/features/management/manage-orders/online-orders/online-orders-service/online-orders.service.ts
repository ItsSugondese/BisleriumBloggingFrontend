import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SummaryPayload, onlineOrderPagination } from './model/online-orders-payload.model';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { SummaryData, onlineOrder } from './model/online-order-interface';
import { ServiceCommonVariable } from '@shared/helper/inherit/common-variable-serivce';
import { onlineOrderPayload } from 'src/app/payload.interface';
import { catchError, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnlineOrdersService extends ServiceCommonVariable {
  backendUrl = environment.apiUrl;
  moduleName = "online-order"

  postOnlineLoader: boolean = false;
  summaryLoader = false

  constructor(private httpClient : HttpClient) {
    super()
   }

  getData(paginationRequest : onlineOrderPagination){
    this.loading = true
     return this.httpClient.post<ResponseData<PaginatedData<onlineOrder>>>(this.backendUrl + "online-order/paginated", paginationRequest)
     .pipe(
      this.handleError()
     );
  }

  postOnlineOrder(onlineOrderPayload : onlineOrderPayload){
    this.postOnlineLoader = true
    return this.httpClient.post<ResponseData<onlineOrder>>(this.backendUrl + "online-order", onlineOrderPayload)
    .pipe(
      catchError(error => {
        this.postOnlineLoader = false;
        throw error;
      }),
      finalize(() => this.postOnlineLoader = false)
    );
   }


  makeOnsite(id: number){
    this.postOnlineLoader = true
    return this.httpClient.get<ResponseData<null>>(`${this.backendUrl}${this.moduleName}/make-onsite/${id}/dfasdf`)
    .pipe(
      catchError(error => {
        this.postOnlineLoader = false;
        throw error;
      }),
      finalize(() => this.postOnlineLoader = false)
    );
   }

  summarize(payload: SummaryPayload){
    this.summaryLoader = true
    return this.httpClient.get<ResponseData<SummaryData[]>>(`${this.backendUrl}${this.moduleName}/summary/${payload.fromTime}/${payload.toTime}`)
    .pipe(
      catchError(error => {
        throw error;
      }),
      finalize(() => this.summaryLoader = false)
    );
   }

   deleteOrderFoodById(id: number){
    return this.httpClient.delete<ResponseData<null>>(`${this.backendUrl}${this.moduleName}/order-food/${id}`)
   }


}
