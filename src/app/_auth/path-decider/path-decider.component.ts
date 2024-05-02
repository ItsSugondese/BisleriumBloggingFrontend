import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@shared/service/user-service/user.service';
import { ManagementRouteConstant } from 'src/app/constant/routing/management-routing-constant.model';
import { UserRouteConstant } from 'src/app/constant/routing/user-routing-constant.model';

@Component({
  selector: 'app-path-decider',
  templateUrl: './path-decider.component.html',
  styleUrls: ['./path-decider.component.scss']
})
export class PathDeciderComponent implements OnInit {

  constructor(private userSerivce: UserService, private router: Router){
    
  }

  ngOnInit(): void {
    let role = this.userSerivce.getSingleRole()
    if(role == 'ADMIN'){
      this.router.navigate(['/' + ManagementRouteConstant.adminDashboard])
    }else if(role?.toUpperCase() == 'BLOGGER'){
        this.router.navigate(['/' + UserRouteConstant.homepage])
      }else{
        this.router.navigate(['/' + ManagementRouteConstant.login])

      }
  }

}
