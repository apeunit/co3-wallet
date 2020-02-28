import React from 'react'
import { Image } from 'rebass'

const Avatar=(props: any)=>{
    return(
    
        <Image 
            src={props.image}
            size="s12"
            backgroundColor="white"
            sx={{            
                boxShadow: 'base',
                borderRadius: "full"
            }}      
        />
   
    )}

export default Avatar