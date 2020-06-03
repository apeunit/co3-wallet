import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import SingleToken from './SingleToken';
import MultiToken from './MultiToken';
import { Flex } from 'rebass';
import _get from 'lodash/get';
import { saveAccessToken } from '../redux/actions/CO3UUM';
import { getLocation } from '../redux/actions/User';
import {
  generateMnemonicPhrase,
  getMnemonic,
  initWallet,
  initWalletLocal,
} from '../redux/actions/Wallet';
import { setModalData, toggleModal } from '../redux/actions/Modal';
import NodeErrorModal from './NodeErrorModal';

/**
 * TODO: Define props and state interface for component and remove all 'any(s)'
 */
const MainPage: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const { chain: chainObj, wallet: walletObj, user: useObj } = useSelector(
    ({ chain, wallet, user }: any) => {
      return {
        chain,
        wallet,
        user,
      };
    },
  );

  useEffect(() => {
    dispatch(setModalData('', '', 'node'));
    dispatch(toggleModal());
    if (!localStorage.getItem('privateKey')) {
      // Get the fetched  Mnemonic phrase
      dispatch(getMnemonic());
    } else {
      dispatch(initWalletLocal());
    }
    if (localStorage.getItem('pilot')) {
      dispatch(getLocation(localStorage.getItem('pilot')));
    }
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const pilot = params.get('pilot');
      if (pilot) {
        localStorage.setItem('pilot', pilot);
      }
      dispatch(getLocation(pilot));

      const accessToken = params.get('accessToken');
      if (accessToken) {
        dispatch(saveAccessToken(accessToken));
        history.push('/');
      }
    }
  }, [dispatch, history, location.search]);

  const homeView = () => {
    return useObj && useObj.features.indexOf('multiToken') > -1 ? <MultiToken /> : <SingleToken />;
  };

  useEffect(() => {
    // -------------------------------------------------------------------------- */
    //             Generate memonic phrase and create the user wallet.            */
    // -------------------------------------------------------------------------- */
    if (!localStorage.getItem('privateKey')) {
      if (walletObj && !walletObj.mnemonic) {
        dispatch(generateMnemonicPhrase());
      }
      if (walletObj && walletObj.mnemonic && !walletObj.privateKey) {
        dispatch(initWallet(walletObj.mnemonic));
      }
    }
    // TODO: Need to show the error message if the wallet is not generated.
  }, [dispatch, walletObj]);

  return (
    <Flex flexDirection="column" height="100vh" backgroundColor="blue100">
      {homeView()}
      {!_get(chainObj, 'errorWeb3.connected', true) && <NodeErrorModal />}
    </Flex>
  );
};

export default MainPage;
