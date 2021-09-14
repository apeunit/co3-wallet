import React, { useEffect, useState } from 'react';
import { Flex } from 'rebass';
import CrowdsaleList from 'src/components/Crowdsale/CrowdsaleList/CrowdsaleList';
import STFooter from 'src/components/SingleTokenComponents/STFooter';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCrowdsale } from 'src/redux/actions/Chain';
import { CrowdsaleSortEnum, GET_ALL_TOKENS, GET_CROWDSALE_ADDED } from '../api/middleware';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { ICrowdsaleData } from 'src/interfaces';

const LIMIT = 50;
const MarketPlace = () => {
  const dispatch = useDispatch();
  const [tokenList, setTokenList] = useState([]);
  const { crowdsaleList } = useSelector(
    ({ chain }: any) => {
      return {
        crowdsaleList: chain.crowdsaleList,
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

  const [crowdsaleAddedQuery, { data }] = useLazyQuery(GET_CROWDSALE_ADDED, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: {},
      skip: 0,
      limit: LIMIT,
      sort: CrowdsaleSortEnum.DESC,
    },
  });

  useEffect(() => {
    crowdsaleAddedQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------- */
  //                                     
  // -------------------------------------------------------------------------- */

  useEffect(() => {
    if (data && data.crowdsaleAddedNotificationMany) {
      getCrowdsaleUpdatedList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getCrowdsaleUpdatedList = async () => {
    const cdList: any = [];
    data.crowdsaleAddedNotificationMany.map((crowdAdded: ICrowdsaleData) => {

      const metaData = crowdAdded?.metadata as any || null
      const start = crowdAdded?.start && crowdAdded?.start?.includes('1970') ? Math.round(new Date(crowdAdded?.start).getTime() * 1000) : crowdAdded?.start;
      const end = crowdAdded?.end && crowdAdded?.end?.includes('1970') ? Math.round(new Date(crowdAdded?.end).getTime() * 1000) : crowdAdded?.end;
      metaData && metaData.token && cdList.push({ ...crowdAdded, start, end, ...metaData });

      return cdList;
    });
    if (cdList.length > 0) {
      dispatch(getAllCrowdsale(cdList));
    }
  };

  // -------------------------------------------------------------------------- */
  //                                     
  // -------------------------------------------------------------------------- */

  return (
    <Flex>
      <CrowdsaleList limit={LIMIT} fetchMore={crowdsaleAddedQuery} crowdsaleList={crowdsaleList} tokenList={tokenList} />
      <STFooter iconActive="sellIcon" />
    </Flex>
  );
};

export default MarketPlace;
