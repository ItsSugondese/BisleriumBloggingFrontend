import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { defaultPaginationNavigator } from 'src/app/shared/model/pagination/pagination.model';
import { manageUserPagination } from './manage-users-service/model/maange-users-payload.model';
import { Subscription } from 'rxjs';
import { ManageUsersService } from './manage-users-service/manage-users.service';
import { User } from './manage-users-service/model/user.model';
import { Router } from '@angular/router';
import { CommonVariable } from 'src/app/shared/helper/inherit/common-variable';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { UserProfileService } from '@shared/service/user-profile-service/user-profile.service';
import { ManageStaffService } from '../../manage-staff-body/manage-staff/manage-staff-service/manage-staff.service';


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent extends CommonVariable implements OnInit, OnDestroy {

  userListPaginated !: PaginatedData<User>
  @Output() sendUserId: EventEmitter<User | null> = new EventEmitter()
  @Output() onOpeningDrawer: EventEmitter<boolean> = new EventEmitter();




  userSubscription$ !: Subscription
  userPictureSubscription$ !: Subscription

  userData !: User



  constructor(public manageUserService: ManageUsersService, public userProfileService: UserProfileService,
    private staffService: ManageStaffService
  ) {
    super()
  }

  ngOnInit(): void {
    this.getUserData();
  }




  removeImage(){
    if(this.userData.profilePath){
      this.userPictureSubscription$ = this.userProfileService.deleteUserProfilePic(this.userData.id).subscribe(
        (res) => {
          this.userProfileService.imageMap = null;
          this.getUserData()
        }
      )
    }
  }






  getUserData() {
    this.userSubscription$ = this.userProfileService.getUserProfile().subscribe(
      (res) => {
        this.userData = res.data

        
          this.userPictureSubscription$ = this.staffService.getUserPicture(this.userData.id).subscribe((imageBlob: Blob) => {

            if (this.userData.profilePath) {

              this.createImageFromBlob(imageBlob, this.userData.id)
                .then((imageData) => {
                  this.userProfileService.imageMap = imageData;

                })
                .catch((error) => {
                  console.log("error when trying to access")
                })
                .finally(() => {this.userPictureSubscription$.unsubscribe()});
            }
          }
          );
        

      }
    )
  }


  ngOnDestroy(): void {
    if (this.userSubscription$) {
      this.userSubscription$.unsubscribe();
    }
    if (this.userPictureSubscription$) {
      this.userPictureSubscription$.unsubscribe();
    }
  }

}
