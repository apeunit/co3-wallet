import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SingleToken from './SingleToken';
import MultiToken from './MultiToken';
import { Flex } from 'rebass';
import { getPilot } from '../redux/actions/Pilot';
import NodeErrorModal from './NodeErrorModal';
import { PILOT } from 'src/config';
import { setModalData } from 'src/redux/actions/Modal';

/**
 * TODO: Define props and state interface for component and remove all 'any(s)'
 */
const MainPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { errorWeb3, _pilot, modalOpen } = useSelector(({ chain, pilot, modal }: any) => {
    return {
      _pilot: pilot,
      errorWeb3: chain.errorWeb3,
      modalOpen: modal.isOpen,
    };
  });

  useEffect(() => {
    // set the pilot from the build
    try {
      PILOT && dispatch(getPilot(PILOT));

      if (location.search) {
        const params = new URLSearchParams(location.search);
        const pilotParam = params.get('pilot') || PILOT;
        dispatch(getPilot(pilotParam));
      }
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, location.search]);

  useEffect(() => {
    if (errorWeb3 && !errorWeb3.connected && !modalOpen) {
      dispatch(setModalData(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorWeb3]);

  const homeView = () => {
    return _pilot && _pilot.features.indexOf('multiToken') > -1 ? <MultiToken /> : <SingleToken />;
  };

  return (
    <Flex flexDirection="column" height="100vh" backgroundColor="blue100">
      {homeView()}
      {errorWeb3 && !errorWeb3.connected && !modalOpen && <NodeErrorModal />}
    </Flex>
  );
};

export default MainPage;
