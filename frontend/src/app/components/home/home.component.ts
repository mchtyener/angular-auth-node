import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { UserModel } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userInformation: UserModel | undefined = undefined

  constructor(private userService: UserService) {
    this.userInformation = this.userService.userInformation();

  }

}
