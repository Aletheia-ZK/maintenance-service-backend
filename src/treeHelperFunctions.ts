import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'
//@ts-ignore
import { poseidon } from 'circomlibjs' // v0.0.8
import dotenv from 'dotenv'
import { ethers } from 'ethers'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

import treeArtifact from '../artifacts/contracts/Athletia.sol/Athletia.json'

const MERKLE_TREE_HEIGHT = parseInt(process.env.MERKLE_TREE_HEIGHT!)
const MERKLE_TREE_CONTRACT_ADDRESS = process.env.MERKLE_TREE_CONTRACT_ADDRESS!
const PROVIDER_URL = process.env.PROVIDER_URL!
const PRIVATE_KEY = process.env.PRIVATE_KEY!

export function buildMerkleTree(addresses: string[]) {
    const leaves = addresses
    const tree = new IncrementalMerkleTree(poseidon, MERKLE_TREE_HEIGHT, 0, 2)

    for (const leaf of leaves) {
        tree.insert(leaf)
    }

    return tree
}

function getTreeContract() {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = new ethers.Contract(
        MERKLE_TREE_CONTRACT_ADDRESS,
        treeArtifact['abi'],
        wallet
    )
    return contract
}

export async function updateRoot(rootKey: string, rootValue: string) {
    const contract = getTreeContract()
    const transaction = await contract.setRoot(rootKey, rootValue)
    const transactionReceipt = await transaction.wait()
    if (transactionReceipt.status !== 1) {
        console.log('error')
    }
}
