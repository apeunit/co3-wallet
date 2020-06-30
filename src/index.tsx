import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import theme from './themes/co3';
import { ThemeProvider } from 'emotion-theming';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './redux/configureStore';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import './i18n';
import Loading from './components/Loading';
import { LISTENER_URL, SENTRY_DSN } from './config';
import { isIOS, osName, osVersion } from "react-device-detect";

// initialize sentry (only if SENTRY_DSN is defined) 
Sentry.init({ dsn: SENTRY_DSN });

// remove manifest.json on iOS
if (isIOS) {
  const element = document.getElementById('manifest-link');
  console.log(`OS ${osName} ${osVersion}, remove manifest: should suppress PWA installation`);
  if (element) { element.remove(); }
} else {
  console.log(`OS ${osName} ${osVersion}, PWA installation available`)
}

const store = configureStore({});

const client = new ApolloClient({
  uri: LISTENER_URL,
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Suspense fallback={<Loading loader={true} />}>
            <App />
          </Suspense>
        </ConnectedRouter>
      </Provider>
    </ApolloProvider>
  </ThemeProvider>,
  document.getElementById('root'),
);

serviceWorker.register();
