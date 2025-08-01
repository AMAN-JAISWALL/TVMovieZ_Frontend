import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  //global_DI
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);

  //forms
  registerForm: FormGroup = new FormGroup({
    full_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
    confirmation_password: new FormControl('', [Validators.required]),
  }, { validators: this.passwordMatchValidator })

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmation_password')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }


  handleRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this._toastr.error("Please fill all required fields.", "Validation Errors!");
      return
    }

    if (this.registerForm.valid) {
      const data ={
       'full_name': this.registerForm.get('full_name')?.value || '',
        "email": this.registerForm.get('email')?.value || '',
        "password": this.registerForm.get('password')?.value || '',
      }
      this.registerFun(data);
    }
  }

  registerFun(data: any) {
    this._authService.register(data).subscribe(
      (res) => {
        if (res.success && res.message) {
          this._toastr.success(res.message, "Suceess");
          this.registerForm.reset();
        }else{
          this._toastr.error(res.message || "Something went wront on backend.","Error!")
        }
      },
      (err) => {
        this._toastr.error(err.error.message, "Error!");
      }
    )
  }
}

