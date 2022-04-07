export type TokenMetaData = {
	contract_decimals: number,
	contract_name: string,
	contract_ticker_symbol: string
	contract_address: string
	supports_erc: any,
	logo_url: string
	token_id: string
}

export type TokenData = {
	contract_decimals: number,
	contract_name: string
	contract_ticker_symbol: string,
	contract_address: string
	supports_erc: any,
	logo_url: string
	type: string,
	nft_data: [NFTData]
}

type NFTData = {
	token_id: string,
	token_balance: string,
	token_url: string,
	supports_erc: string[],
	token_price_wei: null,
	token_quote_rate_eth: null,
	original_owner: string,
	external_data: {
		name: string,
		description: string,
		image: string,
		image_256: string,
		image_512: string,
		image_1024: string,
		animation_url: null,
		external_url: null,
		attributes: null,
		owner: null
	},
	owner: string
	owner_address: string,
	burned: false
}

