/* eslint-disable react/prop-types */
import React from 'react';
import {
  Nav,
  Button,
  Dropdown,
  NavItem,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectors as channelsSelectors } from '../slices/channelsSlice';

const Channels = ({ activeChannel, setActiveChannel, handleShow }) => {
  const channels = useSelector(channelsSelectors.selectAll);
  /* const { username } = user;
  const dispatch = useDispatch();
  console.log(user);
  const changeActiveChannellForUser = (channel) => {
    dispatch(usersActions.updateUser({ username, changes: { currentChannel: channel } }));
    setActiveChannel(channel);
  }; */
  const getVariant = (channelName) => {
    if (activeChannel.name === channelName) {
      return 'secondary';
    }
    return 'light';
  };
  return (
    <>
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>
        <Button variant="group-vertical" className="p-0 text-primary" onClick={handleShow('adding')}>+</Button>
      </div>
      <Nav fill as="ul" variant="pills" className="flex-column px-2">
        {channels.map((channel) => {
          const { id, name, removable } = channel;
          return (
            <NavItem as="li" key={id} className="w-100">
              {
              removable
                ? (
                  <Dropdown as={Button.Group} className="d-flex">
                    <Button
                      variant={getVariant(name)}
                      onClick={() => setActiveChannel(channel)}
                      className="w-100 rounded-0 text-start"
                    >
                      <span className="me-1">#</span>
                      {name}
                    </Button>
                    <Dropdown.Toggle split variant={getVariant(name)} className="rounded-0" />
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleShow('removing', channel)}>Удалить</Dropdown.Item>
                      <Dropdown.Item onClick={handleShow('renaming', channel)}>Переименовать</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )
                : (
                  <Button variant={getVariant(name)} onClick={() => setActiveChannel(channel)} className="w-100 rounded-0 text-start">
                    <span className="me-1">#</span>
                    {name}
                  </Button>
                )
              }
            </NavItem>
          );
        })}
      </Nav>
    </>
  );
};

export default Channels;
