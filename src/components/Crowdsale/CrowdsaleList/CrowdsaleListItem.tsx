import React from 'react';
import { Flex, Image, Text } from 'rebass';
import { Divider } from '@material-ui/core';
import { ICrowdsaleData } from 'src/interfaces';
import { getTokenSymbol } from 'src/utils/helper';
import { getCrowdsaleData } from 'src/redux/actions/Chain';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

interface IProps {
  crowdsale: ICrowdsaleData;
  tokenList: any;
}

const CrowdsaleListItem: React.FC<IProps> = ({ crowdsale, tokenList }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const kebabCase = ( string : string ) => string
  .replace(/([a-z])([A-Z])/g, "$1-$2")
  .replace(/[\s_]+/g, '-')
  .toLowerCase();

  const handleCrowdsaleItem = () => {
    dispatch(
      getCrowdsaleData({
        ...crowdsale,
        crowdSymbol: getTokenSymbol(tokenList, crowdsale.token),
      }),
    );
    history.push(`/crowdsale-detail/${kebabCase(crowdsale.name)}-${(crowdsale.itemToSell).slice(-3)}`);
  };

  // console.log('tokenlist', tokenList)

  return (
    <Flex
      marginTop="10px"
      width="100%"
      paddingX={5}
      flexDirection="row"
      onClick={handleCrowdsaleItem}
    >
      <Flex marginRight="5px" justifyContent="start" width="90px">
        <Image maxHeight="89px" margin="0px auto" height="fit-content" src={crowdsale?.logoURL} />
      </Flex>
      <Flex flexDirection="column" width="70%">
        <Flex marginBottom="15px" justifyContent="space-between" width="100%">
          <Text marginRight="10px" width="180px" fontSize="16px">
            {crowdsale.name}
            <Text color="#00000099" height="45px" className="ellipsi-2">
              {crowdsale.description}
            </Text>
          </Text>
          <Text marginLeft="auto" marginTop="5px" fontSize="13px" fontWeight="bold" color="#3048D9">
            {crowdsale.giveRatio} <span>{getTokenSymbol(tokenList, crowdsale.token)}</span>
          </Text>
        </Flex>
        <Divider />
      </Flex>
    </Flex>
  );
};

export default CrowdsaleListItem;
