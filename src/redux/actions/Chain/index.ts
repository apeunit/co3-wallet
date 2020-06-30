// tslint:disable
import { createActions } from 'redux-actions';
import { CROWDSALE_FACTORY_ADDRESS, NODE_URL, TOKEN_FACTORY_ADDRESS } from 'src/config';
import Web3 from 'web3';
import CrowdsaleFactoryJSON from '../../../contracts/CrowdsaleFactory.json';
import TokenFactoryJSON from '../../../contracts/TokenFactory.json';
import TokenTemplateJSON from '../../../contracts/TokenTemplate.json';
import { IToken, ITokenAction, ITokenData } from '../../../interfaces';
import {
  CREATE_TOKEN,
  ERROR_WEB3,
  GET_TOKEN_BALANCE,
  GET_TOKEN_DETAIL,
  GET_TRANSACTION_HISTORY,
  INIT_WEB3,
  MINT_TOKEN,
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
  getTransactionHistory,
  createToken,
  mintToken,
  transferToken,
  getTokenBalance,
  getTokenDetail,
} = createActions({
  [INIT_WEB3]: (data: object): object => ({ ...data }),
  [ERROR_WEB3]: (data: object): object => ({ ...data }),
  [TOKEN_LOADING]: (tokenLoading: object): object => ({ tokenLoading }),
  [TXN_LOADING]: (txnLoading: object): object => ({ txnLoading }),
  // [GET_ALL_TOKEN]: (tokenList: []): object => ({ tokenList }),
  [GET_TRANSACTION_HISTORY]: (transactionHistory: []): object => ({ transactionHistory }),
  [CREATE_TOKEN]: (tokenCreated: object) => ({ tokenCreated }),
  [MINT_TOKEN]: (tokenMinted: object) => ({ tokenMinted }),
  [TRANSFER_TOKEN]: (tokenTransferred: object) => ({ tokenTransferred }),
  [GET_TOKEN_BALANCE]: (balance: object) => ({ balance }),
  [GET_TOKEN_DETAIL]: (tokenInfo: ITokenData) => ({ tokenInfo }),
});

const fetchAllTokens = () => {
  return async (dispatch: any, state: any) => {
    try {
      const tokensList = await tokenFactory.methods
        .getTokenList()
        .call()
        .then((data: any) => data);
      if (state().chain.tokenList.length !== tokensList.length) {
        // return dispatch(getAllToken(tokensList));
      }
    } catch (error) {
      dispatch(tokenLoading(false));
      console.error(error.message);
    }
  };
};

const fetchTokenByTicker = (ticker: string) => {
  return (dispatch: any) => {
    return tokenFactory.methods
      .getToken(ticker)
      .call()
      .then((data: any) => {
        if (data[2] === ticker) {
          dispatch(getTokenDetail(formatTokenData(data)));
        } else {
          console.log('Not found');
          /**
           * TODO: dispatch error
           */
        }
      });
  };
};

const fetchTransactionsHistory = () => {
  return async (dispatch: any, state: any) => {
    try {
      const contract = new web3.eth.Contract(TokenFactoryJSON.abi, TOKEN_FACTORY_ADDRESS, opts);
      let filteredTxnsHistory: any = [];
      const contractEvent = await contract.getPastEvents('TokenAdded', {
        fromBlock: 0,
        toBlock: 'latest',
      });
      contractEvent.length > 0 &&
        contractEvent.map(async (event: any) => {
          if (event.returnValues._from === state().wallet.ethAddress) {
            filteredTxnsHistory.push({
              event: event.event,
              from: event.returnValues._from,
              timestamp: event.returnValues._timestamp,
              name: event.returnValues._name,
              symbol: event.returnValues._symbol,
              decimals: event.returnValues._decimals,
              value: event.returnValues._hardCap,
              contractAddress: event.returnValues._contractAddress,
              logoURL: event.returnValues._logoURL,
              transactionHash: event.transactionHash,
              blockHash: event.blockHash,
              blockNumber: event.blockNumber,
              address: event.address,
              raw: event.raw,
            });
          }
        });
      if (state().chain.tokenList.length === 0) {
        dispatch(txnLoading(false));
      }
      state().chain.tokenList.length > 0 &&
        state().chain.tokenList.map(async (token: IToken, index: number) => {
          if (token.owner === state().wallet.ethAddress || (token.amount && token.amount > 0)) {
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
                if (
                  event.returnValues.to === state().wallet.ethAddress ||
                  event.returnValues.to === token.owner ||
                  event.returnValues.from === state().wallet.ethAddress ||
                  event.returnValues.from === token.owner
                ) {
                  filteredTxnsHistory.push({
                    event: event.event,
                    ...token,
                    ...event.returnValues,
                    timestamp: blockData && blockData.timestamp,
                    transactionHash: event.transactionHash,
                    blockHash: event.blockHash,
                    blockNumber: event.blockNumber,
                    address: event.address,
                    raw: event.raw,
                  });
                }
              });
            if (
              filteredTxnsHistory.length > 0 &&
              state().chain.transactionHistory.length < filteredTxnsHistory.length
            ) {
              dispatch(txnLoading(false));
              dispatch(getTransactionHistory(filteredTxnsHistory));
            }
          }
          if (index === state().chain.tokenList.length - 1 && filteredTxnsHistory.length === 0) {
            dispatch(txnLoading(false));
          }
        });
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
        /**
         * Refresh token list after new token is added
         */
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
    return Token.methods[action](to, amount)
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: '94000000',
      })
      .then((data: any) => {
        console.log(data);
      });
  };
};

const mintNewToken = (token: ITokenData, amount: number) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);
    const gasPrice = await web3.eth.getGasPrice();
    const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts);
    return Token.methods
      .mint(state().wallet.ethAddress, amount)
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: '94000000',
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
    const Node_URL = state().wallet.nodeUrl ? state().wallet.nodeUrl : NODE_URL;
    dispatch(errorWeb3({ connected: true }));
    if (Node_URL.includes('http')) {
      web3 = new Web3(new Web3HttpProvider(Node_URL.trim(), options));
    } else {
      web3 = new Web3(new Web3WsProvider(Node_URL.trim(), options));
    }
    web3.eth.net
      .isListening()
      .then(() => {
        dispatch(errorWeb3({ connected: true }));
      })
      .catch((error: any) => {
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
  initialSetup,
  fetchAllTokens,
  createToken,
  createNewToken,
  transferTokens,
  isMintableToken,
  mintToken,
  transferToken,
  mintNewToken,
  getTokenBalance,
  getTokenDetail,
  fetchTokenByTicker,
  fetchTransactionsHistory,
};
