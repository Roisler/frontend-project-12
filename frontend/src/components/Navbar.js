import React from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';

const NavBar = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  return (
    <Container>
      <Navbar expand="lg" variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
          {auth.isAuth && <Button variant="primary" onClick={() => auth.logOut()}>{t('basic.logout')}</Button>}
        </Container>
      </Navbar>
    </Container>
  );
};

export default NavBar;
