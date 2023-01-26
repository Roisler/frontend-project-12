import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import Chat from './Chat';
import getModal from './modals/index';
import Channels from './Channels';
import routes from '../routes';
import NavBar from './Navbar';
import useAuth from '../hooks/useAuth';

const renderModal = (props) => {
  const {
    modalInfo, hideModal,
  } = props;
  if (!modalInfo.type) {
    return null;
  }

  const Modal = getModal(modalInfo.type);
  return (
    <Modal
      modalInfo={modalInfo}
      onHide={hideModal}
    />
  );
};

const Home = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const { username } = auth.user;
  const [modalInfo, setModalInfo] = useState({ type: null, channel: null });

  const hideModal = () => setModalInfo({ type: null, channel: null });
  const showModal = (type, channel = null) => () => setModalInfo({ type, channel });

  const dispatch = useDispatch();

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await axios.get(
          routes.dataPath(),
          { headers: auth.getAuthHeader() },
        );
        const { channels, messages, currentChannelId } = response.data;
        dispatch(channelsActions.addChannels(channels));
        dispatch(messagesActions.addMessages(messages));
        dispatch(channelsActions.setActiveChannel(currentChannelId));
      } catch (err) {
        if (err.response?.status === 401) {
          auth.logOut();
        }
        if (err.isAxiosError) {
          toast.error(t('errors.connect'));
        } else {
          toast.error(t('errors.unknown'));
        }
      }
    };
    getContent();
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col md={2} className="col-4 border-end pt-5 px-0 bg-light">
            <Channels handleShow={showModal} />
          </Col>
          <Col className="h-100 p-0">
            <Chat user={username} />
          </Col>
        </Row>
        {renderModal({ modalInfo, hideModal })}
      </Container>
    </>
  );
};

export default Home;
