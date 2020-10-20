import { combineActions, handleActions } from 'redux-actions';
import { IChainState, ITokenData } from '../../../interfaces';
import {
  CREATE_TOKEN,
  ERROR_WEB3,
  GET_ALL_CROWDSALE,
  GET_ALL_TOKEN,
  GET_CROWDSALE_DATA,
  GET_TOKEN_BALANCE,
  GET_TOKEN_DETAIL,
  GET_TRANSACTION_HISTORY,
  INIT_WEB3,
  MINT_TOKEN,
  TOKEN_LOADING,
  TRANSFER_TOKEN,
  TXN_LOADING,
} from '../../actions/Chain/ActionTypes';

const defaultState: IChainState = {
  contracts: null,
  web3: null,
  tokenList: [],
  transactionHistory: [],
  tokenCreated: null,
  tokenMinted: null,
  tokenTransferred: {},
  tokenBalance: {},
  errorWeb3: null,
  tokenLoading: false,
  txnLoading: true,
  crowdsaleList: [],
  crowdsaleData: null,
};

const combinedActions: any = combineActions(
  INIT_WEB3,
  GET_ALL_TOKEN,
  GET_TRANSACTION_HISTORY,
  CREATE_TOKEN,
  MINT_TOKEN,
  TRANSFER_TOKEN,
  TOKEN_LOADING,
  TXN_LOADING,
  GET_ALL_CROWDSALE,
  GET_CROWDSALE_DATA,
);

const reducer = handleActions(
  {
    [combinedActions]: (state: Object, action: any): IChainState => {
      return { ...(state as IChainState), ...action.payload };
    },
    [ERROR_WEB3]: (state: Object, action: any): IChainState => {
      const errorWeb3 = { connected: action.payload.connected };

      return { ...(state as IChainState), errorWeb3 };
    },
    [GET_TOKEN_BALANCE]: (state: IChainState, action: any): IChainState => {
      const bal = action.payload.balance;
      const tokenBalance = { ...state.tokenBalance, ...bal };

      return { ...state, tokenBalance };
    },
    [GET_TOKEN_DETAIL]: (state: IChainState, action: any): IChainState => {
      const tokenInfo: ITokenData = action.payload.tokenInfo;
      let tokenList: ITokenData[] = state.tokenList;
      const index = tokenList.findIndex((o: ITokenData) => o.symbol === tokenInfo.symbol);
      if (index) {
        tokenList[index] = tokenInfo;
      } else {
        tokenList = [...tokenList, tokenInfo];
      }

      return { ...state, ...tokenList };
    },
  },
  defaultState,
);

export default reducer;
