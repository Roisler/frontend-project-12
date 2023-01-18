/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import {
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import { selectors as messagesSelectors } from '../slices/messagesSlice';
import useApi from '../hooks/useApi';

const Chat = ({ user, activeChannel }) => {
  const { t } = useTranslation();
  const api = useApi();
  const messages = useSelector(messagesSelectors.selectAll);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: (values) => {
      const message = {
        body: leoProfanity.clean(values.body),
        username: user.username,
        channelId: activeChannel.id,
      };
      api.sendNewMessage(message);
      formik.resetForm();
    },
    validationSchema: yup.object({
      body: yup.string().required(t('validation.required')),
    }),
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChannel]);

  const getTotalMessages = (id) => messages.filter((message) => message.channelId === id).length;

  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0"><b>{`# ${leoProfanity.clean(activeChannel.name)}`}</b></p>
        <span className="text-muted">{t('messages.messageWithCount', { count: getTotalMessages(activeChannel.id) })}</span>
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
        <span ref={messagesEndRef} />
      </div>
      <div className="mt-auto px-5 py-3">
        <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
          <InputGroup>
            <Form.Control
              id="body"
              name="body"
              type="text"
              placeholder="Введите сообщение..."
              aria-label="Новое сообщение"
              className="border-0 p-0 ps-2"
              onChange={formik.handleChange}
              value={formik.values.body}
              ref={inputRef}
              required
            />
            <Button
              type="submit"
              variant="outline-primary"
              id="button-text"
              disabled={formik.values.body === ''}
            >
              {t('basic.send')}
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
