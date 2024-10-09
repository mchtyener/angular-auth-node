import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgxMaskDirective,
  NgxMaskPipe,
  provideNgxMask,
} from 'ngx-mask';
import { successSweetAlert } from '../../data/sweet-alerts';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [
    provideNgxMask()
  ]
})
export class RegisterComponent {

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  }, { validators: this.passwordMatchValidator() })

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { 'passwordMismatch': true };
      }
      return null;
    };
  }

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    if (!this.registerForm.valid) {
      alert()
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (data) => {
        if (data.success) {
          successSweetAlert('Kullanıcı başarıyla kaydedildi.').finally(() => this.router.navigate(['login']));
        }
      },
      error: (err) => console.log(err),
      complete: () => { }
    })
  }

}

