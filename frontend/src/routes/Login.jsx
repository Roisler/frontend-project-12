/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import useAuth from '../AutorizationContext';

const Login = () => {
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
        localStorage.setItem(username, JSON.stringify({ userId: username, token }));
        auth.logIn();
      } catch (err) {
        formik.setSubmitting(false);
        if (err.name === 'AxiosError' && err.response.status === 401) {
          setAuthFailed(true);
          return;
        }
        throw err;
      }
    },
    validationSchema: yup.object({
      username: yup.string().min(2, 'Должно быть не менее 2 символов').required('Обязательное поле'),
      password: yup.string()
        .min(3, 'Должен быть не менее 3 символов')
        .required('Обязательное поле'),
    }),
  });
  return (
    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
      <h1 className="text-center mb4">Войти</h1>
      <Form.Group className="form-floating mb-3">
        <FormControl
          id="username"
          name="username"
          type="text"
          value={formik.values.username}
          placeholder="Ваш ник"
          onChange={formik.handleChange}
          isInvalid={authFailed}
        />
        <Form.Label htmlFor="username">Ваш ник</Form.Label>
      </Form.Group>
      <Form.Group className="form-floating mb-4">
        <FormControl
          id="password"
          name="password"
          type="password"
          placeholder="Пароль"
          onChange={formik.handleChange}
          value={formik.values.password}
          isInvalid={authFailed}
        />
        <Form.Label htmlFor="password">Пароль</Form.Label>
        <Form.Control.Feedback type="invalid">Неверные имя пользователя или пароль</Form.Control.Feedback>
      </Form.Group>
      <Button type="submit">Отправить</Button>
    </Form>
  );
};

export default Login;
