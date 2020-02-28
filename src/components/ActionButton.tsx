import React from 'react'
import { Flex, Text} from 'rebass'
import IconButton from './IconButton'

const ActionButton=(props: any)=>{
    const { icon,label,iconColor,iconBg, ...rest } = props;
    return(
    <Flex             
        
        flexDirection="column"    
        alignItems="center"
        {...rest}
    >
        
        <IconButton 
            marginX={3}
            size="s14"
            backgroundColor={iconBg?iconBg:'shadow'}
            color={iconColor?iconColor:'current'}
            icon = {icon}
        />
        <Text
            marginTop={2}
            variant="base"
            fontSize={1}
        >
        {label}
        </Text>
    </Flex>
    )}

export default ActionButton