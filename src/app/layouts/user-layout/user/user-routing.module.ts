import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/_auth/auth.guard';
import { UserRouteConstant } from 'src/app/constant/routing/user-routing-constant.model';
import { HomepageComponent } from 'src/app/features/homepage/homepage.component';
import { UserOrderHistoryComponent } from 'src/app/features/user-order/user-order-history/user-order-history.component';
import { UserOrderComponent } from 'src/app/features/user-order/user-order.component';

const routes: Routes = [
  {path: UserRouteConstant.homepage, component: HomepageComponent, canActivate:[AuthGuard], data: {roles:['USER', 'BLOGGER']}},
  {path: UserRouteConstant.userOrder, component: UserOrderComponent, canActivate:[AuthGuard], data: {roles:['USER']}},
  {path: UserRouteConstant.userOrderHistory, component: UserOrderHistoryComponent, canActivate:[AuthGuard], data: {roles:['USER']}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
