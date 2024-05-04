import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceCommonVariable } from '@shared/helper/inherit/common-variable-serivce';
import { EnumItem } from '@shared/model/enums/MapForEnum.model';
import { catchError, finalize } from 'rxjs';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { manageUserPagination } from 'src/app/features/management/people-management/manage-user-body/manage-users/manage-users-service/model/maange-users-payload.model';
import { User, UserPaginationPayload, UserPayload } from 'src/app/features/management/people-management/manage-user-body/manage-users/manage-users-service/model/user.model';
import { environment } from 'src/environments/environment';

export enum UserFilter{
  ALL = "All",
  ADMIN = "Admin",
  BLOGGER = "Blogger",
}



@Injectable({
  providedIn: 'root'
})
export class UserProfileService extends ServiceCommonVariable {

  moduleName =  "user"
  backendUrl = environment.apiUrl
  imageMap !: string | null
  pictureLoading = false

  options: EnumItem[] = this.enumToEnumItems(UserFilter)
   selectedOption = Object.keys(UserFilter)[0]
  
  constructor(private httpClient: HttpClient) { 
    super()
  }


  getUserData(paginationRequest : UserPaginationPayload){
    this.loading = true
     return this.httpClient.post<ResponseData<PaginatedData<User>>>(this.backendUrl + this.moduleName + "/paginated", paginationRequest)
     .pipe(
      this.handleError()
     );
  }


  updateUserDetails(payload: UserPayload | { [key: string]: any }){
    this.loading = true
    return this.httpClient.post<ResponseData<User>>(`${this.backendUrl}${this.moduleName}`, payload)
    .pipe(
      this.handleError()
    );
  }
  getUserProfile(){
    return this.httpClient.get<ResponseData<User>>(`${this.backendUrl}${this.moduleName}/profile`);
  }

  getUserPicture(id: number) {
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

  deleteUserProfilePic(id: string){
    return this.httpClient.delete<ResponseData<any>>(`${this.backendUrl}${this.moduleName}/photo/${id}`);
  }

}
