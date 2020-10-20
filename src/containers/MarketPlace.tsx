import React, { useEffect, useState } from 'react';
import { Flex } from 'rebass';
import CrowdsaleList from 'src/components/Crowdsale/CrowdsaleList/CrowdsaleList';
import STFooter from 'src/components/SingleTokenComponents/STFooter';
import { useDispatch, useSelector } from 'react-redux';
import { THING_ID } from 'src/config';
import { getAllCrowdsale } from 'src/redux/actions/Chain';
import { CrowdsaleSortEnum, GET_ALL_TOKENS, GET_CROWDSALE_ADDED } from './query';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { getCrowdsaleList } from 'src/api/firstlife';
import { ICrowdsaleData } from 'src/interfaces';
import _get from 'lodash/get';

const MarketPlace = () => {
  const dispatch = useDispatch();
  const [tokenList, setTokenList] = useState([]);
  const { accessToken, activityID, crowdsaleList, ethAddress } = useSelector(
    ({ co3uum, chain, wallet }: any) => {
      return {
        accessToken: co3uum.accessToken,
        activityID: co3uum.activityID || THING_ID,
        crowdsaleList: chain.crowdsaleList,
        ethAddress: wallet.ethAddress,
      };
    },
  );

  const tokenQueryData = useQuery(GET_ALL_TOKENS);

  useEffect(() => {
    if (!tokenQueryData.loading && tokenQueryData.data && tokenQueryData.data.tokenAddedMany) {
      setTokenList(tokenQueryData.data.tokenAddedMany);
    }
  }, [tokenQueryData]);

  const [crowdsaleAddedQuery, { data }] = useLazyQuery(GET_CROWDSALE_ADDED, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: {},
      skip: 0,
      limit: 20,
      sort: CrowdsaleSortEnum.ASC,
    },
  });

  useEffect(() => {
    if (ethAddress) {
      crowdsaleAddedQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethAddress]);

  const getCrowdsaleUpdatedList = async () => {
    const cdList: any = [];
    const crowdsaleData = await getCrowdsaleList(accessToken, activityID);
    const crowdsaleListData = _get(crowdsaleData, 'data.properties.crowdsaleList', []);
    data.crowdsaleAddedNotificationMany.map((crowdAdded: ICrowdsaleData) => {
      const crowdData = crowdsaleListData.find(
        (crowdsale: ICrowdsaleData) => crowdAdded.contractAddress === crowdsale.contractAddress,
      );
      const idFound =
        cdList.length > 0 && cdList.find((cd: any) => cd?.crowdsaleId === crowdData?.crowdsaleId);
      (!idFound || idFound === undefined) && cdList.push({ ...crowdAdded, ...crowdData });

      return cdList;
    });
    if (cdList.length > 0) {
      dispatch(getAllCrowdsale(cdList));
    }
  };

  useEffect(() => {
    if (data && data.crowdsaleAddedNotificationMany) {
      getCrowdsaleUpdatedList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Flex>
      <CrowdsaleList crowdsaleList={crowdsaleList} tokenList={tokenList} />
      <STFooter iconActive="sellIcon" />
    </Flex>
  );
};

export default MarketPlace;
