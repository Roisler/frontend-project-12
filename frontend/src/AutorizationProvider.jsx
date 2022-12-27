/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import AutorizationContext from './AutorizationContext';

const AutorizationProvider = ({ children }) => {
  const [statusAuth, setStatusAuth] = React.useState(false);
  const logIn = () => setStatusAuth(true);
  const logOut = (user) => {
    localStorage.removeItem(user);
    setStatusAuth(false);
  };

  return (
    <AutorizationContext.Provider value={{ statusAuth, logIn, logOut }}>
      {children}
    </AutorizationContext.Provider>
  );
};

export default AutorizationProvider;
