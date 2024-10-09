import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public userService: UserService, private authService: AuthService, private router: Router) {

  }

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        if (data.success) {
          this.userService.removeAuthToken();
          this.router.navigate([''])
        }
      },
      error: (e) => {

      }
    })
  }


}
