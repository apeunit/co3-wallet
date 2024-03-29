export interface IToken {
  logoURL: string;
  name: string;
  token_symbol: string;
  amount?: number | string;
  decimals: number | string;
  owner?: string;
  purpose?: number;
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
    // | 'pay'
    // | 'receive'
    // | 'history'
    // | 'notifications'
    // | 'ranking'
    // | 'menu'
    // | 'close'
    // | 'flash'
    // | 'flip'
    // | 'back'
    // | 'check'
    // | 'upload'
    // | 'uploading'
    // | 'cloud'
    // | 'add'
    // | 'remove'
    // | 'up'
    // | 'arrowUp'
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
    | 'next'
    | 'check'
    | 'backspace'
    | 'add'
    | 'up'
    | 'dialpad'
    | 'token'
    | 'coupen'
    | 'tag'
    | 'upload'
    | 'uploading'
    | 'cloud'
    | 'clouddone'
    | 'fileCopy'
    | 'editIcon'
    | 'mapIcon'
    | 'walletIcon'
    | 'compareIcon'
    | 'totalSupply'
    | 'errorIcon'
    | 'dirBackArrow'
    | 'sellIcon'
    | 'sendIcon'
    | 'mintIcon'
    | 'arrowDown'
    | 'arrowUp'
    | 'remove'
    | 'cameraAlt'
    | 'settings'
    | 'arrowForward'
    | 'warning'
    | 'checkCircleRounded'
    | 'errorOutline'
    | 'defaultImage'
    | 'locationOn'
    | 'myLocation'
    | 'arrowBackIos'
    | 'insertDriveFile'
    | 'dateRange'
    | 'shoppingCart'
    | 'calendarToday'
    | 'hourglassEmpty'
    | 'dowload';
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
  activityID: string | null;
}

export interface IQRCode {
  onError(data: string | null): void;
  onScan(data: string | null): void;
}

export interface ICrowdsaleData {
  name: string;
  icon?: string;
  logoURL: string;
  metadata?: any;
  startDate?: string;
  start?: string;
  end?: string;
  endDate?: string;
  description?: string;
  crowdsaleId: string;
  maxSupply?: string;
  itemToSell: string;
  giveRatio?: number;
  acceptRatio?: number;
  token: string;
  contractAddress: string;
  entity_type?: string;
}

export interface ITokenListData {
  contractAddress: string;
  decimals: number;
  hardCap: number;
  logoURL: string;
  mintable: true
  name: string;
  owner: string;
  purpose: number;
  symbol: string;
  timestamp: string;
  __typename: string;
  _id: string;

}

export interface IPickupBasketData {
  name: string;
  icon?: string;
  logoURL: string;
  metadata?: any;
  startDate?: string;
  start?: string;
  end?: string;
  endDate?: string;
  description?: string;
  pickupsaleId: string;
  maxSupply?: string;
  itemToSell: string;
  giveRatio?: number;
  acceptRatio?: number;
  token: string;
  contractAddress: string;
  entity_type?: string;
  couponToGive: string;
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
  pickupBasketList: IPickupBasketData[];
  crowdsaleList: ICrowdsaleData[];
  openCrowdsaleList: ICrowdsaleData[];
  closedCrowdsaleList: ICrowdsaleData[];
  crowdsaleData: any;
  pickupBasketData: any;
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
  purpose?: number;
}

export interface IModalState {
  isOpen: boolean;
  title: string;
  body: string;
  type: string;
}

export interface IPilotState {
  features: [];
}

export interface IMember {
  admin: string, //"false",
  created: string, //"2019-09-30 12:34:58",
  id: string, //"35",
  identification: string, //"alberto guffanti",
  last_activity: string, //"2021-03-10",
  location: string, //null,
  name: string, //"alberto guffanti"
  roles: IAssociate;
}

export interface IAssociate {
  beneficiary: boolean;
}
export interface IMemberSearchResult {
  result: Array<IMember>
}

export interface IProfile {
  result: {
    blockchain_public_key: string
  }
}


// export interface IRoles {
//   result: {
//     admin: string
//     associationManager: string
//     anyone: string
//   }
// }
