import React from 'react'
import { addParameters } from '@storybook/react'
import QrCode from '../components/QrCode'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

addParameters({
	viewport: {
		viewports: INITIAL_VIEWPORTS,
		defaultViewport: 'iphonex'
	}
})

export default {
	title: 'QrCode',
	component: QrCode
}

export const Base = () => (
	<QrCode
		value='0x2186739F88a0c3DBec3d0E10f2e6Bd407C6Bd02f'
		bgColor='#FFF'
		fgColor='#3948FF'
		size={512}
	/>
)
