import { handleActions, combineActions } from 'redux-actions'
import { WalletState } from '../../../interfaces'
import {
    CREATE_WALLET,
    GENERATE_MNEMONIC_PHRASE,
    GET_MNEMONIC,
    VALIDATE_MNEMONIC_DATA,
    SET_TO_ADDRESS,
    SET_TRANSFER_AMOUNT,
    SET_TRANSFER_TOKEN
} from '../../actions/Wallet/ActionTypes'

const defaultState: WalletState = {
    mnemonic: null,
    privateKey: null,
    isValid: false,
    saved: false,
    ethAddress: null,
    transfer: {
        amount: '0'
    }
}

const combinedActions: any = combineActions(CREATE_WALLET, GENERATE_MNEMONIC_PHRASE, GET_MNEMONIC, VALIDATE_MNEMONIC_DATA)

const reducer = handleActions({
    [combinedActions]: (state: WalletState, action: object): WalletState => {
        const data = action as any
        console.log(action, { ...data.payload })
        const newState: WalletState = Object.assign({}, state as WalletState, { ...data.payload })
        return newState
    },
    [SET_TO_ADDRESS]: (state: WalletState, action: object): WalletState => {
        const data = action as any
        const transfer = Object.assign({}, state.transfer)
        transfer.to = data.payload.address
        const newState: WalletState = Object.assign({}, state as WalletState, { transfer })
        return newState
    },
    [SET_TRANSFER_TOKEN]: (state: WalletState, action: object): WalletState => {
        const data = action as any
        const transfer = Object.assign({}, state.transfer)
        transfer.token = data.payload.token
        const newState: WalletState = Object.assign({}, state as WalletState, { transfer })
        return newState
    },
    [SET_TRANSFER_AMOUNT]: (state: WalletState, action: object): WalletState => {
        const data = action as any
        const transfer = Object.assign({}, state.transfer)
        transfer.amount = data.payload.amount
        const newState: WalletState = Object.assign({}, state as WalletState, { transfer })
        return newState
    }
}, defaultState)


export default reducer