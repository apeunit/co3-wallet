// tslint:disable
import moment from 'moment';
import { createActions } from 'redux-actions';
import {
  CROWDSALE_FACTORY_ADDRESS,
  NODE_URL,
  TOKEN_FACTORY_ADDRESS,
  PICKUPBASKET_FACTORY_ADDRESS,
} from 'src/config';
import { getRandomId } from 'src/utils/helper';
import { formatAmount } from 'src/utils/misc';
import Web3 from 'web3';
import CrowdsaleFactoryJSON from '../../../contracts/CrowdsaleFactory.json';
import PickupBasketFactoryJSON from '../../../contracts/PickUpBasketFactory.json';
import PickupBasketJSON from '../../../contracts/PickUpBasket.json';
import TokenCrowdsaleJSON from '../../../contracts/TokenCrowdsale.json';
import TokenFactoryJSON from '../../../contracts/TokenFactory.json';
import TokenTemplateJSON from '../../../contracts/TokenTemplate.json';
import { ICrowdsaleData, IPickupBasketData, ITokenAction, ITokenData } from '../../../interfaces';
import { setTransferToken } from '../Wallet';
import {
  CREATE_TOKEN,
  ERROR_WEB3,
  GET_ALL_CROWDSALE,
  GET_ALL_PICKUP_BASKET,
  GET_ALL_TOKEN,
  GET_CROWDSALE_DATA,
  GET_PICKUP_BASKET_DATA,
  GET_TOKEN_BALANCE,
  GET_TOKEN_DETAIL,
  GET_TRANSACTION_HISTORY,
  INIT_WEB3,
  TOKEN_LOADING,
  TRANSFER_TOKEN,
  TXN_LOADING,
} from './ActionTypes';
import _ from 'lodash';

var Web3WsProvider = require('web3-providers-ws');
var Web3HttpProvider = require('web3-providers-http');

let web3: any = null;
let opts: any = null;
let tokenFactory: any = null;
let crowdsaleFactory: any = null;
let pickUpBasketFactory: any = null;

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
  getAllPickupBasket,
  getCrowdsaleData,
  getPickupBasketData,
} = createActions({
  [INIT_WEB3]: (data: object): object => ({ ...data }),
  [ERROR_WEB3]: (data: object): object => ({ ...data }),
  [TOKEN_LOADING]: (tokenLoading: object): object => ({ tokenLoading }),
  [TXN_LOADING]: (txnLoading: object): object => ({ txnLoading }),
  [GET_ALL_TOKEN]: (tokenList: []): object => ({ tokenList }),
  [GET_ALL_CROWDSALE]: (crowdsaleList: []): object => ({ crowdsaleList }),
  [GET_ALL_PICKUP_BASKET]: (pickupBasketList: any): object => ({ pickupBasketList }),
  [GET_TRANSACTION_HISTORY]: (transactionHistory: []): object => ({ transactionHistory }),
  [CREATE_TOKEN]: (tokenCreated: object) => ({ tokenCreated }),
  [TRANSFER_TOKEN]: (tokenTransferred: object) => ({ tokenTransferred }),
  [GET_TOKEN_BALANCE]: (balance: object) => ({ balance }),
  [GET_TOKEN_DETAIL]: (tokenInfo: ITokenData) => ({ tokenInfo }),
  [GET_CROWDSALE_DATA]: (crowdsaleData: ICrowdsaleData) => ({ crowdsaleData }),
  [GET_PICKUP_BASKET_DATA]: (pickupBasketData: IPickupBasketData) => ({ pickupBasketData }),
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
              const newtknData =
                token.logoURL && token.logoURL.includes('description') && JSON.parse(token.logoURL);
              const newObj = newtknData
                ? { ...token, ...newtknData, logoURL: newtknData.logoURL }
                : { ...token };
              dispatch(setTransferToken({ ...newObj, amount }));
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
      console.error(error);
    }
  };
};

