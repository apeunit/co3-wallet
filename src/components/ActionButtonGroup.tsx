import React from 'react'
import { Flex} from 'rebass'
import ActionButton from './ActionButton'

const ActionButtonGroup=(props: any)=>{
    const { buttons, gap, iconColor, iconBg, ...rest } = props;
    return(
        <Flex
            width="100%"            
            paddingX={3}
            {...rest}
        >
            {
                buttons.map( (button: any) => {
                    return <ActionButton 
                                {...button} 
                                marginX={gap?gap:0} 
                                iconColor={iconColor} 
                                iconBg={iconBg} 
                            />
                })
            }
        
        </Flex>
        )}

export default ActionButtonGroup