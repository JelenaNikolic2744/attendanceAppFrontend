import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api-req/api.service';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  registered: boolean = false;
  loggedUser: string = '';

  constructor(
    private route: Router,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loggedUser = this.authService.getEmail();
  }

  register() {
    this.registered = true;
    const currentDate = new Date();

    const registerData = { email: this.loggedUser, attendance: currentDate };
    this.apiService.register(registerData).subscribe({
      next: (data) => {
        console.log('registered');
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  cancel() {
    this.registered = false;
    const registerData = { email: this.loggedUser };
    this.apiService.unregister(registerData).subscribe({
      next: (data) => {
        console.log('canceled');
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  viewAttendance() {
    this.route.navigate(['attendance']);
  }
}
