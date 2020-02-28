import React from 'react'
import { Flex } from 'rebass'
import TokenListItem from './TokenListItem'
import { Tokens, Token } from '../interfaces'

const TokenList=(props: Tokens)=>{
    return(
    <Flex
        width="100%"            
        color='text'
        flexDirection="column"
        paddingX={6}
    >
        {
            props.tokens.map( (token: Token) => {
                return <TokenListItem {...token} />
            })
        }
    
    </Flex>
    )}

export default TokenList