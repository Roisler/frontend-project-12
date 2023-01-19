import React from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const NavBar = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  return (
    <Navbar expand="lg" variant="light" bg="light" className="shadow">
      <Container>
        <Link className="navbar-brand" to="/">Hexlet Chat</Link>
        {auth.user && <Button variant="primary" onClick={() => auth.logOut()}>{t('basic.logout')}</Button>}
      </Container>
    </Navbar>
  );
};

export default NavBar;
