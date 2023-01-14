/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';

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
      setAuthFailed(false);
      try {
        const response = await axios.post('/api/v1/login', values);
        const { username, token } = response.data;
        localStorage.setItem('user', JSON.stringify({ username, token }));
        auth.logIn();
      } catch (err) {
        if (err.name === 'AxiosError' && err.response.status === 401) {
          setAuthFailed(true);
          return;
        }
        throw err;
      }
    },
  });
  return (
    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
      <h1 className="text-center mb4">{t('basic.signin')}</h1>
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
      <Button type="submit">{t('basic.send')}</Button>
      <Button href="/signup">{t('basic.signup')}</Button>
    </Form>
  );
};

export default Login;
