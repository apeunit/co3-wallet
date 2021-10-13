import { createActions } from 'redux-actions';
import { SET_MODAL_DATA, TOGGLE_MODAL } from './ActionTypes';

const { toggleModal, setModalData } = createActions({
  [TOGGLE_MODAL]: (): object => ({}),
  [SET_MODAL_DATA]: (
    isOpen = false,
    title: string,
    body: any,
    type: string,
    isClose = true,
  ): object => ({
    isOpen,
    title,
    body,
    type,
    isClose,
  }),
});

export { toggleModal, setModalData };