const fetchCrowdsaleList = () => {
  return async (dispatch: any, state: any) => {
    try {
      dispatch(txnLoading(true));
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

      contractEvent.length > 0 &&
        contractEvent.map(async (event: any) => {
          const metaData =
            event.returnValues._metadata.includes('name') &&
            JSON.parse(event.returnValues._metadata);
          if (metaData && !metaData.name.includes('TKN Sale')) {
            crowdsaleList.push({
              ...metaData,
              metadata: event.returnValues._metadata,
              from: event.returnValues._from,
              timestamp: event.returnValues._timestamp,
              contractAddress: event.returnValues._contractAddress,
              end: new Date(event.returnValues._end * 1000),
              acceptRatio: event.returnValues._acceptRatio,
              giveRatio: event.returnValues._giveRatio,
              id: event.returnValues._id,
              maxCap: event.returnValues._maxCap,
              start: new Date(event.returnValues._start * 1000),
              transactionHash: event.transactionHash,
              blockHash: event.blockHash,
              blockNumber: event.blockNumber,
              address: event.address,
              raw: event.raw,
            });
          }
        });
      dispatch(getAllCrowdsale(_.reverse(crowdsaleList)));
      dispatch(txnLoading(false));
    } catch (error) {
      dispatch(txnLoading(false));
      console.error(error);
    }
  };
};

const fetchPickupBasketList = () => {
  return async (dispatch: any, state: any) => {
    try {
      dispatch(txnLoading(true));
      const contract = new web3.eth.Contract(
        PickupBasketFactoryJSON.abi,
        PICKUPBASKET_FACTORY_ADDRESS,
        opts,
      );
      let pickupBasketList: any = [];
      const contractEvent = await contract.getPastEvents('PickupBasket Added', {
        fromBlock: 0,
        toBlock: 'latest',
      });

      contractEvent.length > 0 &&
        contractEvent.map(async (event: any) => {
          const metaData =
            event.returnValues._metadata.includes('name') &&
            JSON.parse(event.returnValues._metadata);
          if (metaData && !metaData.name.includes('TKN Sale')) {
            pickupBasketList.push({
              ...metaData,
              metadata: event.returnValues._metadata,
              from: event.returnValues._from,
              timestamp: event.returnValues._timestamp,
              contractAddress: event.returnValues._contractAddress,
              end: new Date(event.returnValues._end * 1000),
              acceptRatio: event.returnValues._acceptRatio,
              giveRatio: event.returnValues._giveRatio,
              id: event.returnValues._id,
              maxCap: event.returnValues._maxCap,
              start: new Date(event.returnValues._start * 1000),
              transactionHash: event.transactionHash,
              blockHash: event.blockHash,
              blockNumber: event.blockNumber,
              address: event.address,
              raw: event.raw,
            });
          }
        });
      dispatch(getAllPickupBasket(_.reverse(pickupBasketList)));
      dispatch(txnLoading(false));
    } catch (error) {
      dispatch(txnLoading(false));
      console.error(error);
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
    const blockNo = await web3.eth.getBlockNumber();
    const gas = blockNo.gasLimit - 100000;
    console.log(gas);
    return tokenFactory.methods
      .createToken(name, symbol, decimals, purpose, logoUrl, logoHash, hardCap, contractHash)
      .send({
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        from: state().wallet.ethAddress,
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: gas,
      })
      .then((data: any) => {
        console.log(data);
        dispatch(createToken(data.events.TokenAdded));
        return data;
        /**
         * Refresh token list after new token is added
         */
      });
  };
};

const createNewCrowdsale = (crowdsale: any) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);
    console.log('create new crowdsale 1 ');
    const gasPrice = await web3.eth.getGasPrice();
    const { itemToSell, token, startDate, endDate, giveRatio, maxSupply } = crowdsale;
    const crowdsaleId = getRandomId();
    const blockNo = await web3.eth.getBlockNumber();
    const gas = blockNo.gasLimit - 100000;
    console.log('crowdsale from store 1', crowdsale);
    return crowdsaleFactory.methods
      .createCrowdsale(
        crowdsaleId,
        itemToSell,
        token,
        Math.floor(new Date(startDate).getTime()),
        Math.floor(new Date(endDate).getTime()),
        1,
        parseInt(giveRatio, 10),
        parseInt(maxSupply, 10),
        JSON.stringify({
          name: crowdsale.name,
          logoURL: crowdsale.icon,
          description: crowdsale.description,
          itemToSell,
          token,
          contract: crowdsale.contract,
          contractLabel: crowdsale.contractLabel,
          aca: crowdsale.aca,
          FLID: crowdsale.FLID, //"string", FirstLife ID
          TTA: crowdsale.TTA, //"string", Ticker (Symbol) of the token to accept
          TTG: crowdsale.TTG, //"string", Ticker (Symbol) of the token to give
          AU: crowdsale.AU, //"string", Admin URL
          RU: crowdsale.RU, //"string", Redeem URL
        }),
      )
      .send(
        {
          from: state().wallet.ethAddress,
          gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
          nonce: web3.utils.toHex(parseInt(nonce, 10)),
          gas: gas,
        },
        console.log('create new crowdsale 2'),
      )
      .then((data: any) => {
        console.log('crowdsale from store 2', crowdsale);
        console.log('create new crowdsale 3');
        return data;
      });
  };
};

