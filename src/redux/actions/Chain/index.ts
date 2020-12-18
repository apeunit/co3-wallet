// tslint:disable
import _get from 'lodash/get';
import moment from 'moment';
import { createActions } from 'redux-actions';
import { getCrowdsaleList, saveCrowdsaleData } from 'src/api/firstlife';
import { CROWDSALE_FACTORY_ADDRESS, NODE_URL, THING_ID, TOKEN_FACTORY_ADDRESS } from 'src/config';
import { getRandomId } from 'src/utils/helper';
import { formatAmount } from 'src/utils/misc';
import Web3 from 'web3';
import CrowdsaleFactoryJSON from '../../../contracts/CrowdsaleFactory.json';
import TokenFactoryJSON from '../../../contracts/TokenFactory.json';
import TokenTemplateJSON from '../../../contracts/TokenTemplate.json';
import { ICrowdsaleData, ITokenAction, ITokenData } from '../../../interfaces';
import { setTransferToken } from '../Wallet';
import {
  CREATE_TOKEN,
  ERROR_WEB3,
  GET_ALL_CROWDSALE,
  GET_ALL_TOKEN,
  GET_CROWDSALE_DATA,
  GET_TOKEN_BALANCE,
  GET_TOKEN_DETAIL,
  GET_TRANSACTION_HISTORY,
  INIT_WEB3,
  TOKEN_LOADING,
  TRANSFER_TOKEN,
  TXN_LOADING,
} from './ActionTypes';

var Web3WsProvider = require('web3-providers-ws');
var Web3HttpProvider = require('web3-providers-http');

let web3: any = null;
let opts: any = null;
let tokenFactory: any = null;
let crowdsaleFactory: any = null;

var options = {
  timeout: 30000, // ms

  // Useful if requests are large
  clientConfig: {
    maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
    maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
  },

  // Enable auto reconnection
  reconnect: {
    auto: true,
    delay: 5000, // ms
    maxAttempts: 5,
    onTimeout: false,
  },
};

const {
  initWeb3,
  errorWeb3,
  tokenLoading,
  txnLoading,
  getAllToken,
  getTransactionHistory,
  createToken,
  transferToken,
  getTokenBalance,
  getTokenDetail,
  getAllCrowdsale,
  getCrowdsaleData,
} = createActions({
  [INIT_WEB3]: (data: object): object => ({ ...data }),
  [ERROR_WEB3]: (data: object): object => ({ ...data }),
  [TOKEN_LOADING]: (tokenLoading: object): object => ({ tokenLoading }),
  [TXN_LOADING]: (txnLoading: object): object => ({ txnLoading }),
  [GET_ALL_TOKEN]: (tokenList: []): object => ({ tokenList }),
  [GET_ALL_CROWDSALE]: (crowdsaleList: []): object => ({ crowdsaleList }),
  [GET_TRANSACTION_HISTORY]: (transactionHistory: []): object => ({ transactionHistory }),
  [CREATE_TOKEN]: (tokenCreated: object) => ({ tokenCreated }),
  [TRANSFER_TOKEN]: (tokenTransferred: object) => ({ tokenTransferred }),
  [GET_TOKEN_BALANCE]: (balance: object) => ({ balance }),
  [GET_TOKEN_DETAIL]: (tokenInfo: ITokenData) => ({ tokenInfo }),
  [GET_CROWDSALE_DATA]: (crowdsaleData: ICrowdsaleData) => ({ crowdsaleData }),
});

const fetchTokenByTicker = (ticker: string) => {
  return (dispatch: any, state: any) => {
    return tokenFactory.methods
      .getToken(ticker)
      .call()
      .then((data: any) => {
        if (data[2] === ticker) {
          const tokenContract = new web3.eth.Contract(TokenTemplateJSON.abi, data[0], opts);
          tokenContract.methods
            .balanceOf(state().wallet.ethAddress)
            .call()
            .then((amount: any) => {
              const token = formatTokenData(data);
              dispatch(setTransferToken({ ...token, amount }));
            });
        } else {
          console.log('Not found');
          /**
           * TODO: dispatch error
           */
        }
      });
  };
};

