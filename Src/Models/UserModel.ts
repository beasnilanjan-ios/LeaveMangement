export interface UserJson {
  id: number;
  employee_id: number;
  name: string;
  email: string;
  designation: string;
  role: string;
}

export class UserModel {
  id: number;
  employeeId: number;
  name: string;
  email: string;
  designation: string;
  role: string;

  constructor({
    id,
    employeeId,
    name,
    email,
    designation,
    role,
  }: {
    id: number;
    employeeId: number;
    name: string;
    email: string;
    designation: string;
    role: string;
  }) {
    this.id = id;
    this.employeeId = employeeId;
    this.name = name;
    this.email = email;
    this.designation = designation;
    this.role = role;
  }

  static fromJson(json: UserJson): UserModel {
    return new UserModel({
      id: json.id,
      employeeId: json.employee_id,
      name: json.name,
      email: json.email,
      designation: json.designation,
      role: json.role,
    });
  }
}
