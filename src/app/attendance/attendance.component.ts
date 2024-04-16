import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api-req/api.service';
import { Employees, Following } from '../interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';
import { AttendanceService } from './service/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class AttendanceComponent implements OnInit, OnDestroy {
  private employeesAndFollowersChangeSub: Subscription | undefined;
  openedClosed: boolean = false;
  openedClosedText: string = 'open';
  employees: Employees[] = [];
  loggedUser: string = '';
  followers: Following[] = [];

  constructor(
    private apiService: ApiService,
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {
    this.apiService.getAllUsers().subscribe({
      next: (data) => {
        this.attendanceService.setEmployees(data);
        this.getFollowersAndEmployees();
        console.log(this.employees);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
  getFollowersAndEmployees() {
    this.employees = this.attendanceService.getEmployees();
    this.followers = this.attendanceService.getFollowers();
  }

  ngOnInit(): void {
    this.loggedUser = this.authService.getEmail();
    this.employeesAndFollowersChangeSub =
      this.attendanceService.employeesAndFollowersChanged.subscribe({
        next: (data) => {
          this.followers = data.following;
          this.employees = data.employees;
        },
      });
  }
  ngOnDestroy(): void {
    this.employeesAndFollowersChangeSub!.unsubscribe();
  }

  openClose() {
    this.openedClosed = !this.openedClosed;
    this.openedClosedText = 'close';
  }

  remove(index: number) {
    this.attendanceService.removeEmployeesFromFollowing(
      index,
      this.followers[index]
    );
  }

  add(index: number) {
    this.attendanceService.addEmployeesToFollowing(this.employees[index]);
  }
}
