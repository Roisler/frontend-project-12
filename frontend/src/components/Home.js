import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import Chat from './Chat';
import getModal from './modals/index';
import Channels from './Channels';
import routes from '../routes';
import NavBar from './Navbar';

const socket = io();

const renderModal = (props) => {
  const {
    modalInfo, hideModal, setChannel, activeChannel,
  } = props;
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return (
    <Component
      modalInfo={modalInfo}
      setChannel={setChannel}
      onHide={hideModal}
      activeChannel={activeChannel}
    />
  );
};

const Home = () => {
  const { t } = useTranslation();
  const [activeChannel, setActiveChannel] = useState({});
  const [modalInfo, setModalInfo] = useState({ type: null, channel: null });

  const hideModal = () => setModalInfo({ type: null, channel: null });
  const showModal = (type, channel = null) => () => setModalInfo({ type, channel });

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const defaultChannel = useSelector((state) => state.channels.defaultChannel);

  const changeChannel = (channel) => {
    dispatch(channelsActions.setDefaultChannel(channel));
  };

  useEffect(() => {
    if (defaultChannel) {
      setActiveChannel(defaultChannel);
    }
  }, [defaultChannel]);

  useEffect(() => {
    const getContent = async () => {
      const response = await axios.get(
        routes.dataPath(),
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      const { channels, messages, currentChannelId } = response.data;
      dispatch(channelsActions.addChannels(channels));
      dispatch(messagesActions.addMessages(messages));
      const currentChannel = channels.find(({ id }) => id === currentChannelId);
      dispatch(channelsActions.setDefaultChannel(currentChannel));
    };
    getContent();
  }, []);

  useEffect(() => {
    socket.on('connect_error', () => {
      setTimeout(() => {
        socket.connect();
      }, 1000);
      toast.warn(t('errors.connect'));
    });
    socket.on('newMessage', (message) => {
      dispatch(messagesActions.addMessage(message));
    });
    socket.on('newChannel', (channel) => {
      dispatch(channelsActions.addChannel(channel));
      toast.success(t('channels.channel_created'));
    });
    socket.on('removeChannel', (channel) => {
      dispatch(channelsActions.removeChannel(channel.id));
      hideModal();
      toast.success(t('channels.channel_removed'));
    });
    socket.on('renameChannel', (channel) => {
      const { id, name } = channel;
      dispatch(channelsActions.updateChannel({ id, changes: { name } }));
      hideModal();
      changeChannel(channel);
      toast.success(t('channels.channel_renamed'));
    });
  }, []);

  return (
    <>
      <NavBar />
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col md={2} className="col-4 border-end pt-5 px-0 bg-light">
            <Channels
              activeChannel={activeChannel}
              setActiveChannel={changeChannel}
              handleShow={showModal}
            />
          </Col>
          <Col className="h-100 p-0">
            <Chat user={user} activeChannel={activeChannel} />
          </Col>
        </Row>
        {renderModal({
          modalInfo, hideModal, setChannel: changeChannel, activeChannel,
        })}
      </Container>
    </>
  );
};

export default Home;
