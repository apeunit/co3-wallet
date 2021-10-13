import React, { useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import CrowdsaleList from 'src/components/Crowdsale/CrowdsaleList/CrowdsaleList';
import STFooter from 'src/components/SingleTokenComponents/STFooter';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCrowdsale, setOpenCrowdsale, setClosedCrowdsale } from 'src/redux/actions/Chain';
import { CrowdsaleSortEnum, GET_ALL_TOKENS, GET_CROWDSALE_ADDED } from '../api/middleware';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { ICrowdsaleData } from 'src/interfaces';
import { useTranslation } from 'react-i18next';
import Accordion from '../components/Accordion';
import moment from 'moment';

const LIMIT = 50;
const MarketPlace = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [tokenList, setTokenList] = useState([]);
  const [currentAccordion, setCurrentAccordion] = useState('open-crowdsale');


  const { openCrowdsaleList, closedCrowdsaleList } = useSelector(({ chain }: any) => {
    return {
      // crowdsaleList: chain.crowdsaleList,
      openCrowdsaleList: chain.openCrowdsaleList,
      closedCrowdsaleList: chain.closedCrowdsaleList,
    };
  });

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
    const openCdList: any = [];
    const closedCdList: any = [];

    data.crowdsaleAddedNotificationMany.map((crowdAdded: ICrowdsaleData) => {
      const metaData = (crowdAdded?.metadata as any) || null;
      const start =
        crowdAdded?.start && crowdAdded?.start?.includes('1970')
          ? Math.round(new Date(crowdAdded?.start).getTime() * 1000)
          : crowdAdded?.start;
      const end =
        crowdAdded?.end && crowdAdded?.end?.includes('1970')
          ? Math.round(new Date(crowdAdded?.end).getTime() * 1000)
          : crowdAdded?.end;

      const cd = { ...crowdAdded, start, end, ...metaData };

      if (!metaData || !metaData.token) return cd;

      cdList.push(cd);

      if (moment().isSameOrBefore(end)) {
        openCdList.push(cd);
      } else {
        closedCdList.push(cd);
      }

      return cdList;
    });
    if (cdList.length > 0) {
      dispatch(getAllCrowdsale(cdList));
      dispatch(setOpenCrowdsale(openCdList));
      dispatch(setClosedCrowdsale(closedCdList));
      if (!openCdList.length && closedCdList.length) setCurrentAccordion('closed-crowdsale');
    }
  };

  return (
    <Flex
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Flex
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Text fontSize={3} paddingX={7} paddingTop={5} paddingBottom={4}>
          {t('marketplace.label')}
        </Text>
        {openCrowdsaleList.length ? (
          <Accordion title="Open Crowdsale" active={currentAccordion} setActive={(e: string) => setCurrentAccordion(e)} id="open-crowdsale">
            <CrowdsaleList
              limit={LIMIT}
              fetchMore={crowdsaleAddedQuery}
              crowdsaleList={openCrowdsaleList}
              tokenList={tokenList}
            />
          </Accordion>
        ) : null}
        {closedCrowdsaleList.length ? (
          <Accordion title="Closed Crowdsale" active={currentAccordion} setActive={(e: string) => setCurrentAccordion(e)} id="closed-crowdsale">
            <CrowdsaleList
              limit={LIMIT}
              fetchMore={crowdsaleAddedQuery}
              crowdsaleList={closedCrowdsaleList}
              tokenList={tokenList}
            />
          </Accordion>
        ) : null}

      </Flex>
      <STFooter iconActive="sellIcon" />
    </Flex>
  );
};

export default MarketPlace;
