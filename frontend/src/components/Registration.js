import React, { useEffect, useRef, useState } from 'react';
import {
  Form,
  Button,
  Card,
  Image,
  Container,
  Col,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import routes from '../routes';
import NavBar from './Navbar';

const Registration = () => {
  const auth = useAuth();
  const usernameRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [regFailed, setRegFailed] = useState(false);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(routes.signupPath(), values);
        const user = response.data;
        auth.logIn(user);
        navigate(routes.chat);
        setRegFailed(false);
      } catch (err) {
        if (err.response?.status === 409) {
          setRegFailed(true);
          return;
        }
        if (err.isAxiosError) {
          toast.error(t('errors.connect'));
        } else {
          toast.error(t('errors.unknown'));
        }
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
    <>
      <NavBar />
      <Container fluid>
        <Row className="justify-content-center align-content-center h-100">
          <Col xs={12} md={8} xxl={6}>
            <Card className="shadow">
              <Card.Body className="row p-5">
                <Col className="d-flex align-items-center justify-content-center">
                  <Image roundedCircle src="regImage.jpg" alt={t('basic.registration')} />
                </Col>
                <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                  <h1 className="text-center mb-4">{t('basic.registration')}</h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      id="username"
                      name="username"
                      type="text"
                      value={formik.values.username}
                      placeholder={t('basic.username')}
                      ref={usernameRef}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={formik.isSubmitting}
                      isInvalid={touched.username && !!errors.username}
                    />
                    <Form.Label htmlFor="username">{t('basic.username')}</Form.Label>
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
                      disabled={formik.isSubmitting}
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
                      disabled={formik.isSubmitting}
                      isInvalid={(touched.confirmPassword && !!errors.confirmPassword) || regFailed}
                    />
                    <Form.Label htmlFor="confirmPassword">{t('basic.confirm_password')}</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>{errors.confirmPassword}</Form.Control.Feedback>
                    {regFailed && <Form.Control.Feedback type="invalid" tooltip>{t('errors.user_exist')}</Form.Control.Feedback>}
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" className="w-100 mb-3" disabled={formik.isSubmitting}>
                    {formik.isSubmitting && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    {t('basic.signup')}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="p-4">
                <div className="text-center">
                  <span className="me-3">{`${t('basic.already_registred')}?`}</span>
                  <Link to={routes.login}>{t('basic.signin')}</Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Registration;
