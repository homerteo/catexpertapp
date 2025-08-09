import { Component, inject, OnInit } from '@angular/core';
import { Users } from '../../services/users';

@Component({
  selector: 'app-user-info',
  imports: [],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss'
})
export class UserInfo {
  private userService = inject(Users);

  readonly userInfo = this.userService.currentUser;



}
