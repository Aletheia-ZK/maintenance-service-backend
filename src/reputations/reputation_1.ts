import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
import { getTokenIDsFromContract, getInfoForTokenID } from '../api'
import { TokenData, TokenMetaData } from '../types'

// Reputation 1
// Criteria: All pub addresses who currently own the ZKU Supporter NFT

export async function getReputationHolders(): Promise<string[]> {
	const contractAddress = process.env. REPUTATION_1_CONTRACT_ADDRESS!
	const existingTokenIds = await getTokenIDsFromContract(contractAddress)
	const tokensMetaInfo: TokenData[] = []

	for(const t of existingTokenIds){
		const tokenMetaInfo = await getInfoForTokenID(contractAddress, t.token_id)
		tokensMetaInfo.push(tokenMetaInfo)
	}

	const reputationHolders = tokensMetaInfo.map(elm => {
		return elm.nft_data[0].owner_address
	})

	return reputationHolders
}

// Calculate merkle tree
// Check if root changes: if yes, update root in smart contract

// async function main() {
//     const exampleContract = process.env.EXAMPLE_CONTRACT!
//     try {
//         // console.log(tokenMetaInfo)

//     } catch (error) {
//         console.log(error)
//     }
// }