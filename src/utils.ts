import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'
//@ts-ignore
import { poseidon } from 'circomlibjs' // v0.0.8
import dotenv from 'dotenv'
import { ethers } from 'ethers'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
import { getTransactionsFromContract } from './api'

import aletheiaArtifact from '../artifacts/contracts/Aletheia.sol/Aletheia.json'

const ATTESTATION_MERKLE_TREE_HEIGHT = parseInt(
    process.env.ATTESTATION_MERKLE_TREE_HEIGHT!
)
const ALETHEIA_CONTRACT_ADDRESS = process.env.ALETHEIA_CONTRACT_ADDRESS!
const PROVIDER_URL = process.env.PROVIDER_URL!

const PRIVATE_KEY = process.env.PRIVATE_KEY!

let nonce = 0
initNonce()

export function buildMerkleTree(addresses: string[]) {
    const leaves = addresses
    const tree = new IncrementalMerkleTree(
        poseidon,
        ATTESTATION_MERKLE_TREE_HEIGHT,
        0,
        2
    )

    for (const leaf of leaves) {
        tree.insert(leaf)
    }

    return tree
}

function getWallet() {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    return wallet
}

async function getNonce() {
    const wallet = getWallet()
    const nonce = await wallet.getTransactionCount('pending')
    return nonce
}

async function initNonce() {
    nonce = await getNonce()
}

function getContract() {
    const wallet = getWallet()
    const contract = new ethers.Contract(
        ALETHEIA_CONTRACT_ADDRESS,
        aletheiaArtifact['abi'],
        wallet
    )
    return contract
}

export async function updateRoot(rootKey: string, rootValue: string) {
    nonce = nonce + 1
    const contract = getContract()
    try {
        const transaction = await contract.setAttestationRoot(
            rootKey,
            rootValue,
            {
                nonce: nonce,
            }
        )
        const transactionReceipt = await transaction.wait()
        if (transactionReceipt.status !== 1) {
            console.log('error')
        }
    } catch {
        nonce = nonce + 1
        console.log(
            'Reputation root was not updated. Increasing nonce and try again.'
        )
    }
}

async function decodeEventData(txs: any) {
    const iface = new ethers.utils.Interface(aletheiaArtifact.abi)

    const txsDecoded = txs.map((tx: any, index: number) => {
        const log_events = tx['log_events'][0]

        let decoded_event
        try {
            decoded_event = iface.parseLog({
                topics: log_events['raw_log_topics'],
                data: log_events['raw_log_data'],
            })
        } catch (error) {
            // console.log(error)
            // console.log(index)
        }

        return {
            ...tx,
            decoded_events: decoded_event,
        }
    })

    const txsDecodedNoError = txsDecoded.filter((tx: any) => {
        return tx['decoded_events']
    })

    return txsDecodedNoError

    // console.log(txsDecoded[0]['decoded_events'])
}

function paginatedFetch(
    contractAddress: string,
    pageNumber = 0,
    previousResponse: any = []
): Promise<any[]> {
    return getTransactionsFromContract(contractAddress, 50, pageNumber).then(
        (newResponse) => {
            const response = [...previousResponse, ...newResponse] // Combine the two arrays

            if (newResponse.length !== 0) {
                pageNumber++

                return paginatedFetch(contractAddress, pageNumber, response)
            }

            return response
        }
    )
}

async function getAllTransactionsFromContract(contractAddress: string) {
    const txs = await paginatedFetch(ALETHEIA_CONTRACT_ADDRESS)
    return txs
}

export async function getAllCurrentRegisteredIdentities() {
    const txs = await getAllTransactionsFromContract(ALETHEIA_CONTRACT_ADDRESS)
    const decodedTxs = await decodeEventData(txs)

    // const TxAttestationRootChanged = decodedTxs.filter((tx: any) => {
    //     return tx['decoded_events']['name'] == 'AttestationRootChanged'
    // })

    const membersAdded = decodedTxs
        .filter((tx: any) => {
            return tx['decoded_events']['name'] == 'MemberAdded'
        })
        .map((tx: any) => {
            return tx['decoded_events']['args']['identityCommitment'].toString()
        })

    // const membersRemoved = decodedTxs.filter((tx: any) => {
    //     return tx['decoded_events']['name'] == 'MemberRemoved'
    // })

    return membersAdded

    // console.log(
    //     'identityCommitment: ',
    //     membersAdded[0]['decoded_events']['args'][
    //         'identityCommitment'
    //     ].toString()
    // )

    //     eturn options.filter(function(option){
    //         return !option.assigned;
    //     }).map(function (option) {
    //         return (someNewObject);
    //     });
    // }

    // txs.map((tx: any) => {
    //     const log_events = tx['log_events'][0]
    //     const decoded_event = iface.parseLog({
    //         topics: log_events['raw_log_topics'],
    //         data: log_events['raw_log_data'],
    //     })

    //     return {
    //         ...tx,
    //         decoded_events: decoded_event,
    //     }
}
