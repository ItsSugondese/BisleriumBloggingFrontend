import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BlogPagination, BlogReactionPayload, FoodMenuPagination, ToggleAvailability } from './model/food-menu.payload';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { Blog, FoodMenuWithImageData, foodMenu } from './model/food-menu.model';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { BehaviorSubject, catchError, finalize } from 'rxjs';
import { LoaderService } from 'src/app/shared/service/loader-service/loader.service';
import { SnackbarService } from 'src/app/templates/snackbar/snackbar-service/snackbar.service';
import { MessageStatus } from 'src/app/templates/snackbar/snackbar.template.component';
import { ServiceCommonVariable } from 'src/app/shared/helper/inherit/common-variable-serivce';
import { EnumItem } from '@shared/model/enums/MapForEnum.model';

export enum FoodFilterHomepageType {
  RECENT = 'Recent',
  RANDOM = 'Random',
  POPULAR = 'Popular',
}
export enum FoodFilterType {
  ALL = 'All',
  MEAL = 'Meal',
  DRINKS = 'Drinks',
  MISC = 'Misc',
  AUTO = 'Auto',
}

@Injectable({
  providedIn: 'root'
})
export class ManageFoodsService extends ServiceCommonVariable {

  filterOptionsHomepage : EnumItem[] = this.enumToEnumItems(FoodFilterHomepageType)
  filterOptions : EnumItem[] = this.enumToEnumItems(FoodFilterType)
  defaltFoodSelect : string = 'RECENT'
  backendUrl = environment.apiUrl;
  moduleName : string = "blog"
  private selectedMenuSubject = new BehaviorSubject<FoodMenuWithImageData | null>(null);
pictureLoading = false
deleteLoading = false
public toggleLoading = {
  status: false,
  index: -1
} 
  constructor(private httpClient : HttpClient,) { 
      super()
    }
  
  postImage(data : FormData){
    this.pictureLoading = true
    return this.httpClient.post<any>(this.backendUrl + "temporary-attachments",data)
    .pipe(
      catchError(error => {
        throw error;
      }),
      finalize(() => this.pictureLoading=false
      ));;
  }

  postFoodMenu(data : { [key: string]: any }){
    this.pictureLoading = true
    return this.httpClient.post<any>(this.backendUrl + this.moduleName,data)
    .pipe(
      catchError(error => {
        throw error;
      }),
      finalize(() => this.pictureLoading=false
      ));
  }
  toggleFoodMenu(data : ToggleAvailability, i: number){
    this.toggleLoading = {
      status: true,
      index: i
    }
    
    return this.httpClient.post<any>(this.backendUrl + this.moduleName + "/toggle-availability",data)
    
    .pipe(
      catchError(((error : HttpErrorResponse) => {
        this.toggleLoading.status = false
        throw error;
      })),
      finalize(() => this.toggleLoading.status = false
      ));
  }

  getFoodMenu(){
     return this.httpClient.get<ResponseData<foodMenu[]>>(this.backendUrl + "food-menu" + "?type=ALL");
  }
  
  getFoodPicture(id: number) {
    return this.httpClient.get(this.backendUrl +'food-menu/photo/' + id, { responseType: 'blob' });
  }


  deleteMenu(id: number) {
    this.deleteLoading = true
    return this.httpClient.delete(`${this.backendUrl}${this.moduleName}/${id}`)
    .pipe(
      catchError(error => {
        throw error;
      }),
      finalize(() => this.deleteLoading=false
      ));;
  }

  
  sendSelectedFoodMenu(item: FoodMenuWithImageData | null){
    this.selectedMenuSubject.next(item);
  }

  getSelectedFoodMenu(){
    return this.selectedMenuSubject.asObservable();
  }










  ////
  getBlogPaginated(data : BlogPagination){
    this.loading = true
     return this.httpClient.post<ResponseData<PaginatedData<Blog>>>(this.backendUrl + this.moduleName +  "/paginated", data)
     .pipe(
      
      this.handleError()
      );
  }
  getSingleBlog(id : number){
    this.loading = true
     return this.httpClient.get<ResponseData<Blog>>(`${this.backendUrl}${this.moduleName}/${id}`)
     .pipe(
      this.handleError()
      );
  }

  getBlogPicture(id: number) {
    return this.httpClient.get(`${this.backendUrl}${this.moduleName}/doc/${id}`, { responseType: 'blob' });
  }

  reactBlog(data: BlogReactionPayload){
    return this.httpClient.post<ResponseData<any>>(this.backendUrl + this.moduleName +  "/react", data)
  }
 

}

