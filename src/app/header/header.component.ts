import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  userName: string = "";
  userImage: string = ""
  showDropdown: boolean = false;
  constructor(private route: Router, private product: ProductService) { }

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('user')) {
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData.firstName + " " + userData.lastName;
          this.userImage = userData.image
          console.log("userName", this.userName)
          this.menuType = 'user';
        } else {
          this.menuType = 'default';
        }
      }
    });
  }

  userLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    this.route.navigate(['/user-auth'])
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown; // Toggles the dropdown visibility
  }
}
