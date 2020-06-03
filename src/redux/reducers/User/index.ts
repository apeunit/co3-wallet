import { handleActions } from 'redux-actions';
import { IUserState } from '../../../interfaces';
import { GET_LOCATION } from '../../actions/User/ActionTypes';

const defaultLocation: IUserState = {
  location: '',
  country: '',
  username: '',
  ip: '',
  features: [],
};

const reducer = handleActions(
  {
    [GET_LOCATION]: (state, action) => {
      const { payload } = action;

      return { ...state, ...payload };
    },
  },
  defaultLocation,
);

export default reducer;
