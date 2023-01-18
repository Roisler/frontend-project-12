import React, {
  createContext,
  useState,
  useMemo,
} from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const user = localStorage.getItem('user');

  const [isAuth, setIsAuth] = useState(!!user);
  const getUsername = () => {
    if (user) {
      const { username } = JSON.parse(user);
      return username;
    }
    return null;
  };

  const getAuthHeader = () => {
    const { token } = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${token}` };
  };

  const logIn = () => setIsAuth(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setIsAuth(false);
  };
  const value = useMemo(() => ({
    isAuth,
    logIn,
    logOut,
    getAuthHeader,
    getUsername,
  }), [isAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
