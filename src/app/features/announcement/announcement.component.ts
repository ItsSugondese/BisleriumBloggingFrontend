import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonVariable } from '@shared/helper/inherit/common-variable';
import { AnnouncementService } from '@shared/service/announcement-service/announcement.service';
import { AnnouncementPaginationPayload, AnnouncementPayload } from '@shared/service/announcement-service/model/announcement-payload.model';
import { Announcement } from '@shared/service/announcement-service/model/announcement.model';
import { Subscription } from 'rxjs';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { ManageStaffService } from '../management/people-management/manage-staff-body/manage-staff/manage-staff-service/manage-staff.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent extends CommonVariable implements OnInit, OnDestroy {
  visible: boolean = false;
  announcementList : Announcement[] = []

  announcementPaginatedData !: PaginatedData<Announcement>
  announcementSubscription$ !: Subscription
  getAdminPicture$ !: Subscription

  announcementPayload !: AnnouncementPaginationPayload
  imageDataMap: { [key: number]: string |null } = {};

  

  constructor(public announcementService: AnnouncementService, private adminServcie: ManageStaffService) {
    super()
  }

  ngOnInit(): void {
    this.announcementPayload = {
      row: 6,
      page: 1
    }

    // this.fetchAnnouncement()
  }

  typedOrderToFilter(event: string){
    if(event.trim() == ''){
      this.announcementPayload.name = undefined
    }else{
      this.announcementPayload.name = event
    }
    this.setPageAndListToRestart()
    this.fetchAnnouncement() 
  }

  onRangeSelect(event: Date[]) {
    const fromDate = event[0];
    const toDate = event[event.length - 1];

    const fromDateString = fromDate.getFullYear() + '-' + ('0' + (fromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + fromDate.getDate()).slice(-2);
      const toDateString = toDate.getFullYear() + '-' + ('0' + (toDate.getMonth() + 1)).slice(-2) + '-' + ('0' + toDate.getDate()).slice(-2);
    this.announcementPayload.fromDate = fromDateString
    this.announcementPayload.toDate = toDateString

    this.setPageAndListToRestart()
    this.fetchAnnouncement()
}

  setPageAndListToRestart(){
    this.announcementList = []
    this.announcementPayload.page = 1
  }
  
  fetchAnnouncement(){
    this.announcementSubscription$ = this.announcementService.getAllAnnouncement(this.announcementPayload).subscribe(
      (res) => {
        this.announcementPaginatedData = res.data
        this.announcementList = [...this.announcementList, ...res.data.content]
  
        this.announcementPaginatedData.content.forEach((admin) => {
              if(admin.profileUrl){
                this.getAdminPicture$ = this.adminServcie.getStaffPicture(admin.userId).subscribe((imageBlob: Blob) => {
    
    
                this.createImageFromBlob(imageBlob, admin.userId)
                 .then((imageData) => {
                  this.imageDataMap[admin.userId] = imageData;
              })
              .catch((error) => {
                  console.log("error when trying to access")
              });
              });
            }else{
              this.imageDataMap[admin.userId] = null
            }
            
            }
          
        );
      }
    )
    
  }

  onScroll = () => {
    if (this.announcementPaginatedData.totalPages != this.announcementPayload.page) {
      this.announcementPayload.page++
      this.fetchAnnouncement()
    }
  }

  ngOnDestroy(): void {

  }
}
