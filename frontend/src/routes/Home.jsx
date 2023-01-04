/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  Button,
  // Form,
  // InputGroup,
} from 'react-bootstrap';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
// import { io } from 'socket.io-client';
import { selectors as channelsSelectors, actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import Chat from '../components/Chat';

// const socket = io();

const Home = () => {
  const [activeChannel, setActiveChannel] = useState({});
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const getContent = async () => {
      const response = await axios.get(
        '/api/v1/data',
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      const { channels, messages, currentChannelId } = response.data;
      dispatch(channelsActions.addChannels(channels));
      dispatch(messagesActions.addMessages(messages));
      const currentChannel = channels.find(({ id }) => id === currentChannelId);
      setActiveChannel(currentChannel);
    };
    getContent();
  }, []);
  /* const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async (values) => {
      const message = { ...values, username: user.username, channelId: activeChannel.id };
      await socket.emit('newMessage', message);
      dispatch(messagesActions.addMessage(message));
      formik.resetForm();
    },
    validationSchema: yup.object({
      body: yup.string().required('Введите сообщение!'),
    }),
  }); */
  const channels = useSelector(channelsSelectors.selectAll);
  // const messages = useSelector(messagesSelectors.selectAll);
  // const getTotalMessages = (id) => messages.filter((message) => message.channelId === id).length;

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col md={2} className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
            <span>Каналы</span>
          </div>
          <Nav fill as="ul" variant="pills" className="flex-column px-2">
            {channels.map((channel) => {
              const { id, name } = channel;
              return (
                <NavItem as="li" key={id} className="w-100" onClick={() => setActiveChannel(channel)}>
                  <Button variant={activeChannel.name === name ? 'secondary' : 'light'} className="w-100 rounded-0 text-start">
                    <span className="me-1">#</span>
                    {name}
                  </Button>
                </NavItem>
              );
            })}
          </Nav>
        </Col>
        <Chat user={user} activeChannel={activeChannel} />
      </Row>
    </Container>
  );
};

export default Home;
