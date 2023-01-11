import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Registration = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [regFailed, setRegFailed] = useState(false);
  /* useEffect(() => {
    if (auth.isAuth) {
      const { from } = location.state || { from: { pathname: '/' } };
      navigate(from);
    }
  }, [auth.isAuth]); */
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/api/v1/signup', values);
        const { username, token } = response.data;
        localStorage.setItem('user', JSON.stringify({ username, token }));
        auth.logIn();
        navigate({ pathname: '/' });
        setRegFailed(false);
      } catch (e) {
        if (e.response.status === 409) {
          setRegFailed(true);
        }
        throw e;
      }
    },
    validationSchema: yup.object({
      username: yup.string().min(3, 'От 3 до 20 символов').required('Введите ник'),
      password: yup.string().min(6, 'Не менее 6 символов').required('Введите пароль'),
      confirmPassword: yup.string().oneOf([yup.ref('password')], 'Пароли не совпадают').required('Введите пароль'),
    }),
  });
  const { touched, errors } = formik;
  return (
    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
      <h1 className="text-center mb4">Регистрация</h1>
      <Form.Group className="form-floating mb-3">
        <Form.Control
          id="username"
          name="username"
          type="text"
          value={formik.values.username}
          placeholder="Ваш ник"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={touched.username && !!errors.username}
        />
        <Form.Label htmlFor="username">Ваш ник</Form.Label>
        <Form.Control.Feedback type="invalid" tooltip>{errors.username}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="form-floating mb-4">
        <Form.Control
          id="password"
          name="password"
          type="password"
          placeholder="Пароль"
          onChange={formik.handleChange}
          value={formik.values.password}
          onBlur={formik.handleBlur}
          isInvalid={touched.password && !!errors.password}
        />
        <Form.Label htmlFor="password">Пароль</Form.Label>
        <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="form-floating mb-4">
        <Form.Control
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Подтвердите пароль"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          onBlur={formik.handleBlur}
          isInvalid={(touched.confirmPassword && !!errors.confirmPassword) || regFailed}
        />
        <Form.Label htmlFor="confirmPassword">Подтвердите пароль</Form.Label>
        <Form.Control.Feedback type="invalid" tooltip>{errors.confirmPassword}</Form.Control.Feedback>
        {regFailed && <Form.Control.Feedback type="invalid" tooltip>Такой пользователь уже существует</Form.Control.Feedback>}
      </Form.Group>
      <Button type="submit">Отправить</Button>
    </Form>
  );
};

export default Registration;
