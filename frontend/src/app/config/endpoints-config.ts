export interface EndpointsConfig {
  authLogin: string;
  authRegister: string;
  authLogout: string;
  authOtp: string;
  authForgotPassword: string;
  authVerifyEmail: string
  authResetPassword: string
}

export const API_CONFIG = {
  ENDPOINTS: {
    authLogin: 'auth/login',
    authRegister: 'auth/register',
    authLogout: 'auth/logout',
    authOtp: 'auth/verify-otp',
    authForgotPassword: 'auth/forgot-password',
    authVerifyEmail: 'auth/verify-email/${token}',
    authResetPassword: 'auth/reset-password'
  }
};
