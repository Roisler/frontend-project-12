import React from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

const NavBar = () => {
  const auth = useAuth();
  return (
    <Container>
      <Navbar expand="lg" variant="light" bg="light">
        <Container>
          <Navbar.Brand href="#">Hexlet Chat</Navbar.Brand>
          {auth.isAuth && <Button variant="primary" onClick={() => auth.logOut()}>Выйти</Button>}
        </Container>
      </Navbar>
    </Container>
  );
};

export default NavBar;
