import React from 'react';
import { Flex, Image, Text } from 'rebass';

const AvatarBadge = (props: any) => {
  const { image, label, blockies } = props;

  return (
    <Flex
      alignItems="center"
      height="32px"
      sx={{
        borderRadius: 'full',
        borderColor: 'gray100',
        borderWidth: '1px',
        borderStyle: 'solid',
        overflow: 'hidden',
      }}
    >
      {image && (
        <Image
          src={image}
          backgroundColor="white"
          sx={{
            flexShrink: 0,
            maxHeight: '100%',
          }}
        />
      )}

      {blockies && blockies}

      {label && (
        <Text
          variant="base"
          paddingLeft={3}
          paddingRight={5}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Text>
      )}
    </Flex>
  );
};

export default AvatarBadge;
