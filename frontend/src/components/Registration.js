import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';
import routes from '../routes';

const Registration = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [regFailed, setRegFailed] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(routes.signupPath(), values);
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
      username: yup.string()
        .min(3, t('validation.name'))
        .max(20, t('validation.name'))
        .required(t('validation.required')),
      password: yup.string()
        .min(6, t('validation.password_length'))
        .required(t('validation.required')),
      confirmPassword: yup.string()
        .oneOf([yup.ref('password')], t('validation.confirm_password'))
        .required(t('validation.required')),
    }),
  });
  const { touched, errors } = formik;
  return (
    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
      <h1 className="text-center mb4">{t('basic.registration')}</h1>
      <Form.Group className="form-floating mb-3">
        <Form.Control
          id="username"
          name="username"
          type="text"
          value={formik.values.username}
          placeholder={t('basic.nickname')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={touched.username && !!errors.username}
        />
        <Form.Label htmlFor="username">{t('basic.nickname')}</Form.Label>
        <Form.Control.Feedback type="invalid" tooltip>{errors.username}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="form-floating mb-4">
        <Form.Control
          id="password"
          name="password"
          type="password"
          placeholder={t('basic.password')}
          onChange={formik.handleChange}
          value={formik.values.password}
          onBlur={formik.handleBlur}
          isInvalid={touched.password && !!errors.password}
        />
        <Form.Label htmlFor="password">{t('basic.password')}</Form.Label>
        <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="form-floating mb-4">
        <Form.Control
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder={t('basic.confirm_password')}
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          onBlur={formik.handleBlur}
          isInvalid={(touched.confirmPassword && !!errors.confirmPassword) || regFailed}
        />
        <Form.Label htmlFor="confirmPassword">{t('basic.confirm_password')}</Form.Label>
        <Form.Control.Feedback type="invalid" tooltip>{errors.confirmPassword}</Form.Control.Feedback>
        {regFailed && <Form.Control.Feedback type="invalid" tooltip>{t('errors.user_exist')}</Form.Control.Feedback>}
      </Form.Group>
      <Button type="submit">{t('basic.send')}</Button>
    </Form>
  );
};

export default Registration;
