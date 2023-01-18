import { createContext } from 'react';

const ApiContext = createContext();

export const buildApi = (socket) => {
  const addChannel = async (name) => {
    await socket.emit('newChannel', name, (response) => {
      if (response.status !== 'ok') {
        throw new Error('Network Error. Channel creation failed');
      }
    });
  };

  const renameChannel = async (newName) => {
    await socket.emit('renameChannel', newName, (response) => {
      if (response.status !== 'ok') {
        throw new Error('Network Error. Channel renaming failed');
      }
    });
  };

  const removeChannel = async (channel) => {
    await socket.emit('removeChannel', channel, (response) => {
      if (response.status !== 'ok') {
        throw new Error('Network Error. Channel removing failed');
      }
    });
  };

  const sendNewMessage = async (message) => {
    await socket.emit('newMessage', message, (response) => {
      if (response.status !== 'ok') {
        throw new Error('Network Error. Sending message failed');
      }
    });
  };

  return {
    addChannel,
    renameChannel,
    removeChannel,
    sendNewMessage,
  };
};

export default ApiContext;
