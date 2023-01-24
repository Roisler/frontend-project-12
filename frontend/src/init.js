import React from 'react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import io from 'socket.io-client';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App';
import store from './slices/index';
import resources from './locales/index';
import ApiContext from './contexts/ApiContext';
import { actions as channelsActions } from './slices/channelsSlice';
import { actions as messagesActions } from './slices/messagesSlice';

const init = async () => {
  const socket = io();
  const wrapper = (event, data) => new Promise((resolve, reject) => {
    socket.timeout(5000).volatile.emit(event, data, (err, response) => {
      if (err) {
        reject(err);
      }
      if (response?.status === 'ok') {
        resolve(response.data);
      }
      reject(err);
    });
  });

  const chatApi = {
    addChannel: (data) => wrapper('newChannel', data),
    renameChannel: (data) => wrapper('renameChannel', data),
    removeChannel: (data) => wrapper('removeChannel', data),
    sendNewMessage: (data) => wrapper('newMessage', data),
  };

  socket.on('newChannel', (channel) => {
    store.dispatch(channelsActions.addChannel(channel));
  });

  socket.on('renameChannel', (channel) => {
    const { id, name } = channel;
    store.dispatch(channelsActions.updateChannel({ id, changes: { name } }));
  });

  socket.on('removeChannel', (channel) => {
    store.dispatch(channelsActions.removeChannel(channel.id));
  });

  socket.on('newMessage', (message) => {
    store.dispatch(messagesActions.addMessage(message));
  });

  const i18nInstance = i18n.createInstance();
  await i18nInstance
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ru',
      fallbackLng: 'ru',
    });

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ACCESS_ROLLBAR_TOKEN,
  };
  leoProfanity.clearList();
  leoProfanity.add(leoProfanity.getDictionary('en'));
  leoProfanity.add(leoProfanity.getDictionary('ru'));

  const vdom = (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <React.StrictMode>
          <Provider store={store}>
            <I18nextProvider i18n={i18nInstance}>
              <ApiContext.Provider value={chatApi}>
                <App />
              </ApiContext.Provider>
            </I18nextProvider>
          </Provider>
        </React.StrictMode>
      </ErrorBoundary>
    </RollbarProvider>
  );
  return vdom;
};

export default init;
