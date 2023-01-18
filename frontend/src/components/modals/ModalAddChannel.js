import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { selectors } from '../../slices/channelsSlice';
import useApi from '../../hooks/useApi';

const ModalAddChannel = ({ onHide }) => {
  const { t } = useTranslation();
  const api = useApi();
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      await api.addChannel(values);
      onHide();
      toast.success(t('channels.channel_created'));
    },
    validationSchema: yup.object({
      name: yup.string()
        .trim()
        .min(3, t('validation.name'))
        .max(20, t('validation.name'))
        .notOneOf([channelsNames], t('validation.channel_exist')),
    }),
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              id="name"
              name="name"
              onChange={formik.handleChange}
              type="text"
              value={formik.values.name}
              required
              ref={inputRef}
              isInvalid={!formik.isValid}
            />
            <Form.Label htmlFor="name" className="visually-hidden">Имя канала</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-3" onClick={onHide}>{t('basic.cancel')}</Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid}>{t('basic.send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddChannel;
