import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import Chat from './Chat';
import getModal from './modals/index';
import Channels from './Channels';
import routes from '../routes';
import NavBar from './Navbar';

const renderModal = (props) => {
  const {
    modalInfo, hideModal, activeChannel,
  } = props;
  if (!modalInfo.type) {
    return null;
  }

  const Modal = getModal(modalInfo.type);
  return (
    <Modal
      modalInfo={modalInfo}
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
  const currentChannel = useSelector((state) => state.channels.activeChannel);

  useEffect(() => {
    if (currentChannel) {
      setActiveChannel(currentChannel);
    }
  }, [currentChannel]);

  useEffect(() => {
    const getContent = async () => {
      const response = await axios.get(
        routes.dataPath(),
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      const { channels, messages, currentChannelId } = response.data;
      dispatch(channelsActions.addChannels(channels));
      dispatch(messagesActions.addMessages(messages));
      const defaultActiveChannel = channels.find(({ id }) => id === currentChannelId);
      dispatch(channelsActions.setActiveChannel(defaultActiveChannel));
    };
    getContent();
  }, []);

  return (
    <>
      <NavBar />
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col md={2} className="col-4 border-end pt-5 px-0 bg-light">
            <Channels handleShow={showModal} />
          </Col>
          <Col className="h-100 p-0">
            <Chat user={user} activeChannel={activeChannel} />
          </Col>
        </Row>
        {renderModal({ modalInfo, hideModal, activeChannel })}
      </Container>
    </>
  );
};

export default Home;
