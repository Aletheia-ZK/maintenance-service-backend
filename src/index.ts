import { getReputationHolders } from './reputations/reputation1'
import { buildMerkleTree, updateRoot } from './treeHelperFunctions'

async function maintainReputation1(){
    console.log("Check for updates on reputation 1 merkle tree...")
    try {
        // get pub addresses of everybody who fulfills reputation 1
        const reputation1Holders = await getReputationHolders()
        console.log("Number of reputation 1 users: ", reputation1Holders.length)

        // create merkle tree with poseidon hash function
        const tree = buildMerkleTree(reputation1Holders)
        console.log("New root:",tree.root)

        // update root of contract
        console.log("update root in contract")
        updateRoot("reputation_1", tree.root.toString())

        // read root from contract
        // console.log("read root for reputation1 from contract")
        // getRoot("reputation_1")

        // update merkle root in smart contract
    } catch (error) {
        console.log(error)
    }
}

async function main() {
    setInterval(maintainReputation1, 10000);
}

main()
