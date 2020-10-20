import React, { useEffect } from 'react';
import { Flex } from 'rebass';
import { useHistory, useLocation } from 'react-router-dom';
import { getPublicKey } from 'src/api/co3uum';
import { useDispatch } from 'react-redux';
import { getUserProfileData } from 'src/redux/actions/CO3UUM';
import { setPublicKey, setToAddress } from 'src/redux/actions/Wallet';
import _get from 'lodash/get';

const NewPayment = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

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
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const toParam = params.get('to');
      const tokenParam = params.get('token');
      const amountParam = params.get('amount');
      const callbackParam = params.get('callback');
      if (toParam && tokenParam && amountParam) {
        dispatch(setToAddress(toParam));
        history.push(
          `/confirmpayment?to=${toParam}&&token=${tokenParam}&&amount=${amountParam}${
            callbackParam ? `&&callback=${callbackParam}` : ''
          }`,
        );
      } else if (toParam && tokenParam) {
        dispatch(setToAddress(toParam));
        history.push(
          `/payment?to=${toParam}&&token=${tokenParam}${
            callbackParam ? `&&callback=${callbackParam}` : ''
          }`,
        );
      } else if (toParam && !tokenParam && amountParam) {
        dispatch(setToAddress(toParam));
        history.push('/404');
      } else if (toParam) {
        dispatch(setToAddress(toParam));
        history.push(
          `/select-token?to=${toParam}${callbackParam ? `&&callback=${callbackParam}` : ''}`,
        );
      }
      accessTokenCalls(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location.search]);

  return <Flex />;
};

export default NewPayment;
