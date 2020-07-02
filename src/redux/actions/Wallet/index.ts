import { generateMnemonic, mnemonicToSeed, validateMnemonic } from 'bip39';
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util';
import { createActions } from 'redux-actions';
import { MNEMONIC_PHRASE } from 'src/config';
import { ITokenData } from '../../../interfaces';
import { initialSetup, tokenLoading } from '../Chain';
import {
  CREATE_WALLET,
  GENERATE_MNEMONIC_PHRASE,
  GET_MNEMONIC,
  SET_MNEMONIC,
  SET_NODE_URL,
  SET_PUBLIC_KEY,
  SET_TOKEN_FACTORY_ADDRESS,
  SET_TO_ADDRESS,
  SET_TRANSFER_AMOUNT,
  SET_TRANSFER_TOKEN,
  VALIDATE_MNEMONIC_DATA,
} from './ActionTypes';

const hdkey = require('ethereumjs-wallet/hdkey');

const {
  generateMnemonicPhrase,
  validateMnemonicData,
  getMnemonic,
  createWallet,
  setToAddress,
  setTransferToken,
  setTransferAmount,
  setNodeUrl,
  setTokenFactoryAddress,
  setPublicKey,
  setMnemonic,
} = createActions({
  [GENERATE_MNEMONIC_PHRASE]: (): object => {
    const mnemonic = MNEMONIC_PHRASE ? MNEMONIC_PHRASE : generateMnemonic(),
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
  [SET_MNEMONIC]: (mnemonic: string) => ({ mnemonic }),
  [CREATE_WALLET]: (payload: object) => ({ ...payload }),
  [SET_TO_ADDRESS]: (address: string) => ({ address }),
  [SET_TRANSFER_TOKEN]: (token: ITokenData) => ({ token }),
  [SET_TRANSFER_AMOUNT]: (amount: string) => ({ amount }),
  [SET_NODE_URL]: (nodeUrl: string) => ({ nodeUrl }),
  [SET_TOKEN_FACTORY_ADDRESS]: (tokenFactoryAddress: string) => ({ tokenFactoryAddress }),
  [SET_PUBLIC_KEY]: (publicKey: string) => ({ publicKey }),
});

const initWallet = (mnemonic: string): any => {
  return (dispatch: any) => {
    return mnemonicToSeed(mnemonic).then((seed: any) => {
      const hdkeyInstance = hdkey.fromMasterSeed(seed);
      const node = hdkeyInstance.derivePath("m/44'/60'/0'/0'/0");
      const child = node.deriveChild(0);
      const wallet = child.getWallet();
      const ethAddress = toChecksumAddress(
        publicToAddress(wallet.getPublicKeyString()).toString('hex'),
      );
      dispatch(tokenLoading(true));
      dispatch(
        createWallet({
          privateKey: wallet.getPrivateKeyString(),
          ethAddress: ethAddress,
        }),
      );
      /**
       * TODO: Find a better place to init web3 esp. that is disconnected from the wallet
       */
      dispatch(initialSetup(wallet.getPrivateKeyString()));
    });
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
  createWallet,
  getMnemonic,
  setToAddress,
  setTransferAmount,
  setTransferToken,
  resetTransferData,
  setNodeUrl,
  setTokenFactoryAddress,
  setPublicKey,
  setMnemonic,
};
