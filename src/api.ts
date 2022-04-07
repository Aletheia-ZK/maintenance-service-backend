import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
import axios from 'axios'
import { TokenMetaData } from './types'

const chainID = process.env.CHAIN_ID!
const apiKey = process.env.COVALENT_API_KEY!

export async function getTokenIDsFromContract(
    contractAddress: string
): Promise<TokenMetaData[]> {
    try {
        const params = new URLSearchParams()
        params.append('quote-currency', 'USD')
        params.append('format', 'JSON')
        params.append('key', apiKey)
        const response = await axios.get(
            `https://api.covalenthq.com/v1/${chainID}/tokens/${contractAddress}/nft_token_ids/`,
            { params }
        )
        return response.data.data.items
    } catch (error) {
        // console.log(error)
        throw error
    }
}

export async function getInfoForTokenID(
    contractAddress: string,
    tokenID: string
) {
    try {
        const params = new URLSearchParams()
        params.append('quote-currency', 'USD')
        params.append('format', 'JSON')
        params.append('key', apiKey)
        const response = await axios.get(
            `https://api.covalenthq.com/v1/${chainID}/tokens/${contractAddress}/nft_metadata/${tokenID}/`,
            { params }
        )
        return response.data.data.items[0]
    } catch (error) {
        // console.log(error)
        throw error
    }
}
