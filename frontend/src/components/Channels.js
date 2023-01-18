/* eslint-disable react/prop-types */
import React from 'react';
import {
  Nav,
  Button,
  Dropdown,
  NavItem,
} from 'react-bootstrap';
import leoProfanity from 'leo-profanity';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectors as channelsSelectors } from '../slices/channelsSlice';

const Channels = ({ activeChannel, setActiveChannel, handleShow }) => {
  const { t } = useTranslation();
  const channels = useSelector(channelsSelectors.selectAll);
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
        <Button variant="success" className="btn-sm" onClick={handleShow('adding')}>+</Button>
      </div>
      <Nav fill as="ul" variant="pills" className="flex-column px-2">
        {channels.map((channel) => {
          const { id, name, removable } = channel;
          const cleanName = leoProfanity.clean(name);
          return (
            <NavItem as="li" key={id} className="w-100">
              {
              removable
                ? (
                  <Dropdown as={Button.Group} className="d-flex">
                    <Button
                      variant={getVariant(name)}
                      onClick={() => setActiveChannel(channel)}
                      className="w-100 rounded-0 text-start text-truncate"
                    >
                      <span className="me-1">#</span>
                      {cleanName}
                    </Button>
                    <Dropdown.Toggle split variant={getVariant(name)} className="rounded-0" />
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleShow('removing', channel)}>{t('channels.remove')}</Dropdown.Item>
                      <Dropdown.Item onClick={handleShow('renaming', channel)}>{t('channels.rename')}</Dropdown.Item>
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
