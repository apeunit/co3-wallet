<a name="unreleased"></a>
## [Unreleased]


<a name="1.1.2"></a>
## [1.1.2] - 2020-07-20
### Fix
- url for SSO/Identity service


<a name="1.1.1"></a>
## [1.1.1] - 2020-07-02
### Fix
- set the pilot only once MainApp
- save "toChecksumAddress" public key
- use checksummed eth address to query the middleware
- set location at build time (override with url params)
- getting the same private key on all instances
- versioning in package.json and manifest

### Refactor
- rename USER_LOCATION to PILOT


<a name="1.1.0"></a>
## [1.1.0] - 2020-06-30
### Build
- add sentry for monitoring errors
- override env var for ganache dev env
- specify build env var for each pilot

### Feat
- remove unused buttons
- remove manifest link on iOS devices
- Fix modal width
- Update minor fixes
- improve xp for backup/restore wallet
- add meaningful app title and desc
- add illustrations for wallet import
- add sentry for error logging
- Add backup/restore support for wallets
- remove manifest link on iOS devices
- add integration with UUM profiles
- **component:** add multi token view
- **component:** Bind the Address and config to runtime instead of local storage
- **component:** Show Error message for transaction failed
- **component:** Import PK and Create token
- **component:**  UI bug fixes
- **component:** Add Language
- **components:** Add RecoverPhrase, Import Wallet and New Wallet

### Fix
- hide the node modal below the mdw one
- add missing translation key
- tooltip typo
- update package.json and remove package-lock from git
- headres section in netlify config
- **component:** Resolve Web3 Connection Issue
- **component:** Show date in the transaction detail
- **component:** Fix UI issue on  create token
- **component:** Token Detail routing


<a name="1.0.0"></a>
## 1.0.0 - 2020-06-30

[Unreleased]: https://github.com/apeunit/co3-wallet/compare/1.1.2...HEAD
[1.1.2]: https://github.com/apeunit/co3-wallet/compare/1.1.1...1.1.2
[1.1.1]: https://github.com/apeunit/co3-wallet/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/apeunit/co3-wallet/compare/1.0.0...1.1.0
