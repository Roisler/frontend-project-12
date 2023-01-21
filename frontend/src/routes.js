const host = 'api/v1';

export default {
  loginPath: () => [host, 'login'].join('/'),
  signupPath: () => [host, 'signup'].join('/'),
  dataPath: () => [host, 'data'].join('/'),
  login: '/login',
  chat: '/',
  signup: '/signup',
  error: '*',
};