const fetchTransactionsHistory = (token: ITokenData) => {
  return async (dispatch: any, state: any) => {
    dispatch(txnLoading(true));
    try {
      let filteredTxnsHistory: any = [];
      const tokenContract = new web3.eth.Contract(
        TokenTemplateJSON.abi,
        token.contractAddress,
        opts,
      );
      const events = await tokenContract.getPastEvents('Transfer', {
        fromBlock: 0,
        toBlock: 'latest',
      });
      events.length > 0 &&
        events.map(async (event: any) => {
          const blockData = await web3.eth.getBlock(event.blockNumber);
          filteredTxnsHistory.push({
            event: event.event,
            ...token,
            ...event.returnValues,
            transactionHash: event.transactionHash,
            blockHash: event.blockHash,
            blockNumber: event.blockNumber,
            address: event.address,
            raw: event.raw,
            token_symbol: token.symbol,
            executed_on: moment(blockData && blockData.timestamp * 1000).format(),
            sender_pk: event.returnValues.from,
            receiver_pk: event.returnValues.to,
            amount: event.returnValues.value,
          });
          if (filteredTxnsHistory.length === events.length) {
            dispatch(txnLoading(false));
            dispatch(getTransactionHistory(filteredTxnsHistory));
          }
        });
    } catch (error) {
      dispatch(txnLoading(false));
      console.error(error.message);
    }
  };
};

const fetchCrowdsaleList = (accessToken: any, activityID: any) => {
  return async (dispatch: any, state: any) => {
    try {
      console.log('fetchCrowdsaleList');
      const contract = new web3.eth.Contract(
        CrowdsaleFactoryJSON.abi,
        CROWDSALE_FACTORY_ADDRESS,
        opts,
      );
      let crowdsaleList: any = [];
      const contractEvent = await contract.getPastEvents('CrowdsaleAdded', {
        fromBlock: 0,
        toBlock: 'latest',
      });
      const crowdsaleData = await getCrowdsaleList(accessToken, activityID);
      const crowdsaleListData = _get(crowdsaleData, 'data.properties.crowdsaleList', []);

      contractEvent.length > 0 &&
        contractEvent.map(async (event: any) => {
          const crowdData = crowdsaleListData.find(
            (crowdsale: ICrowdsaleData) =>
              event.returnValues._contractAddress === crowdsale.contractAddress,
          );
          if (event.returnValues._from === state().wallet.ethAddress) {
            crowdsaleList.push({
              ...crowdData,
              from: event.returnValues._from,
              timestamp: event.returnValues._timestamp,
              contractAddress: event.returnValues._contractAddress,
              end: event.returnValues._end,
              acceptRatio: event.returnValues._acceptRatio,
              giveRatio: event.returnValues._giveRatio,
              id: event.returnValues._id,
              maxCap: event.returnValues._maxCap,
              start: event.returnValues._start,
              transactionHash: event.transactionHash,
              blockHash: event.blockHash,
              blockNumber: event.blockNumber,
              address: event.address,
              raw: event.raw,
            });
          }
        });
      dispatch(getAllCrowdsale(crowdsaleList));
    } catch (error) {
      dispatch(txnLoading(false));
      console.error(error.message);
    }
  };
};

const createNewToken = (
  tokenFactory: any,
  name: string,
  symbol: string,
  logoUrl: string,
  logoHash: string,
  contractHash: string,
  decimals: number = 2,
  hardCap: number = 0,
  purpose: number = 1,
) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);

    const gasPrice = await web3.eth.getGasPrice();
    return tokenFactory.methods
      .createToken(name, symbol, decimals, purpose, logoUrl, logoHash, hardCap, contractHash)
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: 94000000,
      })
      .then((data: any) => {
        dispatch(createToken(data.events.TokenAdded));
        return data;
        /**
         * Refresh token list after new token is added
         */
      });
  };
};

