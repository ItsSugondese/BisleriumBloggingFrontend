import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_auth/auth.guard';
import { LoginComponent } from './_auth/registration/login/login.component';
import { LogoutComponent } from './_auth/registration/logout/logout.component';
import { OnlineOrdersComponent } from './features/management/manage-orders/online-orders/online-orders.component';
import { OnsiteOrdersComponent } from './features/management/manage-orders/onsite-orders/onsite-orders.component';
import { HomepageComponent } from './features/homepage/homepage.component';
import { StaffDetailsComponent } from './features/management/people-management/manage-staff/staff-inspect/staff-details/staff-details.component';
import { ManageStaffComponent } from './features/management/people-management/manage-staff/manage-staff.component';
import { AddStaffComponent } from './features/management/people-management/manage-staff/add-staff/add-staff.component';
import { ManageUsersComponent } from './features/management/people-management/manage-users/manage-users.component';
import { UserDetailsComponent } from './features/management/people-management/manage-users/user-inspect/user-details/user-details.component';
import { StaffDisableHistoryComponent } from './features/management/people-management/manage-staff/staff-inspect/staff-disable-history/staff-disable-history.component';
import { UserDisableHistoryComponent } from './features/management/people-management/manage-users/user-inspect/user-disable-history/user-disable-history.component';
import { FeedbackComponent } from './features/feedback/feedback.component';
import { ManagementRouteConstant } from './constant/routing/management-routing-constant.model';
import { FeedbackInspectComponent } from './features/feedback/feedback-inspect/feedback-inspect.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { UserRouteConstant } from './constant/routing/user-routing-constant.model';
import { UserOrderComponent } from './features/user-order/user-order.component';
import { TestComponent } from './features/test/test.component';
import { OrderManagementBodyComponent } from './features/management/manage-orders/order-management-body/order-management-body.component';
import { ManageFoodsComponent } from './features/management/manage-food-body/manage-foods/manage-foods.component';
import { ManageFoodBodyComponent } from './features/management/manage-food-body/manage-food-body.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: ManagementRouteConstant.login, component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: ManagementRouteConstant.foodManagement, component: ManageFoodBodyComponent,  data: {roles:['ADMIN']}},
  {path: 'admin/manage_staff', component : ManageStaffComponent, canActivate: [AuthGuard], data: {roles:['USER']}},
  {path: 'admin/manage_staff/:id', component : StaffDetailsComponent, canActivate: [AuthGuard], data: {roles:['USER']}},
  {path: 'admin/manage_staff/:id/history', component : StaffDisableHistoryComponent, canActivate: [AuthGuard], data: {roles:['USER']}},
  {path: ManagementRouteConstant.addStaff, component : AddStaffComponent,},
  {path: ManagementRouteConstant.orderManagement, component: OrderManagementBodyComponent},
  {path: ManagementRouteConstant.onlineOrderManagement, component: OnlineOrdersComponent},
  {path: ManagementRouteConstant.onsiteOrderManagement, component: OnsiteOrdersComponent},
  {path: 'manage_users', component: ManageUsersComponent},
  {path: 'manage_users/:id', component: UserDetailsComponent},
  {path: 'manage_users/:id/history', component: UserDisableHistoryComponent},
  {path: UserRouteConstant.homepage, component: HomepageComponent},
  {path: ManagementRouteConstant.adminDashboard, component: AdminDashboardComponent},
  {path: UserRouteConstant.userOrder, component: UserOrderComponent},
  // {path: 'feedback/:id', component: FeedbackComponent}
  {path: 'feedback/:id', component: FeedbackInspectComponent},
  {path: 'test', component: TestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
