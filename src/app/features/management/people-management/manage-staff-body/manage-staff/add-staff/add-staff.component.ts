import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ManageStaffService } from '../manage-staff-service/manage-staff.service';
import { Subscription } from 'rxjs';
import { Staff, StaffWithImageData } from '../manage-staff-service/model/staff.model';
import { createImageFromBlob } from '@shared/helper/attachment-helper/attachment.handler';
import { AuthService } from 'src/app/_auth/auth-service/auth.service';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent implements OnInit, OnDestroy {
  @Input() staff !: Staff | null
  @Output() onOpeningDrawer: EventEmitter<boolean> = new EventEmitter();

  postStaffDetails$ !: Subscription
  imageId !: number | null;
  imageUrl: string | null = null
  fileControl = new FormControl(null, Validators.required);
  imageLoaded = false;

  staffForm  :FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    fileId: new FormControl(),

  });
  constructor(private fb: FormBuilder, public staffService: ManageStaffService,
    public authService: AuthService
  ) { }

  ngOnInit() {

    
  }


  onSubmit() {
    if (this.imageId) {
      const photoIdControl = this.formValue('fileId');
      photoIdControl?.setValue(this.imageId);
    }


    let formVal = this.staffForm.value;
formVal.role = 'Admin';

    this.postStaffDetails$ = this.authService.registerUser(formVal).subscribe(
      (results) => {
        this.postStaffDetails$.unsubscribe();
        window.location.reload()
      }
    );
  }


  compareFormAndStaff(): boolean {

    if (this.staff?.fullName == this.formValue('fullName')!.value &&
      this.staff?.contactNumber.toUpperCase() == this.formValue('contactNumber')!.value.toUpperCase() &&
      this.staff?.email.toUpperCase() == this.formValue('email')!.value.toUpperCase()) {
      return true;
    }

    return false;
  }

  formValue(name: string) {
    return this.staffForm.get(name);
  }


  ngOnDestroy(): void {
    if (this.postStaffDetails$) {
      this.postStaffDetails$.unsubscribe();
    }
  }
}
