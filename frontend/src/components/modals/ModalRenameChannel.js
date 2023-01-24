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

const ModalRenameChannel = ({ modalInfo, onHide }) => {
  const { t } = useTranslation();
  const api = useApi();
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const formik = useFormik({
    initialValues: modalInfo.channel,
    onSubmit: async (values) => {
      try {
        await api.renameChannel(values);
        toast.success(t('channels.channel_renamed'));
        onHide();
      } catch (err) {
        toast.error(t('errors.connect'));
      }
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
    inputRef.current.select();
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.rename')}</Modal.Title>
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
              disabled={formik.isSubmitting}
              isInvalid={!formik.isValid}
            />
            <Form.Label htmlFor="name" className="visually-hidden">Имя канала</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-3" onClick={onHide}>{t('basic.cancel')}</Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid || formik.isSubmitting}>{t('basic.send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRenameChannel;
