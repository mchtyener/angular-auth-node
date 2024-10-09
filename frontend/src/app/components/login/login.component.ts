import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  })

  constructor(private authService: AuthService, private ngbModal: NgbModal) { }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (data) => {
        if (data.success) {
          import('../otp-verification/otp-verification.component').then((m) => {
            const modalRef = this.ngbModal.open(m.OtpVerificationComponent);
            modalRef.componentInstance.data = {
              email: this.loginForm.get('email')?.value,
              type: 'login',
            }
          })
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

}
