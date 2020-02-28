# Wallet Deep linking Specification

The wallet base URL accepts several query parameters to deep link directly into different wallet screens.

## Wallet Initialization

First request to wallet should always have a valid CO3UUM access token provided under `access_token` query param. User can also combine the `access_token` or initialization with other deep link params.

### Example

- wallet.apeunit.com/access_token=abcd1234
- wallet.apeunit.com/access_token=abcd1234&to=0xcA7a02e63e55Ba02D8Cd3dCa57E81570626F284B

## Payment(token) Deep link

Below is the list of accepted query params for opening the payment/transfer screen:

- `to` (required): This is the to/receiver address

- `token` : Token symbol of the token you want to send/transfer

- `amount`: Amount of token you want to transfer
