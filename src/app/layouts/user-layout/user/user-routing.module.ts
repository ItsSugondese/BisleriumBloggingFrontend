import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/_auth/auth.guard';
import { UserRouteConstant } from 'src/app/constant/routing/user-routing-constant.model';
import { BlogInspectComponent } from 'src/app/features/blog-inspect/blog-inspect.component';
import { HomepageComponent } from 'src/app/features/homepage/homepage.component';
import { ManageUserBodyComponent } from 'src/app/features/management/people-management/manage-user-body/manage-user-body.component';
import { UserOrderHistoryComponent } from 'src/app/features/user-order/user-order-history/user-order-history.component';
import { UserOrderComponent } from 'src/app/features/user-order/user-order.component';

const routes: Routes = [
  {path: UserRouteConstant.homepage, component: HomepageComponent, canActivate:[AuthGuard], data: {roles:['USER', 'BLOGGER']}},
  {path: UserRouteConstant.userOrder, component: UserOrderComponent, canActivate:[AuthGuard], data: {roles:['BLOGGER']}},
  {path: UserRouteConstant.userOrderHistory, component: UserOrderHistoryComponent, canActivate:[AuthGuard], data: {roles:['USER']}},
  {path: UserRouteConstant.userManagement, component: ManageUserBodyComponent, canActivate:[AuthGuard], data: {roles:['BLOGGER', 'ADMIN']}},
  {path: UserRouteConstant.blogView + '/:id', component: BlogInspectComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
