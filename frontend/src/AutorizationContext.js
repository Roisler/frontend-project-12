/* eslint-disable react/prop-types */
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
} from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const logIn = () => setIsAuth(true);
  const logOut = (user) => {
    localStorage.removeItem(user);
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

export default () => useContext(AuthContext);
