import { LoginResponseModel } from '../Models/LoginResponseModel';
import { UserModel } from '../Models/UserModel';

let currentLoginResponse: LoginResponseModel | null = null;
let currentUser: UserModel | null = null;

export const setCurrentLoginResponse = (loginResponse: LoginResponseModel) => {
  currentLoginResponse = loginResponse;
};

export const getCurrentLoginResponse = () => currentLoginResponse;

export const getAuthToken = () => currentLoginResponse?.token ?? '';

export const clearCurrentLoginResponse = () => {
  currentLoginResponse = null;
};

export const setCurrentUser = (user: UserModel) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;

export const clearCurrentUser = () => {
  currentUser = null;
};
