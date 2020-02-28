import React from 'react'
import { Flex, Box } from 'rebass'
import Icon from './Icon'

const IconButton = (props: any) => {
	const { icon, ...rest } = props
	return (
		<Flex
			justifyContent='center'
			alignItems='center'
			size='s12'
			sx={{
				position: 'relative',
				borderRadius: 'full'
			}}
			{...rest}
		>
			{props.dot && (
				<Box
					size='s2'
					sx={{
						position: 'absolute',
						bg: 'secondary',
						top: '50%',
						right: '50%',
						marginTop: -3,
						marginRight: -5,
						borderRadius: 'full'
					}}
				/>
			)}
			<Box
				
				sx={{
					position: 'relative'
				}}
			>
				<Icon name={icon} />
			</Box>
		</Flex>
	)
}

export default IconButton
