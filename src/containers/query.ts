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

export { TRANSFER_NOTIFY_QUERY, BALANCE_NOTIFY_QUERY };
