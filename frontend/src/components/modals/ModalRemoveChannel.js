import React from 'react';
import {
  Modal,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useApi from '../../hooks/useApi';

const ModalRemoveChannel = (props) => {
  const { t } = useTranslation();
  const api = useApi();
  const { modalInfo, onHide } = props;
  const handleRemove = async () => {
    try {
      await api.removeChannel(modalInfo.channel);
      toast.success(t('channels.channel_removed'));
      onHide();
    } catch (err) {
      toast.error(t('errors.connect'));
    }
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
