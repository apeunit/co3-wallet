import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import TokenDetailItems from '../components/StepsComponents/DetailItems';
import { Flex, Text } from 'rebass';
import Avatar from '../components/Avatar';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'TokenDetailItems',
  component: TokenDetailItems,
};

const token = {
  name: 'ApeUnit Credit',
  symbol: 'APE',
  icon:
    'https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0585352e8411915dc1772_1759.png',
  description: 'Lorem ipsum dolor sit amet, consectetur ',
  contractType: 'Standard Contract',
  contract: 'Ape_Credit_Contract.pdf',
  contractLabel: '',
  tokenType: 'Mintable Token',
  totalSupply: '',
};

export const Base = () => (
  <TokenDetailItems handleEdit={() => console.log('name')} title="Name" value={token.name} />
);

export const Contract = () => (
  <TokenDetailItems
    handleEdit={() => console.log('contract')}
    title="Contract"
    value="Ape_Credit_Contract.pdf"
  />
);

export const Icon = () => (
  <Flex padding={5} flexDirection="row" justifyContent="space-between">
    <Text fontSize={13} color="#9399A2">
      Icon
    </Text>
    <Avatar image={token.icon} size="110px" />
    <Text
      sx={{ cursor: 'pointer' }}
      onClick={() => console.log('Icon')}
      fontSize={13}
      color="blue600"
    >
      Edit
    </Text>
  </Flex>
);
