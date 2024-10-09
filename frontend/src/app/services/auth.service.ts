import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginModel, OtpModel, RegisterModel, ResetPasswordModel, SuccesResponseModel, UserModel } from '../models/user';
import { EndpointService } from './endpoint.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private endpointService: EndpointService, private userService: UserService) { }

  login(data: LoginModel): Observable<SuccesResponseModel> {
    const url = this.endpointService.buildUrl('authLogin');
    return this.http.post<SuccesResponseModel>(url, data);
  }

  register(data: RegisterModel): Observable<SuccesResponseModel | SuccesResponseModel> {
    const url = this.endpointService.buildUrl('authRegister');
    return this.http.post<SuccesResponseModel | SuccesResponseModel>(url, data);
  }

  otp(data: OtpModel): Observable<UserModel | SuccesResponseModel> {
    const url = this.endpointService.buildUrl('authOtp');
    return this.http.post<UserModel | SuccesResponseModel>(url, data);
  }

  logout(): Observable<SuccesResponseModel> {
    const url = this.endpointService.buildUrl('authLogout');
    return this.http.post<SuccesResponseModel>(url, null).pipe(tap((res) => {
      this.userService.safeLocalStorageRemove('speedy-tige');
    }));
  }

  forgotPassword(data: { email: string }): Observable<SuccesResponseModel> {
    const url = this.endpointService.buildUrl('authForgotPassword');
    return this.http.post<SuccesResponseModel>(url, data);
  }

  verifyEmail(token: string): Observable<SuccesResponseModel> {
    const url = this.endpointService.buildUrl('authVerifyEmail', { token });
    return this.http.get<SuccesResponseModel>(url);
  }

  resetPassword(data: ResetPasswordModel): Observable<SuccesResponseModel> {
    const url = this.endpointService.buildUrl('authResetPassword');
    return this.http.post<SuccesResponseModel>(url, data);
  }

}

