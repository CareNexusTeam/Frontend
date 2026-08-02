export interface LoginRequest {

  email: string;
  password: string;

}

export interface SignupRequest {

  name: string;

  email: string;

  password: string;

  phone: number;

  role: string;

  departmentId?: number;

}

export interface AuthResponse {

  token: string;

  userId: number;

  name: string;

  email: string;

  role: string;

}