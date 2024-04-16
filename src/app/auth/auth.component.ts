import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api-req/api.service';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;
  authFailed = false;
  forgotPasswordPrim = false;
  buttonText = 'Login';

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit(form: FormGroup): void {
    if (this.forgotPasswordPrim) {
      this.forgotPasswordPrim = false;
      this.buttonText = 'Login';
    } else {
      const authData = {
        email: form.value.email,
        password: form.value.password,
      };
      this.apiService.login(authData).subscribe({
        next: (data) => {
          this.router.navigate(['home']);
        },
        error: (e) => {
          console.error(e);
        },
      });
    }
  }

  forgotPassword() {
    this.forgotPasswordPrim = true;
    this.buttonText = 'Submit';
  }
}
