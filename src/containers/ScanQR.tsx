import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import IconButton from '../components/IconButton'
import { Box, Flex, Text } from 'rebass'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { isAddress } from '../utils/misc'
import { setToAddress } from '../redux/actions/Wallet'
import { toggleModal, setModalData } from '../redux/actions/Modal'
class ScanQR extends Component {

    onScan(data: any) {
        const { saveToAddress, history } = this.props as any
        if(data) {
            if(isAddress(data.toLowerCase())) {
                saveToAddress(data.toLowerCase())
                history.push('/pay')
            } else {
                console.log('Invalid data', data)
            }
        }
    }

    onError(err: any) {
        const { toggleModalVisibility, setModalInfo } = this.props as any
        setModalInfo('Error', err.message)
        toggleModalVisibility()
    }

    render() {
        const { history } = this.props as any
        return (
            <Flex
                flexDirection='column'
                height='100vh'
                paddingX={7}
                justifyContent='flex-end'
            >
                <Text variant='headingXl'>
                    Scan a
			</Text>
                <Text variant='headingXl' color='blue500'>
                    QR Code
			</Text>
                <Box
                    backgroundColor='background'
                    marginTop={5}
                    sx={{
                        borderRadius: 'r5',
                        boxShadow: 'base',
                        paddingBottom: '100%',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Flex
                        justifyContent='center'
                        alignItems='center'
                        size='100%'
                        sx={{
                            position: 'absolute'
                        }}
                    >
                        <Box size='100%'>
                            <QrReader
                                delay={300}
                                facingMode={'environment'}
                                onScan={ (data) => { this.onScan(data) }}
                                onError={ (err) => { this.onError(err) } }
                            />
                        </Box>
                    </Flex>
                </Box>
                <Flex justifyContent='center' marginY={10}>
                    <IconButton
                        onClick={() => { history.push('/') }}
                        marginX={3}
                        size='s14'
                        icon='close'
                        color='white'
                        backgroundColor='black'
                    />
                </Flex>
            </Flex>
        )
    }

}

export default connect(
    (state: any) => ({ ...state }),
    (dispatch: any) => ({
        saveToAddress: (address: string) => {
            dispatch(setToAddress(address))
        },
        toggleModalVisibility: () => {
            dispatch(toggleModal())
        },
        setModalInfo: (title: string, body: string) => {
            dispatch(setModalData(title, body))
        }
    })
)(withRouter(ScanQR as any))