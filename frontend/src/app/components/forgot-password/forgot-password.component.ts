import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { successSweetAlert } from '../../data/sweet-alerts';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  constructor(private authService: AuthService, private ngbModal: NgbModal) { }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (data) => {
          if (data.success) {
            successSweetAlert('Yeni şifre için talep gönderindi').finally(() => {
              import('../otp-verification/otp-verification.component').then((m) => {
                const modalRef = this.ngbModal.open(m.OtpVerificationComponent);
                modalRef.componentInstance.data = {
                  email: this.forgotPasswordForm.get('email')?.value,
                  type: 'forgot-password'
                }
              })
            });
          }
        },
        error: (e) => {
          console.log(e)
        }
      })
    }
  }
}
