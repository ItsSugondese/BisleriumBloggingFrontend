import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceCommonVariable } from '@shared/helper/inherit/common-variable-serivce';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { environment } from 'src/environments/environment';
import { BlogPagination, Blog, BlogReactionPayload } from './model/blog.model';
import { EnumItem } from '@shared/model/enums/MapForEnum.model';
import { FoodFilterType } from '../../management/manage-food-body/manage-foods/manage-foods-service/manage-foods.service';
import { catchError, finalize } from 'rxjs';

export enum FoodFilterHomepageType {
  RECENT = 'Recent',
  RANDOM = 'Random',
  POPULAR = 'Popular',
}

@Injectable({
  providedIn: 'root'
})
export class BlogService extends ServiceCommonVariable {
  moduleName : string = "blog"
  backendUrl = environment.apiUrl;

  filterOptionsHomepage : EnumItem[] = this.enumToEnumItems(FoodFilterHomepageType)
  filterOptions : EnumItem[] = this.enumToEnumItems(FoodFilterType)
  defaltFoodSelect : string = 'RECENT'

  deletingBlog = false;
  constructor(private httpClient : HttpClient,) { 
      super()
    }



  postBlog(data : { [key: string]: any }){
    this.loading = true;
  return this.httpClient.post<ResponseData<string>>(`${this.backendUrl}${this.moduleName}` , data)
    .pipe(
      this.handleError()
    )
  }

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

  deleteBlog(id: number){
    this.deletingBlog = true
    return this.httpClient.delete<ResponseData<any>>(`${this.backendUrl}${this.moduleName}/${id}`)
    .pipe(
      catchError(error => {
        throw error;
      }),
      finalize(() => this.deletingBlog = false)
    );
  }
}
