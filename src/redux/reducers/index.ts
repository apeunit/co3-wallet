import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import chain from './Chain';
import co3uum from './CO3UUM';
import modal from './Modal';
import pilot from './Pilot';
import wallet from './Wallet';
export default (history: any) =>
  combineReducers({
    router: connectRouter(history),
    co3uum,
    wallet,
    chain,
    modal,
    pilot,
  });
