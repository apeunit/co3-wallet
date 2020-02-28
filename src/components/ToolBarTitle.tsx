import React from 'react'
import {Text} from 'rebass'



const ToolBarTitle=(props: any)=>{
    const { children, ...rest } = props;
    return(
        <Text 
            variant ="heading"
            marginLeft={5}
            marginRight='auto'
            {...rest}
        >
            {children}
        </Text>
    )
}
   


export default ToolBarTitle