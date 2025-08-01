import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  //global_DI
  private _toastr = inject(ToastrService); 
  private _router = inject(Router);
  private _authService = inject(AuthService);

  //forms
  loginForm:FormGroup =new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email]),
    password : new FormControl('',[Validators.required, Validators.minLength(8),Validators.maxLength(20)]),
  })

  isLogin:boolean=false;
  handleLogin(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      this._toastr.error("Please fill all required fields.","Validation Errors!");
      return 
    }

    if(this.loginForm.valid){
      // localStorage.setItem("token",'123123');
      // this._router.navigate(['/home']);
      this.isLogin=true;
      this.loginFun(this.loginForm.value);
    }
  }


  loginFun(data: any) {
    this._authService.login(data).subscribe(
      (res) => {
        if (res.success && res.message) {
          this._toastr.success(res.message, "Suceess");
          localStorage.setItem("token",res.token);
          localStorage.setItem("userDetails",JSON.stringify(res.user));
             this.isLogin=false;
          this._router.navigate(['/home']);
        }else{
          this.isLogin=false;
          this._toastr.error(res.message || "Something went wront on backend.","Error!")
        }
      },
      (err) => {
        this.isLogin=false;
        this._toastr.error(err.error.message, "Error!");
      }
    )
  }
}
