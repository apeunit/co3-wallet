<a name="unreleased"></a>
## [Unreleased]


<a name="1.3.4"></a>
## [1.3.4] - 2021-02-17
### Feat
- Add Copied Popover on QR code
- Design Empty Screens

### Feat
- Redesign coupon list for main page
- Token list redesign
- Add description, contract hash, headline in coupon detail
- Add Description, contract hash in token details
- Add callback in deeplink error popup
- Add callback in deeplink error popup
- Deeplink error
- Close button disable in modal
- Add Contract screen like others
- Add coupon in send list

### Fix
- Increase Crowdsale Limit
- Remove Sell button from Coupon Detail
- Crowdsale icon button issue resolved
- Token Loader False on error
- Resolve edit button issue
- Crowdsale Coupon and token dropdown remove duplication
- Amount popup error resolve
- Fix Min Height for tokens list
- Resolve Token Detail send transfer action props
- Resolve Token Icon load issue in transaction history
- Resolve pay,receive... btns click issue
- Popup btn issue resolve
- Catch Error in Create Crowdsale
- Check token is valid or expire and display msg
- Refactor created by text in detail pages
- Work on Coupon Detail UI
- Redesign Coupon Image Card

### Fix
- Resolve Coupon Icon issues
- Redesign Main page
- down padding coupon list title
- End date set after month from today
- Resolve issues and update detail
- Resolve File Download Issue
-  Resolve Date/Time issue in crowdsale creation
- Resolve placeholder issue
- Rename Mint Page


<a name="1.3.3"></a>
## [1.3.3] - 2021-02-11

<a name="1.3.2"></a>
## [1.3.2] - 2020-12-22

<a name="1.3.1"></a>
## [1.3.1] - 2020-12-18
### Fix
- Refactor Token and coupon minting logic


<a name="1.3.0"></a>
## [1.3.0] - 2020-12-17
### Chore
- remove netflix env var for REACT_APP_PILOT

### Feat
- Add total supply screen
- Update Translation
- Update Cypress Coupon Testcase
- Remove Standard contract from coupon
- Set Coupon Mintable
- add type selection for attach-sm deeplink
- webhook support (for firstlife)
- Update New Token Steps and add custom contract Text
- use ethereum identicons for addresses images
- Add 2 for coupon type in purpose
- all tokens are mintable

### Fix
- Add Total Supply Screen in Token
- Remove Copied console
- Resolve Balance display Issue
- Resolve Decimal Point Issue
- Add amount from params in payment
- misplaced tokens in coupon list
- minor ui issues
- Update Transaction Empty Message
- single token wallet pilot
- Set default single token
- Update Coupon icons
- token details not displayed properly
- add locales for token description

### Fix
- display history in descending order

### Test
- set default tokens for single/multi token pilots


<a name="1.2.2"></a>
## [1.2.2] - 2020-10-22
### Fix
- **regression:** unable to send tokens


<a name="1.2.1"></a>
## [1.2.1] - 2020-10-20
### Fix
- package version


<a name="1.2.0"></a>
## [1.2.0] - 2020-10-20
### Chore
- improve crowdsale deatils data

### Feat
- Copy address in clipboard
- Add MDW in crowdsale
- Add routes for deeplinking
- Add version string in setting page
- **component:** Handle enter event on backup/restore wallet
- **componet:** Handle enter event

### Feat
- Add Crowdsale Deeplinking Test case

### Fix
- Resolve crowdsale Issue and some changes
- MarketPlace List Fix
- cypress
- setting "Backup wallet" text style issue
- missing translation
- Resolve LogoURL and multiple call for balanceNotification
- Resolve send token Issue
- multiple popup open issue
- Resolve create button issue
- setting "Backup wallet" text style issue
- **component:** Refactor file structure
- **component:** Refactor file structure
- **component:** Refactor file structure

### Fix
- File structure

### Refactor
- make use of pilot features more evident


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

[Unreleased]: https://github.com/apeunit/co3-wallet/compare/1.3.4...HEAD
[1.3.4]: https://github.com/apeunit/co3-wallet/compare/1.3.3...1.3.4
[1.3.3]: https://github.com/apeunit/co3-wallet/compare/1.3.2...1.3.3
[1.3.2]: https://github.com/apeunit/co3-wallet/compare/1.3.1...1.3.2
[1.3.1]: https://github.com/apeunit/co3-wallet/compare/1.3.0...1.3.1
[1.3.0]: https://github.com/apeunit/co3-wallet/compare/1.2.2...1.3.0
[1.2.2]: https://github.com/apeunit/co3-wallet/compare/1.2.1...1.2.2
[1.2.1]: https://github.com/apeunit/co3-wallet/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/apeunit/co3-wallet/compare/1.1.2...1.2.0
[1.1.2]: https://github.com/apeunit/co3-wallet/compare/1.1.1...1.1.2
[1.1.1]: https://github.com/apeunit/co3-wallet/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/apeunit/co3-wallet/compare/1.0.0...1.1.0
