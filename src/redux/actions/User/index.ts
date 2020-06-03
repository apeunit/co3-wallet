import { createActions } from 'redux-actions';
import { GET_LOCATION } from './ActionTypes';
import location from './User.json';

const _location: any = location;

const { getLocation } = createActions({
  [GET_LOCATION]: (pilot) => {
    return { ..._location[pilot] };
  },
});

export { getLocation };