const createNewCrowdsale = (accessToken: string, crowdsale: any) => {
  return async (dispatch: any, state: any) => {
    const crowdsaleData = await getCrowdsaleList(
      accessToken,
      state().co3uum.activityID || THING_ID,
    );
    const crowdsaleList = _get(crowdsaleData, 'data.properties.crowdsaleList', []);
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);

    const gasPrice = await web3.eth.getGasPrice();
    const { itemToSell, token, startDate, endDate, giveRatio, maxSupply } = crowdsale;
    const crowdsaleId = getRandomId();
    return crowdsaleFactory.methods
      .createCrowdsale(
        crowdsaleId,
        itemToSell,
        token,
        Math.floor(new Date(startDate).getTime() / 1000),
        Math.floor(new Date(endDate).getTime() / 1000),
        1,
        parseInt(giveRatio, 10),
        parseInt(maxSupply, 10),
      )
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: 94000000,
      })
      .then((data: any) => {
        const cddata = {
          type: 'Feature',
          properties: {
            crowdsaleList: [
              ...crowdsaleList,
              {
                name: crowdsale.name,
                icon: crowdsale.icon,
                itemToSell: crowdsale.itemToSell,
                token: crowdsale.token,
                contractAddress: _get(
                  data,
                  'events.CrowdsaleAdded.returnValues._contractAddress',
                  '',
                ),
                entity_type: 'CO3_ACTIVITY',
                crowdsaleId,
              },
            ],
          },
        };
        saveCrowdsaleData(accessToken, cddata, state().co3uum.activityID || THING_ID);
        dispatch(createToken(data.events.CrowdsaleAdded));
        return data;
      });
  };
};

const transferTokens = (
  token: ITokenData,
  to: string,
  amount: number,
  action: ITokenAction = ITokenAction.Transfer,
) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);
    const gasPrice = await web3.eth.getGasPrice();
    const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts);
    return Token.methods[action](to, formatAmount(token, amount))
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: state().wallet.gas,
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
  };
};

const mintNewToken = (token: ITokenData, amount: number) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);
    const gasPrice = await web3.eth.getGasPrice();
    const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts);
    return Token.methods
      .mint(state().wallet.ethAddress, formatAmount(token, amount))
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: state().wallet.gas,
      })
      .then((data: any) => {
        console.log(data);
      });
  };
};

const isMintableToken = (token: ITokenData) => {
  const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts);
  return Token.methods
    .isMinter(token.owner)
    .call()
    .then((data: any) => data);
};

const connectWeb3 = () => {
  return (dispatch: any, state: any) => {
    // const Node_URL = state().wallet.nodeUrl ? state().wallet.nodeUrl : NODE_URL;
    const Node_URL = NODE_URL;
    dispatch(errorWeb3({ connected: true }));
    try {
      if (Node_URL.includes('http')) {
        web3 = new Web3(new Web3HttpProvider(Node_URL.trim(), options));
      } else {
        web3 = new Web3(new Web3WsProvider(Node_URL.trim(), options));
      }
    } catch (err) {
      console.log(err);
    }

    web3.eth.net
      .isListening()
      .then(() => {
        dispatch(errorWeb3({ connected: true }));
      })
      .catch((error: any) => {
        console.log(error);
        dispatch(errorWeb3({ connected: false }));
      });
  };
};

const initialSetup = (privateKey: string) => {
  return async (dispatch: any, state: any) => {
    try {
      if (!web3 || web3 === null || (web3 && !web3.currentProvider.connected)) {
        dispatch(connectWeb3());
      }
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address;
      web3.eth.getBlock('latest').then((block: any) => {
        const gas = block.gasLimit - 100000;
        opts = { from: web3.eth.defaultAccount, gas };
        tokenFactory = new web3.eth.Contract(
          TokenFactoryJSON.abi as any,
          state().wallet.tokenFactoryAddress
            ? state().wallet.tokenFactoryAddress
            : TOKEN_FACTORY_ADDRESS,
          opts,
        );
        crowdsaleFactory = new web3.eth.Contract(
          CrowdsaleFactoryJSON.abi as any,
          CROWDSALE_FACTORY_ADDRESS,
          opts,
        );
        dispatch(initWeb3({ web3, contracts: { tokenFactory, crowdsaleFactory }, gas }));
      });
    } catch (err) {
      console.log(err);
    }
  };
};

const formatTokenData = (data: any): ITokenData => {
  return {
    contractAddress: data[0],
    name: data[1],
    symbol: data[2],
    decimals: Number(data[3]),
    logoURL: data[4],
    owner: data[5],
    mintable: data[6],
  };
};
export {
  initWeb3,
  errorWeb3,
  connectWeb3,
  tokenLoading,
  txnLoading,
  getAllToken,
  initialSetup,
  createToken,
  createNewToken,
  transferTokens,
  isMintableToken,
  transferToken,
  mintNewToken,
  getTokenBalance,
  getTokenDetail,
  fetchTokenByTicker,
  fetchTransactionsHistory,
  createNewCrowdsale,
  fetchCrowdsaleList,
  getAllCrowdsale,
  getCrowdsaleData,
};
