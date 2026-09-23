import Cookies from 'js-cookie';

export const TOKEN_COOKIE_NAME = 'doctor_tracker_token';

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    expires: 7, // 7 days matching JWT expiration
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE_NAME);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
};
