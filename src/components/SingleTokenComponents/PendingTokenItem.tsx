import React from 'react';
import { Box, Flex, Text } from 'rebass';
import Icon from '../Icon';
import Avatar from '../Avatar';
import '../../assets/styles/NewToken.css';
import { useHistory } from 'react-router-dom';

interface IProps {
  token: any;
  subtitle: string;
}

const PendingTokenItem: React.FC<IProps> = ({ token, subtitle }) => {
  const history = useHistory();

  const handlePendingToken = () => {
    history.push({ pathname: '/new-token', state: { token } });
  };

  return (
    <Flex
      backgroundColor="#E2E6FC"
      alignItems="center"
      paddingY={1}
      paddingX={5}
      sx={{ borderRadius: 'full', position: 'relative', cursor: 'pointer' }}
      width="90%"
      height="60px"
      margin="25px auto"
      onClick={handlePendingToken}
    >
      <Box
        width="32px"
        height="32px"
        padding="2px 7px"
        sx={{ borderRadius: 'full' }}
        backgroundColor="#ffffff"
        className="token-uploading-icon"
        marginRight="-6px"
      >
        <Icon name="uploading" />
      </Box>
      <Avatar image={token.icon} size="32px" />
      <Flex flexDirection="column" marginLeft="5px">
        <Text fontWeight="bold">{token.name}</Text>
        <Text fontSize={11}>{subtitle}</Text>
      </Flex>
    </Flex>
  );
};

export default PendingTokenItem;
