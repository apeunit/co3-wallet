import { handleActions } from 'redux-actions';
import { IPilotState } from '../../../interfaces';
import { GET_PILOT } from '../../actions/Pilot/ActionTypes';

const defaultPilot: IPilotState = {
  features: [],
};

const reducer = handleActions(
  {
    [GET_PILOT]: (state, action) => {
      const { payload } = action;

      return { ...state, ...payload };
    },
  },
  defaultPilot,
);

export default reducer;
