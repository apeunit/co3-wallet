import React, { Fragment } from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { action, actions } from '@storybook/addon-actions';
import IconButton from '../components/IconButton';

import { Box, Flex, Image, Text } from 'rebass';
import QrScanner from '../components/QRScanner';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'Alpha02',
};

const isCameraOn = true;
const qrEvents = actions({
  onError: 'handle-error',
  onScan: 'handle-scan',
});

export const Screen02 = () => {
  return (
    <Flex flexDirection="column" height="100vh" paddingX={7} justifyContent="flex-end">
      <Text variant="headingXl">Scan a</Text>
      <Text variant="headingXl" color="blue500">
        QR Code
      </Text>
      <Box
        marginTop={5}
        sx={{
          borderRadius: 'r5',
          paddingBottom: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          size="100%"
          sx={{
            position: 'absolute',
          }}
        >
          {!(Error && isCameraOn) ? (
            <Box>error</Box>
          ) : (
            <Box size="100%">
              <QrScanner {...qrEvents} />
            </Box>
          )}
        </Flex>
      </Box>

      {/*!(Error && isCameraOn) ? (
				<Box
					backgroundColor='background'
					marginTop={5}
					sx={{
						borderRadius: 'r5',
						boxShadow: 'base',
						paddingBottom: '100%',
						minHeight: '50%',
						position: 'relative',
						overflow: 'hidden'
					}}
				>
					<Image
						src='https://www.fomopay.com/wp-content/uploads/2017/08/FOMO_Pay_Wonderful_Durian_01-665x1024.jpg'
						backgroundColor='white'
						sx={{
							position: 'absolute'
						}}
					/>
					<Crosshair />
				</Box>
			) : (
				<Box
					marginTop={5}
					sx={{
						minHeight: '50%',
						position: 'relative'
					}}
				>
					<QrScanner {...qrEvents} />
				</Box>
				)*/}

      <Flex justifyContent="center" marginY={10}>
        <IconButton
          onClick={action('handle-close')}
          marginX={3}
          size="s14"
          icon="close"
          color="white"
          backgroundColor="black"
        />
      </Flex>
    </Flex>
  );
};
