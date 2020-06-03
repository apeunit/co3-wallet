import React from 'react';
import { Box, Flex, Text } from 'rebass';
import TokenCard from '../components/TokenCard';
import { Slider } from '../components/Slider';
import IconButton from './IconButton';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { transferToken, transferTokens } from '../redux/actions/Chain';
import { setModalData } from '../redux/actions/Modal';
import { SearchHeader } from './SearchHeader';
import InfoBar from './InfoBar';
import AvatarBadge from './AvatarBadge';

const ConfirmPayment = (props: any) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { amount, token, to } = useSelector(({ wallet }: any) => {
    return {
      amount: wallet.transfer.amount,
      token: wallet.transfer.token,
      to: wallet.transfer.to,
    };
  });

  const handleSendToken = () => {
    if (Object.keys(token).length && Number(amount) && to) {
      transferToken({});
      /**
       * TODO: check if these copy/conversion ops are needed
       */
      dispatch(transferTokens({ ...token }, to, amount));
      history.push('/');
      dispatch(setModalData('Payment Info', 'Transaction Complete', 'permission'));
    }
  };

  return (
    <Flex
      backgroundColor="white"
      flexDirection="column"
      height="100vh"
      width="100vw"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <Box style={{ width: '100vw' }}>
        <SearchHeader back={'/payment'} to={to} />
        <InfoBar>
          <Text variant="base">From</Text>
          <AvatarBadge image={token.image} label={token.name} />
        </InfoBar>
      </Box>
      <Flex flexDirection="column" margin={5}>
        <TokenCard
          icon={token.image || ''}
          name={token.name || ''}
          symbol={token.symbol || ''}
          amount={token.amount || '0'}
        />
        <Flex marginTop="10px" justifyContent="space-between">
          <Text fontSize="16px">Amount</Text>
          <Text fontSize="40px">{amount}</Text>
        </Flex>
      </Flex>
      <Flex flexDirection="row" paddingY={10} justifyContent="space-around" width="100%">
        <IconButton
          onClick={() => {
            history.push('/pay');
          }}
          size="s14"
          icon="dialpad"
          color="#8E949E"
          backgroundColor="#ffffff"
          sx={{
            borderRadius: 'full',
            borderColor: '#F1F3F6',
            borderWidth: '2px',
            borderStyle: 'solid',
          }}
        />
        <Slider
          title="Slide to Send"
          bgColor="#F1F3F6"
          btnColor="blue600"
          txtColor="#8E949E"
          dragEnd={handleSendToken}
          onClick={() => console.log}
        />
      </Flex>
    </Flex>
  );
};
export default ConfirmPayment;
