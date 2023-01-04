/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import {
  Form,
  InputGroup,
  Col,
  Button,
} from 'react-bootstrap';
import { uniqueId } from 'lodash';
import { selectors as messagesSelectors, actions as messagesActions } from '../slices/messagesSlice';

const socket = io.connect();
const Chat = ({ user, activeChannel }) => {
  const dispatch = useDispatch();
  const messages = useSelector(messagesSelectors.selectAll);
  const [currentMessage, setCurrentMessage] = useState();
  useEffect(() => {
    if (!currentMessage) return;
    socket.emit('newMessage', currentMessage);
    dispatch(messagesActions.addMessage(currentMessage));
    setCurrentMessage();
  }, [currentMessage]);
  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: (values) => {
      const message = {
        ...values,
        username: user.username,
        channelId: activeChannel.id,
        id: uniqueId(),
      };
      setCurrentMessage(message);
      formik.resetForm();
    },
    validationSchema: yup.object({
      body: yup.string().required('Введите сообщение!'),
    }),
  });

  const getTotalMessages = (id) => messages.filter((message) => message.channelId === id).length;

  return (
    <Col className="h-100 p-0">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0"><b>{`# ${activeChannel.name}`}</b></p>
          <span className="text-muted">{`${getTotalMessages(activeChannel.id)} сообщений`}</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {messages
            .filter((message) => message.channelId === activeChannel.id)
            .map((message) => {
              if (messages.length === 0) {
                return null;
              }
              const { body, username, id } = message;
              return (
                <div key={id} className="text-break mb-2">
                  <b>{username}</b>
                  {`: ${body}`}
                </div>
              );
            })}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
            <InputGroup has-validation="true">
              <Form.Control
                id="body"
                name="body"
                type="text"
                placeholder="Введите сообщение..."
                aria-describedby="basic-text"
                className="border-0 p-0 ps-2"
                onChange={formik.handleChange}
                value={formik.values.body}
              />
              <Button type="submit" variant="outline-primary" id="button-text" disabled={formik.isSubmitting}>Send</Button>
            </InputGroup>
          </Form>
        </div>
      </div>
    </Col>
  );
};

export default Chat;
