import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
import { getReputationHolders } from './reputations/reputation_1'


async function main() {
    try {
        const reputation1Holders = await getReputationHolders()
        console.log(reputation1Holders)

    } catch (error) {
        console.log(error)
    }
}

main()
