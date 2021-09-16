import React from 'react';
import { Flex, Image, Text } from 'rebass';
import Badge from '../../Badge';
import chip from '../../../images/chip.png';
import AddImage from '../../AddImage';
import avatarImg from '../../../images/placeholder-img.png';
import Avatar from '../../Avatar';
import TokenCardPlaceholder from './TokenCardPlaceholder';

const TokenCard = (props: any) => {
  const { name, symbol, amount, loading, type, ...rest } = props;

  return (
    <Flex
      color="#303030"
      alignItems="center"
      padding={6}
      backgroundColor="#F8F9FA"
      height="55%"
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        borderRadius: '10px',
      }}
      {...rest}
    >
      {loading ? (
        <TokenCardPlaceholder />
      ) : (
        <>
          <Flex width="100%" justifyContent="flex-end">
            <Flex flexDirection="column" alignItems="flex-end" paddingLeft={2}>
              <Text
                fontFamily="sans"
                fontSize={3}
                fontWeight="light"
                textAlign="right"
                sx={{
                  letterSpacing: 'xNarrow',
                  marginBottom: 2,
                }}
              >
                {props.name}
              </Text>
              <Badge marginY={1}>{props.symbol}</Badge>
            </Flex>
          </Flex>

          <Flex alignItems="flex-start" width="100%">
            <Image width="50px" src={chip} />
          </Flex>

          <Flex justifyContent="space-between" width="100%">
            {type !== 'add' && (
              <Flex
                flexDirection="column"
                color="#5B5D63"
                justifyContent="center"
                alignItems="flex-start"
              >
                <Text fontSize={3} fontWeight="500" textAlign="left">
                  {props.amount}
                </Text>
                <Text fontSize={1} fontWeight="regular" textAlign="left">
                  {props.amount_msg || 'Balance'}
                </Text>
              </Flex>
            )}
            {type === 'add' ? (
              <Flex width="100%" justifyContent="flex-end">
                <AddImage
                  width="55px"
                  label={props.icon ? '' : 'Add Icon'}
                  uploading={props.uploading}
                  accept="image/*"
                  onChange={props.onChange}
                  image={props.icon}
                  placeholder={avatarImg}
                  padding={0}
                />
              </Flex>
            ) : (
              <Avatar
                marginRight="10px"
                loading={!props.icon}
                image={props.icon}
                borderRadius="50px"
                size="56px"
                justifyContent="flex-end"
              />
            )}
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default TokenCard;
