import React, { useEffect } from 'react';
import './App.css';
import Router from './router/Router';
import './i18n';
import { connect } from 'react-redux';
import Modal from './containers/Modal';
import FullScreen from 'react-request-fullscreen';

const NodeURL: string =
  process.env.REACT_APP_NODE || 'wss://co3:Co3Blockchain_2019@co3-pantheon.di.unito.it:8545/ws/';
const TokenFactoryAddress: string =
  process.env.REACT_APP_TOKEN_FACTORY || '0x4EE74201998b35CE3f38d7462ee11d7b55A791E2';
const CrowdsaleFactoryAddress: string =
  process.env.REACT_APP_CROWDSALE_FACTORY || '0xd21d09AEE6B39D52573154Fe4f3Ac55B384637Fc';
const DAOFactoryAddress: string =
  process.env.REACT_APP_DAO_FACTORY || '0x7a871b2B1830aF39f718D3045D89B144734C761d';

const App = (props: any) => {
  const {
    modal: { type },
  } = props;

  useEffect(() => {
    if (!localStorage.getItem('wsUrl')) {
      localStorage.setItem('wsUrl', NodeURL);
    }
    if (!localStorage.getItem('pilot')) {
      localStorage.setItem('pilot', 'turin');
    }
    if (!localStorage.getItem('tokenFactoryAddress')) {
      localStorage.setItem('tokenFactoryAddress', TokenFactoryAddress);
    }
    if (!localStorage.getItem('crowdsaleFactoryAddress')) {
      localStorage.setItem('crowdsaleFactoryAddress', CrowdsaleFactoryAddress);
    }
    if (!localStorage.getItem('DAOFactoryAddress')) {
      localStorage.setItem('DAOFactoryAddress', DAOFactoryAddress);
    }
  }, []);

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

export default connect((state: any) => ({ ...state }), undefined)(App);
