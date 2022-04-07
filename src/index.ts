import { getReputationHolders } from './reputations/reputation_1'
import { buildMerkleTree } from './tree_helper_functions'


async function maintainReputation1(){
    console.log("Check for updates on reputation 1 merkle tree...")
    try {
        // get pub addresses of everybody who fulfills reputation 1
        const reputation1Holders = await getReputationHolders()
        console.log("Number of reputation 1 users: ", reputation1Holders.length)

        // create merkle tree with poseidon hash function
        const tree = buildMerkleTree(reputation1Holders)
        console.log("New root:",tree.root)

        // update merkle root in smart contract
    } catch (error) {
        console.log(error)
    }
}

async function main() {
    setInterval(maintainReputation1, 10000);
}

main()
