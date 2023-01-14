/* eslint-disable react/prop-types */
import React from 'react';
import {
  Modal,
  Button,
} from 'react-bootstrap';
import io from 'socket.io-client';
import { useTranslation } from 'react-i18next';

const socket = io();

const RemoveChannel = (props) => {
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

export default RemoveChannel;
