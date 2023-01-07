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
import { selectors } from '../../slices/channelsSlice';

const socket = io();

const RenameChannel = ({ modalInfo, onHide }) => {
  const channelsNames = useSelector(selectors.selectAll).map((channel) => channel.name);
  const formik = useFormik({
    initialValues: modalInfo.channel,
    onSubmit: (values) => {
      socket.emit('renameChannel', values);
    },
    validationSchema: yup.object({
      name: yup.string().notOneOf([channelsNames], 'Такой канал уже существует!'),
    }),
  });
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);
  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Переименовать канал</Modal.Title>
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
            <Form.Label htmlFor="name" className="visually-hidden">Новое название канала</Form.Label>
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

export default RenameChannel;
