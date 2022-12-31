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
  Form,
  InputGroup,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectors, actions as channelsActions } from '../slices/channelsSlice';

const Home = () => {
  const [activeChannel, setActiveChannel] = useState();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('admin'));
  useEffect(() => {
    const getContent = async () => {
      const response = await axios.get(
        '/api/v1/data',
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      const { channels, messages, currentChannelId } = response.data;
      dispatch(channelsActions.addChannels(channels));
      const activeChannelName = channels.find(({ id }) => id === currentChannelId).name;
      setActiveChannel(activeChannelName);
      console.log(messages);
    };
    getContent();
  }, []);
  const channels = useSelector(selectors.selectAll);
  console.log(channels);
  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col md={2} className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
            <span>Каналы</span>
          </div>
          <Nav fill as="ul" variant="pills" className="flex-column px-2">
            {channels.map(({ id, name }) => (
              <NavItem as="li" key={id} className="w-100" onClick={() => setActiveChannel(name)}>
                <Button variant={activeChannel === name ? 'secondary' : 'light'} className="w-100 rounded-0 text-start">
                  <span className="me-1">#</span>
                  {name}
                </Button>
              </NavItem>
            ))}
          </Nav>
        </Col>
        <Col className="h-100 p-0">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0"><b>{`# ${activeChannel}`}</b></p>
              <span className="text-muted">0 сообщений</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5 " />
            <div className="mt-auto px-5 py-3">
              <Form className="py-1 border rounded-2">
                <InputGroup has-validation>
                  <Form.Control
                    id="body"
                    name="body"
                    type="text"
                    placeholder="Введите сообщение..."
                    aria-describedby="basic-text"
                    className="border-0 p-0 ps-2"
                  />
                  <Button type="submit" variant="outline-secondary" id="button-text" />
                </InputGroup>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
