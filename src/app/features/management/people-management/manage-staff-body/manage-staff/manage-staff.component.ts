import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { CommonVariable } from 'src/app/shared/helper/inherit/common-variable';
import { defaultPaginationNavigator } from 'src/app/shared/model/pagination/pagination.model';
import { ManageStaffService } from './manage-staff-service/manage-staff.service';
import { Staff } from './manage-staff-service/model/staff.model';
import { ManageUsersService } from '../../manage-user-body/manage-users/manage-users-service/manage-users.service';
import { manageUserPagination } from '../../manage-user-body/manage-users/manage-users-service/model/maange-users-payload.model';
import { User, UserPaginationPayload } from '../../manage-user-body/manage-users/manage-users-service/model/user.model';
import { UserService } from '@shared/service/user-service/user.service';
import { UserFilter, UserProfileService } from '@shared/service/user-profile-service/user-profile.service';


@Component({
  selector: 'app-manage-staff',
  templateUrl: './manage-staff.component.html',
  styleUrls: ['./manage-staff.component.scss']
})
 export class ManageStaffComponent extends CommonVariable implements OnInit, OnDestroy {

  staffListPaginated !: PaginatedData<Staff>
  @Output() sendUserId : EventEmitter<Staff | null> = new EventEmitter()
  @Output() isInspectingEvent : EventEmitter<boolean> = new EventEmitter()
  @Output() onOpeningDrawer : EventEmitter<boolean> = new EventEmitter();

  imageDataMap: { [key: number]: string } = {};
  imageId$ !: Subscription;



  paginationJson: UserPaginationPayload = {
    page: 1,
    row: 2
  }
  getStaffSubscriable$ !: Subscription

  load = true

  

  constructor(public userProfileService: UserProfileService,  ) {
    super()
  }

  ngOnInit(): void {
    this.paginationJson.userType = 'ALL'
    this.getPaginatedData();
  }

  selectedUserTypeToFilter(event: string | null){
    this.userProfileService.selectedOption = event!

    this.paginationJson.userType = event!
  
    this.load = true
    
    
    this.getPaginatedData()
  }

  getPaginatedData() {

    this.getStaffSubscriable$ = this.userProfileService.getUserData(
      this.paginationJson).subscribe(
        (response) => {
          this.staffListPaginated = response.data
          this.load = false

        this.staffListPaginated.content.forEach((user) => {
          if(user.profilePath){
            this.imageId$ = this.userProfileService.getUserPicture(user.id).subscribe((imageBlob: Blob) => {
             
            this.createImageFromBlob(imageBlob, user.id)
             .then((imageData) => {
              this.imageDataMap[user.id] = imageData;
          })
        
          });
          }

        })

        }
      )
  }


  typedUserToFilter(event: string){
      this.paginationJson.name = event
    this.load = true
    this.getPaginatedData()
  }

  onTableDataChange(event: any) {
    this.paginationJson.page = event
    this.getPaginatedData();

  }

  onSelectedDropdown(event: any) {
    if (this.paginationJson.row != event) {
      this.paginationJson.row = event
      this.paginationJson.page = 1
      this.getPaginatedData();
    }
  }


  ngOnDestroy(): void {
    if (this.getStaffSubscriable$) {
      this.getStaffSubscriable$.unsubscribe();
    }
    if(this.imageId$){
      this.imageId$.unsubscribe()
    }
  }

}

//  extends CommonVariable implements OnInit, OnDestroy {
  // 
//   staffListPaginated !: PaginatedData<Staff>
//   paginationNavigator: defaultPaginationNavigator = {
//     currentPage: 1,
//     row: 10,
//   }
//   paginationJson: manageUserPagination = {
//     userType: 'STAFF',
//     page: 1,
//     row: this.selectedRow

//   }
//   fromTime = new Date();
//   getStaffSubscriable$ !: Subscription



//   constructor(private manageStaffService : ManageStaffService,
//     public manageUserService: ManageUsersService, private router: Router) {
//     super()
//   }
  
//   ngOnInit(): void {
//     this.getPaginatedData();
//   }

//   navigateToSingle(id : Number){
//     this.router.navigate(['/admin/manage_staff/', id])
//   }

//   getPaginatedData() {
//     this.getStaffSubscriable$ = this.manageUserService.getData(this.paginationJson)
//     .subscribe(
//         (response) => {
//           this.staffListPaginated = response.data
//           this.paginationNavigator.totalNoOfElements = response.data.totalElements
//           this.paginationNavigator.totalNoOfpage = response.data.totalPages
//           this.paginationNavigator.noOfElements = response.data.numberOfElements
//         }
//       )
//   }

 

//   typedUserToFilter(event: string){
//     if(event.trim() != ''){
//       this.paginationJson.name = event
//     }else{
//       this.paginationJson.name = undefined
//     }
//     this.getPaginatedData()
//   }

//   onTableDataChange(event: any) {
//     this.paginationJson.page = event
//     this.getPaginatedData();

//   }

//   onSelectedDropdown(event: any) {
//     if (this.paginationJson.row != event) {
//       this.paginationJson.row = event
//       this.getPaginatedData();
//     }
//   }

  

//   ngOnDestroy(): void {
//     if(this.getStaffSubscriable$){
//       this.getStaffSubscriable$.unsubscribe();
//     }
//   }
// }

