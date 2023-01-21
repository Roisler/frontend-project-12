import React, {
  createContext,
  useState,
  useMemo,
} from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const currentUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser);
  const getAuthHeader = () => {
    const { token } = user;
    return { Authorization: `Bearer ${token}` };
  };

  const logIn = (loggedUser) => {
    setUser(loggedUser);
    localStorage.setItem('user', JSON.stringify(loggedUser));
  };
  const logOut = () => {
    localStorage.removeItem('user');
    setUser();
  };
  const value = useMemo(() => ({
    user,
    logIn,
    logOut,
    getAuthHeader,
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
