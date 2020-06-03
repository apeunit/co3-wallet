import { handleActions } from 'redux-actions';
import { IModalState } from '../../../interfaces';
import { SET_MODAL_DATA, TOGGLE_MODAL } from '../../actions/Modal/ActionTypes';

const defaultState: IModalState = {
  isOpen: false,
  title: '',
  body: '',
  type: '',
};

const reducer = handleActions(
  {
    [SET_MODAL_DATA]: (state: IModalState, action: any): IModalState => {
      return { ...state, ...action.payload };
    },
    [TOGGLE_MODAL]: (state: IModalState, action: any): IModalState => {
      return { ...state, isOpen: !state.isOpen };
    },
  },
  defaultState,
);

export default reducer;
