import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../manage-users-service/model/user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ManageUsersService } from '../manage-users-service/manage-users.service';
import { CommonVariable } from '@shared/helper/inherit/common-variable';
import { ManageStaffService } from '../../../manage-staff-body/manage-staff/manage-staff-service/manage-staff.service';
import { UserProfileService } from '@shared/service/user-profile-service/user-profile.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent extends CommonVariable{
  @Input() user !: User | null
  @Output() onOpeningDrawer: EventEmitter<boolean> = new EventEmitter();

  userForm !: FormGroup
  postStaffDetails$ !: Subscription
  imageId !: number | null;
  imageUrl: string | null = null
  fileControl = new FormControl(null, Validators.required);
  imageId$ !: Subscription
  imageLoaded = false;

  constructor(private fb: FormBuilder, public userService: ManageUsersService,
     public userProfileService: UserProfileService) { 
    super()
  }

  ngOnInit() {

    this.userForm = this.fb.group({
      id: new FormControl(),
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fileId: new FormControl()
    });

    if (this.user != null) {
      this.userForm.setValue({
        id: this.user?.id,
        username: this.user?.fullName,
        email: this.user?.email,
        fileId: null
      })
      if(this.user.profilePath){
      this.imageId$ = this.userProfileService.getUserPicture(this.user.id).subscribe(
        (response) => {




          this.createImageFromBlob(response, this.user!.id)
            .then((imageData) => {
              if (imageData.startsWith("data:image") || imageData.startsWith("data:text/xml")) {
                this.imageUrl = imageData;
              }
            })
          this.imageLoaded = true


        }
      )
    }

    }
  }


  onSubmit() {
    if (this.imageId) {
      const photoIdControl = this.formValue('fileId');
      photoIdControl?.setValue(this.imageId);
    }


    let formVal = this.userForm.value;


    this.postStaffDetails$ = this.userProfileService.updateUserDetails(formVal).subscribe(
      (results) => {
        this.postStaffDetails$.unsubscribe();
        window.location.reload()
      }
    );
  }


  compareFormAndStaff(): boolean {

    if (this.user?.fullName == this.formValue('username')!.value &&
      this.user?.email.toUpperCase() == this.formValue('email')!.value.toUpperCase()) {
      return true;
    }

    return false;
  }

  formValue(name: string) {
    return this.userForm.get(name);
  }


  ngOnDestroy(): void {
    if (this.postStaffDetails$) {
      this.postStaffDetails$.unsubscribe();
    }
  }

}
