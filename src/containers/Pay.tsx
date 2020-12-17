import React from 'react';
import InfoBar from '../components/InfoBar';
import Badge from '../components/Badge';
import AvatarBadge from '../components/AvatarBadge';
import Keyboard from '../components/Keyboard';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Text } from 'rebass';
import { setTransferAmount, setTransferToken } from '../redux/actions/Wallet';
import { SearchHeader } from '../components/SearchHeader';

const amountRegex = new RegExp('^[0-9]+(.[0-9]{1,2})?$');

const Pay = (props: any) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { amount, token, to } = useSelector(({ wallet }: any) => {
    return {
      amount: wallet.transfer.amount,
      token: wallet.transfer.token,
      to: wallet.transfer.to,
    };
  });

  const { state }: any = history.location;

  const handleTap = (data: string) => {
    const amountString: string = `${amount}${data}`;
    if (amountString === '0.') {
      dispatch(setTransferAmount(amountString));
    }
    if (amountRegex.test(`${amountString}0`) && amountString.endsWith('.')) {
      dispatch(setTransferAmount(amountString));
    }
    if (amountRegex.test(amountString)) {
      dispatch(setTransferAmount(Number(amountString).toString()));
    }
  };

  const handleConfirm = () => {
    dispatch(setTransferToken(state && state.token));
    history.push({
      pathname: '/confirmpayment',
      state: {
        token: token || (state && state.token),
        amount: amount,
        to: to,
      },
    });
  };

  const handleErase = () => {
    let amountString: string = amount || '';
    if (amountString) {
      amountString = amountString.slice(0, -1) || '0';
      dispatch(setTransferAmount(amountString));
    }
  };

  return (
    <Flex flexDirection="column" height="100vh">
      <SearchHeader back={'/select-token'} to={to} />
      {state && state.token && (
        <InfoBar>
          <Badge>{state.token.token_symbol}</Badge>
          <AvatarBadge image={state.token.logoURL} label={state.token.name} />
        </InfoBar>
      )}

      <Text marginTop="auto" alignSelf="flex-end" paddingX={7} paddingY={8} variant="headingX2l">
        {amount || 0}
      </Text>
      <Keyboard
        marginBottom={10}
        handleTap={handleTap}
        handleErase={handleErase}
        handleConfirm={handleConfirm}
        disbaleConfirm={true}
      />
    </Flex>
  );
};

export default Pay;
