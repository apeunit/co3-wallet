export interface IToken {
  logoURL: string;
  name: string;
  token_symbol: string;
  amount?: number | string;
  decimals: number | string;
  owner?: string;
  contractAddress?: string;
}
export interface ITokens {
  tokens: IToken[];
}

export interface IName {
  name: string;
}

export interface IIconName {
  name:
    | 'pay'
    | 'receive'
    | 'history'
    | 'notifications'
    | 'ranking'
    | 'menu'
    | 'close'
    | 'flash'
    | 'flip'
    | 'back'
    | 'check'
    | 'upload'
    | 'uploading'
    | 'cloud'
    | 'add'
    | 'remove';
  style?: any;
}

export interface IWalletState {
  mnemonic: string | null;
  privateKey: string | null;
  nodeUrl: string | null;
  tokenFactoryAddress: string | null;
  isValid: boolean;
  saved: boolean;
  ethAddress: string | null;
  publicKey: string | null;
  transfer: {
    to?: string;
    token?: ITokenData;
    amount?: string;
  };
}

export interface ICO3UUMState {
  profile: object | null;
  accessToken: string | null;
}

export interface IQRCode {
  onError(data: string | null): void;
  onScan(data: string | null): void;
}

export interface IChainState {
  web3: object | null;
  contracts: object | null;
  tokenList: ITokenData[];
  transactionHistory: ITransactionHistoryData[];
  tokenCreated: object | null;
  tokenMinted: object | null;
  tokenTransferred: object | null;
  tokenBalance: object | null;
  errorWeb3: object | null;
  tokenLoading: boolean | false;
  txnLoading: boolean | true;
}

export enum ITokenAction {
  Transfer = 'transfer',
  Mint = 'mint',
}

export interface ITransactionHistoryData {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
  type: string;
  returnValues: object | null;
  event: string;
}

export interface ITokenData {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURL: string;
  owner: string;
  mintable: boolean;
}

export interface IModalState {
  isOpen: boolean;
  title: string;
  body: string;
  type: string;
}

export interface IUserState {
  location: string;
  features: string[];
  country: string;
  username: string;
  ip: string;
}
