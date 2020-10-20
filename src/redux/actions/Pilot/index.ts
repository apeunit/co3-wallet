import { createActions } from 'redux-actions';
import { GET_PILOT } from './ActionTypes';
import pilots from './Pilots.json';

const _pilots: any = pilots;

const { getPilot } = createActions({
  [GET_PILOT]: (pilot) => ({ ..._pilots[pilot] }),
});

export { getPilot };
