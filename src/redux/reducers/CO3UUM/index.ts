import { handleActions, combineActions } from 'redux-actions'
import { CO3UUMState } from '../../../interfaces'
import { GET_USER_PROFILE_DATA, UPDATE_USER_PUBKEY, SAVE_ACCESS_TOKEN  } from '../../actions/CO3UUM/ActionTypes'

const defaultState: CO3UUMState = {
    accessToken: null,
    profile: null
}

const combinedActions: any = combineActions(GET_USER_PROFILE_DATA, UPDATE_USER_PUBKEY, SAVE_ACCESS_TOKEN )

const reducer = handleActions({
    [combinedActions]: (state: Object, payload: Object): CO3UUMState => {
        return Object.assign({}, state as CO3UUMState, payload)
    }
}, defaultState)

export default reducer