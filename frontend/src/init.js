import React from 'react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import App from './components/App';
import store from './slices/index';
import resources from './locales/index';

const init = async () => {
  const i18nInstance = i18n.createInstance();
  await i18nInstance
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ru',
      fallbackLng: 'ru',
    });
  leoProfanity.clearList();
  leoProfanity.add(leoProfanity.getDictionary('en'));
  leoProfanity.add(leoProfanity.getDictionary('ru'));
  const vdom = (
    <Provider store={store}>
      <I18nextProvider i18n={i18nInstance}>
        <App />
      </I18nextProvider>
    </Provider>
  );
  return vdom;
};

export default init;
