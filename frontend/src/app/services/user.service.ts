import { Injectable, signal, WritableSignal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserModel } from '../models/user';

export interface Token {
  exp: number;
  iat: number;
  user: UserModel;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private tokenKey: string = 'speedy-tiger';
  isLoggedInSignal: WritableSignal<boolean> = signal(false);
  isOtpCode: WritableSignal<string | undefined> = signal(undefined);
  userInformation: WritableSignal<UserModel | undefined> = signal(undefined);

  constructor() {
    this.checkLoginStatus();
    this.loadUserInformation();
  }

  private checkLoginStatus(): void {
    const token = this.getAuthToken();
    if (token && !this.isTokenExpired(token)) {
      this.isLoggedInSignal.set(true);
    } else {
      this.isLoggedInSignal.set(false);
    }
  }

  setAuthToken(authToken: string): void {
    this.safeLocalStorageSet(this.tokenKey, authToken);
    this.checkLoginStatus();
    this.loadUserInformation();
  }

  private loadUserInformation(): void {
    const token = this.getAuthToken();
    if (!token) return;

    try {
      const data: Token = jwtDecode(token);
      this.userInformation.set(data.user);
    } catch (error) {
      console.error('Invalid token:', error);
      this.userInformation.set(undefined);
    }
  }

  removeAuthToken(): void {
    this.safeLocalStorageRemove(this.tokenKey);
    this.isLoggedInSignal.set(false);
    this.userInformation.set(undefined);
  }

  getAuthToken(): string | null {
    return this.safeLocalStorageGet(this.tokenKey);
  }

  getOtpCode(): string | undefined {
    return this.isOtpCode();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: Token = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return true;
    }
  }

  private safeLocalStorageGet(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private safeLocalStorageSet(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  }

  public safeLocalStorageRemove(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }
}
