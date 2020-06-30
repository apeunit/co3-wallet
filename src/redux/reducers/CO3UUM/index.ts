import { combineActions, handleActions } from 'redux-actions';
import { ICO3UUMState } from '../../../interfaces';
import {
  GET_USER_PROFILE_DATA,
  SAVE_ACCESS_TOKEN,
  UPDATE_USER_PUBKEY,
} from '../../actions/CO3UUM/ActionTypes';

const defaultState: ICO3UUMState = {
  accessToken: null,
  profile: null,
};

const combinedActions: any = combineActions(
  GET_USER_PROFILE_DATA,
  UPDATE_USER_PUBKEY,
  SAVE_ACCESS_TOKEN,
);

const reducer = handleActions(
  {
    [combinedActions]: (state: Object, action: any): ICO3UUMState => {
      return { ...(state as ICO3UUMState), ...action.payload };
    },
  },
  defaultState,
);

export default reducer;