const createNewPickUpBasket = (pickUpBox: any) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);

    const gasPrice = await web3.eth.getGasPrice();
    const { couponToGive, productsAvailable } = pickUpBox;
    const pickUpBasketId = getRandomId();
    return pickUpBasketFactory.methods
      .createPickUpBasket(
        pickUpBasketId,
        couponToGive,
        parseInt(productsAvailable, 10),
        JSON.stringify({
          name: pickUpBox.name,
          logoURL: pickUpBox.icon,
          description: pickUpBox.description,
          FLID: pickUpBox.FLID, // FirstLife ID
          AU: pickUpBox.AU, // Admin URL
          RU: pickUpBox.RU, // Redeem URL
          couponToGive,
        }),
      )
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: 10_485_760,
      })
      .then((data: any) => {
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
        return data;
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
        pickUpBasketFactory = new web3.eth.Contract(
          PickupBasketFactoryJSON.abi as any,
          PICKUPBASKET_FACTORY_ADDRESS,
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

const unlockCrowdsale = (contractAddress: string) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);

    const gasPrice = await web3.eth.getGasPrice();
    const contract = new web3.eth.Contract(TokenCrowdsaleJSON.abi as any, contractAddress, opts);
    return contract.methods
      .unlockCrowdsale()
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: state().wallet.gas,
      })
      .then((data: any) => {
        return data;
      });
  };
};

const unlockPickupBasket = (contractAddress: string) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);

    const gasPrice = await web3.eth.getGasPrice();
    const contract = new web3.eth.Contract(PickupBasketJSON.abi as any, contractAddress, opts);
    return contract.methods
      .unlockPickUpBasket()
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: state().wallet.gas,
      })
      .then((data: any) => {
        return data;
      });
  };
};

const collectPickupBasket = (contractAddress: string) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);

    const gasPrice = await web3.eth.getGasPrice();
    const contract = new web3.eth.Contract(PickupBasketJSON.abi as any, contractAddress, opts);
    return contract.methods
      .pickUpItem()
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: state().wallet.gas,
      })
      .then((data: any) => {
        return data;
      });
  };
};

const approveSender = (token: ITokenData, spender: string, amount: number) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);
    const gasPrice = await web3.eth.getGasPrice();
    const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts);
    return Token.methods
      .approve(spender, formatAmount(token, amount))
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

const joinCrowdsale = (token: ITokenData, contractAddress: string, amount: number) => {
  return async (dispatch: any, state: any) => {
    const nonce = await web3.eth.getTransactionCount(state().wallet.ethAddress);

    const gasPrice = await web3.eth.getGasPrice();
    const contract = new web3.eth.Contract(TokenCrowdsaleJSON.abi as any, contractAddress, opts);
    return contract.methods
      .joinCrowdsale(formatAmount(token, amount))
      .send({
        from: state().wallet.ethAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)),
        nonce: web3.utils.toHex(parseInt(nonce, 10)),
        gas: state().wallet.gas,
      })
      .then((data: any) => {
        return data;
      });
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
  createNewPickUpBasket,
  fetchCrowdsaleList,
  fetchPickupBasketList,
  getAllCrowdsale,
  getAllPickupBasket,
  getCrowdsaleData,
  unlockCrowdsale,
  getPickupBasketData,
  collectPickupBasket,
  unlockPickupBasket,
  approveSender,
  joinCrowdsale,
};
