import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
import { getReputationHolders } from './reputations/reputation_1'
import { buildMerkleTree } from './tree_helper_functions'


async function main() {
    try {
        // get pub addresses of everybody who fulfills reputation 1
        const reputation1Holders = await getReputationHolders()
        console.log(reputation1Holders)

        // create merkle tree with poseidon hash function
        const tree = buildMerkleTree(reputation1Holders)
        console.log("root:",tree.root)
        console.log("Tree:", tree.toString())

    } catch (error) {
        console.log(error)
    }
}

main()
