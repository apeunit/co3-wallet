import React from 'react'
import { Flex, Text } from 'rebass'
import Avatar from './Avatar'
import Badge from './Badge'


const TokenListItem=(props: any)=>{
    return(
    <Flex
        width="100%"            
        color='text'
        alignItems="center"
        paddingY={4}
    >
        <Avatar image={props.image} />
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            paddingLeft={2}
        >
            <Text
                fontFamily='sans'
                fontSize={2}
                fontWeight='regular'
                textAlign='left'
            >
            {props.name}
            </Text>
            <Badge
                marginY={1}
            >
            {props.symbol}
            </Badge>
        </Flex>
        <Text
                fontFamily='sans'
                fontSize={2}
                fontWeight='medium'
                marginLeft='auto'
                marginBottom={5}
            >
            {props.amount}
            </Text>
    </Flex>
    )}

export default TokenListItem