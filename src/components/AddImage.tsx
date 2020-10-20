import React from 'react';
import { Box, Flex, Text } from 'rebass';
import Avatar from '../components/Avatar';
import Icon from './Icon';
import { useLocation } from 'react-router-dom';
import IconButton from './IconButton';

const AddImage = (props: any) => {
  const {
    uploading = false,
    label,
    placeholder,
    icon,
    padding,
    onChange,
    accept,
    uploadIcon,
  } = props;
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
              outline: 'none',
              opacity: '0',
              position: 'relative',
              flex: 1,
            }}
            className={uploadIcon === 'crowdsale' ? 'crowdsale-input' : 'token-input'}
          />
        )}
      </Box>
      {uploadIcon === 'crowdsale' ? (
        <Flex style={{ position: 'absolute', bottom: '-25px', right: '-24px' }}>
          <Flex
            width="47px"
            height="47px"
            style={{
              borderRadius: '50%',
              backgroundColor: '#3752F5',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <Box className={uploading ? 'upload-icon-loader' : ''}>
              <IconButton icon={uploading ? 'uploading' : 'cameraAlt'} />
            </Box>
          </Flex>
        </Flex>
      ) : (
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
          className="image-section"
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
          {uploadIcon !== 'hide' && onChange && (
            <Box
              width="24px"
              height="24px"
              sx={{ position: 'absolute', right: 0, bottom: 0, borderRadius: 'full' }}
              backgroundColor="#3948ff"
              fontSize={1}
              color="white"
            >
              {uploading ? (
                <Box className="upload-icon-loader">
                  <Icon name="uploading" />
                </Box>
              ) : (
                <Icon name={uploadIcon ? uploadIcon : 'upload'} />
              )}
            </Box>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default AddImage;
