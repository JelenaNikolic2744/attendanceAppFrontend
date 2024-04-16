import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';
import { AuthResponse, Employees, Following } from '../interface';
import { AttendanceService } from '../attendance/service/attendance.service';

export interface RegisterData {
  email: string;
  attendance: Date;
}

export interface UserData {
  email: string;
}

export interface PasswordData {
  email: string;
  password: string;
}

@Injectable()
export class ApiService {
  BASE_URL = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  unregister(unregisterData: UserData): Observable<any> {
    return this.httpClient.put<any>(
      `${this.BASE_URL}/user/reset-arrival`,
      unregisterData
    );
  }

  register(registerData: RegisterData): Observable<any> {
    return this.httpClient.put<any>(
      `${this.BASE_URL}/user/arrival`,
      registerData
    );
  }

  login(authData: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.BASE_URL}/auth`, authData)
      .pipe(
        tap((data) => {
          this.authService.setJwt(data);
          this.authService.setEmail(authData.email);
        })
      );
  }

  changePassword(passwordData: PasswordData): Observable<any> {
    return this.httpClient.put<any>(
      `${this.BASE_URL}/user/update-password`,
      passwordData
    );
  }

  getAllUsers(): Observable<Employees[]> {
    return this.httpClient.get<Employees[]>(`${this.BASE_URL}/user`);
  }

  addFollower(email: string, followingUser: Following): Observable<any> {
    let follower = {
      email: followingUser.email,
      name: followingUser.name,
      lastname: followingUser.lastname,
    };
    return this.httpClient.put<any>(`${this.BASE_URL}/user/my-followers`, {
      email: email,
      follower: follower,
    });
  }

  removeMyFollower(email: string, followingUser: Following): Observable<any> {
    return this.httpClient.put<any>(`${this.BASE_URL}/user/remove-follower`, {
      email: email,
      follower: followingUser,
    });
  }
}
