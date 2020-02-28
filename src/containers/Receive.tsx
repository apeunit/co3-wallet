import React, { Component } from 'react'
import IconButton from '../components/IconButton'
import QRCodeCanvas from 'qrcode.react'
import { Box, Flex, Text } from 'rebass'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class Receive extends Component {

    render() {
        const { ethAddress, history } = this.props as any
        if (!ethAddress) {
            history.replace('/')
        }
        return (
            <Flex
                flexDirection='column'
                height='100vh'
                paddingX={7}
                justifyContent='flex-end'
            >

                <Text variant='headingXl'>
                    Ask Sender
                </Text>
                <Text variant='headingXl' color='blue500'>
                    to Scan
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
                        p={10}
                        sx={{
                            position: 'absolute'
                        }}
                    >
                        {
                            ethAddress && (
                                <QRCodeCanvas
                                    value={ethAddress}
                                    bgColor='#FFF'
                                    fgColor='#3948FF'
                                    size={250}
                                />
                            )
                        }
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
    (state: any) => ({ ...state.wallet }),
    null
)(withRouter(Receive as any))