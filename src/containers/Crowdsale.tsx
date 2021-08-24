import React, { useEffect } from 'react';
import { Flex } from 'rebass';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUserProfileData, saveAid } from 'src/redux/actions/CO3UUM';
import _get from 'lodash/get';
import { setPublicKey } from 'src/redux/actions/Wallet';
import { getPublicKey } from 'src/api/co3uum';
import { CROWDSALE_TYPE_DP, VENDING_TYPE_DP, PICKUP_BOX_DP } from 'src/config';

const CrowdsaleCS = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

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
      const eidParam = params.get('eid');
      const accessTokenParam = params.get('access_token');
      const typeParam = params.get('type');
      if (eidParam && accessTokenParam) {
        dispatch(saveAid(eidParam));
        if (typeParam) {
          history.push({
            pathname: `${
              parseInt(typeParam, 10) === CROWDSALE_TYPE_DP
              ? '/new-crowdsale'
              : parseInt(typeParam, 10) === VENDING_TYPE_DP
              ? '/vm'
              : parseInt(typeParam, 10) === PICKUP_BOX_DP
              ? '/new-pickupbasket'
              : ''
            }`,
            search: location.search,
          });
        } else {
          history.push({
            pathname: `/`,
            search: location.search,
          });
        }
        accessTokenCalls(params);
      } else {
        history.push('/404');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location.search]);


  return <Flex />;
};

export default CrowdsaleCS;
