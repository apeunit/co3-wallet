import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import theme from './themes/co3'
import { ThemeProvider } from 'emotion-theming'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './redux/configureStore'

const store = configureStore({})

ReactDOM.render(

    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </Provider>
    </ThemeProvider>
    , document.getElementById('root'));

serviceWorker.register();
