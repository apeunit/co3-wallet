import React from 'react'
import { Box } from 'rebass'

const Crosshair=()=>{
    
    return(  
        <Box
            width='100%'
            height='100%'
            color='white'
            opacity={.7}
            sx={{            
                position:'absolute',
            }} 
        >
            <Box
                width='50%'
                sx={{            
                    position:'absolute',
                    top:'10%',
                    bottom:'10%',
                    borderColor:'current',
                    borderWidth:'1px',
                    borderRightStyle:'solid'
                }} 
            />
            <Box
                height='50%'
                sx={{            
                    position:'absolute',
                    left:'10%',
                    right:'10%',
                    borderColor:'current',
                    borderWidth:'1px',
                    borderBottomStyle:'solid'
                }} 
            />

            <Box
                width='15%'
                sx={{            
                    position:'absolute',
                    left:'15%',
                    top:'15%',
                    borderColor:'current',
                    borderWidth:'4px',
                    borderTopStyle:'solid',
                    borderLeftStyle:'solid',
                    paddingTop:'15%',
                    borderTopLeftRadius:'r5'
                }} 
            />

            <Box
                width='15%'
                sx={{            
                    position:'absolute',
                    right:'15%',
                    top:'15%',
                    borderColor:'current',
                    borderWidth:'4px',
                    borderTopStyle:'solid',
                    borderRightStyle:'solid',
                    paddingTop:'15%',
                    borderTopRightRadius:'r5'
                }} 
            />

            <Box
                width='15%'
                sx={{            
                    position:'absolute',
                    right:'15%',
                    top:'15%',
                    borderColor:'current',
                    borderWidth:'4px',
                    borderTopStyle:'solid',
                    borderRightStyle:'solid',
                    paddingTop:'15%',
                    borderTopRightRadius:'r5'
                }} 
            />
            <Box
                width='15%'
                sx={{            
                    position:'absolute',
                    right:'15%',
                    bottom:'15%',
                    borderColor:'current',
                    borderWidth:'4px',
                    borderBottomStyle:'solid',
                    borderRightStyle:'solid',
                    paddingTop:'15%',
                    borderBottomRightRadius:'r5'
                }} 
            />
            <Box
                width='15%'
                sx={{            
                    position:'absolute',
                    left:'15%',
                    bottom:'15%',
                    borderColor:'current',
                    borderWidth:'4px',
                    borderBottomStyle:'solid',
                    borderLeftStyle:'solid',
                    paddingTop:'15%',
                    borderBottomLeftRadius:'r5'
                }} 
            />

        </Box>
   
    )}

export default Crosshair