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
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import Chat from '../components/Chat';
import getModal from '../components/modals/index';
import Channels from '../components/Channels';

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
  const [activeChannel, setActiveChannel] = useState({});
  const [modalInfo, setModalInfo] = useState({ type: null, channel: null });
  const hideModal = () => setModalInfo({ type: null, channel: null });
  const showModal = (type, channel = null) => () => setModalInfo({ type, channel });

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const defaultChannel = useSelector((state) => state.channels.defaultChannel);
  console.log(defaultChannel);
  const changeChannel = (channel) => {
    dispatch(channelsActions.setDefaultChannel(channel));
  };
  useEffect(() => {
    console.log(defaultChannel);
    if (defaultChannel) {
      setActiveChannel(defaultChannel);
    }
  }, [defaultChannel]);

  useEffect(() => {
    const getContent = async () => {
      const response = await axios.get(
        '/api/v1/data',
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      const { channels, messages, currentChannelId } = response.data;
      console.log(response);
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
    });
    socket.on('newMessage', (message) => {
      dispatch(messagesActions.addMessage(message));
    });
    socket.on('newChannel', (channel) => {
      dispatch(channelsActions.addChannel(channel));
    });
    socket.on('removeChannel', (channel) => {
      dispatch(channelsActions.removeChannel(channel.id));
      hideModal();
    });
    socket.on('renameChannel', (channel) => {
      const { id, name } = channel;
      dispatch(channelsActions.updateChannel({ id, changes: { name } }));
      hideModal();
      changeChannel(channel);
    });
  }, []);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col md={2} className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
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
  );
};

export default Home;
