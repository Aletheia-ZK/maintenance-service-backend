import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
import { getReputationHolders } from './reputations/reputation_1'


async function main() {
    try {
        // get pub addresses of everybody who fulfills reputation 1
        const reputation1Holders = await getReputationHolders()

        // create merkle tree with poseidon hash function
        console.log(reputation1Holders)

    } catch (error) {
        console.log(error)
    }
}

main()
