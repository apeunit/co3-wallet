# CO3 Wallet [WIP]

## Prerequisites

- Node.js (Recommended: v11.10.1)
- Yarn

## Environment Variables

Please add the below environment variables directly to the build/dev shell or use a `.env` file.

- `REACT_APP_CO3UUM_URL`: URL of the CO3UUM
- `REACT_APP_NODE`: URL to the JSON-RPC interface of the blockchain node
- `REACT_APP_TOKEN_FACTORY`: Ethereum address of the token factory contract
- `REACT_APP_CROWDSALE_FACTORY`: Ethereum address of the crowdsale factory contract
- `REACT_APP_PILOT`: Location of the user. Currently supported value is `athens`. This variable will be removed in future.

## How to run

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!
