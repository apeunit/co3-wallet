import React from 'react'
import { Flex, Image, Text } from 'rebass'

const AvatarBadge=(props:any)=>{
    const { image, label} = props;
    return(  
        <Flex
            alignItems='center'
            sx={{                  
                borderRadius: "full",
                borderColor:'gray100',
                borderWidth:'1px',
                borderStyle:'solid'
            }}  
          >
            <Image 
                src={image}
                size="s8"
                backgroundColor="white"
                sx={{            
                    borderRadius: "full",
                    flexShrink:0
                }}      
            />

            <Text
                variant ="base"
                paddingLeft = {3}
                paddingRight= {5}
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }

                }
            >
              {label}
            </Text>

          </Flex>
   
    )}

export default AvatarBadge