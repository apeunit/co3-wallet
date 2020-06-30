import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SingleToken from './SingleToken';
import MultiToken from './MultiToken';
import { Flex } from 'rebass';
import { getLocation } from '../redux/actions/User';
import NodeErrorModal from './NodeErrorModal';

/**
 * TODO: Define props and state interface for component and remove all 'any(s)'
 */
const MainPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { errorWeb3, user: useObj } = useSelector(({ chain, user }: any) => {
    return {
      user,
      errorWeb3: chain.errorWeb3,
    };
  });

  useEffect(() => {
    // Get the fetched  Mnemonic phrase
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
    }
  }, [dispatch, location.search]);

  const homeView = () => {
    return useObj && useObj.features.indexOf('multiToken') > -1 ? <MultiToken /> : <SingleToken />;
  };

  return (
    <Flex flexDirection="column" height="100vh" backgroundColor="blue100">
      {homeView()}
      {(errorWeb3 && errorWeb3.connected) && <NodeErrorModal />}
    </Flex>
  );
};

export default MainPage;
