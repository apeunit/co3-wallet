import React, { Component } from 'react'
import ToolBar from '../components/ToolBar'
import InfoBar from '../components/InfoBar'
import IconButton from '../components/IconButton'
import ToolBarTitle from '../components/ToolBarTitle'
import Badge from '../components/Badge'
import AvatarBadge from '../components/AvatarBadge'
import Keyboard from '../components/Keyboard'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { filterTokenBySymbol } from '../utils/misc'
import { setTransferToken, setTransferAmount, resetTransferData } from '../redux/actions/Wallet'
import { mintTransferTokens, transferToken } from '../redux/actions/Chain'
import { setModalData, toggleModal } from '../redux/actions/Modal'
import configJson from '../config/scenario.config.json'
import { TokenData } from '../interfaces'

class Pay extends Component {
    // eslint-disable-next-line
    amountRegex = new RegExp('^[0-9]+(\.[0-9]{1,2})?$')
    componentDidMount() {
        const { history, wallet, chain: { tokenList }, setTokenToTransfer } = this.props as any
        if (!wallet.transfer.to) {
            history.push('/')
        }
        /**
         * The below conditions to set token can be moved to a different location as project develops further
         */
        if (!wallet.transfer.token) {
            const location: string = process.env.REACT_APP_USER_LOCATION || ''
            const config: any = configJson
            const token = filterTokenBySymbol(tokenList, config[location].tokens[0])
            if (token) {
                setTokenToTransfer(token)
            } else {
                history.push('/')
            }
        }
    }

    handleTap(data: string) {
        const { wallet: { transfer: { amount } }, setAmountToTransfer } = this.props as any
        let amountString: string = amount + data
        if (amountString === '0.') {
            setAmountToTransfer(amountString)
        }
        if (this.amountRegex.test(amountString + '0') && amountString.endsWith('.')) {
            setAmountToTransfer(amountString)
        }
        if (this.amountRegex.test((amountString))) {
            setAmountToTransfer(Number(amountString).toString())
        }
    }
    
    handleConfirm() {
        const {
            wallet: { transfer: { amount, token, to } },
            handleTransfer,
            history,
            toggleModalVisibility,
            setModalInfo
        } = this.props as any

        if (Object.keys(token).length && Number(amount) && to) {
            transferToken({})
            /**
             * TODO: check if these copy/conversion ops are needed
             */
            handleTransfer(Object.assign({}, token), String(to), Number(amount))
            setModalInfo('Payment Info', 'Transaction Complete')
            history.push('/')
            toggleModalVisibility()
        }
    }
    handleErase() {
        const { wallet: { transfer: { amount } }, setAmountToTransfer } = this.props as any
        let amountString: string = amount || ''
        if (amountString) {
            amountString = amountString.slice(0, -1) || '0'
            setAmountToTransfer(amountString)
        }
    }

    render() {
        const { history, wallet: { transfer: { amount, token, to } } } = this.props as any
        return (
            <Flex
                flexDirection="column"
                height='100vh'
            >
                <ToolBar>
                    <IconButton icon="back" onClick={() => { history.push('/scan') }} />
                    <ToolBarTitle>
                        Send
                    </ToolBarTitle>
                </ToolBar>

                <InfoBar border>
                    <Text variant="base">To</Text>
                    <AvatarBadge
                        image='https://www.thispersondoesnotexist.com/image'
                        label={to}
                    />
                </InfoBar>

                {token &&
                    <InfoBar>
                        <Badge>{token.symbol}</Badge>
                        <AvatarBadge
                            image={token.logoURL}
                            label={token.name}
                        />
                    </InfoBar>}

                <Text
                    marginTop='auto'
                    alignSelf='flex-end'
                    paddingX={7}
                    paddingY={8}
                    variant='headingX2l'>
                    {amount || 0}
                </Text>

                <Keyboard
                    marginBottom={10}
                    handleTap={(data: any) => this.handleTap(data)}
                    handleErase={() => this.handleErase()}
                    handleConfirm={() => this.handleConfirm()}

                />
            </Flex>
        )
    }
}

export default connect(
    (state: any) => ({ ...state }),
    (dispatch: any) => ({
        setTokenToTransfer: (token: any) => {
            dispatch(setTransferToken(token))
        },
        setAmountToTransfer: (amount: string) => {
            dispatch(setTransferAmount(amount))
        },
        handleTransfer: (token: TokenData, to: string, amount: number) => {
            dispatch(mintTransferTokens(token, to, amount))
            dispatch(resetTransferData())
        },
        toggleModalVisibility: () => {
            dispatch(toggleModal())
        },
        setModalInfo: (title: string, body: string) => {
            dispatch(setModalData(title, body))
        }
    })
)(withRouter(Pay as any))