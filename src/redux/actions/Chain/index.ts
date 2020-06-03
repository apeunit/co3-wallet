// tslint:disable
import _merge from 'lodash/merge';
import { createActions } from 'redux-actions';
import Web3 from 'web3';
import CrowdsaleFactoryJSON from '../../../contracts/CrowdsaleFactory.json';
import TokenFactoryJSON from '../../../contracts/TokenFactory.json';
import TokenTemplateJSON from '../../../contracts/TokenTemplate.json';
import { IToken, ITokenAction, ITokenData } from '../../../interfaces';
import { resetTransferData } from '../Wallet';
import {
  CREATE_TOKEN,
  ERROR_WEB3,
  GET_ALL_TOKEN,
  GET_TOKEN_BALANCE,
  GET_TOKEN_DETAIL,
  GET_TRANSACTION_HISTORY,
  INIT_WEB3,
  MINT_TOKEN,
  TOKEN_LOADING,
  TRANSFER_TOKEN,
  TXN_LOADING,
} from './ActionTypes';
const CrowdsaleFactoryAddress = process.env.REACT_APP_CROWDSALE_FACTORY;
const EthereumTx = require('ethereumjs-tx');
var Web3WsProvider = require('web3-providers-ws');
var Web3HttpProvider = require('web3-providers-http');

const Node_URL: string = process.env.REACT_APP_NODE || '';
const privateKey: string = localStorage.getItem('privateKey') || '';
const tokenFactoryAddress: string =
  localStorage.getItem('tokenFactoryAddress') || process.env.REACT_APP_TOKEN_FACTORY || '';

let web3: any = null;
let opts: any = null;
let tokenFactory: any = null;
let crowdsaleFactory: any = null;

var options = {
  timeout: 30000, // ms

  // Useful for credentialed urls, e.g: ws://username:password@localhost:8546
  headers: {
    authorization: 'Basic username:password',
  },

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
  mintToken,
  transferToken,
  getTokenBalance,
  getTokenDetail,
} = createActions({
  [INIT_WEB3]: (data: object): object => ({ ...data }),
  [ERROR_WEB3]: (data: object): object => ({ ...data }),
  [TOKEN_LOADING]: (tokenLoading: object): object => ({ tokenLoading }),
  [TXN_LOADING]: (txnLoading: object): object => ({ txnLoading }),
  [GET_ALL_TOKEN]: (tokenList: []): object => ({ tokenList }),
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
        // .getToken('U003')
        .call()
        .then((data: any) => data);
      if (state().chain.tokenList.length !== tokensList.length) {
        // return dispatch(getAllToken([tokensList]));
        return dispatch(getAllToken(tokensList));
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
      const contract = new web3.eth.Contract(TokenFactoryJSON.abi, tokenFactoryAddress, opts);
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
) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);

    const gasPrice = await web3.eth.getGasPrice();
    return tokenFactory.methods
      .createToken(name, symbol, decimals, logoUrl, logoHash, hardCap, contractHash)
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: '94000000',
      })
      .then((data: any) => {
        dispatch(createToken(data.events.TokenAdded));
        /**
         * Refresh token list after new token is added
         */
        dispatch(fetchAllTokens());
      });
  };
};

const sendTransaction = async (payload: any, to: string, dispatch: any, state: any) => {
  const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);
  const gasPrice = await web3.eth.getGasPrice();

  const txData = {
    nonce: web3.utils.toHex(parseInt(nonce, 10)),
    gasLimit: web3.utils.toHex(web3.utils.toBN(2000000)),
    gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)), // set gas price
    to,
    from: state().wallet.ethAddress,
    data: payload,
  };

  const privKey = privateKey && Buffer.from(privateKey.replace('0x', ''), 'hex');
  const transaction = new EthereumTx.Transaction(txData);

  transaction.sign(privKey);
  const serializedTx = transaction.serialize().toString('hex');

  const receipt = await web3.eth.sendSignedTransaction(`0x${serializedTx}`);
  if (receipt) {
    dispatch(resetTransferData());
  }
};

const transferTokens = (
  token: ITokenData,
  to: string,
  amount: number,
  action: ITokenAction = ITokenAction.Transfer,
) => {
  return async (dispatch: any, state: any) => {
    const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts);
    const payload = Token.methods[action](to, amount * Math.pow(10, token.decimals)).encodeABI();
    sendTransaction(payload, token.contractAddress, dispatch, state);
  };
};

const mintNewToken = (token: ITokenData, amount: number) => {
  return async (dispatch: any, state: any) => {
    const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts);
    const payload = Token.methods
      .mint(state().wallet.ethAddress, amount * Math.pow(10, token.decimals))
      .encodeABI();
    sendTransaction(payload, token.contractAddress, dispatch, state);
  };
};

const isMintableToken = (token: ITokenData) => {
  const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts);
  return Token.methods
    .isMinter(token.owner)
    .call()
    .then((data: any) => data);
};

const fetchUserBalance = (token: ITokenData, userAddr: string, index: number) => {
  return (dispatch: any, state: any) => {
    const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts);
    return Token.methods
      .balanceOf(userAddr)
      .call()
      .then((balance: any) => {
        _merge(token, {
          amount: balance / Math.pow(10, token.decimals),
        });
        if (index === state().chain.tokenList.length - 1) {
          dispatch(tokenLoading(false));
        }

        return dispatch(
          getTokenBalance({
            [token.symbol]: {
              // We are keep the decimal space to to 2 in token.
              // Make sure the smart contract have decimal space equal to 2
              balance: balance / Math.pow(10, token.decimals),
              tokenAddress: token.contractAddress,
            },
          }),
        );
      });
  };
};

const connectWeb3 = () => {
  return (dispatch: any) => {
    dispatch(errorWeb3({ connected: true }));
    dispatch(getAllToken([]));
    if ((localStorage.getItem('wsUrl') || Node_URL).includes('http')) {
      web3 = new Web3(
        new Web3HttpProvider((localStorage.getItem('wsUrl') || Node_URL).trim(), options),
      );
    } else {
      web3 = new Web3(
        new Web3WsProvider((localStorage.getItem('wsUrl') || Node_URL).trim(), options),
      );
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
  return async (dispatch: any) => {
    try {
      const TokenFactoryAddress =
        localStorage.getItem('tokenFactoryAddress') || process.env.REACT_APP_TOKEN_FACTORY;
      if (!web3 || (web3 && !web3.currentProvider.connected)) {
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
          TokenFactoryAddress,
          opts,
        );
        crowdsaleFactory = new web3.eth.Contract(
          CrowdsaleFactoryJSON.abi as any,
          CrowdsaleFactoryAddress,
          opts,
        );
        dispatch(initWeb3({ web3, contracts: { tokenFactory, crowdsaleFactory }, gas }));
        setInterval(() => {
          if (web3.currentProvider.connected) {
            dispatch(fetchAllTokens());
          }
        }, 5000);
      });
    } catch (err) {
      console.log(err);
    }
  };
};

const loadTokenBalanceByList = (tokenList: ITokenData[], address: string) => {
  return (dispatch: any) => {
    tokenList.forEach((token: any, index: number) => {
      dispatch(fetchUserBalance(token, address, index));
    });
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
  fetchUserBalance,
  getTokenDetail,
  fetchTokenByTicker,
  loadTokenBalanceByList,
  fetchTransactionsHistory,
};
