import React from 'react'
import { addParameters } from '@storybook/react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { action } from '@storybook/addon-actions'
import IconButton from '../components/IconButton'
import QrCode from '../components/QrCode'
import { Box, Flex, Text} from 'rebass'

addParameters({
	viewport: {
		viewports: INITIAL_VIEWPORTS,
		defaultViewport: 'iphonex'
	}
})

export default {
	title: 'Alpha03'
}

export const Screen03 = () => {
	return (
		<Flex
			flexDirection='column'
			height='100vh'
			paddingX={7}
			justifyContent='flex-end'
		>
			
			<Text variant='headingXl'>
				Ask Sender
			</Text>
			<Text variant='headingXl' color='blue500'>
				to Scan
			</Text>
			<Box
				backgroundColor='background'
				marginTop={5}
				sx={{
					borderRadius: 'r5',
					boxShadow: 'base',
					paddingBottom: '100%',
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				<Flex
					justifyContent='center'
					alignItems='center'
					size='100%'
					sx={{
						position: 'absolute'
					}}
				>
					<QrCode
						value='0x2186739F88a0c3DBec3d0E10f2e6Bd407C6Bd02f'
						bgColor='#FFF'
						fgColor='#3948FF'
						size='250'
					/>
				</Flex>
			</Box>
			<Flex justifyContent='center' marginY={10}>
				<IconButton
					onClick={action('handle-close')}
					marginX={3}
					size='s14'
					icon='close'
					color='white'
					backgroundColor='black'
				/>
			</Flex>
		</Flex>
	)
}
