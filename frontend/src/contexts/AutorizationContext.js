import React, {
  createContext,
  useState,
  useMemo,
} from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const isLogin = () => {
    const user = localStorage.getItem('user');
    if (user) {
      return true;
    }
    return false;
  };

  const [isAuth, setIsAuth] = useState(isLogin());
  const logIn = () => setIsAuth(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setIsAuth(false);
  };
  const value = useMemo(() => ({
    isAuth,
    logIn,
    logOut,
  }), [isAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
