/* eslint-disable consistent-return */
import React, { useEffect } from 'react';
import axios from 'axios';
import { normalize, schema } from 'normalizr';
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
  const dispatch = useDispatch();
  const getNormalize = (data) => {
    const channels = new schema.Entity('channels');
    return normalize(data, [channels]);
  };
  const user = JSON.parse(localStorage.getItem('admin'));
  useEffect(() => {
    const getContent = async () => {
      const response = await axios.get(
        '/api/v1/data',
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      const normalizedData = getNormalize(response.data.channels);
      console.log(normalizedData);
      const { channels } = normalizedData.entities;
      dispatch(channelsActions.addChannels(channels));
    };
    getContent();
  }, []);
  const channels = useSelector(selectors.selectAll);
  console.log(channels);
  /* if (!content) {
    return <div>Здесь ничего нет</div>;
  } */
  return (
    <Container className="h-100">
      <Row className="bg-white">
        <Col md={2} className="h-100">
          <div className="justify-content-between">Каналы</div>
          <Nav as="ul" variant="pills">
            {channels.map(({ id, name }) => (
              <NavItem as="li" key={id} className="w-100">
                <Button variant="light" className="w-100 rounded-0">{name}</Button>
              </NavItem>
            ))}
          </Nav>
        </Col>
        <Col className="h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">Блабла</p>
            </div>
          </div>
          <div id="messages-box" className="chat-messages" />
          <div className="mt-auto px-5 py-3">
            <Form className="py-1 border rounded-2">
              <InputGroup>
                <Form.Control
                  id="body"
                  name="body"
                  type="text"
                  placeholder="Введите сообщение..."
                  aria-describedby="basic-text"
                />
                <Button variant="outline-secondary" id="button-text" />
              </InputGroup>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
