import gql from 'graphql-tag';

const TRANSFER_NOTIFY_QUERY: any = gql`
  query transferQuery($senderPk: String!) {
    transferNotificationMany(
      filter: { OR: [{ receiver_pk: $senderPk }, { sender_pk: $senderPk }] }
    ) {
      _id
      receiver_pk
      token_symbol
      executed_on
      amount
      sender_pk
      purpose
      contractAddress
      owner
      decimals
    }
  }
`;

const BALANCE_NOTIFY_QUERY: any = gql`
  query balanceNotifyQuery($accountPk: String!) {
    balanceNotificationMany(filter: { account_pk: $accountPk }) {
      _id
      name
      token_symbol
      computed_at
      amount
      logoURL
      decimals
      contractAddress
      owner
    }
  }
`;

const BALANCE_NOTIFY_QUERY_TOKEN: any = gql`
  query balanceNotificationMany($accountPk: String, $contractAddress: String) {
    balanceNotificationMany(filter: { account_pk: $accountPk, contractAddress: $contractAddress }) {
      _id
      name
      token_symbol
      computed_at
      amount
      logoURL
      decimals
      contractAddress
      owner
    }
  }
`;

const GET_ALL_TOKENS: any = gql`
  query tokenAddedMany {
    tokenAddedMany(filter: {}) {
      _id
      contractAddress
      name
      symbol
      decimals
      logoURL
      owner
      hardCap
      timestamp
      mintable
    }
  }
`;

const CROWDSALE_ADDED: any = gql`
  mutation crowdsaleAddedNotificationCreateOne($record: CreateOneCrowdsaleAddedInput!) {
    crowdsaleAddedNotificationCreateOne(record: $record) {
      recordId
      record {
        contractAddress
        identifier
        start
        end
        acceptRatio
        giveRatio
        owner
        timestamp
        maxCap
      }
    }
  }
`;

const GET_CROWDSALE_ADDED: any = gql`
  query crowdsaleAddedNotificationMany(
    $filter: FilterFindManyCrowdsaleAddedInput
    $skip: Int
    $limit: Int
    $sort: SortFindManyCrowdsaleAddedInput
  ) {
    crowdsaleAddedNotificationMany(filter: $filter, skip: $skip, limit: $limit, sort: $sort) {
      contractAddress
      identifier
      start
      end
      acceptRatio
      giveRatio
      owner
      timestamp
      maxCap
      acceptRatio
      _id
    }
  }
`;

enum CrowdsaleSortEnum {
  'ASC' = '_ID_ASC',
  'DESC' = '_ID_DESC',
}

export {
  TRANSFER_NOTIFY_QUERY,
  BALANCE_NOTIFY_QUERY,
  CROWDSALE_ADDED,
  GET_CROWDSALE_ADDED,
  CrowdsaleSortEnum,
  GET_ALL_TOKENS,
  BALANCE_NOTIFY_QUERY_TOKEN,
};
