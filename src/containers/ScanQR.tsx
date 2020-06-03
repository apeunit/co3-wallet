import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import IconButton from '../components/IconButton';
import { Box, Flex, Text } from 'rebass';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isAddress } from '../utils/misc';
import { setToAddress } from '../redux/actions/Wallet';
import { setModalData, toggleModal } from '../redux/actions/Modal';
class ScanQR extends Component {
  public onScan(data: any) {
    //const test = '0xc1912fee45d61c87cc5ea59dae31190fffff232d';
    const { saveToAddress, history } = this.props as any;
    const { state } = history.location;

    if (data) {
      if (isAddress(data.toLowerCase())) {
        saveToAddress(data.toLowerCase());

        const { user } = this.props as any;

        const { features } = user;
        features.indexOf('multiToken') > -1
          ? state && state.token
            ? history.replace({ pathname: '/payment', state })
            : history.push('/select-token')
          : history.push('/payment');
      } else {
        console.log('Invalid data', data);
      }
    }
  }

  public onError(err: any) {
    const { toggleModalVisibility, setModalInfo } = this.props as any;
    setModalInfo('Error', err.message, 'permission');
    toggleModalVisibility();
  }
  public render() {
    const { history } = this.props as any;

    return (
      <Flex flexDirection="column" height="100vh" paddingX={7} justifyContent="flex-end">
        <Text variant="headingXl">Scan a</Text>
        <Text variant="headingXl" color="blue500">
          QR Code
        </Text>
        <Box
          backgroundColor="background"
          marginTop={5}
          sx={{
            borderRadius: 'r5',
            paddingBottom: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            size="100%"
            sx={{
              position: 'absolute',
            }}
          >
            <Box size="100%">
              <QrReader
                delay={300}
                onScan={(data) => {
                  this.onScan(data);
                }}
                onError={(err) => {
                  this.onError(err);
                }}
              />
            </Box>
          </Flex>
        </Box>
        <Flex justifyContent="center" marginY={10}>
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
      </Flex>
    );
  }
}

export default connect(
  (state: any) => ({ ...state }),
  (dispatch: any) => ({
    saveToAddress: (address: string) => {
      dispatch(setToAddress(address));
    },
    toggleModalVisibility: () => {
      dispatch(toggleModal());
    },
    setModalInfo: (title: string, body: string, type: string) => {
      dispatch(setModalData(title, body, type));
    },
  }),
)(withRouter(ScanQR as any));
