import React from 'react';
import { Flex, Image, Text } from 'rebass';
import '../../../assets/styles/NewToken.css';
import CrowdsaleListItem from './CrowdsaleListItem';
import { useTranslation } from 'react-i18next';
import CrowdsaleListPlaceholder from './CrowdsaleListPlaceholder';
import { ICrowdsaleData } from 'src/interfaces';
import { CrowdsaleSortEnum } from 'src/api/middleware';
import { useSelector } from 'react-redux';
import EmptyImg from '../../../images/empty.png';

// import Chevron from "../../Chevron";

interface IProps {
  crowdsaleList: ICrowdsaleData[];
  fetchMore?: any;
  tokenList: any;
  limit: number;
}


const CrowdsaleList: React.FC<IProps> = ({ crowdsaleList, tokenList, fetchMore, limit }) => {
  const { t } = useTranslation();

  // const [setRotate, setRotateState] = useState("accordion__icon");

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
        <Flex flexDirection="column" height="100%">
          {txnLoading && crowdsaleList.length === 0 ? (
            <CrowdsaleListPlaceholder counter={2} />
          ) : !txnLoading && crowdsaleList.length === 0 ? (
            <Flex paddingBottom="125px" width="212px" margin="auto" flexDirection="column">
              <Image marginBottom="35px" src={EmptyImg} />
              <Text width="195px" textAlign="center">{t('marketplace.no_crowdsale')}</Text>
            </Flex>
          ) : (
            crowdsaleList && crowdsaleList.length > 0 && crowdsaleList.map((crowdsale: ICrowdsaleData, index: number) => (
              <CrowdsaleListItem key={index} crowdsale={crowdsale} tokenList={tokenList} last={crowdsaleList.length - 1 === index} />
            ))
          )}
        </Flex>
    </Flex>
  );
};

export default CrowdsaleList;
