import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { successSweetAlert } from '../../data/sweet-alerts';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {
  @Input() token: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.verifyEmail();
  }

  verifyEmail() {
    if (!this.token) {
      return
    }
    this.authService.verifyEmail(this.token).subscribe({
      next: (res) => {
        if (res.success) {
          successSweetAlert('Mail doğrulama işlemi başarıyla gerçekleşti.');
          this.router.navigate(['login'])
        }
      },
      error: (e) => {
        console.log(e)
        this.router.navigate(['login'])
      },
      complete: () => { }
    })
  }
}
