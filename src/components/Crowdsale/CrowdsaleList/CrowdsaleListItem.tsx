import React from 'react';
import { Flex, Image, Text, Box } from 'rebass';
import { Divider } from '@material-ui/core';
import { ICrowdsaleData } from 'src/interfaces';
import { getTokenSymbol } from 'src/utils/helper';
import { getCrowdsaleData } from 'src/redux/actions/Chain';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

interface IProps {
  crowdsale: ICrowdsaleData;
  tokenList: any;
  last?: boolean
}

const CrowdsaleListItem: React.FC<IProps> = ({ crowdsale, tokenList, last }) => {
  const dispatch = useDispatch();
  const history = useHistory();



  const handleCrowdsaleItem = () => {
    dispatch(
      getCrowdsaleData({
        ...crowdsale,
        crowdSymbol: getTokenSymbol(tokenList, crowdsale.token),
      }),
    );
    history.push(`/crowdsale-detail/${crowdsale?.metadata?.FLID}`);
  };
  
  return (
    <Flex
      marginTop="5px"
      marginBottom="5px"
      width="100%"
      paddingX={5}
      flexDirection="row"
      onClick={handleCrowdsaleItem}
    >
      <Flex marginRight="5px" justifyContent="start">
        <Box sx={{
          width: '90px',
          height: '70px'
        }}>
          <Image
            src={crowdsale?.logoURL}
            sx={{
              objectFit: 'contain',
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      </Flex>
      <Flex flexDirection="column" width="70%">
        <Flex marginBottom="15px" justifyContent="space-between" width="100%">
          <Text marginRight="10px" width="180px" fontSize="16px">
            {crowdsale.name}
            <Text color="#00000099" fontSize="14px" maxHeight="45px" className="ellipsi-2">
              {crowdsale.description}
            </Text>
            <Text color="#00000099" fontSize="14px">
              {/* {crowdsaleOpen && moment().isSameOrBefore(crowdsale?.end) ? "OPEN" : "CLOSED"}{' '} */}
            </Text>
          </Text>
           <Text marginLeft="auto" marginTop="5px" fontSize="13px" fontWeight="bold" color="#3048D9">
            {crowdsale.acceptRatio && crowdsale.acceptRatio / 100} <span>{getTokenSymbol(tokenList, crowdsale.token)}</span>
          </Text>
        </Flex>
        {!last && <Divider />}
      </Flex>
    </Flex>
  );
};

export default CrowdsaleListItem;
