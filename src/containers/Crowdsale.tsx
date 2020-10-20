import React, { useEffect } from 'react';
import { Flex } from 'rebass';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUserProfileData, saveAid } from 'src/redux/actions/CO3UUM';
import _get from 'lodash/get';
import { setPublicKey } from 'src/redux/actions/Wallet';
import { getPublicKey } from 'src/api/co3uum';

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
      const callbackParam = params.get('callback');
      if (eidParam && accessTokenParam) {
        dispatch(saveAid(eidParam));
        history.push(
          `/new-crowdsale?eid=${eidParam}&&access_token=${accessTokenParam}${
            callbackParam ? `&&callback=${callbackParam}` : ''
          }`,
        );
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
