import React from 'react';
import { Flex, Text } from 'rebass';
import '../../../assets/styles/NewToken.css';
import CrowdsaleListItem from './CrowdsaleListItem';
import { useTranslation } from 'react-i18next';
import CrowdsaleListPlaceholder from './CrowdsaleListPlaceholder';
import { ICrowdsaleData } from 'src/interfaces';

interface IProps {
  crowdsaleList: ICrowdsaleData[];
  tokenList: any;
}

const CrowdsaleList: React.FC<IProps> = ({ crowdsaleList, tokenList }) => {
  const { t } = useTranslation();

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
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
