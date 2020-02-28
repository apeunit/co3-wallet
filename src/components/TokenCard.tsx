import React from 'react'
import { Flex, Text } from 'rebass'
import Avatar from './Avatar'
import Badge from './Badge'


const TokenCard=(props: any)=>{
    const { image,name,symbol,amount, ...rest } = props;
    return(
    <Flex
               
        color='white'
        alignItems="center"
        padding={6}
        backgroundColor="blue600"
        height="55vw"
        flexDirection="column"
        justifyContent="space-between"
        sx={{
            borderRadius:"r5",
            boxShadow: 'base'
        }} 
        {...rest}   
    >
        <Flex
            width="100%"
            justifyContent="space-between"
            alignItems="flex-end"
        >
            <Avatar image={props.image} />
            <Flex
                
                flexDirection="column"
                
                alignItems="flex-end"
                paddingLeft={2}
            >
                <Text
                    fontFamily='sans'
                    fontSize={3}
                    fontWeight='light'
                    textAlign='right'
                    sx={{
                        letterSpacing:'xNarrow',
                        marginBottom: 2
                    }} 
                >
                {props.name}
                </Text>
                <Badge
                    marginY={1}
                >
                {props.symbol}
                </Badge>
            </Flex>
        </Flex>
        
        
        <Text
                fontFamily='sans'
                fontSize={5}
                fontWeight='extraLight'
                lineHeight={1}
                sx={{
                    letterSpacing:'xNarrow',
                    marginLeft:'auto'
                }} 
            >
            {props.amount}
            </Text>
    </Flex>
    )}

export default TokenCard