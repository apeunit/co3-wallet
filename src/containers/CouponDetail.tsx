import React, { useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import IconButton from '../components/IconButton';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isMintableToken } from 'src/redux/actions/Chain';
import ActionButtonGroup from 'src/components/ActionButtonGroup';
import Moment from 'react-moment';
import axios from 'axios';
let fileDownload = require('js-file-download');
const pdfcontract = require('../assets/Token-Legal-Contract_Placeholder.pdf');

const CouponDetail: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isMintable, setIsMintable] = useState(false);

  const { ethAddress, token } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
      token: wallet.transfer.token,
    };
  });

  useEffect(() => {
    if (!token || token === null) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackStep = () => {
    history.push('/');
  };

  useEffect(() => {
    token && isMintableToken(token).then(setIsMintable);
  }, [ethAddress, history, isMintable, token]);

  const handleDownload = (url: string, filename: string) => {
    axios.get(url, {
      responseType: 'blob',
    })
    .then((res) => {
      fileDownload(res.data, filename)
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
      <Flex flexDirection="column" width="100%" style={{ transform: 'translateY(-30px)' }}>
        <Flex sx={{ borderRadius: 8, overflow: 'hidden' }} width="94%" marginX="auto" maxHeight="339px">
          <img style={{ width: '100%', margin: 'auto', maxHeight: '339px', maxWidth: '339px', height: 'auto' }} src={token?.image || token?.logoURL} alt="CouponImage" />
          <Flex
            backgroundColor="rgba(0,0,0,.5)"
            justifyContent="center"
            alignItems="center"
            paddingX="5px"
            style={{
              position: 'absolute',
              top: '284px',
              right: '13px',
              height: '24px',
              borderTopLeftRadius: '4px',
              borderBottomRightRadius: '4px',
            }}
            fontSize="13px"
          >
            <Text
              className="margin: auto;"
              color="white"
              maxWidth="100%"
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                minWidth: '14px',
                maxWidth: '50px',
                width: 'max-content',
                textAlign: 'center',
              }}
            >
              {token?.amount}
            </Text>
          </Flex>
        </Flex>
        <Flex marginTop="10px" flexDirection="column" paddingX="15px">
          <Flex flexDirection="column" paddingBottom="2px">
            <Text fontWeight="600" fontSize={24}>{token?.name}</Text>
            <Text fontSize={16} color="#757575">
              {token?.headline}
            </Text>
          </Flex>
        </Flex>
        <Flex marginBottom="10px" >
          <ActionButtonGroup
            marginTop={7}
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
        <Flex paddingY={2} paddingX="15px">
          <Text color="#75797F" fontSize={16}>{token?.description}</Text>
        </Flex>
        <Flex paddingY={2} paddingX="15px">
          <Text color="#75797F" width="210px" fontSize={13}>
            Created on{' '}
            <Moment format="Do MMMM YYYY">{token?.computed_at}</Moment>, <br />
            with a total supply of {token?.amount} coupons
          </Text>
        </Flex>
        <Flex paddingX="15px" paddingBottom={10}>
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
      </Flex>
    </Flex>
  );
};

export default CouponDetail;
