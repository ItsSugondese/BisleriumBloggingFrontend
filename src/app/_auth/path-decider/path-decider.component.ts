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
    if(this.userSerivce.getSingleRole() == null){
      this.userSerivce.setRoles("USER")
    }
    let role = this.userSerivce.getSingleRole()
    if(role?.toUpperCase() == 'ADMIN'){
      this.router.navigate(['/' + ManagementRouteConstant.staffDashboard])
    }else {
        this.router.navigate(['/' + UserRouteConstant.homepage])
      }
  }

}
