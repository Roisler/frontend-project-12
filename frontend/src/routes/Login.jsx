/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import {
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import AutorizationContext from '../AutorizationContext';

const Login = () => {
  const context = React.useContext(AutorizationContext);
  const [error, setError] = useState();
  /* const { statusAuth } = context;
     useEffect(() => {
    console.log(statusAuth);
    if (statusAuth) {
      redirect('/');
    }
  }, [statusAuth]); */
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async () => {
      await axios.post('/api/v1/login', { username: formik.values.username, password: formik.values.password })
        .then((response) => {
          const { username, token } = response.data;
          localStorage.setItem(username, token);
          context.logIn();
          setError();
          window.location.href = '/';
        })
        .catch((e) => {
          setError(e);
          console.log(e);
        });
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
          className={error ? 'is-invalid' : ''}
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
          className={error ? 'is-invalid' : ''}
        />
        <Form.Label htmlFor="password">Пароль</Form.Label>
        {error ? <div className="invalid-tooltip">Неверные имя пользователя или пароль</div> : null}
      </Form.Group>
      <Button type="submit">Отправить</Button>
    </Form>
  );
};

export default Login;
