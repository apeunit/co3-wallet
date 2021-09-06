import React from 'react';
import { Flex, Image, Text } from 'rebass';
import { Divider } from '@material-ui/core';
import { IPickupBasketData } from 'src/interfaces';
import { getTokenSymbol } from 'src/utils/helper';
import { getPickupBasketData } from 'src/redux/actions/Chain';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

interface IProps {
  pickupBasket: IPickupBasketData;
  tokenList: any;
}

const PickupBasketListItem: React.FC<IProps> = ({ pickupBasket, tokenList }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const kebabCase = ( string : string ) => string
  .replace(/([a-z])([A-Z])/g, "$1-$2")
  .replace(/[\s_]+/g, '-')
  .toLowerCase();

  const handleCrowdsaleItem = () => {
    dispatch(
      getPickupBasketData({
        ...pickupBasket,
        crowdSymbol: getTokenSymbol(tokenList, pickupBasket.token),
      }),
    );
    history.push(`/pickup-basket-detail/${kebabCase(pickupBasket.name)}-${(pickupBasket.itemToSell).slice(-3)}`);
    console.log("token symbol", pickupBasket)

  };

  return (
    <Flex
      marginTop="10px"
      width="100%"
      paddingX={5}
      flexDirection="row"
      onClick={handleCrowdsaleItem}
    >
      <Flex marginRight="5px" justifyContent="start" width="90px">
        <Image height="fit-content" src={pickupBasket?.logoURL} />
      </Flex>
      <Flex flexDirection="column" width="70%">
        <Flex marginBottom="15px" justifyContent="space-between" width="100%">
          <Text marginRight="10px" width="180px" fontSize="16px">
            {pickupBasket.name}
            <Text color="#00000099" height="45px" className="ellipsi-2">
              {pickupBasket.description}
            </Text>
          </Text>
          <Text marginLeft="auto" marginTop="5px" fontSize="13px" fontWeight="bold" color="#3048D9">
            {pickupBasket.giveRatio} <span>{getTokenSymbol(tokenList, pickupBasket.token)}</span>
          </Text>
        </Flex>
        <Divider />
      </Flex>
    </Flex>
  );
};

export default PickupBasketListItem;
