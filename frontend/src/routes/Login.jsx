/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup.string().email('Некорректный email').required('Обязательное поле'),
      password: yup.string()
        .min(6, 'Должен быть не менее 6 символов')
        .required('Обязательное поле'),
    }),
  });
  return (
    <form>
      <div className="form-floating mb-3">
        <input
          id="email"
          name="email"
          type="email"
          value={formik.values.email}
          placeholder="Email"
          className="form-control"
        />
        <label htmlFor="email">Адрес электронной почты</label>
      </div>
      <div className="form-floating mb-3">
        <input
          id="password"
          name="password"
          type="password"
          className="form-control"
          placeholder="Пароль"
          value={formik.values.password}
        />
        <label htmlFor="password">Пароль</label>
      </div>
      <button type="submit" className="btn btn-primary">Отправить</button>
    </form>
  );
};

export default Login;
