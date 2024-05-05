import { Injectable } from '@angular/core';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { ServiceCommonVariable } from '@shared/helper/inherit/common-variable-serivce';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommentPayload, CommentReactionPayload, Comments } from './model/comment.model';
import { catchError, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends ServiceCommonVariable {
  moduleName : string = "comment"
  backendUrl = environment.apiUrl;
  deletingComment : boolean = false;

  constructor(private httpClient : HttpClient,) { 
      super()
    }

    postComment(data: CommentPayload){
      this.loading = true
      return this.httpClient.post<ResponseData<any>>(`${this.backendUrl}${this.moduleName}`, data)
      .pipe(this.handleError())
    }

    reactComment(data: CommentReactionPayload){
      return this.httpClient.post<ResponseData<any>>(`${this.backendUrl}${this.moduleName}/react`, data)
    }
    
    deleteComment(id: number){
      return this.httpClient.delete<ResponseData<any>>(`${this.backendUrl}${this.moduleName}/${id}`)
      .pipe(
        catchError(error => {
          throw error;
        }),
        finalize(() => this.deletingComment = false)
      );
    }

    getCommentHistory(id: number){
      this.loading = true
      return this.httpClient.get<ResponseData<Comments[]>>(`${this.backendUrl}${this.moduleName}/history/${id}`)
      .pipe(
        this.handleError()
      );
    }
}
