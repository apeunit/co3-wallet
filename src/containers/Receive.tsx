import React, { useState } from 'react';
import IconButton from '../components/IconButton';
import QRCodeCanvas from 'qrcode.react';
import { Box, Flex, Text } from 'rebass';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';

const Receive = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [copied, setCopied] = useState(false);

  const { ethAddress } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
    };
  });

  if (!ethAddress) {
    history.replace('/');
  }

  const handleCopy = (e: any) => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }
  
  return (
    <Flex
      flexDirection="column"
      height="100vh"
      paddingX={7}
      paddingBottom={3}
      justifyContent="flex-end"
    >
      <Text variant="headingXl" fontSize={6}>
        {t('receive.ask_sender')}
      </Text>
      <Text variant="headingXl" fontSize={6} color="#3948FF">
        {t('receive.to_scan')}
      </Text>
      <Text fontSize={1} color="#ababab">
        {t('receive.click_qr')}
      </Text>
      <Box
        backgroundColor="background"
        marginTop={5}
        sx={{
          borderRadius: 'r5',
          boxShadow: 'base',
          paddingBottom: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          size="100%"
          backgroundColor="#fffff"
          p={10}
          sx={{
            position: 'absolute',
          }}
        >
          {copied && <Flex className="popover__content" paddingY={2} paddingX={4} sx={{ background: '#000000cf', color: '#ffffff', position: 'absolute', top: '100px', borderRadius: '5px' }}>
            {t('receive.address_copied')}
          </Flex>}
          <CopyToClipboard
            text={`${window.location.href.split('receive')[0]}tx?to=${ethAddress}`}
            onCopy={handleCopy}
          >
            {ethAddress && (
              <QRCodeCanvas
                value={ethAddress}
                bgColor="#ffffff"
                fgColor="#3948FF"
                style={{ maxWidth: '295px', maxHeight: '295px', height: '100%', width: '100%' }}
              />
            )}
          </CopyToClipboard>
        </Flex>
      </Box>
      <Flex justifyContent="center" marginY={9}>
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
      <Box
        backgroundColor="black"
        width="134px"
        height="5px"
        marginBottom={2}
        margin="0 auto"
        sx={{
          borderRadius: 'full',
          flexGrow: 0,
        }}
      />
    </Flex>
  );
};

export default Receive;
