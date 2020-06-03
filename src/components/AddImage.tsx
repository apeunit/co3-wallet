import React from 'react';
import { Box, Flex, Text } from 'rebass';
import Avatar from '../components/Avatar';
import Icon from './Icon';
import { useLocation } from 'react-router-dom';

const AddImage = (props: any) => {
  const { uploading = false, label, placeholder, icon, padding, onChange, accept } = props;
  const location = useLocation();

  return (
    <Flex flexDirection="column" style={{ position: 'relative' }}>
      <Box style={{ position: 'absolute', display: 'flex', top: 0, left: 0, right: 0 }}>
        {onChange && (
          <input
            type="file"
            name="image"
            onChange={accept === 'application/pdf' ? onChange : undefined}
            accept={accept}
            style={{
              color: 'transparent',
              display: 'block',
              width: 'auto',
              height: '55px',
              outline: 'none',
              borderRadius: '100px',
              overflow: 'hidden',
              flex: 1,
            }}
          />
        )}
      </Box>
      <Flex
        backgroundColor="#F1F3F6"
        justifyContent="space-between"
        alignItems="center"
        paddingY={1}
        paddingX={padding}
        sx={{ borderRadius: 'full', position: 'relative' }}
        maxWidth="200px"
        width="max-content"
        height="55px"
        style={{ pointerEvents: 'none' }}
      >
        {icon && (
          <Flex justifyContent="flex-end">
            <Icon name={icon} />
          </Flex>
        )}
        {label && (
          <Text
            textAlign="center"
            paddingX={6}
            fontSize="14px"
            style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: '140px',
            }}
          >
            {label}
          </Text>
        )}
        {placeholder ? (
          <Avatar
            image={
              props.image
                ? onChange && location.pathname === '/new-coupon'
                  ? placeholder
                  : props.image
                : placeholder
            }
            size="s14"
          />
        ) : (
          <Flex />
        )}
        {onChange && (
          <Box
            sx={{ position: 'absolute', right: 0, bottom: 0, borderRadius: 'full' }}
            backgroundColor="#3948ff"
            fontSize={1}
            color="white"
          >
            {uploading ? <Icon name="uploading" /> : <Icon name="upload" />}
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default AddImage;