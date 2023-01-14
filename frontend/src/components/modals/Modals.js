/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { selectors } from '../../slices/channelsSlice';

const socket = io();

export const AddChannel = ({ onHide, setChannel }) => {
  const { t } = useTranslation();
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      socket.emit('newChannel', values, (response) => {
        const newChannel = response.data;
        setChannel(newChannel);
      });
      onHide();
    },
    validationSchema: yup.object({
      name: yup.string()
        .min(3, t('validation.name'))
        .max(20, t('validation.name'))
        .notOneOf([channelsNames], t('validation.channel_exist')),
    }),
  });
  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              name="name"
              onChange={formik.handleChange}
              type="text"
              value={formik.values.name}
              required
              autoFocus
            />
            {!formik.isValid && <div>{formik.errors.name}</div>}
            <Form.Label htmlFor="name" className="visually-hidden">{t('channels.name')}</Form.Label>
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

export const RemoveChannel = (props) => {
  const { t } = useTranslation();
  const {
    modalInfo, onHide,
  } = props;
  const handleRemove = () => {
    socket.emit('removeChannel', modalInfo.channel);
  };
  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.remove')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Все сообщения канала будут удалены, а активные пользователи перемещены!</p>
        <p>Вы уверены, что хотите удалить канал?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>{t('basic.cancel')}</Button>
        <Button variant="danger" onClick={handleRemove}>{t('basic.send')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export const RenameChannel = ({ modalInfo, onHide }) => {
  const { t } = useTranslation();
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const formik = useFormik({
    initialValues: modalInfo.channel,
    onSubmit: (values) => {
      socket.emit('renameChannel', values);
    },
    validationSchema: yup.object({
      name: yup.string()
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
              ref={inputRef}
              name="name"
              onChange={formik.handleChange}
              type="text"
              value={formik.values.name}
              required
              autoFocus
            />
            {!formik.isValid && <div>{formik.errors.name}</div>}
            <Form.Label htmlFor="name" className="visually-hidden">{t('channels.name')}</Form.Label>
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
