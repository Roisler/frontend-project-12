/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  Button,
  Card,
  Image,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';
import NavBar from './Navbar';

const Login = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isAuth) {
      const { from } = location.state || { from: { pathname: '/' } };
      navigate(from);
    }
  }, [auth.isAuth]);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/api/v1/login', values);
        const { username, token } = response.data;
        localStorage.setItem('user', JSON.stringify({ username, token }));
        auth.logIn();
      } catch (err) {
        if (err.response?.status === 401) {
          setAuthFailed(true);
          return;
        }
        if (err.isAxiosError) {
          toast.error(t('errors.connect'));
        }
        throw new Error(err.message);
      }
    },
  });
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <Card.Body className="row p-5">
                <Col className="d-flex align-items-center justify-content-center">
                  <Image roundedCircle src="loginImage.jpeg" alt="Войти" />
                </Col>
                <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                  <h1 className="text-center mb-4">{t('basic.signin')}</h1>
                  <Form.Group className="form-floating mb-3">
                    <FormControl
                      id="username"
                      name="username"
                      type="text"
                      value={formik.values.username}
                      placeholder={t('basic.nickname')}
                      onChange={formik.handleChange}
                      isInvalid={authFailed}
                    />
                    <Form.Label htmlFor="username">{t('basic.nickname')}</Form.Label>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <FormControl
                      id="password"
                      name="password"
                      type="password"
                      placeholder={t('basic.password')}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      isInvalid={authFailed}
                    />
                    <Form.Label htmlFor="password">{t('basic.password')}</Form.Label>
                    <Form.Control.Feedback type="invalid">{t('errors.invalid_auth')}</Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" className="w-100 mb-3">{t('basic.signin')}</Button>
                </Form>
              </Card.Body>
              <Card.Footer className="p-4">
                <div className="text-center">
                  <span className="me-3">Нет аккаунта?</span>
                  <Link to="/signup">{t('basic.registration')}</Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
