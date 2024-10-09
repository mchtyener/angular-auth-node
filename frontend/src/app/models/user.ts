export interface UserModel {
  firstName?: string;
  lastName?: string;
  email?: string;
  passowrd?: string;
  phone?: string;
  role?: string;
  token?: string;
  success?: boolean
}

export interface SuccesResponseModel {
  message?: string;
  success?: boolean;
  token?: string;
}


export interface LoginModel {
  email?: string;
  passowrd?: string;
}

export interface RegisterModel {
  firstName?: string;
  lastName?: string;
  email?: string;
  passowrd?: string;
  confirmPassword?: string;
  phone?: string;
}

export interface ForgotPasswordaAndVerifyEmailModel {
  email?: string;
  passowrd?: string;
}
export interface ResetPasswordModel {
  email?: string;
  passowrd?: string;
  confirmPassword?: string;
}



export interface OtpModel {
  email?: string;
  type?: string;
  otp?: string
}

