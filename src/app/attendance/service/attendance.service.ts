import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api-req/api.service';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Employees, EmployeesAndFollwing, Following } from 'src/app/interface';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  employeesAndFollowersChanged = new Subject<EmployeesAndFollwing>();
  employees: Employees[] = [];
  originalEmployees: Employees[] = [];
  followers: Following[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  setEmployees(employees: Employees[]) {
    this.employees = employees;
    this.originalEmployees = employees;
    this.setFolower();
    
  }

  setFolower() {
    let loggedUser = this.authService.getEmail();
    let employee = this.employees.filter(
      (employee) => employee.email === loggedUser
    );
    
    this.followers = employee[0].following;
  }

  getEmployees() {
    this.removeLoggedUser();
    this.removeFromEmployees();
    return this.employees.slice();
  }

  getFollowers() {
    return this.followers.slice();
  }

  removeLoggedUser() {
    let loggedUser = this.authService.getEmail();
    let userIndex = this.employees.findIndex(
      (data) => data.email === loggedUser
    );
    this.employees.splice(userIndex, 1);
  }

  removeFromEmployees() {
    if (this.followers.length > 0) {
      this.employees = this.employees.filter(
        (employee) =>
          !this.followers.filter(
            (follower) => employee.email === follower.email
          ).length
      );
    }
  }

  addEmployeesToFollowing(employee: Following) {
    let userIndex = this.employees.findIndex(
      (data) => data.email === employee.email
    );
    this.followers.push(employee);
    this.employees.splice(userIndex, 1);
    this.employeesAndFollowersChanged.next({
      employees: this.employees.slice(),
      following: this.followers.slice(),
    });
    let loggedUser = this.authService.getEmail();
    this.apiService.addFollower(loggedUser, employee).subscribe({
        next: (data) => {
            console.log("upisalo");
            
        }
    });
  }

  findFullEmployee(follower: Following) {
    let fullEmployee = this.originalEmployees.filter(
      (employee) => employee.email === follower.email
    );
    return fullEmployee[0];
  }

  removeEmployeesFromFollowing(index: number, follower: Following) {
    this.followers.splice(index, 1);
    this.employees.push(this.findFullEmployee(follower));
    this.employeesAndFollowersChanged.next({
      employees: this.employees.slice(),
      following: this.followers.slice(),
    });
    let loggedUser = this.authService.getEmail();
    this.apiService.removeMyFollower(loggedUser, follower).subscribe();
  }
}
