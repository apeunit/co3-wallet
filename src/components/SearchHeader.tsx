import React from 'react';
import { Flex, Text } from 'rebass';
import ToolBar from '../components/ToolBar';
import InfoBar from '../components/InfoBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import AvatarBadge from '../components/AvatarBadge';
import { useHistory } from 'react-router-dom';

export const SearchHeader = (props: any) => {
  const { to, back } = props;
  const history = useHistory();

  return (
    <Flex flexDirection="column" style={{ width: '100%' }} backgroundColor="#fff">
      <ToolBar>
        <IconButton
          icon="back"
          onClick={() => {
            history.push(back);
          }}
        />
        <ToolBarTitle fontWeight="500">Send</ToolBarTitle>
      </ToolBar>

      <InfoBar border={true}>
        <Text variant="base">To</Text>
        <AvatarBadge image="https://www.thispersondoesnotexist.com/image" label={to} />
      </InfoBar>
    </Flex>
  );
};
