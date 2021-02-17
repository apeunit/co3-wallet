import React, { useEffect } from 'react';
import { Flex } from 'rebass';
import { useHistory, useLocation } from 'react-router-dom';
import { getPublicKey } from 'src/api/co3uum';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfileData } from 'src/redux/actions/CO3UUM';
import { setPublicKey, setToAddress } from 'src/redux/actions/Wallet';
import _get from 'lodash/get';
import { fetchTokenByTicker } from 'src/redux/actions/Chain';
import ScenarioJSON from '../config/scenario.config.json';
import { PILOT } from 'src/config';

const NewPayment = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const { contracts, token } = useSelector(({ chain, pilot, wallet }: any) => {
    return {
      contracts: chain.contracts,
      token: wallet.transfer.token,
    };
  });

  const accessTokenCalls = async (params: any) => {
    const accessTokenParam = params.get('access_token');
    if (accessTokenParam) {
      dispatch(getUserProfileData(accessTokenParam));
      const pbkey = await getPublicKey(accessTokenParam);
      if (_get(pbkey, 'result.blockchain_public_key')) {
        dispatch(setPublicKey(_get(pbkey, 'result.blockchain_public_key')));
      }
    }
  };


  useEffect(() => {
    if (PILOT === 'athens' && contracts?.tokenFactory && location.search) {
      const params = new URLSearchParams(location.search);
      const toParam = params.get('to');
      dispatch(fetchTokenByTicker(ScenarioJSON.athens.tokens[0]));
      dispatch(setToAddress(toParam));
      history.push({ pathname: '/payment', search: location.search, state: { token } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contracts]);

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const toParam = params.get('to');
      const tokenParam = params.get('token');
      const amountParam = params.get('amount');
      if (toParam && tokenParam && amountParam) {
        dispatch(setToAddress(toParam));
        history.push({ pathname: '/confirmpayment', search: location.search });
      } else if (toParam && tokenParam) {
        dispatch(setToAddress(toParam));
        history.push({ pathname: '/payment', search: location.search });
      } else if (toParam && !tokenParam && amountParam) {
        dispatch(setToAddress(toParam));
        history.push('/404');
      } else if (toParam && PILOT === 'turin') {
        dispatch(setToAddress(toParam));
        history.push({ pathname: '/select-token', search: location.search });
      }
      accessTokenCalls(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location.search]);

  return <Flex />;
};

export default NewPayment;
