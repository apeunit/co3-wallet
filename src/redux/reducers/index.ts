import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import wallet from './Wallet'
import co3uum from './CO3UUM'
import chain from './Chain'
import modal from './Modal'

export default (history: any) => combineReducers({
    router: connectRouter(history),
    co3uum,
    wallet,
    chain,
    modal
})
