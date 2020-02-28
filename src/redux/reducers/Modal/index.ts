import { handleActions } from 'redux-actions'
import { ModalState } from '../../../interfaces'
import { SET_MODAL_DATA, TOGGLE_MODAL } from '../../actions/Modal/ActionTypes'

const defaultState: ModalState = {
    isOpen: false,
    title: '',
    body: ''
}

const reducer = handleActions({
    [SET_MODAL_DATA]: (state: ModalState, action: any): ModalState => {
        console.log(action)
        return Object.assign({}, state as ModalState, { ...action.payload })
    },
    [TOGGLE_MODAL]: (state: ModalState, action: any): ModalState => {
        return Object.assign({}, state as ModalState, { isOpen: !state.isOpen})
    }
}, defaultState)

export default reducer
