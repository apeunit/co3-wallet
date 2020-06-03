import React, { useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import TokenCard from '../components/TokenCard';
import IconButton from '../components/IconButton';
import { useHistory } from 'react-router-dom';
import ActionButtonGroup from '../components/ActionButtonGroup';
import { useSelector } from 'react-redux';
import { isMintableToken } from '../redux/actions/Chain';

const TokenDetail: React.FC = () => {
  const history = useHistory();
  const [isMintable, setIsMintable] = useState(false);

  const { ethAddress, token } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
      token: wallet.transfer.token,
    };
  });

  const handleBackStep = () => {
    history.push('/');
  };

  useEffect(() => {
    isMintableToken(token).then(setIsMintable);
  }, [ethAddress, isMintable, token]);

  return (
    <Flex flexDirection="column" width="100%" height="100vh">
      <Flex justifyContent="space-between" alignItems="center" paddingY={4}>
        <IconButton
          onClick={handleBackStep}
          sx={{ cursor: 'pointer', transform: 'rotate(180deg)' }}
          icon="dirBackArrow"
        />
      </Flex>
      <Flex flexDirection="column" marginLeft="7px" width="100%">
        <TokenCard
          name={token.name}
          amount={token.amount}
          symbol={token.symbol}
          icon={token.image || token.logoURL}
          amount_msg="Prepaid Balance"
        />
        <Flex marginBottom="15px">
          <ActionButtonGroup
            marginTop={7}
            marginBottom="auto"
            gap={2}
            buttons={[
              {
                icon: 'sendIcon',
                label: 'Send',
                key: 'send',
                iconBg: 'blue600',
                iconColor: 'white',
                onClick: () => {
                  history.replace({ pathname: '/scan', state: { token } });
                },
              },
              {
                icon: 'sellIcon',
                label: 'Sell',
                key: 'sell',
                iconBg: 'blue600',
                iconColor: 'white',
                onClick: () => {
                  history.replace({ pathname: '/receive', state: { token } });
                },
              },
              {
                icon: 'mintIcon',
                label: 'Mint',
                key: 'mint',
                show: !(isMintable && ethAddress === token.owner),
                iconBg: 'white',
                iconColor: '#00E0A8',
                iconBorderColor: '#00E0A8',
                onClick: () => {
                  history.replace({ pathname: '/token-mint', state: { token } });
                },
              },
            ]}
          />
        </Flex>
        <Flex padding={5}>
          <Text fontSize={16}>{token.description}</Text>
        </Flex>
        <Flex padding={5}>
          <Text color="#75797F" width="175px" fontSize={13}>
            Created by CQ Sansalvario <br /> on 14th March 2020, <br />
            with a total supply of 20K tokens
          </Text>
        </Flex>
        <Flex
          marginTop="10px"
          height="32px"
          width="187px"
          sx={{ borderRadius: 'full', borderWidth: '1px', borderColor: '#F1F3F6' }}
          className="token-file-icon"
          padding="8px 10px 10px 12px"
        >
          <IconButton marginRight="5px" width="20px" height="10px" icon="fileCopy" />
          <Text marginTop="-3px" color="#404245" fontSize={13}>
            Terms and conditions
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TokenDetail;
