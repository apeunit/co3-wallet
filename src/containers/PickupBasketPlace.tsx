import React, { useEffect, useState } from 'react';
import { Flex } from 'rebass';
import PickupBasketList from 'src/components/PickUpBasket/PickUpBasketList/PickupBasketList';
import STFooter from 'src/components/SingleTokenComponents/STFooter';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPickupBasket } from 'src/redux/actions/Chain';
import { CrowdsaleSortEnum, GET_ALL_TOKENS, GET_PICKUP_BASKET_ADDED } from '../api/middleware';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { IPickupBasketData } from 'src/interfaces';

const LIMIT = 20;
const PickupBasketPlace = () => {
  const dispatch = useDispatch();
  const [tokenList, setTokenList] = useState([]);
  const { pickupBasketList } = useSelector(
    ({ chain }: any) => {
      return {
        pickupBasketList: chain.pickupBasketList,
      };
    },
  );

  const tokenQueryData = useQuery(GET_ALL_TOKENS);

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!tokenQueryData.loading && tokenQueryData.data && tokenQueryData.data.tokenAddedMany) {
      setTokenList(tokenQueryData.data.tokenAddedMany);
    }
  }, [tokenQueryData]);

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  const [pickupBasketAddedQuery, { data }] = useLazyQuery(GET_PICKUP_BASKET_ADDED, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: {},
      skip: 0,
      //limit: LIMIT,
      sort: CrowdsaleSortEnum.DESC,
    },
  });

  useEffect(() => {
    pickupBasketAddedQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  useEffect(() => {
    if (data && data.pickUpBasketAddedNotificationMany) {
      getPickupBasketUpdatedList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getPickupBasketUpdatedList = async () => {
    const cdList: any = [];
   
    data.pickUpBasketAddedNotificationMany.map((pickupAdded: IPickupBasketData) => {

      const metaData = pickupAdded?.metadata as any || null;
      // const start = pickupAdded?.start && pickupAdded?.start?.includes('1970') ? Math.round(new Date(pickupAdded?.start).getTime() * 1000) : pickupAdded?.start;
      // const end = pickupAdded?.end && pickupAdded?.end?.includes('1970') ? Math.round(new Date(pickupAdded?.end).getTime() * 1000) : pickupAdded?.end;
      metaData && cdList.push({ ...pickupAdded, ...metaData });
      return cdList;
    });

    if (cdList.length > 0) {
      dispatch(getAllPickupBasket(cdList));
    }
  };

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  return (
    <Flex>
      <PickupBasketList limit={LIMIT} fetchMore={pickupBasketAddedQuery} pickupBasketList={pickupBasketList} tokenList={tokenList} />
      <STFooter iconActive="sellIcon" />
    </Flex>
  );
};

export default PickupBasketPlace;
