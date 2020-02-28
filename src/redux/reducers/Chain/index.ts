import { handleActions, combineActions } from 'redux-actions'
import { ChainState, TokenData } from '../../../interfaces'
import { INIT_WEB3, GET_ALL_TOKEN, CREATE_TOKEN, MINT_TOKEN, TRANSFER_TOKEN, GET_TOKEN_BALANCE, GET_TOKEN_DETAIL } from '../../actions/Chain/ActionTypes'

const defaultState: ChainState = {
    contracts: null,
    web3: null,
    tokenList: [],
    tokenCreated: null,
    tokenMinted: null,
    tokenTransferred: {},
    tokenBalance: {}
}

const combinedActions: any = combineActions(INIT_WEB3, GET_ALL_TOKEN, CREATE_TOKEN, MINT_TOKEN, TRANSFER_TOKEN)

const reducer = handleActions({
    [combinedActions]: (state: Object, action: any): ChainState => {
        return Object.assign({}, state as ChainState, action.payload)
    },
    [GET_TOKEN_BALANCE]: (state: ChainState, action: any): ChainState => {
        const bal = action.payload.balance
        const tokenBalance = { ...state.tokenBalance, ...bal }
        return  Object.assign({}, state as ChainState, { tokenBalance })
    },
    [GET_TOKEN_DETAIL]: (state: ChainState, action: any): ChainState => {
        const tokenInfo: TokenData = action.payload.tokenInfo
        let tokenList: TokenData[] =  state.tokenList
        let index = tokenList.findIndex((o: TokenData) => o.symbol === tokenInfo.symbol)
        if(index) {
            tokenList[index] = tokenInfo
        } else {
            tokenList = [...tokenList, tokenInfo]
        }
        return  Object.assign({}, state as ChainState, { tokenList })
    }
}, defaultState)

export default reducer