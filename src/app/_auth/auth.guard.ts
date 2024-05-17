import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/service/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private userService : UserService,
    private router : Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const roles = route.data['roles'] as [];

      console.log(roles)
      if(roles){
        const match = this.userService.roleMatch(roles)
        console.log(match)
        if(match){
          return true;
        }else{
          this.router.navigate(['/forbidden'])
          return false;
        }
      }
    return false;
  
  }
  
}