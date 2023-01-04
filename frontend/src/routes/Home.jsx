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
import AddChannelModal from '../components/modals/AddChannel';
import RenameChannelModal from '../components/modals/RenameChannel';
import Channels from '../components/Channels';

const socket = io();

const Home = () => {
  const [activeChannel, setActiveChannel] = useState({});
  const [activeModal, setActiveModal] = useState();
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
    });
  }, []);

  const handleShow = (modal) => () => setActiveModal(modal);

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
            handleShow={handleShow}
            getVariant={getVariant}
          />
        </Col>
        <Col className="h-100 p-0">
          <Chat user={user} activeChannel={activeChannel} />
        </Col>
      </Row>
      <AddChannelModal
        show={activeModal === 'add'}
        onHide={() => setActiveModal('')}
        setChannel={setActiveChannel}
      />
      <RenameChannelModal
        show={activeModal === 'rename'}
        onHide={() => setActiveModal('')}
      />
    </Container>
  );
};

export default Home;
