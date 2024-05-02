import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './registration/login/login.component';
import { ManagementRouteConstant } from '../constant/routing/management-routing-constant.model';
import { LogoutComponent } from './registration/logout/logout.component';
import { PasswordResetComponent } from './registration/password-reset/password-reset.component';
import { ForgotPasswordComponent } from './registration/forgot-password/forgot-password.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { PathDeciderComponent } from './path-decider/path-decider.component';
import { RegisterUserComponent } from './registration/register-user/register-user.component';

const routes: Routes = [
  {path: '_', component: PathDeciderComponent},
  {path: ManagementRouteConstant.login, component: LoginComponent},
  {path: ManagementRouteConstant.forgotPassword, component: ForgotPasswordComponent},
  {path: ManagementRouteConstant.resetPassword, component: PasswordResetComponent},
  {path: ManagementRouteConstant.forbidden, component: ForbiddenComponent},
  {path: ManagementRouteConstant.register, component: RegisterUserComponent},
  // {
  //   path: '',
  //   component: LoginComponent,
  //   children: [
  //     {
  //       path: ManagementRouteConstant.login,
  //       component: LoginComponent,
  //       pathMatch: 'full'
  //     },
  //     // { path: ManagementRouteConstant.login, component: LoginComponent },
  //     { path: 'logout', component: LogoutComponent },
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
