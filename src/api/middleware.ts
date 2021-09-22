import gql from 'graphql-tag';

/*
  Get Transaction History List
*/
const TRANSFER_NOTIFY_QUERY: any = gql`
  query transferQuery($senderPk: String!, $sort: SortFindManyTransferNotificationInput) {
    transferNotificationMany(
      filter: { OR: [{ receiver_pk: $senderPk }, { sender_pk: $senderPk }] }
      sort: $sort
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

const TRANSFER_NOTIFY_QUERY_FILTER: any = gql`
  query transferQuery(
    $filter: FilterFindManyTransferNotificationInput
    $limit: Int
    $sort: SortFindManyTransferNotificationInput
  ) {
    transferNotificationMany(filter: $filter, sort: $sort, limit: $limit) {
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

/*
  Get Tokens List of specific ethAddress (wallet owner)
*/
const BALANCE_NOTIFY_QUERY: any = gql`
  query balanceNotifyQuery($accountPk: String!) {
    balanceNotificationMany(filter: { account_pk: $accountPk }) {
      _id
      name
      token_symbol
      computed_at
      amount
      logoURL
      purpose
      decimals
      contractAddress
      owner
    }
  }
`;

/*
  Get Tokens List of specific ethAddress (wallet owner)
*/
const GET_TOKEN: any = gql`
  query getCoupon($contractAddress: String!) {
    balanceNotificationMany(filter: { contractAddress: $contractAddress }) {
      _id
      name
      token_symbol
      computed_at
      amount
      logoURL
      purpose
      decimals
      contractAddress
      owner
    }
  }
`;

/*
  Get Token of specific ethAddress (wallet owner) and Token with their contract Address
*/
const BALANCE_NOTIFY_QUERY_TOKEN: any = gql`
  query balanceNotificationMany($accountPk: String, $contractAddress: String) {
    balanceNotificationMany(filter: { account_pk: $accountPk, contractAddress: $contractAddress }) {
      _id
      name
      token_symbol
      computed_at
      amount
      purpose
      logoURL
      decimals
      contractAddress
      owner
    }
  }
`;

/*
  Get All Tokens in middleware
*/
const GET_ALL_TOKENS: any = gql`
  query tokenAddedMany {
    tokenAddedMany(filter: {}) {
      _id
      contractAddress
      name
      symbol
      decimals
      logoURL
      purpose
      owner
      hardCap
      timestamp
      mintable
    }
  }
`;

/*
  Get Crowdsale List from middleware
*/
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
      metadata
      _id
    }
  }
`;

/*
  Get pickupBasket List from middleware
*/
const GET_PICKUP_BASKET_ADDED: any = gql`
  query pickupBasketAddedNotificationMany(
    $filter: FilterFindManyPickUpBasketAddedInput
    $skip: Int
    $sort: SortFindManyPickUpBasketAddedInput
  ) {
    pickUpBasketAddedNotificationMany(filter: $filter, skip: $skip, sort: $sort) {
      identifier
      timestamp
      contractAddress
      giveRatio
      productsAvailable
      owner
      metadata
      _id
    }
  }
`;

/*
  Crowdsale List Sort ENUM
*/
enum CrowdsaleSortEnum {
  'ASC' = '_ID_ASC',
  'DESC' = '_ID_DESC',
}

export {
  TRANSFER_NOTIFY_QUERY,
  BALANCE_NOTIFY_QUERY,
  GET_CROWDSALE_ADDED,
  GET_PICKUP_BASKET_ADDED,
  CrowdsaleSortEnum,
  GET_ALL_TOKENS,
  BALANCE_NOTIFY_QUERY_TOKEN,
  GET_TOKEN,
  TRANSFER_NOTIFY_QUERY_FILTER,
};
