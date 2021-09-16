import React from 'react';
import { Flex } from 'rebass';
import AddImage from '../components/AddImage';
import avatarImg from '../images/placeholder-img.png';
import Avatar from './Avatar';

const ImageCard = (props: any) => {
  const { name, symbol, amount, loading, style, type, uploadIcon, ...rest } = props;

  return (
    <Flex
      color="#303030"
      alignItems="center"
      padding={6}
      height={uploadIcon === 'crowdsale' ? '240px' : '55%'}
      flexDirection="column"
      justifyContent="space-between"
      backgroundColor="#F8F9FA"
      style={{
        backgroundImage: `url(${props.icon})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
      sx={{
        borderRadius: uploadIcon === 'crowdsale' ? '8px' : '10px',
        ...style,
      }}
      {...rest}
    >
      <Flex justifyContent="space-between" width="100%">
        {type === 'add' ? (
          <Flex width="100%" justifyContent="flex-end">
            <AddImage
              width="55px"
              label={props.icon ? '' : 'Add Image'}
              uploading={props.uploading}
              accept="image/*"
              onChange={props.onChange}
              image={props.icon}
              placeholder={avatarImg}
              padding={0}
              uploaded={props.icon}
              uploadIcon={props.uploadIcon}
            />
          </Flex>
        ) : (
          uploadIcon !== 'crowdsale' && (
            <Avatar
              marginRight="10px"
              loading={!props.icon}
              image={props.icon}
              borderRadius="50px"
              size="56px"
              justifyContent="flex-end"
            />
          )
        )}
      </Flex>
    </Flex>
  );
};

export default ImageCard;
