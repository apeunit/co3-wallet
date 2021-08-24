const ENV = process.env.NODE_ENV;
const DEV_ADDRESS = process.env.REACT_APP_DEV_ADDRESS;

// pilot name
const PILOT = process.env.REACT_APP_PILOT || 'turin';
const TOKEN_PURPOSE = 0;
const DISCOUNT_PURPOSE = 1;
const COUPON_PURPOSE = 50;
const PASS_PURPOSE = 51;

/*
  Deeplink type params for crowdsale and vending machine
*/
const CROWDSALE_TYPE_DP = 100;
const VENDING_TYPE_DP = 101;
const PICKUP_BOX_DP = 102;
const LIMIT = 20;

const LISTENER_URL =
  process.env.REACT_APP_LISTENER_URL || 'https://co3-pantheon.di.unito.it:4040/graphql';

const NODE_URL =
  process.env.REACT_APP_NODE || 'wss://co3:Co3Blockchain_2019@co3-pantheon.di.unito.it:8545/ws/';
const TOKEN_FACTORY_ADDRESS =
  process.env.REACT_APP_TOKEN_FACTORY || '0x954Ce03F134145151846Ba3980c8F0Bc1370fcce';
const CROWDSALE_FACTORY_ADDRESS =
  process.env.REACT_APP_CROWDSALE_FACTORY || '0x5d0F435B51eD7cF418103C9752239156150D9287';
const PICKUPBASKET_FACTORY_ADDRESS =
  process.env.PICKUPBASKET_FACTORY_ADDRESS || '0xC151ac4D7AA84A50d0Eefa1519813894fB5DEb31';
const DAO_FACTORY_ADDRESS =
  process.env.REACT_APP_DAO_FACTORY || '0xBFFFa8a14a5aF0a5363859F8F8dD0Dc7300A87a6';

// const LISTENER_POLL_INTERVAL = process.env.REACT_APP_LISTENER_POLL_INTERVAL || 10000;
const LISTENER_POLL_INTERVAL = '10000';

const API_URL = process.env.REACT_APP_CO3UUM_URL || 'https://co3.liquidfeedback.com';

const API_FIRSTLIFE_URL_STORAGE =
  process.env.REACT_APP_FIRSTLIFE_STORAGE_URL || 'https://storage.firstlife.org';

const API_FIRSTLIFE_URL = process.env.REACT_APP_FIRSTLIFE_URL || 'https://api.co3-pt.firstlife.org';

const API_SERVER = process.env.REACT_APP_FIRSTLIFE_SERVER_ID || 'CO3UUM_DEV';
const MNEMONIC_PHRASE = localStorage.getItem('co3-app-mnemonic');
const THING_ID = '5f4cc6b20eca08088d47bfed';

// redirect URL for SSO login
const SSO_LOGIN_URL =
  process.env.REACT_APP_SSO_LOGIN_URL || 'https://dashboard.co3.apeunit.com/wallet/login';

// sentry key for error logging
const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN || undefined;

const BACKUP_WALLET = localStorage.getItem('co3-app-backup');

const TOKEN_CONTRACT_PLACEHOLDER =
  process.env.TOKEN_CONTRACT_PLACEHOLDER || 'assets/Token-Legal-Contract_Placeholder.pdf';

const WEBHOOKAPI = 'https://example.com/webhook';

export {
  ENV,
  DEV_ADDRESS,
  PILOT,
  LISTENER_URL,
  NODE_URL,
  TOKEN_FACTORY_ADDRESS,
  CROWDSALE_FACTORY_ADDRESS,
  PICKUPBASKET_FACTORY_ADDRESS,
  DAO_FACTORY_ADDRESS,
  API_URL,
  LISTENER_POLL_INTERVAL,
  API_SERVER,
  MNEMONIC_PHRASE,
  SSO_LOGIN_URL,
  SENTRY_DSN,
  BACKUP_WALLET,
  THING_ID,
  API_FIRSTLIFE_URL_STORAGE,
  API_FIRSTLIFE_URL,
  TOKEN_PURPOSE,
  DISCOUNT_PURPOSE,
  COUPON_PURPOSE,
  PASS_PURPOSE,
  TOKEN_CONTRACT_PLACEHOLDER,
  WEBHOOKAPI,
  CROWDSALE_TYPE_DP,
  VENDING_TYPE_DP,
  PICKUP_BOX_DP,
  LIMIT
};
