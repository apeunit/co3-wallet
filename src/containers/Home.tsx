import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ToolBar from '../components/ToolBar'
import IconButton from '../components/IconButton'
import ToolBarTitle from '../components/ToolBarTitle'
import ActionButtonGroup from '../components/ActionButtonGroup'
import TokenCard from '../components/TokenCard'
import { Box, Flex, Text } from 'rebass'
import { saveAccessToken } from '../redux/actions/CO3UUM'
import { getMnemonic, generateMnemonicPhrase, initWallet } from '../redux/actions/Wallet'
import { loadTokenBalanceList } from '../redux/actions/Chain'
import { filterTokenBySymbol } from '../utils/misc'
import configJson from '../config/scenario.config.json'
/**
 * TODO: Define props and state interface for component and remove all 'any(s)'
 */
class Home extends Component {

    constructor(props: any) {
        super(props)
        const {
            location: { search },
            history,
            saveToken,
            fetchStoredMnemonic
        } = this.props as any
        fetchStoredMnemonic()
        if (search) {
            const params = new URLSearchParams(search);
            const accessToken = params.get('accessToken');
            if (accessToken) {
                saveToken(accessToken)
                history.push('/')
            }
        }
    }

    componentDidUpdate(prevProps: any) {
        const {
            chain,
            wallet,
            getUserBalance,
            generateUserMnemonic,
            createUserWallet
        } = this.props as any
        if (!wallet.mnemonic) {
            generateUserMnemonic()
        }
        if (wallet.mnemonic && !wallet.privateKey) {
            createUserWallet(wallet.mnemonic)
        }
        if (!prevProps.chain.tokenList.length && chain.tokenList.length) {
            if (chain.web3 && chain.tokenList.length && !chain.loadingBalance) {
                /**
                 * TODO: Use data from profile instead when available
                 */
                const location: string = process.env.REACT_APP_USER_LOCATION || ''
                const config: any = configJson
                const tokens = config[location].tokens
                setInterval(() => {
                    getUserBalance(chain.tokenList, tokens, wallet.ethAddress)
                }, 3000)
            }
        }
    }

    render() {
        const { chain: { tokenList, tokenBalance }, history } = this.props as any

        let userTokenData: any = []
        const tokenBalanceList = Object.keys((tokenBalance as object))
        if (tokenBalanceList.length) {
            userTokenData = tokenBalanceList.map((symbol: string) => {
                const token = filterTokenBySymbol(tokenList, symbol)
                return {
                    ...token,
                    balance: tokenBalance[symbol].balance
                }
            })
        }
        return (
            <Flex
                flexDirection="column"
                height='100vh'
                backgroundColor='blue100'

            >
                <ToolBar>
                    <IconButton icon="menu" />
                    <ToolBarTitle>
                        Wallet
                  </ToolBarTitle>
                    <IconButton icon="ranking" />
                    <IconButton icon="notifications" dot />
                </ToolBar>
                {
                    userTokenData.map((value: any) => {
                        return <TokenCard
                            key={value.contractAddress}
                            image={value.logoURL}
                            name={value.name}
                            symbol={value.symbol}
                            amount={value.balance}
                            marginX={7}
                            marginTop='auto'
                        />
                    })
                }
                <ActionButtonGroup
                    justifyContent='center'
                    marginTop={9}
                    marginBottom='auto'
                    gap={4}
                    iconColor='blue600'
                    iconBg='blue200'
                    buttons={[
                        {
                            icon: "pay",
                            label: "Pay",
                            key: "pay",
                            onClick: () => { history.replace('/scan') }
                        },
                        {
                            icon: "receive",
                            label: "Receive",
                            key: "receive",
                            onClick: () => { history.replace('/receive') }
                        }
                    ]}
                />
                <Box
                    backgroundColor='background'
                    paddingTop={10}
                    paddingX={7}
                    height='s40'
                    sx={{
                        borderTopLeftRadius: 'r10',
                        borderTopRightRadius: 'r10',
                        boxShadow: 'base'
                    }}
                >
                    <Text
                        fontFamily='sans'
                        fontSize={2}
                        fontWeight='regular'
                        color='text'
                        sx={{
                            letterSpacing: 'xNarrow',
                            marginBottom: 2
                        }}
                    >
                        Transaction History
                        </Text>
                </Box>
            </Flex>
        )
    }
}

export default connect(
    (state) => ({ ...state }),
    (dispatch: any) => ({
        saveToken: (token: string) => {
            dispatch(saveAccessToken(token))
        },
        fetchStoredMnemonic: () => {
            dispatch(getMnemonic())
        },
        generateUserMnemonic: () => {
            return dispatch(generateMnemonicPhrase())
        },
        createUserWallet: (mnemonic: string) => {
            dispatch(initWallet(mnemonic))
        },
        getUserBalance: (tokenList: any[], tokens: string[], userAddr: string) => {
            dispatch(loadTokenBalanceList(tokenList, tokens, userAddr))
        }
    })
)(withRouter(Home as any))