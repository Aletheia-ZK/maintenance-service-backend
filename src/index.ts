import { getReputationHolders } from './reputations/reputation1'
import { buildMerkleTree, updateRoot } from './treeHelperFunctions'
import { createClient } from 'redis'

async function maintainReputation1(client: any) {
    console.log('Check for updates on reputation 1 merkle tree...')
    try {
        // get pub addresses of everybody who fulfills reputation 1
        const reputation1Holders = await getReputationHolders()
        console.log('Number of reputation 1 users: ', reputation1Holders.length)

        // create merkle tree with poseidon hash function
        const tree = buildMerkleTree(reputation1Holders)
        console.log('New root:', tree.root)

        // update root in smart contract
        console.log('Update root in contract')
        // updateRoot('reputation_1', tree.root.toString())

        // update values in redis
        console.log('Update values in Redis')
        await client.set('attestation_1_leaves', JSON.stringify(tree.elements))
        await client.set('attestation_1_root', tree.root)
    } catch (error) {
        console.log(error)
    }
}

async function main() {
    const client = createClient()
    client.on('error', (err) => console.log('Redis Client Error', err))
    await client.connect()
    setInterval(() => {
        maintainReputation1(client)
    }, 10000)
}

main()
