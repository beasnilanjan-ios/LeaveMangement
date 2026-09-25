import { LoginResponseModel } from '../Models/LoginResponseModel';
import { UserModel } from '../Models/UserModel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_RESPONSE_KEY = 'login_response';

let currentLoginResponse: LoginResponseModel | null = null;
let currentUser: UserModel | null = null;

export const setCurrentLoginResponse = (loginResponse: LoginResponseModel) => {
  currentLoginResponse = loginResponse;

  // persist in background; callers don't need to await
  try {
    AsyncStorage.setItem(LOGIN_RESPONSE_KEY, JSON.stringify(loginResponse)).catch(err => {
      console.warn('Unable to persist login response', err);
    });
  } catch (err) {
    console.warn('Unable to persist login response', err);
  }
};

export const getCurrentLoginResponse = () => currentLoginResponse;

export const getAuthToken = () => currentLoginResponse?.token ?? '';

export const clearCurrentLoginResponse = () => {
  currentLoginResponse = null;
  try {
    AsyncStorage.removeItem(LOGIN_RESPONSE_KEY).catch(err => {
      console.warn('Unable to clear persisted login response', err);
    });
  } catch (err) {
    console.warn('Unable to clear persisted login response', err);
  }
};

export const initAuthSession = async () => {
  try {
    const raw = await AsyncStorage.getItem(LOGIN_RESPONSE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);

    // Reconstruct LoginResponseModel instance shape
    currentLoginResponse = new LoginResponseModel({
      success: Boolean(parsed.success),
      message: parsed.message || '',
      token: parsed.token || '',
      user: parsed.user || ({} as any),
    });
  } catch (err) {
    console.warn('Unable to initialize auth session', err);
  }
};

export const setCurrentUser = (user: UserModel) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;

export const clearCurrentUser = () => {
  currentUser = null;
};
