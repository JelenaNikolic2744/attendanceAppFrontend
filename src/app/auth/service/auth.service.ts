import { Injectable } from '@angular/core';

const JWT: string = 'jwt';
const EMAIL: string = 'email';

@Injectable()
export class AuthService {
  constructor() {}

  setJwt(data: any) {
    window.localStorage.removeItem(JWT);
    window.localStorage.setItem(JWT, JSON.stringify(data.jwt));
  }

  removeJwt() {
    window.localStorage.removeItem(JWT);
  }

  getJwt() {
    const jwt = window.localStorage.getItem(JWT);
    if (jwt) {
      return JSON.parse(jwt);
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const jwt = window.localStorage.getItem(JWT);
    if (jwt) {
      return true;
    }
    return false;
  }

  setEmail(email: string) {
    window.localStorage.removeItem(EMAIL);
    window.localStorage.setItem(EMAIL, JSON.stringify(email));
  }

  getEmail() {
    const email = window.localStorage.getItem(EMAIL);
    if (email) {
      return JSON.parse(email);
    }
    return null;
  }
}
