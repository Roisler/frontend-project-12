/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Nav,
  NavItem,
  Button,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectors } from '../slices/channelsSlice';

const Channels = (props) => {
  const { currentChannelId } = props;
  const [activeChannel, setActiveChannel] = useState();
  const channels = useSelector(selectors.selectAll);
  useEffect(() => {
    const activeChannelName = channels.find(({ id }) => id === currentChannelId).name;
    setActiveChannel(activeChannelName);
  });
  return (
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
  );
};

export default Channels;
