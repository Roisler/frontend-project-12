import React from 'react';
import {
  Modal,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ModalRemoveChannel = (props) => {
  const { t } = useTranslation();
  const {
    modalInfo, onHide, socket,
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
        <p className="lead">{`${t('basic.sure')}?`}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>{t('basic.cancel')}</Button>
        <Button variant="danger" onClick={handleRemove}>{t('basic.send')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRemoveChannel;
