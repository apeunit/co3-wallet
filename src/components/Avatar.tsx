import React from 'react';
import { Box, Image } from 'rebass';

const Avatar = (props: any) => {
  return (
    <Box
      sx={{
        width: '56px',
        height: '56px',
        borderRadius: 'full',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          width: '190%',
          height: '100%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <Image
          src={props.image}
          width="auto"
          backgroundColor={props.backgroundColor}
          sx={{
            maxWidth: '100% !important',
            borderRadius: 'none',
            overflow: 'hidden',
            display: 'block',
            zIndex: 111,
            height: '100%',
            margin: '0 auto',
          }}
        />
      </Box>
    </Box>
  );
};

export default Avatar;
