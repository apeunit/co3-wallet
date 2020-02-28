import Web3 from 'web3'
import { createActions } from 'redux-actions'
import { INIT_WEB3, GET_ALL_TOKEN, CREATE_TOKEN, MINT_TOKEN, TRANSFER_TOKEN, GET_TOKEN_BALANCE, GET_TOKEN_DETAIL } from './ActionTypes'
import TokenFactoryJSON from '../../../contracts/TokenFactory.json'
import TokenTemplateJSON from '../../../contracts/TokenTemplate.json'
import CrowdsaleFactoryJSON from '../../../contracts/CrowdsaleFactory.json'
import { TokenAction, TokenData } from '../../../interfaces'
import { filterTokenBySymbol } from '../../../utils/misc'
const TokenFactoryAddress = process.env.REACT_APP_TOKEN_FACTORY
const CrowdsaleFactoryAddress = process.env.REACT_APP_CROWDSALE_FACTORY
const Node_URL: string = process.env.REACT_APP_NODE || ''

let web3: any = null
let opts: any = null
let tokenFactory: any = null
let crowdsaleFactory: any = null

const { initWeb3, getAllToken, createToken, mintToken, transferToken, getTokenBalance, getTokenDetail } = createActions({
    [INIT_WEB3]: (data: object): object => ({ ...data }),
    [GET_ALL_TOKEN]: (tokenList: []): object => ({ tokenList }),
    [CREATE_TOKEN]: (tokenCreated: object) => ({ tokenCreated }),
    [MINT_TOKEN]: (tokenMinted: object) => ({ tokenMinted }),
    [TRANSFER_TOKEN]: (tokenTransferred: object) => ({ tokenTransferred }),
    [GET_TOKEN_BALANCE]: (balance: object) => ({ balance }),
    [GET_TOKEN_DETAIL]: (tokenInfo: TokenData) => ({ tokenInfo })
})

const fetchAllTokens = () => {
    return (dispatch: any) => {
        return tokenFactory.methods.getTokenList().call().then((data: any) => {
            const transformed = data.map(formatTokenData)
            dispatch(getAllToken(transformed))
        })
    }
}

const fetchTokenByTicker = (ticker: string) => {
    return (dispatch: any) => {
        return tokenFactory.methods.getToken(ticker).call().then((data: any) => {
            if (data[2] === ticker) {
                dispatch(getTokenDetail(formatTokenData(data)))
            } else {
                console.log('Not found')
                /**
                 * TODO: dispatch error
                 */
            }
        })
    }
}

const createNewToken = (tokenFactory: any, name: string, symbol: string, logoUrl: string, logoHash: string, contractHash: string, decimals: number = 2, hardCap: number = 0) => {
    return (dispatch: any) => {
        return tokenFactory.methods.createToken(name, symbol, decimals, logoUrl, logoHash, hardCap, contractHash)
            .send()
            .then((data: any) => {
                dispatch(createToken(data.events.TokenAdded))
                /**
                 * Refresh token list after new token is added
                 */
                dispatch(fetchAllTokens())
            })
    }
}

const mintTransferTokens = (token: TokenData, to: string, amount: number, action: TokenAction = TokenAction.Transfer) => {
    return (dispatch: any) => {
        const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts)
        return Token.methods[action](to, (amount * Math.pow(10, token.decimals))).send().then((tx: any) => {
            if (action === TokenAction.Transfer) {
                dispatch(transferToken(tx.events.Transfer))
            } else if (action === TokenAction.Mint) {
                dispatch(mintToken(tx.events.Transfer))
            }
        })
    }
}

const fetchUserBalance = (token: TokenData, userAddr: string) => {
    return (dispatch: any) => {
        const Token = new web3.eth.Contract(TokenTemplateJSON.abi, token.contractAddress, opts)
        return Token.methods.balanceOf(userAddr).call().then((balance: any) => {
            return dispatch(getTokenBalance({
                [token.symbol]: {
                    balance: (balance/Math.pow(10, token.decimals)),
                    tokenAddress: token.contractAddress
                }
            }))
        })
    }
}

const initialSetup = (privateKey: string) => {
    return (dispatch: any) => {
        web3 = new Web3(Node_URL)
        const account = web3.eth.accounts.privateKeyToAccount(privateKey)
        web3.eth.accounts.wallet.add(account)
        web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address
        web3.eth.getBlock('latest').then((block: any) => {
            const gas = block.gasLimit - 100000
            opts = { from: web3.eth.defaultAccount, gas }
            tokenFactory = new web3.eth.Contract(TokenFactoryJSON.abi as any, TokenFactoryAddress, opts)
            crowdsaleFactory = new web3.eth.Contract(CrowdsaleFactoryJSON.abi as any, CrowdsaleFactoryAddress, opts)
            dispatch(initWeb3({ web3, contracts: { tokenFactory, crowdsaleFactory }, gas }))
            dispatch(fetchAllTokens())
        })

    }
}

const loadTokenBalanceList = (tokenList: TokenData[], tokens: string[], address: string) => {
    return (dispatch: any) => {
        tokens.forEach((element: any) => {
            const token = filterTokenBySymbol(tokenList, element)
            if(token) {
                dispatch(fetchUserBalance(token, address))
            }
        })
    }
}

const formatTokenData = (data: any): TokenData => {

    return {
        contractAddress: data[0],
        name: data[1],
        symbol: data[2],
        decimals: Number(data[3]),
        logoURL: data[4],
        owner: data[5],
        mintable: data[6]
    }

}

export {
    initWeb3,
    initialSetup,
    fetchAllTokens,
    createToken,
    createNewToken,
    mintTransferTokens,
    mintToken,
    transferToken,
    getTokenBalance,
    fetchUserBalance,
    getTokenDetail,
    fetchTokenByTicker,
    loadTokenBalanceList
}