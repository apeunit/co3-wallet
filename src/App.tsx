import React, { useEffect } from 'react';
import './App.css';
import Router from './router/Router';
import './i18n';
import { useLocation } from 'react-router-dom';
import Modal from './containers/Modal';
import FullScreen from 'react-request-fullscreen';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicKey } from './api/co3uum';
import {
  generateMnemonicPhrase,
  getMnemonic,
  initWallet,
  setPublicKey,
} from './redux/actions/Wallet';
import _get from 'lodash/get';
import { saveAccessToken } from './redux/actions/CO3UUM';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { accessToken, type, wallet: walletObj } = useSelector(({ modal, co3uum, wallet }: any) => {
    return {
      type: modal.type,
      accessToken: co3uum.accessToken || params.get('access_token'),
      wallet,
    };
  });

  useEffect(() => {
    dispatch(getMnemonic());

    const _accessToken = params.get('access_token');
    if (_accessToken) {
      dispatch(saveAccessToken(_accessToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const getUserPublicKey = async () => {
    const _accessToken = accessToken || params.get('access_token');
    if (_accessToken) {
      let pbkey = await getPublicKey(_accessToken);
      if (_get(pbkey, 'result.blockchain_public_key')) {
        dispatch(setPublicKey(_get(pbkey, 'result.blockchain_public_key')));
      }
    }
  };

  useEffect(() => {
    getUserPublicKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    // -------------------------------------------------------------------------- */
    //             Generate memonic phrase and create the user wallet.            */
    // -------------------------------------------------------------------------- */
    if (walletObj && !walletObj.mnemonic) {
      dispatch(generateMnemonicPhrase());
    }
    if (walletObj && walletObj.mnemonic && !walletObj.privateKey) {
      dispatch(initWallet(walletObj.mnemonic));
    }
    // TODO: Need to show the error message if the wallet is not generated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletObj]);

  return (
    <div className="app-wrapper">
      <FullScreen
        onFullScreenError={(err: any) => console.log(err)}
        onFullScreenChange={() => console.log}
      >
        <div className="App">
          <Router />
          {type === 'permission' && <Modal />}
        </div>
      </FullScreen>
    </div>
  );
};

export default App;
