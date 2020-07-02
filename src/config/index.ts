const ENV = process.env.NODE_ENV;
const DEV_ADDRESS = process.env.REACT_APP_DEV_ADDRESS;

// pilot name 
const PILOT = process.env.REACT_APP_PILOT || "turin";

const LISTENER_URL =
  process.env.REACT_APP_LISTENER_URL || 'https://co3-pantheon.di.unito.it:4040/graphql';

const NODE_URL =
  process.env.REACT_APP_NODE || 'wss://co3:Co3Blockchain_2019@co3-pantheon.di.unito.it:8545/ws/';
const TOKEN_FACTORY_ADDRESS =
  process.env.REACT_APP_TOKEN_FACTORY || '0x954Ce03F134145151846Ba3980c8F0Bc1370fcce';
const CROWDSALE_FACTORY_ADDRESS =
  process.env.REACT_APP_CROWDSALE_FACTORY || '0xB886d5AB6e8672DD017a0bE65afec471DC9Db7f7';
const DAO_FACTORY_ADDRESS =
  process.env.REACT_APP_DAO_FACTORY || '0xf59F92549eBD86eF1a6937f339bc2e77798D2d65';

const LISTENER_POLL_INTERVAL = process.env.REACT_APP_LISTENER_POLL_INTERVAL || 2000;

const API_URL = process.env.REACT_APP_CO3UUM_URL || 'https://co3.liquidfeedback.com';

const API_FIRSTLIFE_URL =
  process.env.REACT_APP_FIRSTLIFE_STORAGE_URL || 'https://storage.firstlife.org';
const API_SERVER = process.env.REACT_APP_FIRSTLIFE_SERVER_ID || 'CO3UUM_DEV';
const MNEMONIC_PHRASE = localStorage.getItem('co3-app-mnemonic');

// redirect URL for SSO login
const SSO_LOGIN_URL =
  process.env.REACT_APP_SSO_LOGIN_URL || 'https://dashboard.co3.apeunit.com/wallet/login';

// sentry key for error logging
const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN || undefined;

const BACKUP_WALLET = localStorage.getItem('co3-app-backup');

export {
  ENV,
  DEV_ADDRESS,
  PILOT,
  LISTENER_URL,
  NODE_URL,
  TOKEN_FACTORY_ADDRESS,
  CROWDSALE_FACTORY_ADDRESS,
  DAO_FACTORY_ADDRESS,
  API_URL,
  LISTENER_POLL_INTERVAL,
  API_FIRSTLIFE_URL,
  API_SERVER,
  MNEMONIC_PHRASE,
  SSO_LOGIN_URL,
  SENTRY_DSN,
  BACKUP_WALLET,
};
