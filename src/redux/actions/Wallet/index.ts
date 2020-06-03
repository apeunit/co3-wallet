import { generateMnemonic, mnemonicToSeed, validateMnemonic } from 'bip39';
import { publicToAddress } from 'ethereumjs-util';
import { createActions } from 'redux-actions';
import { ITokenData } from '../../../interfaces';
import { initialSetup, tokenLoading } from '../Chain';
import {
  CREATE_WALLET,
  GENERATE_MNEMONIC_PHRASE,
  GET_MNEMONIC,
  SET_TO_ADDRESS,
  SET_TRANSFER_AMOUNT,
  SET_TRANSFER_TOKEN,
  VALIDATE_MNEMONIC_DATA,
} from './ActionTypes';
const privateKeyToAddress = require('ethereum-private-key-to-address');

const hdkey = require('ethereumjs-wallet/hdkey');

const {
  generateMnemonicPhrase,
  validateMnemonicData,
  getMnemonic,
  createWallet,
  setToAddress,
  setTransferToken,
  setTransferAmount,
} = createActions({
  [GENERATE_MNEMONIC_PHRASE]: (): object => {
    const mnemonic = generateMnemonic(),
      saved = true;
    localStorage.setItem('co3-app-mnemonic', mnemonic);

    return {
      mnemonic,
      saved,
    };
  },
  [VALIDATE_MNEMONIC_DATA]: (mnemonic: string): object => ({ isValid: validateMnemonic(mnemonic) }),
  [GET_MNEMONIC]: (): object => ({
    mnemonic: localStorage.getItem('co3-app-mnemonic'),
    saved: true,
  }),
  [CREATE_WALLET]: (payload: object) => ({ ...payload }),
  [SET_TO_ADDRESS]: (address: string) => ({ address }),
  [SET_TRANSFER_TOKEN]: (token: ITokenData) => ({ token }),
  [SET_TRANSFER_AMOUNT]: (amount: string) => ({ amount }),
});

const initWallet = (mnemonic: string): any => {
  return (dispatch: any) => {
    return mnemonicToSeed(mnemonic).then((seed: any) => {
      const hdkeyInstance = hdkey.fromMasterSeed(seed);
      const node = hdkeyInstance.derivePath("m/44'/60'/0'/0'/0");
      const child = node.deriveChild(0);
      const wallet = child.getWallet();
      dispatch(tokenLoading(true));
      dispatch(
        createWallet({
          privateKey: wallet.getPrivateKeyString(),
          ethAddress: `0x${publicToAddress(wallet.getPublicKeyString()).toString('hex')}`,
        }),
      );
      /**
       * TODO: Find a better place to init web3 esp. that is disconnected from the wallet
       */
      localStorage.setItem('privateKey', wallet.getPrivateKeyString() as string);
      dispatch(initialSetup(wallet.getPrivateKeyString()));
    });
  };
};

const initWalletLocal = (): any => {
  return async (dispatch: any) => {
    const privateKey = `${localStorage.getItem('privateKey')}` || '';

    dispatch(tokenLoading(true));
    dispatch(
      createWallet({
        privateKey,
        ethAddress: privateKeyToAddress(privateKey),
      }),
    );
    /**
     * TODO: Find a better place to init web3 esp. that is disconnected from the wallet
     */
    dispatch(initialSetup(privateKey));
  };
};

const resetTransferData = () => {
  return (dispatch: any) => {
    dispatch(setToAddress(''));
    //dispatch(setTransferToken({}))
    dispatch(setTransferAmount(0));
  };
};

export {
  generateMnemonicPhrase,
  validateMnemonicData,
  initWallet,
  initWalletLocal,
  createWallet,
  getMnemonic,
  setToAddress,
  setTransferAmount,
  setTransferToken,
  resetTransferData,
};
