import React, { useState } from 'react';
import InfoBar from '../components/InfoBar';
import Badge from '../components/Badge';
import AvatarBadge from '../components/AvatarBadge';
import { Flex } from 'rebass';
import InputField from '../components/InputField';
import { useHistory } from 'react-router-dom';
import ToolBar from '../components/ToolBar';
import ToolBarTitle from '../components/ToolBarTitle';
import IconButton from '../components/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { mintNewToken } from '../redux/actions/Chain';
import { setModalData } from '../redux/actions/Modal';

const Minting = () => {
  const [supply, setSupply] = useState<number>();
  const history = useHistory();
  const dispatch = useDispatch();

  const { token } = useSelector(({ wallet }: any) => {
    return {
      token: wallet.transfer.token,
    };
  });

  const handleConfirm = () => {
    if (supply) {
      dispatch(mintNewToken(token, supply));
      history.push('/');
      dispatch(setModalData('Token Mint Info', 'Transaction Complete', 'permission'));
    }
  };

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100vh">
      <Flex flexDirection="column">
        <ToolBar>
          <IconButton
            icon="back"
            onClick={() => {
              history.push({ pathname: '/token-detail', state: { token } });
            }}
          />
          <ToolBarTitle fontWeight="500">Minting</ToolBarTitle>
        </ToolBar>
        {token && (
          <InfoBar>
            <Badge>{token.symbol}</Badge>
            <AvatarBadge image={token.image} label={token.name} />
          </InfoBar>
        )}
      </Flex>
      <Flex padding={7}>
        <InputField
          type="number"
          label="Supply"
          placeholder="Enter token supply"
          value={supply || undefined}
          onChangeValue={setSupply}
        />
      </Flex>
      <Flex justifyContent="center" marginBottom={4}>
        <IconButton
          icon="next"
          marginBottom={5}
          size="s14"
          backgroundColor="blue600"
          color="white"
          onClick={handleConfirm}
        />
      </Flex>
    </Flex>
  );
};

export default Minting;
