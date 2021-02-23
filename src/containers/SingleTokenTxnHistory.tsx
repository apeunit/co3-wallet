import React, { useEffect, useState } from 'react';
import { Flex, Text, Image } from 'rebass';
import TransactionHistoryList from '../components/Transactions/TransactionList/TransactionHistoryList';
import TransactionHistoryListPlaceholder from '../components/Transactions/TransactionList/TransactionHistoryListPlaceholder';
import { fetchTokenByTicker, fetchTransactionsHistory } from '../redux/actions/Chain';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../components/IconButton';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScenarioJSON from '../config/scenario.config.json';
import EmptyImg from '../images/empty.png';

const SignleTokenTxnHistory: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [txnHistoy, setTxnHistoy] = useState([]);

  const { transactionHistory, token, txnsLoading, ethAddress, contracts } = useSelector(({ chain, wallet }: any) => {
    return {
      token: wallet.transfer.token,
      transactionHistory: chain.transactionHistory,
      txnsLoading: chain.txnLoading,
      ethAddress: wallet.ethAddress,
      contracts: chain.contracts,
    };
  });


  useEffect(() => {
    if (!token && contracts?.tokenFactory) {
      dispatch(fetchTokenByTicker(ScenarioJSON.athens.tokens[0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contracts, token]);

  useEffect(() => {
    dispatch(fetchTransactionsHistory(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (ethAddress && transactionHistory.length > 0) {
      setTxnHistoy(transactionHistory.filter((txn:any) => (txn.sender_pk === ethAddress || txn.receiver_pk === ethAddress)));
    }
  }, [transactionHistory, ethAddress]);


  return (
    <Flex flexDirection="column" style={{ height: '100vh' }}>
      <Text fontSize={3} paddingX={7} paddingTop={9} paddingBottom={4} variant="headingXl">
        {t('transaction.transaction_history')}
      </Text>
      {txnsLoading && ( transactionHistory.length === 0 || txnHistoy.length === 0 ) ? (
        <TransactionHistoryListPlaceholder />
      ) : !txnsLoading && ( transactionHistory.length === 0 || txnHistoy.length === 0 ) ? (
        <Flex paddingBottom="125px" width="212px" margin="auto"  flexDirection="column">
          <Image marginBottom="35px" src={EmptyImg} />
          <Text width="195px" textAlign="center">{t('transaction.no_transaction')}</Text>
        </Flex>
      ) : (
        <TransactionHistoryList transactions={txnHistoy} />
      )}

      <div>
        <Flex
          justifyContent="center"
          style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: '40px' }}
        >
          <IconButton
            onClick={() => {
              history.push('/');
            }}
            marginX={3}
            size="s14"
            icon="close"
            color="white"
            backgroundColor="black"
          />
        </Flex>
      </div>
    </Flex>
  );
};

export default SignleTokenTxnHistory;
