import { combineActions, handleActions } from 'redux-actions';
import { IWalletState } from '../../../interfaces';
import {
  CREATE_WALLET,
  GENERATE_MNEMONIC_PHRASE,
  GET_MNEMONIC,
  SET_TO_ADDRESS,
  SET_TRANSFER_AMOUNT,
  SET_TRANSFER_TOKEN,
  VALIDATE_MNEMONIC_DATA,
} from '../../actions/Wallet/ActionTypes';

const defaultState: IWalletState = {
  mnemonic: null,
  privateKey: null,
  isValid: false,
  saved: false,
  ethAddress: null,
  transfer: {
    amount: '',
  },
};

const combinedActions: any = combineActions(
  CREATE_WALLET,
  GENERATE_MNEMONIC_PHRASE,
  GET_MNEMONIC,
  VALIDATE_MNEMONIC_DATA,
);

const reducer = handleActions(
  {
    [combinedActions]: (state: IWalletState, action: object): IWalletState => {
      const data = action as any;
      const newState: IWalletState = { ...state, ...data.payload };

      return newState;
    },
    [SET_TO_ADDRESS]: (state: IWalletState, action: object): IWalletState => {
      const data = action as any;
      const transfer = { ...state.transfer };
      transfer.to = data.payload.address;
      const newState: IWalletState = { ...state, transfer };

      return newState;
    },
    [SET_TRANSFER_TOKEN]: (state: IWalletState, action: object): IWalletState => {
      const data = action as any;
      const transfer = { ...state.transfer };
      transfer.token = data.payload.token;
      const newState: IWalletState = { ...state, transfer };

      return newState;
    },
    [SET_TRANSFER_AMOUNT]: (state: IWalletState, action: object): IWalletState => {
      const data = action as any;
      const transfer = { ...state.transfer };
      transfer.amount = data.payload.amount;
      const newState: IWalletState = { ...state, transfer };

      return newState;
    },
  },
  defaultState,
);

export default reducer;
