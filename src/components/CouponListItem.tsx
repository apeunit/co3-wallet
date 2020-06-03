import React from 'react';
import { Box, Flex, Image, Text } from 'rebass';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTransferToken } from '../redux/actions/Wallet';

const CouponListItem = ({ image, symbol, name, description, amount, ...rest }: any) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const selectToken = () => {
    const token = {
      image,
      name,
      symbol,
      amount,
      ...rest,
    };
    dispatch(setTransferToken(token));
    if (history.location.pathname === '/') {
      history.push({ pathname: '/token-detail', state: { token } });
    } else {
      history.push({ pathname: '/payment', state: { token } });
    }
  };

  return (
    <Flex
      onClick={selectToken}
      flexDirection="column"
      backgroundColor="#fff"
      marginRight="6"
      sx={{ flexShrink: '0' }}
    >
      <Box
        backgroundColor="#f0f0f0"
        sx={{ borderRadius: 8, position: 'relative', overflow: 'hidden', display: 'flex' }}
        style={{ width: '144px', height: '144px' }}
      >
        <Image
          src={image}
          margin="auto"
          sx={{
            width: ['100%', '50%'],
            borderRadius: 8,
          }}
        />
        <Flex
          backgroundColor="rgba(0,0,0,.5)"
          justifyContent="center"
          alignItems="center"
          paddingX="5px"
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            height: '24px',
            borderTopLeftRadius: '4px',
          }}
          fontSize="13px"
        >
          <Text
            className="margin: auto;"
            color="white"
            maxWidth="100%"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              minWidth: '14px',
              maxWidth: '50px',
              width: 'max-content',
              textAlign: 'center',
            }}
          >
            {amount}
          </Text>
        </Flex>
      </Box>
      <Box padding="8px 11px 15px 9px">
        <Text variant="heading" fontSize="13px" fontWeight="bold" color="#303030">
          {name}
        </Text>
        <Text
          fontSize="11px"
          width="120px"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

export default CouponListItem;
