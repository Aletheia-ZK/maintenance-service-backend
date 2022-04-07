// require('dotenv').config()
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
import { getTokenIDsFromContract, getInfoForTokenID } from './api'

// Reputation 1: ZKU Supporter NFT

// Calculate merkle tree
// Check if root changes: if yes, update root in smart contract

async function main() {
    const exampleContract = process.env.EXAMPLE_CONTRACT!
    try {
        const result1 = await getTokenIDsFromContract(exampleContract)

        const tokenMetaInfoPromise: any[] = []
        result1.forEach(t => {
           tokenMetaInfoPromise.push(getInfoForTokenID(exampleContract, t.token_id))
        });
        const tokenMetaInfo = await Promise.all(tokenMetaInfoPromise)
        console.log(tokenMetaInfo)

    } catch (error) {
        console.log(error)
    }
}

main()
