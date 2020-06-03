import { applyMiddleware, createStore } from 'redux';
import createRootReducer from './reducers';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

export const history = createBrowserHistory();

export default function configureStore(preloadedState: object = {}) {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeWithDevTools(applyMiddleware(routerMiddleware(history), thunkMiddleware)),
  );

  return store;
}
