import React from 'react';
import { Flex, Image, Text } from 'rebass';
import '../../../assets/styles/NewToken.css';
import PickupBasketListItem from './PickupBasketListItem';
import { useTranslation } from 'react-i18next';
import PickupBasketListPlaceholder from './PickupBasketListPlaceholder';
import { IPickupBasketData } from 'src/interfaces';
import { CrowdsaleSortEnum } from 'src/api/middleware';
import { useSelector } from 'react-redux';
import EmptyImg from '../../../images/empty.png';

interface IProps {
  pickupBasketList: IPickupBasketData[];
  fetchMore?: any;
  tokenList: any;
  limit: number;
}

const PickupBasketList: React.FC<IProps> = ({ pickupBasketList, tokenList, fetchMore, limit }) => {
  const { t } = useTranslation();

  console.log("pickup basket list", pickupBasketList)

  const { txnLoading } = useSelector(
    ({ chain }: any) => {
      return {
        txnLoading: chain.txnLoading,
      };
    },
  );

  const handleScroll = ({ currentTarget }: any, fetchMore: any) => {
    if (
      currentTarget.scrollTop + currentTarget.clientHeight >=
      currentTarget.scrollHeight
    ) {
      fetchMore({
        variables: {
          skip: 0,
          filter: {},
          sort: CrowdsaleSortEnum.DESC,
          limit: limit + 10,
        },
      });
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      onScroll={(e) => handleScroll(e, fetchMore)}
      justifyContent="space-between"
      style={{ overflow: 'hidden' }}
    >
      <Text fontSize={3} paddingX={7} paddingTop={5} paddingBottom={4}>
        {t('pickupbasketplace.label')}
      </Text>
      <div style={{ overflow: 'scroll', height: '85vh' }}>
        <Flex flexDirection="column" height="100%">
          {txnLoading && pickupBasketList.length === 0 ? (
            <PickupBasketListPlaceholder counter={2} />
          ) : !txnLoading && pickupBasketList.length === 0 ? (
            <Flex paddingBottom="125px" width="212px" margin="auto" flexDirection="column">
              <Image marginBottom="35px" src={EmptyImg} />
              <Text width="195px" textAlign="center">{t('pickupbasketplace.no_pickupbasket')}</Text>
            </Flex>

          ) : (
            pickupBasketList && pickupBasketList.length > 0 && pickupBasketList.map((pickupBasket: IPickupBasketData, index: number) => (
              <PickupBasketListItem key={index} pickupBasket={pickupBasket} tokenList={tokenList} />
            ))
          )}
        </Flex>
      </div>
    </Flex>
  );
};

export default PickupBasketList;
