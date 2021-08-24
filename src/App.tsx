import React, { useEffect, useState } from 'react';
import './App.css';
import Router from './router/Router';
import './i18n';
import { useLocation } from 'react-router-dom';
import Modal from './containers/Modal';
import FullScreen from 'react-request-fullscreen';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getPublicKey } from './api/co3uum';
import {
  generateMnemonicPhrase,
  getMnemonic,
  initWallet,
  setPublicKey,
} from './redux/actions/Wallet';
import _get from 'lodash/get';
import { saveAccessToken, saveAid } from './redux/actions/CO3UUM';
import { useLazyQuery } from '@apollo/react-hooks';
import { BALANCE_NOTIFY_QUERY } from './api/middleware';
import { LISTENER_POLL_INTERVAL } from './config';
import { getAllToken } from './redux/actions/Chain';
import _isEqual from 'lodash/isEqual';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [tokenList, setTokenList] = useState([]);
  const { accessToken, type, ethAddress, privateKey, mnemonic } = useSelector(
    ({ modal, co3uum, wallet }: any) => {
      return {
        type: modal.type,
        accessToken: co3uum.accessToken || params.get('access_token'),
        mnemonic: wallet.mnemonic,
        privateKey: wallet.privateKey,
        ethAddress: wallet.ethAddress,
      };
    },
    shallowEqual,
  );

  const [balanceTokenQuery, { called, data }] = useLazyQuery(BALANCE_NOTIFY_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      accountPk: ethAddress,
    },
  });

  useEffect(() => {
    if (ethAddress) {
      balanceTokenQuery();
      const TokenInterval = setInterval(() => {
        !called && balanceTokenQuery();
      }, parseInt(LISTENER_POLL_INTERVAL));

      return () => {
        clearInterval(TokenInterval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceTokenQuery, ethAddress]);

  useEffect(() => {
    if (data) {
      if (!_isEqual(tokenList, data.balanceNotificationMany)) {
        setTokenList(data.balanceNotificationMany);
        dispatch(getAllToken(data.balanceNotificationMany));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    dispatch(getMnemonic());
    if(localStorage.getItem('access_token')) {
      dispatch(saveAccessToken(localStorage.getItem('access_token')));
      const res = getPublicKey(localStorage.getItem('access_token') as string);
      res
        .then((data) => console.log("data"))
        .catch((e) => {
          localStorage.removeItem('access_token')
          dispatch(saveAccessToken(''));
          params.delete('access_token')
          params.delete('role')
          return;
        })
    } 
    const _accessToken = params.get('access_token');
    const aid = params.get('aid');
    if (_accessToken) {
      localStorage.setItem('access_token', _accessToken);
      dispatch(saveAccessToken(_accessToken));
    }
    if (aid) {
      dispatch(saveAid(aid));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserPublicKey = async () => {
    const _accessToken = accessToken || params.get('access_token');
    if (_accessToken) {
      localStorage.setItem('access_token', _accessToken);
      const pbkey = await getPublicKey(_accessToken);
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
    if (!mnemonic) {
      dispatch(generateMnemonicPhrase());
    }
    if (mnemonic && !privateKey) {
      dispatch(initWallet(mnemonic));
    }
    // TODO: Need to show the error message if the wallet is not generated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mnemonic, privateKey]);

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
