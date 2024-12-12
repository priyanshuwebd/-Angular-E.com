import { Component, OnInit } from '@angular/core';
import { login } from '../data-type';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true
  authError: string = "";
  constructor(private user: UserService, private product: ProductService) { }

  ngOnInit(): void {
    // to check is user logged in already
    this.user.userAuthReload();
  }

  login(data: login) {
    this.user.userLogin(data)
    this.user.invalidUserAuth.subscribe((result) => {
      console.warn(result);
      if (result) {
        this.authError = "Invalid Credentials"
      }
    })
  }

  openLogin() {
    this.showLogin = true;
  }
}