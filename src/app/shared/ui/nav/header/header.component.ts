import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonVariable } from '@shared/helper/inherit/common-variable';
import { EnumItem } from '@shared/model/enums/MapForEnum.model';
import { UserService } from '@shared/service/user-service/user.service';
import { Observable, Subscription, delay, of } from 'rxjs';
import { AuthService } from 'src/app/_auth/auth-service/auth.service';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { UserNavConstant } from 'src/app/constant/navbar/usernav-data.model';
import { ManagementRouteConstant } from 'src/app/constant/routing/management-routing-constant.model';
import { User } from 'src/app/features/management/people-management/manage-user-body/manage-users/manage-users-service/model/user.model';
import { UserProfileService } from 'src/app/shared/service/user-profile-service/user-profile.service';
import { SidenavService } from '../sidenav/sidenav-service/sidenav.service';
import { ManageOrdersNavbarService, OrderNav } from 'src/app/features/management/manage-orders/manage-orders-navbar/manage-orders-navbar-service/manage-orders-navbar.service';
import { NotificationService } from '@shared/service/notification-service/notification.service';
import { NotificationPagination } from '@shared/service/notification-service/model/notification.payload';
import { NotificationModel } from '@shared/service/notification-service/model/notification.model';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { ManageStaffService } from 'src/app/features/management/people-management/manage-staff-body/manage-staff/manage-staff-service/manage-staff.service';

enum HeaderNav {
  HOMEPAGE = "Homepage",
  ORDER = "My Orders",
}



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends CommonVariable implements OnInit, OnDestroy {

  orderUrl: string = `/${ManagementRouteConstant.orderManagement}`
  allowedUrl: string[] = [this.orderUrl]
  navList = UserNavConstant
  inspecting = HeaderNav
  options: EnumItem[] = this.enumToEnumItems(HeaderNav);
  manageOrderOptions: EnumItem[] = this.enumToEnumItems(OrderNav)
  selectedNavbar = HeaderNav.HOMEPAGE
  userSubscription$ !: Subscription
  userPictureSubscription$ !: Subscription
  // userSubscription$ !: Observable<ResponseData<User>>
  notificationCountSubscription$ !: Observable<ResponseData<number>>

  notificationPaginatedData !: ResponseData<PaginatedData<NotificationModel>>
  notificationPayload !: NotificationPagination

  notificationsSubscription$ !: Subscription
  isOpen = false;

  userData !: User

  private totalItems = 100;
  notifications: NotificationModel[] = []
  imageMap : string | null = null
 






  appendData = () => {
    this.notificationsSubscription$ = this.notificationService.getUserNotifications(this.notificationPayload).subscribe(
      (response) => {
        this.notifications = [...this.notifications, ...response.data.content];
        this.notificationPaginatedData = response;
        this.notificationsSubscription$.unsubscribe()
      }

    )
  }

  onScroll = () => {
    if (this.notificationPaginatedData.data.totalPages != this.notificationPayload.page
      && !this.notificationService.loading) {
      this.notificationPayload.page++
      this.appendData()
    }
  }

  backDropClick() {
    this.notificationPayload.page = 1;
    this.isOpen = false;
    this.notifications = []
  }


  constructor(private userProfileService: UserProfileService, public userService: UserService,
    public router: Router, public sidenavService: SidenavService, public managementNavbarService: ManageOrdersNavbarService,
    public notificationService: NotificationService, private staffService: ManageStaffService) {
    super()
  }


  ngOnInit(): void {
    this.userSubscription$ = this.userProfileService.getUserProfile().subscribe(
      (res) => {
        this.userData = res.data

        if(this.userData.userType == 'USER'){
          this.imageMap = this.userData.profilePath
        }else{
        this.userPictureSubscription$ = this.staffService.getUserPicture(this.userData.id).subscribe((imageBlob: Blob) => {

          if(this.userData.profilePath){
    
          this.createImageFromBlob(imageBlob, this.userData.id)
            .then((imageData) => {
              this.imageMap = imageData;
    
            })
            .catch((error) => {
              console.log("error when trying to access")
            });
          }
        }
        );
      }

      }
    )
    this.notificationCountSubscription$ = this.notificationService.getNewNotificationCount();
    this.notificationPayload = {
      page: 1,
      row: 6
    }

  }

  updateSelectedNavbar(value: string) {
    this.selectedNavbar = value as HeaderNav;
  }

  updateSelectedOrderNavbar(value: string) {
    this.managementNavbarService.selectedNavbar = value as OrderNav;
  }

  getNotifications() {
    // this.notificationsSubscription$ = this.notificationService.getUserNotifications(this.notificationPayload).subscribe(
    //   (res) => {

    //   }
    // )
  }


  ngOnDestroy(): void {
    if (this.notificationsSubscription$) {
      this.notificationsSubscription$.unsubscribe()
    }
  }
}
