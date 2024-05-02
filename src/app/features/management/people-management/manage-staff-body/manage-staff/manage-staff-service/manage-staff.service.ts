import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {manageStaffPagination } from './model/manage-staff-payload.model';
import { ServiceCommonVariable } from '@shared/helper/inherit/common-variable-serivce';
import { catchError, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageStaffService extends ServiceCommonVariable {

  backendUrl = environment.apiUrl;
  moduleName :string = "user";
  pictureLoading = false
  isInspecting : boolean = false;

  constructor(private httpClient : HttpClient) {
    super()
   }

  postImage(data : FormData){
    this.pictureLoading = true
    return this.httpClient.post<any>(this.backendUrl + "temporary-attachments",data)
    .pipe(
      this.handleError()
    );
  }

  postStaffData(data : { [key: string]: any }){
    return this.httpClient.post<any>(this.backendUrl + this.moduleName, data);
  }

  getData(paginationRequest : manageStaffPagination){
    return this.httpClient.post<any>(this.backendUrl + this.moduleName + "/paginated", paginationRequest);
 }
 getSingleStaff(id : number){
   return this.httpClient.get<any>(this.backendUrl +  "user/" + id);
  }
  
  getStaffPicture(id: number) {
    this.pictureLoading = true
    return this.httpClient.get(this.backendUrl + this.moduleName +'/photo/' + id, { responseType: 'blob' })
    .pipe(
      catchError(error => {
        this.pictureLoading = false;
        throw error;
      }),
      finalize(() => this.pictureLoading = false)
    );
  }
  getUserPicture(id: string) {
    this.pictureLoading = true
    return this.httpClient.get(this.backendUrl + this.moduleName +'/photo/' + id, { responseType: 'blob' })
    .pipe(
      catchError(error => {
        this.pictureLoading = false;
        throw error;
      }),
      finalize(() => this.pictureLoading = false)
    );
  }
  
  
}
