export interface LoginUser {
  id: number;
  employeeId: number;
  name: string;
  email: string;
  designation: string;
  role: string;
}

interface LoginUserJson {
  id: number;
  employee_id: number;
  name: string;
  email: string;
  designation: string;
  role: string;
}

interface LoginDataJson {
  token: string;
  user: LoginUserJson;
}

export interface LoginResponseJson {
  success: boolean | string;
  message: string;
  data?: LoginDataJson;
}

export class LoginResponseModel {
  success: boolean;
  message: string;
  token: string;
  user: LoginUser;

  constructor({
    success,
    message,
    token,
    user,
  }: {
    success: boolean;
    message: string;
    token: string;
    user: LoginUser;
  }) {
    this.success = success;
    this.message = message;
    this.token = token;
    this.user = user;
  }

  static fromJson(json: LoginResponseJson): LoginResponseModel {
    if (!json.data) {
      throw new Error(json.message || 'Login failed');
    }

    return new LoginResponseModel({
      success: json.success === true || json.success === 'true',
      message: json.message,
      token: json.data.token,
      user: {
        id: json.data.user.id,
        employeeId: json.data.user.employee_id,
        name: json.data.user.name,
        email: json.data.user.email,
        designation: json.data.user.designation,
        role: json.data.user.role,
      },
    });
  }
}
