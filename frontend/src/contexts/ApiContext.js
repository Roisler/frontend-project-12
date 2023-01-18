import { createContext } from 'react';
import { useDispatch } from 'react-redux';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';

const ApiContext = createContext();

export const buildApi = (socket) => {
  const dispatch = useDispatch();
  const addChannel = async (name) => {
    await socket.emit('newChannel', name, (response) => {
      if (response.status !== 'ok') {
        throw new Error('Network Error. Channel creation failed');
      }
    });
  };

  socket.on('newChannel', (channel) => {
    dispatch(channelsActions.addChannel(channel));
    dispatch(channelsActions.setActiveChannel(channel));
  });

  const renameChannel = async (newName) => {
    await socket.emit('renameChannel', newName, (response) => {
      if (response.status !== 'ok') {
        throw new Error('Network Error. Channel renaming failed');
      }
    });
  };

  socket.on('renameChannel', (channel) => {
    const { id, name } = channel;
    dispatch(channelsActions.updateChannel({ id, changes: { name } }));
    dispatch(channelsActions.setActiveChannel(channel));
  });

  const removeChannel = async (channel) => {
    await socket.emit('removeChannel', channel, (response) => {
      if (response.status !== 'ok') {
        throw new Error('Network Error. Channel removing failed');
      }
    });
  };

  socket.on('removeChannel', (channel) => {
    dispatch(channelsActions.removeChannel(channel.id));
  });

  const sendNewMessage = async (message) => {
    await socket.emit('newMessage', message, (response) => {
      if (response.status !== 'ok') {
        throw new Error('Network Error. Sending message failed');
      }
    });
  };

  socket.on('newMessage', (message) => {
    dispatch(messagesActions.addMessage(message));
  });

  return {
    addChannel,
    renameChannel,
    removeChannel,
    sendNewMessage,
  };
};

export default ApiContext;
