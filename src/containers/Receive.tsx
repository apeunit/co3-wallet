import React, { Component } from 'react';
import IconButton from '../components/IconButton';
import QRCodeCanvas from 'qrcode.react';
import { Box, Flex, Text } from 'rebass';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Receive extends Component {
  public render() {
    const { ethAddress, history } = this.props as any;
    if (!ethAddress) {
      history.replace('/');
    }
    return (
      <Flex
        flexDirection="column"
        height="100vh"
        paddingX={7}
        paddingBottom={3}
        justifyContent="flex-end"
      >
        <Text variant="headingXl" fontSize={6}>
          Ask Sender
        </Text>
        <Text variant="headingXl" fontSize={6} color="#3948FF">
          to Scan
        </Text>
        <Box
          backgroundColor="background"
          marginTop={5}
          sx={{
            borderRadius: 'r5',
            boxShadow: 'base',
            paddingBottom: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            size="100%"
            backgroundColor="#fffff"
            p={10}
            sx={{
              position: 'absolute',
            }}
          >
            {ethAddress && (
              <QRCodeCanvas
                value={ethAddress}
                bgColor="#ffffff"
                fgColor="#3948FF"
                style={{ maxWidth: '295px', maxHeight: '295px', height: '100%', width: '100%' }}
              />
            )}
          </Flex>
        </Box>
        <Flex justifyContent="center" marginY={9}>
          <IconButton
            onClick={() => {
              history.push('/');
            }}
            marginX={3}
            size="s14"
            icon="close"
            color="white"
            backgroundColor="black"
          />
        </Flex>
        <Box
          backgroundColor="black"
          width="134px"
          height="5px"
          marginBottom={2}
          margin="0 auto"
          sx={{
            borderRadius: 'full',
            flexGrow: 0,
          }}
        />
      </Flex>
    );
  }
}

export default connect((state: any) => ({ ...state.wallet }), null)(withRouter(Receive as any));
