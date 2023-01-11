/* eslint-disable react/prop-types */
import React from 'react';
import { useFormik } from 'formik';
import {
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { selectors } from '../../slices/channelsSlice';

const socket = io();

const AddChannelModal = ({ onHide, setChannel }) => {
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
      name: yup.string().min(3, 'Должно быть не менее 3 символов').notOneOf([channelsNames], 'Такой канал уже существует!'),
    }),
  });
  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Добавить канал</Modal.Title>
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
            <Form.Label htmlFor="name" className="visually-hidden">Название канала</Form.Label>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-3" onClick={onHide}>Отменить</Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid}>Сохранить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannelModal;
