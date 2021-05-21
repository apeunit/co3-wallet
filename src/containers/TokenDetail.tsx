import React, { useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import TokenCard from '../components/Tokens/CreateTokens/TokenCard';
import IconButton from '../components/IconButton';
import { useHistory } from 'react-router-dom';
import ActionButtonGroup from '../components/ActionButtonGroup';
import { useSelector } from 'react-redux';
import { isMintableToken } from '../redux/actions/Chain';
import { useTranslation } from 'react-i18next';
import Moment from 'react-moment';
import axios from 'axios';
const fileDownload = require('js-file-download');
const pdfcontract = require('../assets/Token-Legal-Contract_Placeholder.pdf');
const isDev = process.env.NODE_ENV === 'development';

const TokenDetail: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isMintable, setIsMintable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  const { ethAddress, token } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
      token: wallet.transfer.token,
    };
  });

  const handleBackStep = () => {
    history.push('/');
  };

  useEffect(() => {
    if (!token || token === null) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    token && isMintableToken(token).then(setIsMintable);
  }, [ethAddress, history, isMintable, token]);

  const handleDownload = (url: string, filename: string) => {
    setIsDownloading(true);
    axios.get(isDev ? url : url.replace('http',  'https'), {
      responseType: 'blob',
    })
    .then((res) => {
      setIsDownloading(false);
      fileDownload(res.data, filename)
    }).catch(() => {
      setIsDownloading(false);
      setError(t('common.download_error'))
    })
  }

  return (
    <Flex flexDirection="column" width="100%" height="100vh">
      <Flex justifyContent="space-between" alignItems="center" paddingY={4}>
        <IconButton
          onClick={handleBackStep}
          sx={{ cursor: 'pointer', transform: 'rotate(180deg)' }}
          icon="dirBackArrow"
        />
      </Flex>
      <Flex flexDirection="column" width="96%" marginX="auto">
        <TokenCard
          name={token?.name}
          amount={token?.decimals === 2 ? token?.amount / 100 : token?.amount}
          symbol={token?.token_symbol}
          icon={token?.image || token?.logoURL}
          amount_msg={t('token_details.card_msg')}
        />
        <Flex marginBottom="15px">
          <ActionButtonGroup
            marginTop={7}
            marginBottom="auto"
            gap={2}
            buttons={[
              {
                icon: 'sendIcon',
                label: t('token_details.send'),
                key: 'send',
                iconBg: 'blue600',
                iconColor: 'white',
                onClick: () => {
                  history.replace({ pathname: '/scan', state: { token } });
                },
              },
              {
                icon: 'mintIcon',
                label: t('token_details.mint'),
                key: 'mint',
                className: 'token-mint-btn',
                show: !(isMintable && ethAddress === token?.owner),
                iconBg: 'white',
                iconColor: '#00E0A8',
                iconBorderColor: '#00E0A8',
                onClick: () => {
                  history.replace({ pathname: '/token-mint', state: { token } });
                },
              },
            ]}
          />
        </Flex>
        <Flex padding={5}>
          <Text color="#75797F" fontSize={16}>{token?.description}</Text>
        </Flex>
        <Flex padding={5}>
          <Text color="#75797F" width="210px" fontSize={13}>
            Created on{' '}
            <Moment format="Do MMMM YYYY">{token?.computed_at}</Moment>, <br />
            with a total supply of {token?.amount / 100} tokens
          </Text>
        </Flex>
        <Flex paddingX={5} paddingBottom={10}>
          <button onClick={() => handleDownload(token?.contractHash || pdfcontract, token?.contractLabel || 'Token-Legal-Contract_Placeholder.pdf')}>
            <Flex
              marginTop="10px"
              height="32px"
              width="187px"
              sx={{ borderRadius: 'full', borderWidth: '1px', borderColor: '#F1F3F6' }}
              className="token-file-icon"
              padding="5px 10px 10px 12px"
            >
              <IconButton marginRight="5px" width="20px" height="10px" icon="fileCopy" />
              <Text color="#404245" fontSize={13}>
                {t('token_details.terms_conditions')}
              </Text>
            </Flex>
          </button>
        </Flex>
        {isDownloading && <Flex padding='10px 20px' margin='auto' justifyContent="center" width='150px' sx={{ background: 'rgb(47 47 47 / 77%)', borderRadius: '25px', position: 'absolute', bottom: '30px', left: 0, right: 0 }}>
          <Text color="#ffffff">{t('common.downloading')}</Text>
        </Flex>}
        {error && <Flex padding='10px 20px' margin='auto' justifyContent="center" width='150px' sx={{ background: '#DD303D', borderRadius: '25px', position: 'absolute', bottom: '30px', left: 0, right: 0 }}>
          <Text color="#ffffff">{error}</Text>
        </Flex>}
      </Flex>
    </Flex>
  );
};

export default TokenDetail;
