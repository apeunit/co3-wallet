import React from 'react';
import { Flex, Text } from 'rebass';
import ToolBar from '../components/ToolBar';
import InfoBar from '../components/InfoBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import AvatarBadge from '../components/AvatarBadge';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Blockies from 'react-blockies';

export const SearchHeader = (props: any) => {
  const { t } = useTranslation();
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
        <ToolBarTitle fontWeight="500">{t('common.send')}</ToolBarTitle>
      </ToolBar>

      <InfoBar border={true}>
        <Text variant="base">{t('common.to')}</Text>
        <AvatarBadge
          blockies={
            <Blockies bgColor="#e2e8f0" spotColor="#e2e8f0" seed={to} size={10} scale={3} />
          }
          label={to}
        />
      </InfoBar>
    </Flex>
  );
};
