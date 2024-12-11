import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { login, signUp } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidUserAuth = new EventEmitter<boolean>(false)
  constructor(private http: HttpClient, private router: Router) { }

  userLogin(data: { email: string; password: string }) {
    const loginPayload = {
      username: data.email,
      password: data.password,
      expiresInMins: 30,
    };

    this.http
      .post<{ accessToken: string; refreshToken: string; id: number; username: string; email: string; firstName: string; lastName: string; gender: string; image: string }>(
        'https://dummyjson.com/auth/login',
        loginPayload
      )
      .subscribe(
        (result) => {
          if (result && result.accessToken) {
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('user', JSON.stringify(result));
            this.router.navigate(['/']);
            this.invalidUserAuth.emit(false);
          } else {
            this.invalidUserAuth.emit(true);
          }
        },
        (error) => {
          console.error('Login failed', error);
          this.invalidUserAuth.emit(true);
        }
      );
  }


  userAuthReload() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }
}
