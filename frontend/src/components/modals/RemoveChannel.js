/* eslint-disable react/prop-types */
import React from 'react';
import {
  Modal,
  Button,
} from 'react-bootstrap';
import io from 'socket.io-client';

const socket = io();

const RemoveChannel = ({ modalInfo, onHide, setChannel }) => {
  const handleRemove = () => {
    socket.emit('removeChannel', modalInfo.channel, (data) => {
      if (data.status === 'ok' && modalInfo.channel === modalInfo.activeChannel) {
        setChannel();
      }
    });
    onHide();
  };
  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Все сообщения канала будут удалены, а активные пользователи перемещены!</p>
        <p>Вы уверены, что хотите удалить канал?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Не удалять</Button>
        <Button variant="danger" onClick={handleRemove}>Удалить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannel;
