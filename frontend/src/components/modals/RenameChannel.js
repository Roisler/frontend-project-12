/* eslint-disable react/prop-types */
import React from 'react';
import { useFormik } from 'formik';
import {
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import io from 'socket.io-client';

const socket = io();

const RenameChannelModal = ({ show, onHide, setChannel }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      socket.emit('renameChannel', values, (response) => {
        const newChannel = response.data;
        console.log(newChannel);
        setChannel(newChannel);
        onHide();
      });
    },
  });
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
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
            <Form.Label htmlFor="name" className="visually-hidden">Новое название канала</Form.Label>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-3" onClick={onHide}>Отменить</Button>
            <Button variant="primary" type="submit">Сохранить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;
