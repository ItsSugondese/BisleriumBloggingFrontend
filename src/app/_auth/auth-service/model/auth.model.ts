export interface ForgotPassword{
    userEmail: string;
}

export interface ValidateToken{
    resetToken: string;
}

export interface ChangePassword{
    token: string;
    password: string;
    confirmPassword: string;
    email : string;
}

export interface LoginModel{
    email: string;
    password: string;
}