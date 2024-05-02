import { Component, NgZone } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { loginFormHeader } from '@shared/model/design/login.model';
import { UserService } from '@shared/service/user-service/user.service';
import { Subscription } from 'rxjs';
import { ManagementRouteConstant } from 'src/app/constant/routing/management-routing-constant.model';
import { UserRouteConstant } from 'src/app/constant/routing/user-routing-constant.model';
import { SnackbarService } from 'src/app/templates/snackbar/snackbar-service/snackbar.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth-service/auth.service';
import { LoginModel } from '../../auth-service/model/auth.model';
import { LoginService } from '../login/login-service/login.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    fileId: new FormControl(),

  });
  imageUrl!: string | null;
  imageId !: number | null;

  mgmtRoute = ManagementRouteConstant
  postUser$ !: Subscription

  private clientId = environment.clientId;
  formHeader !: loginFormHeader;
  loginWithGoogleSubscription$ !: Subscription
  isGoogleLogin: boolean = false;
  constructor(
    public router: Router,
    public service: AuthService,
    private _ngZone: NgZone,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private loginService: LoginService,
    private userService: UserService, private snackService: SnackbarService) {
    this.formHeader = loginService.formHeader;
  }

  ngOnInit(): void {

   
  }


  

   onSubmit() {
    //this.formSubmitAttempt = false;
    if (this.form.valid) {
      if (this.imageId) {
        const photoIdControl = this.form.get('fileId');
        photoIdControl?.setValue(this.imageId);
      }
      
    
  
      this.postUser$ = this.service.registerUser(this.form.value).subscribe(
        (results: any) => {
         this.router.navigate(['/' + ManagementRouteConstant.login])
        }
      );

      
    } 
  }

  formValue(name: string) {
    return this.form.get(name);
  }

  ngOnDestroy(): void {
      if(this.postUser$){
        this.postUser$.unsubscribe()
      }
  }


}
