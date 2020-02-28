import { createActions } from 'redux-actions'
import { SET_MODAL_DATA, TOGGLE_MODAL } from './ActionTypes'

const { toggleModal, setModalData } = createActions({
    [TOGGLE_MODAL]: (): object => ({}),
    [SET_MODAL_DATA]: (title:string, body: string): object => ({ title, body })
})

export { toggleModal, setModalData }
