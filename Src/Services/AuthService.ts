import {
  LoginResponseJson,
  LoginResponseModel,
} from '../Models/LoginResponseModel';

import {
  ForgotPasswordResponseJson,
  ForgotPasswordResponseModel,
} from '../Models/ForgotPasswordResponseModel';

import {
  ResetPasswordResponseJson,
  ResetPasswordResponseModel,
} from '../Models/ResetPasswordResponseModel';

import {UserJson, UserModel} from '../Models/UserModel';

import RestApi from './RestApi';

export const login = async (
  identifier: string,
  password: string,
): Promise<LoginResponseModel> => {
  const json = await RestApi.post<LoginResponseJson>(
    '/api/auth/login',
    {
      identifier,
      password,
    },
  );

  const response = LoginResponseModel.fromJson(json);

  if (!response.success) {
    throw new Error(response.message || 'Login failed');
  }

  return response;
};

export const forgotPassword = async (
  identifier: string,
  newPassword: string,
): Promise<ForgotPasswordResponseModel> => {
  const json = await RestApi.post<ForgotPasswordResponseJson>(
    '/api/auth/forgot-password',
    {
      identifier,
      newPassword,
    },
  );

  const response = ForgotPasswordResponseModel.fromJson(json);

  if (!response.success) {
    throw new Error(
      response.message || 'Unable to reset password',
    );
  }

  return response;
};

export const resetPassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<ResetPasswordResponseModel> => {
  const json = await RestApi.post<ResetPasswordResponseJson>(
    '/api/auth/reset-password',
    {
      currentPassword,
      newPassword,
    },
  );

  const response = ResetPasswordResponseModel.fromJson(json);

  if (!response.success) {
    throw new Error(
      response.message || 'Unable to change password',
    );
  }

  return response;
};

export const getCurrentUser = async (): Promise<UserModel> => {
  const json = await RestApi.get<{
    success?: boolean | string;
    message?: string;
    data?: UserJson;
  }>('/api/auth/me');

  if (!json.data) {
    throw new Error(json.message || 'Unable to load profile');
  }

  if (!(json.success === true || json.success === 'true')) {
    throw new Error(json.message || 'Unable to load profile');
  }

  return UserModel.fromJson(json.data);
};