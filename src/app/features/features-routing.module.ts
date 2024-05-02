import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_auth/auth.guard';
import { ManagementRouteConstant } from '../constant/routing/management-routing-constant.model';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { FeedbackInspectComponent } from './feedback/feedback-inspect/feedback-inspect.component';
import { ManageFoodBodyComponent } from './management/manage-food-body/manage-food-body.component';
import { OnlineOrdersComponent } from './management/manage-orders/online-orders/online-orders.component';
import { OnsiteOrdersComponent } from './management/manage-orders/onsite-orders/onsite-orders.component';
import { OrderManagementBodyComponent } from './management/manage-orders/order-management-body/order-management-body.component';
import { ManageStaffBodyComponent } from './management/people-management/manage-staff-body/manage-staff-body.component';
import { AddStaffComponent } from './management/people-management/manage-staff-body/manage-staff/add-staff/add-staff.component';
import { StaffDetailsComponent } from './management/people-management/manage-staff-body/manage-staff/staff-inspect/staff-details/staff-details.component';
import { StaffDisableHistoryComponent } from './management/people-management/manage-staff-body/manage-staff/staff-inspect/staff-disable-history/staff-disable-history.component';
import { ManageUserBodyComponent } from './management/people-management/manage-user-body/manage-user-body.component';
import { UserDetailsComponent } from './management/people-management/manage-user-body/manage-users/user-inspect/user-details/user-details.component';
import { UserDisableHistoryComponent } from './management/people-management/manage-user-body/manage-users/user-inspect/user-disable-history/user-disable-history.component';
import { TestComponent } from './test/test.component';
import { StaffDashboardComponent } from './dashboard/staff-dashboard/staff-dashboard.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { TableManagementBodyComponent } from './management/table-management-body/table-management-body.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { UserManagementPaymentComponent } from './management/people-management/user-management-payment/user-management-payment.component';
import { InventoryManagementAdminComponent } from './management/inventory/inventory-management-admin/inventory-management-admin.component';
import { InventoryManagementBodyComponent } from './management/inventory/inventory-management-body/inventory-management-body.component';
import { ForbiddenComponent } from '../_auth/forbidden/forbidden.component';

const routes: Routes = [
  {path: ManagementRouteConstant.foodManagement, component: ManageFoodBodyComponent,  
    // data: {roles:['ADMIN']}
    canActivate:[AuthGuard], data: {roles:['STAFF', 'ADMIN']}
  },
  {path: ManagementRouteConstant.staffManagement, component : ManageStaffBodyComponent, canActivate:[AuthGuard], data: {roles:['ADMIN']}},
  {path: ManagementRouteConstant.inventoryManagement, component : InventoryManagementBodyComponent, canActivate:[AuthGuard], data: {roles:['STAFF', 'ADMIN']}},
  {path: ManagementRouteConstant.addStaff, component : AddStaffComponent, canActivate:[AuthGuard], data: {roles:['ADMIN']}},
  {path: ManagementRouteConstant.orderManagement, component: OrderManagementBodyComponent, canActivate:[AuthGuard], data: {roles:['STAFF', 'ADMIN']}},
  {path: ManagementRouteConstant.orderHistory, component: OrderHistoryComponent, canActivate:[AuthGuard], data: {roles:['STAFF', 'ADMIN']}},
  
  {path: ManagementRouteConstant.onlineOrderManagement, component: OnlineOrdersComponent, canActivate:[AuthGuard], data: {roles:['STAFF', 'ADMIN']}},
  {path: ManagementRouteConstant.onsiteOrderManagement, component: OnsiteOrdersComponent, canActivate:[AuthGuard], data: {roles:['STAFF', 'ADMIN']}},
  {path: ManagementRouteConstant.userManagement, component: ManageUserBodyComponent, canActivate:[AuthGuard], data: {roles:['ADMIN']}},
  {path: ManagementRouteConstant.userManagementPayment, component: UserManagementPaymentComponent, canActivate:[AuthGuard], data: {roles:['STAFF', 'ADMIN']}},
  {path: ManagementRouteConstant.adminDashboard, component: AdminDashboardComponent, canActivate:[AuthGuard], data: {roles:['ADMIN']}},
  {path: ManagementRouteConstant.staffDashboard, component: StaffDashboardComponent, canActivate:[AuthGuard], data: {roles:['Blogger', 'ADMIN']}},
  {path: ManagementRouteConstant.announcement, component: AnnouncementComponent, canActivate:[AuthGuard], data: {roles:['ADMIN']}},
  {path: ManagementRouteConstant.report, component: GenerateReportComponent, canActivate:[AuthGuard], data: {roles:['ADMIN']}},
  {path: ManagementRouteConstant.tableManagement, component: TableManagementBodyComponent, canActivate:[AuthGuard], data: {roles:['ADMIN']}},
  {path: ManagementRouteConstant.test, component: TestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
