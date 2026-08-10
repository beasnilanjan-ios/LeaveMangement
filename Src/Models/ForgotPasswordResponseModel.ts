export interface ForgotPasswordEmployee {
  name: string;
  email: string;
  employeeId: number;
}

interface ForgotPasswordEmployeeJson {
  name: string;
  email: string;
  employee_id: number;
}

interface ForgotPasswordDataJson {
  employee: ForgotPasswordEmployeeJson;
}

export interface ForgotPasswordResponseJson {
  success: boolean | string;
  message: string;
  data?: ForgotPasswordDataJson;
}

export class ForgotPasswordResponseModel {
  success: boolean;
  message: string;
  employee: ForgotPasswordEmployee | null;

  constructor({
    success,
    message,
    employee,
  }: {
    success: boolean;
    message: string;
    employee: ForgotPasswordEmployee | null;
  }) {
    this.success = success;
    this.message = message;
    this.employee = employee;
  }

  static fromJson(
    json: ForgotPasswordResponseJson,
  ): ForgotPasswordResponseModel {
    return new ForgotPasswordResponseModel({
      success: json.success === true || json.success === 'true',
      message: json.message,
      employee: json.data
        ? {
            name: json.data.employee.name,
            email: json.data.employee.email,
            employeeId: json.data.employee.employee_id,
          }
        : null,
    });
  }
}
