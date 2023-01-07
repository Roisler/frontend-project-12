/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  // Form,
  // InputGroup,
} from 'react-bootstrap';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import Chat from '../components/Chat';
import getModal from '../components/modals/index';
import Channels from '../components/Channels';

const socket = io();

const renderModal = ({ modalInfo, hideModal, setChannel }) => {
  if (!modalInfo.type) {
    console.log(modalInfo);
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} setChannel={setChannel} onHide={hideModal} />;
};

const Home = () => {
  const [activeChannel, setActiveChannel] = useState({});
  const [modalInfo, setModalInfo] = useState({ type: null, channel: null, activeChannel });
  const hideModal = () => setModalInfo({ type: null, channel: null });
  const showModal = (type, channel = null) => () => setModalInfo({ type, channel });

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const getContent = async () => {
      const response = await axios.get(
        '/api/v1/data',
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      const { channels, messages, currentChannelId } = response.data;
      console.log(response.data);
      dispatch(channelsActions.addChannels(channels));
      dispatch(messagesActions.addMessages(messages));
      const currentChannel = channels.find(({ id }) => id === currentChannelId);
      setActiveChannel(currentChannel);
    };
    getContent();
  }, []);

  useEffect(() => {
    socket.on('newMessage', (payload) => {
      dispatch(messagesActions.addMessage(payload));
    });
    socket.on('newChannel', (payload) => {
      dispatch(channelsActions.addChannel(payload));
      hideModal();
    });
    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload.id));
      hideModal();
    });
    socket.on('renameChannel', ({ id, name }) => {
      dispatch(channelsActions.updateChannel({ id, changes: { name } }));
      hideModal();
    });
  }, []);

  const getVariant = (channelName) => {
    if (activeChannel.name === channelName) {
      return 'secondary';
    }
    return 'light';
  };

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col md={2} className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <Channels
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            handleShow={showModal}
            getVariant={getVariant}
          />
        </Col>
        <Col className="h-100 p-0">
          <Chat user={user} activeChannel={activeChannel} />
        </Col>
      </Row>
      {renderModal({ modalInfo, hideModal, setChannel: setActiveChannel })}
    </Container>
  );
};

export default Home;
