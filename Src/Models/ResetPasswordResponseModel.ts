export interface ResetPasswordResponseJson {
  success: boolean | string;
  message: string;
  data?: Record<string, unknown>;
}

export class ResetPasswordResponseModel {
  success: boolean;
  message: string;

  constructor({
    success,
    message,
  }: {
    success: boolean;
    message: string;
  }) {
    this.success = success;
    this.message = message;
  }

  static fromJson(
    json: ResetPasswordResponseJson,
  ): ResetPasswordResponseModel {
    return new ResetPasswordResponseModel({
      success: json.success === true || json.success === 'true',
      message: json.message,
    });
  }
}
