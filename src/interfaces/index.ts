export interface Token {
	image: string
	name: string
	symbol: string
	amount?: number
}

export interface Tokens {
	tokens: Token[]
}

export interface Name {
	name: string
}

export interface IconName {
	name:
		| 'pay'
		| 'receive'
		| 'history'
		| 'notifications'
		| 'ranking'
		| 'menu'
		| 'close'
		| 'flash'
		| 'flip'
		| 'back'
		| 'check'
}

export interface WalletState {
    mnemonic: string | null,
    privateKey: string | null,
    isValid: boolean,
    saved: boolean,
	ethAddress: string | null,
	transfer: {
		to?: string,
		token?: TokenData,
		amount?: string
	}
}

export interface CO3UUMState {
	profile: object | null
	accessToken: string | null
}

export interface QRCode {
	onError: (data: string | null) => void
	onScan: (data: string | null) => void
}


export interface ChainState {
    web3: object | null,
    contracts: object | null,
    tokenList: [],
    tokenCreated: object | null,
    tokenMinted: object | null,
    tokenTransferred: object | null,
	tokenBalance: object | null
}

export enum TokenAction {
    Transfer = 'transfer',
    Mint = 'mint'
}

export interface TokenData {
	contractAddress: string,
	name: string,
    symbol: string,
    decimals: number,
    logoURL: string,
    owner: string,
    mintable: boolean
}

export interface ModalState {
	isOpen: boolean,
	title: string,
	body: string
}