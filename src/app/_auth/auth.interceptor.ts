import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, catchError, filter, finalize, map, tap, throwError } from "rxjs";
import { Route, Router } from "@angular/router";
import { Injectable, OnInit } from "@angular/core";
import { UserService } from "../shared/service/user-service/user.service";
import { LoginService } from "./registration/login/login-service/login.service";
import { SnackbarService } from "../templates/snackbar/snackbar-service/snackbar.service";
import { MessageStatus } from "../templates/snackbar/snackbar.template.component";
import { ResponseData } from "../constant/data/response-data.model";
import { Crud } from "src/enums/backend/curd.enums";
import { ManagementRouteConstant } from "../constant/routing/management-routing-constant.model";

@Injectable()
export class AuthInterceptor implements HttpInterceptor, OnInit {

    // token!: string | null


    constructor(
        private userService: UserService,
        private router: Router,
        private loginService: LoginService,
        private snackService: SnackbarService) {
    }
    ngOnInit(): void {

    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get("No-Auth") === 'true') {
            return next.handle(req.clone());
        }




        req = this.addToken(req, this.userService.getToken());
        return next.handle(req).pipe(
            
            catchError(
                (err: HttpErrorResponse) => {
                    if(err.status == 401){
                        console.log("here")
                        this.snackService.showMessage({
                            label: "Must be login first",
                            status: MessageStatus.FAIL
                        });
                        this.router.navigate([ManagementRouteConstant.login])

                    } else if (err.error.message) {
                        console.log("hello")
                        this.snackService.showMessage({
                            // label : error.error.message,
                            label: err.error.message,
                            status: MessageStatus.FAIL
                        });
                    } else if (err.status == 401) {
                        if (this.userService.getToken() != null) {
                            this.loginService.setFormHeader("Session Expired", "Red")
                        } else {
                            this.loginService.setFormHeader("Must Login first to access the page", "Red")
                        }
                        console.log("Hello")
                        this.router.navigate([ManagementRouteConstant.login])
                    } else if (err.status == 403) {
                        this.router.navigate(['/auth/login'])
                    } else if (err.status == 0) {
                        this.snackService.showMessage({
                            label: "Connection with server failed",
                            status: MessageStatus.FAIL
                        });
                    }else {
                        this.snackService.showMessage({
                            label: "Something went wrong",
                            status: MessageStatus.FAIL
                        });
                    }

                    
                    return throwError(err)
                }
            ),
            map(event => {
                // Assuming you're only interested in HttpResponse events
                if (event instanceof HttpResponse) {
                  return event;
                }
                // Return null for other event types, you can handle them accordingly
                return null;
              }),
              filter((event: HttpResponse<any> | null): event is HttpResponse<any> => event !== null),
              tap((response: HttpResponse<any>) => {  
                if (response.body && 'crud' in response.body && response.body.crud == 'SAVE') {
                  this.snackService.showMessage({
                    label: response.body.message,
                    status: MessageStatus.SUCCESS
                  });
                  // Do your success stuff in here
                }
              })
          
            
        )
    }


    private addToken(req: HttpRequest<any>, token: string | null) {
        return req.clone(
            {
                setHeaders: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            }
        );
    }


}