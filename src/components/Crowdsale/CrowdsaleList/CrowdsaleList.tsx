import React from 'react';
import { Flex, Text } from 'rebass';
import '../../../assets/styles/NewToken.css';
import CrowdsaleListItem from './CrowdsaleListItem';
import { useTranslation } from 'react-i18next';
import CrowdsaleListPlaceholder from './CrowdsaleListPlaceholder';
import { ICrowdsaleData } from 'src/interfaces';
import { CrowdsaleSortEnum } from 'src/api/middleware';

interface IProps {
  crowdsaleList: ICrowdsaleData[];
  fetchMore: any;
  tokenList: any;
  limit: number;
}

const CrowdsaleList: React.FC<IProps> = ({ crowdsaleList, tokenList, fetchMore, limit }) => {
  const { t } = useTranslation();

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
          limit: limit + 20,
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
        {t('marketplace.label')}
      </Text>
      <div style={{ overflow: 'scroll', height: '85vh' }}>
        <Flex flexDirection="column">
          {crowdsaleList && crowdsaleList.length > 0 ? (
            crowdsaleList.map((crowdsale: ICrowdsaleData, index: number) => (
              <CrowdsaleListItem key={index} crowdsale={crowdsale} tokenList={tokenList} />
            ))
          ) : (
            <CrowdsaleListPlaceholder counter={2} />
          )}
        </Flex>
      </div>
    </Flex>
  );
};

export default CrowdsaleList;
