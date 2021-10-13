import React, { useEffect, useState } from 'react';
import './App.css';
import Router from './router/Router';
import './i18n';
import { useLocation, useHistory } from 'react-router-dom';
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
import { useTranslation } from 'react-i18next';
import { saveAccessToken, saveAid } from './redux/actions/CO3UUM';
import { useLazyQuery } from '@apollo/react-hooks';
import { BALANCE_NOTIFY_QUERY } from './api/middleware';
import { LISTENER_POLL_INTERVAL } from './config';
import { getAllToken } from './redux/actions/Chain';
import _isEqual from 'lodash/isEqual';
import { setModalData } from 'src/redux/actions/Modal'
import { Button } from 'rebass';
import { savePublicKeyAPI } from 'src/api/co3uum';


const App = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const [tokenList, setTokenList] = useState([]);
  const { type, accessToken, ethAddress, privateKey, mnemonic, publicKey } = useSelector(
    ({ modal, co3uum, wallet }: any) => {
      return {
        type: modal.type,
        accessToken: co3uum.accessToken || params.get('access_token'),
        mnemonic: wallet.mnemonic,
        privateKey: wallet.privateKey,
        ethAddress: wallet.ethAddress,
        publicKey: wallet.publicKey,
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

  const checkToken = async (token: string) => {
    await dispatch(saveAccessToken(token));
    const pubKey = await getPublicKey(token);
    dispatch(setPublicKey(_get(pubKey, 'result.blockchain_public_key')));
    console.log(pubKey, "pubKey")
  }
  
  useEffect(() => {
    (async () => {
      dispatch(getMnemonic());
      if (localStorage.getItem('access_token')) {
        try {
          await checkToken(localStorage.getItem('access_token') as string)
        } catch (e) {
          localStorage.removeItem('access_token')
          dispatch(saveAccessToken(''));
          params.delete('access_token')
          params.delete('role')
          return;
        }
      }

      const _accessToken = params.get('access_token');
      const aid = params.get('aid');
      if (_accessToken) {
        localStorage.setItem('access_token', _accessToken);
        await checkToken(_accessToken);
      }
      if (aid) {
        dispatch(saveAid(aid));
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   const importWallet = () => {
    history.push('/import-wallet')
    dispatch(setModalData(false));
    window.location.reload();
   }

   const keepWallet = () => {
    savePublicKeyAPI(accessToken, ethAddress)
    dispatch(setModalData(false));
   }
   

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


  useEffect(() => {
    console.log(ethAddress);
    console.log(publicKey);
    if(ethAddress && publicKey && ethAddress !== publicKey && params.get('access_token')){
      dispatch(
        setModalData(
          true,
          t('app_settings.address_mismatch_title'),
          [ t('app_settings.address_mismatch_description'), 
          [ <Button
            className="modal-login-btn"
            height="30px"
            margin="20px 5px 0px"
            margin-right="10px"
            width="130px"
            style={{ padding: '0px', borderRadius: '30px', background: '#3752F5' }}
            onClick={() => keepWallet()}
          >
           keep
          </Button>, 
          
          <Button
          className="modal-login-btn"
          height="30px"
          margin="20px 5px 0px"
          width="130px"
          style={{ padding: '0px', borderRadius: '30px', background: '#3752F5' }}
          onClick={() => importWallet()}
        >
          import
        </Button> 
        
        ] ],
          'permission',
        ),
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethAddress, publicKey, accessToken]);

  return (
    <div className="app-wrapper">
      <FullScreen
        onFullScreenError={(err: any) => console.log(err)}
        onFullScreenChange={() => console.log}
      >
        <div className="App">
          <Router />
          {/* <Modal /> */}
          {type === 'permission' && <Modal />}
        </div>
      </FullScreen>
    </div>
  );
};

export default App;
