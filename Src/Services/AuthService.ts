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

import { UserJson, UserModel } from '../Models/UserModel';

import { BASE_URL } from './ApiConfig';
import { getAuthToken } from './AuthSession';

const LOGIN_URL = `${BASE_URL}/api/auth/login`;
const FORGOT_PASSWORD_URL = `${BASE_URL}/api/auth/forgot-password`;
const RESET_PASSWORD_URL = `${BASE_URL}/api/auth/reset-password`;
const ME_URL = `${BASE_URL}/api/auth/me`;

export const login = async (
  identifier: string,
  password: string,
): Promise<LoginResponseModel> => {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  const json = (await response.json()) as LoginResponseJson;

  if (!response.ok) {
    throw new Error(json.message || 'Unable to login');
  }

  const loginResponse = LoginResponseModel.fromJson(json);

  if (!loginResponse.success) {
    throw new Error(loginResponse.message || 'Login failed');
  }

  return loginResponse;
};

export const forgotPassword = async (
  identifier: string,
  newPassword: string,
): Promise<ForgotPasswordResponseModel> => {
  const response = await fetch(FORGOT_PASSWORD_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier,
      newPassword,
    }),
  });

  const json = (await response.json()) as ForgotPasswordResponseJson;

  const forgotPasswordResponse = ForgotPasswordResponseModel.fromJson(json);

  if (!response.ok || !forgotPasswordResponse.success) {
    throw new Error(
      forgotPasswordResponse.message || 'Unable to reset password',
    );
  }

  return forgotPasswordResponse;
};

export const resetPassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<ResetPasswordResponseModel> => {
  const token = getAuthToken();

  const response = await fetch(RESET_PASSWORD_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const json = (await response.json()) as ResetPasswordResponseJson;

  const resetPasswordResponse = ResetPasswordResponseModel.fromJson(json);

  if (!response.ok || !resetPasswordResponse.success) {
    throw new Error(
      resetPasswordResponse.message || 'Unable to change password',
    );
  }

  return resetPasswordResponse;
};

export const getCurrentUser = async (): Promise<UserModel> => {
  const token = getAuthToken();

  const response = await fetch(ME_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const json = (await response.json()) as {
    success?: boolean | string;
    message?: string;
    data?: UserJson;
  };

  if (!response.ok) {
    throw new Error(json.message || 'Unable to load profile');
  }

  if (!json.data) {
    throw new Error(json.message || 'Unable to load profile');
  }

  if (!(json.success === true || json.success === 'true')) {
    throw new Error(json.message || 'Unable to load profile');
  }

  return UserModel.fromJson(json.data);
};
