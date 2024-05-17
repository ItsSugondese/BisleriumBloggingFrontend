import { Injectable } from '@angular/core';
import { role } from '../../model/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  public setRoles(roles : string){
    
  localStorage.setItem("roles", roles);
  }

  public getSingleRole(){
    return this.getRoles();
  }
  public getRoles() :string | null{
    
    return localStorage.getItem('roles') ;
  }

  public setToken(token : string){
    localStorage.setItem("token", token);
  }

  public getToken(){
    return localStorage.getItem("token");
  }

  public setUsername(username : string){
    localStorage.setItem("username", username);
  }
  public setUserId(userId : string){
    localStorage.setItem("userId", userId);
  }

  public getUsername(){
   return localStorage.getItem("username");
  }

  public getUserId(){
   return localStorage.getItem("userId");
  }



  public clear(){
    localStorage.clear();
  }

  public isLoggedIn(){
    return this.getRoles() && this.getToken();
  }


  public roleMatch(allowedRoles : string[]) : boolean {

    
    const roles = this.getRoles();

    
  
    if(roles!=null && roles){
   

      for(let j=0; j<allowedRoles.length; j++){

        if(roles.toUpperCase() == allowedRoles[j].toUpperCase()){

          return true;
        }
      }
    }
  
  return false;
  }
}