import { getReputationHolders as getReputationHolders1 } from './reputations/reputation1'
import { getReputationHolders as getReputationHolders2 } from './reputations/reputation2'
import {
    buildMerkleTree,
    getAllCurrentRegisteredIdentities,
    updateRoot,
} from './utils'
import dotenv from 'dotenv'
import { createClient } from 'redis'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const REDIS_URL = process.env.REDIS_URL

async function maintainReputation1(client: any) {
    console.log('Check for updates on reputation 1 merkle tree...')
    try {
        // get pub addresses of everybody who fulfills reputation 1
        const reputation1Holders = await getReputationHolders1()
        console.log('Number of reputation 1 users: ', reputation1Holders.length)

        // create merkle tree with poseidon hash function
        const tree = buildMerkleTree(reputation1Holders)
        console.log('New root for reputation 1:', tree.root)

        // update root in smart contract
        // console.log('Update root in contract')
        console.log('New root: ', tree.root.toString())
        updateRoot('reputation_1', tree.root.toString())

        // update values in redis
        // console.log('Update values in Redis')
        await client.set('attestation_1_leaves', JSON.stringify(tree.leaves))
        await client.set('attestation_1_root', tree.root)
    } catch (error) {
        console.log(error)
    }
}

async function maintainReputation2(client: any) {
    console.log('Check for updates on reputation 2 merkle tree...')
    try {
        // get pub addresses of everybody who fulfills reputation 1
        const reputation2Holders = await getReputationHolders2()
        console.log('Number of reputation 2 users: ', reputation2Holders.length)

        // create merkle tree with poseidon hash function
        const tree = buildMerkleTree(reputation2Holders)
        // console.log('New root:', tree.root)

        // update root in smart contract
        // console.log('Update root in contract')
        console.log('New root for reputation 2: ', tree.root.toString())
        updateRoot('reputation_2', tree.root.toString())

        // console.log('Tree leaves: ', JSON.stringify(tree.leaves))

        // update values in redis
        // console.log('Update values in Redis')
        await client.set('attestation_2_leaves', JSON.stringify(tree.leaves))
        await client.set('attestation_2_root', tree.root)
    } catch (error) {
        console.log(error)
    }
}

async function maintainIdentities(client: any) {
    const members = await getAllCurrentRegisteredIdentities()
    const identityTree = buildMerkleTree(members)

    console.log('Update identity tree: ')
    console.log(identityTree.root)
    console.log(JSON.stringify(identityTree.leaves))

    await client.set('identity_leaves', JSON.stringify(identityTree.leaves))
    await client.set('identity_root', identityTree.root)
}

async function updateMaintainanceTimestamp(client: any) {
    const date = new Date()
    try {
        await client.set('latest_update', date.getUTCSeconds())
    } catch (error) {
        console.log(error)
    }
}

async function main() {
    const client = createClient({ url: REDIS_URL })
    client.on('error', (err) => console.log('Redis Client Error', err))
    await client.connect()
    console.log('Redis client connected succesfully.')

    setInterval(() => {
        maintainReputation1(client)
        maintainReputation2(client)
        maintainIdentities(client)
        updateMaintainanceTimestamp(client)
    }, 30000)
}

main()
