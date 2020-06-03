import { connect } from 'react-redux';
import React, { Component } from 'react';
import InfoBar from '../components/InfoBar';
import Badge from '../components/Badge';
import AvatarBadge from '../components/AvatarBadge';
import Keyboard from '../components/Keyboard';
import { withRouter } from 'react-router-dom';
import { Flex, Text } from 'rebass';
import { setTransferAmount, setTransferToken } from '../redux/actions/Wallet';
import { setModalData, toggleModal } from '../redux/actions/Modal';
import { SearchHeader } from '../components/SearchHeader';

class Pay extends Component {
  public amountRegex = new RegExp('^[0-9]+(.[0-9]{1,2})?$');
  public handleTap(data: string) {
    const {
      wallet: {
        transfer: { amount },
      },
      setAmountToTransfer,
    } = this.props as any;
    const amountString: string = `${amount}${data}`;
    if (amountString === '0.') {
      setAmountToTransfer(amountString);
    }
    if (this.amountRegex.test(`${amountString}0`) && amountString.endsWith('.')) {
      setAmountToTransfer(amountString);
    }
    if (this.amountRegex.test(amountString)) {
      setAmountToTransfer(Number(amountString).toString());
    }
  }

  public handleConfirm() {
    const {
      wallet: {
        transfer: { amount, token, to },
      },
      history,
      setTokenToTransfer,
    } = this.props as any;

    const { state } = history.location;
    setTokenToTransfer(state.token);
    history.push({
      pathname: '/confirmpayment',
      state: {
        token: token || state.token,
        amount: amount,
        to: to || '0x32Be343B94f860124dC4fEe278FDCBD38C102D88...',
      },
    });
  }
  public handleErase() {
    const {
      wallet: {
        transfer: { amount },
      },
      setAmountToTransfer,
    } = this.props as any;
    let amountString: string = amount || '';
    if (amountString) {
      amountString = amountString.slice(0, -1) || '0';
      setAmountToTransfer(amountString);
    }
  }

  public render() {
    const {
      wallet: {
        transfer: { amount, to },
      },
      history,
    } = this.props as any;

    const { state } = history.location;

    return (
      <Flex flexDirection="column" height="100vh">
        <SearchHeader
          back={'/select-token'}
          to={to || '0x32Be343B94f860124dC4fEe278FDCBD38C102D88...'}
        />
        {state && state.token && (
          <InfoBar>
            <Badge>{state.token.symbol}</Badge>
            <AvatarBadge image={state.token.image} label={state.token.name} />
          </InfoBar>
        )}

        <Text marginTop="auto" alignSelf="flex-end" paddingX={7} paddingY={8} variant="headingX2l">
          {amount || 0}
        </Text>
        <Keyboard
          marginBottom={10}
          handleTap={(data: any) => this.handleTap(data)}
          handleErase={() => this.handleErase()}
          handleConfirm={() => this.handleConfirm()}
        />
      </Flex>
    );
  }
}

export default connect(
  (state: any) => ({ ...state }),
  (dispatch: any) => ({
    setTokenToTransfer: (token: any) => {
      dispatch(setTransferToken(token));
    },
    setAmountToTransfer: (amount: string) => {
      dispatch(setTransferAmount(amount));
    },
    toggleModalVisibility: () => {
      dispatch(toggleModal());
    },
    setModalInfo: (title: string, body: string) => {
      dispatch(setModalData(title, body));
    },
  }),
)(withRouter(Pay as any));
