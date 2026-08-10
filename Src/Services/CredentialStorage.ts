import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDENTIALS_KEY = 'remembered_credentials';

export interface RememberedCredentials {
  identifier: string;
  password: string;
}

export const saveRememberedCredentials = async (
  identifier: string,
  password: string,
) => {
  try {
    await AsyncStorage.setItem(
      CREDENTIALS_KEY,
      JSON.stringify({ identifier, password }),
    );
  } catch (error) {
    console.warn('Unable to save credentials:', error);
  }
};

export const loadRememberedCredentials = async ():
  | Promise<RememberedCredentials | null> => {
  try {
    const stored = await AsyncStorage.getItem(CREDENTIALS_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as RememberedCredentials;
  } catch (error) {
    console.warn('Unable to load credentials:', error);

    return null;
  }
};

export const clearRememberedCredentials = async () => {
  try {
    await AsyncStorage.removeItem(CREDENTIALS_KEY);
  } catch (error) {
    console.warn('Unable to clear credentials:', error);
  }
};
