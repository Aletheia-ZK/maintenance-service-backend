"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCurrentRegisteredIdentities = exports.updateRoot = exports.buildMerkleTree = void 0;
const incremental_merkle_tree_1 = require("@zk-kit/incremental-merkle-tree");
//@ts-ignore
const circomlibjs_1 = require("circomlibjs"); // v0.0.8
const dotenv_1 = __importDefault(require("dotenv"));
const ethers_1 = require("ethers");
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const api_1 = require("./api");
const Aletheia_json_1 = __importDefault(require("../artifacts/contracts/Aletheia.sol/Aletheia.json"));
const MERKLE_TREE_HEIGHT = parseInt(process.env.MERKLE_TREE_HEIGHT);
const ALETHEIA_CONTRACT_ADDRESS = process.env.ALETHEIA_CONTRACT_ADDRESS;
const PROVIDER_URL = process.env.PROVIDER_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
let nonce = 0;
initNonce();
function buildMerkleTree(addresses) {
    const leaves = addresses;
    const tree = new incremental_merkle_tree_1.IncrementalMerkleTree(circomlibjs_1.poseidon, MERKLE_TREE_HEIGHT, 0, 2);
    for (const leaf of leaves) {
        tree.insert(leaf);
    }
    return tree;
}
exports.buildMerkleTree = buildMerkleTree;
function getWallet() {
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(PROVIDER_URL);
    const wallet = new ethers_1.ethers.Wallet(PRIVATE_KEY, provider);
    return wallet;
}
async function getNonce() {
    const wallet = getWallet();
    const nonce = await wallet.getTransactionCount('pending');
    return nonce;
}
async function initNonce() {
    nonce = await getNonce();
}
function getContract() {
    const wallet = getWallet();
    const contract = new ethers_1.ethers.Contract(ALETHEIA_CONTRACT_ADDRESS, Aletheia_json_1.default['abi'], wallet);
    return contract;
}
async function updateRoot(rootKey, rootValue) {
    nonce = nonce + 1;
    const contract = getContract();
    try {
        const transaction = await contract.setAttestationRoot(rootKey, rootValue, {
            nonce: nonce,
        });
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
            console.log('error');
        }
    }
    catch {
        nonce = nonce + 1;
        console.log('Reputation root was not updated. Increasing nonce and try again.');
    }
}
exports.updateRoot = updateRoot;
async function decodeEventData(txs) {
    const iface = new ethers_1.ethers.utils.Interface(Aletheia_json_1.default.abi);
    const txsDecoded = txs.map((tx, index) => {
        const log_events = tx['log_events'][0];
        let decoded_event;
        try {
            decoded_event = iface.parseLog({
                topics: log_events['raw_log_topics'],
                data: log_events['raw_log_data'],
            });
        }
        catch (error) {
            // console.log(error)
            // console.log(index)
        }
        return {
            ...tx,
            decoded_events: decoded_event,
        };
    });
    const txsDecodedNoError = txsDecoded.filter((tx) => {
        return tx['decoded_events'];
    });
    return txsDecodedNoError;
    // console.log(txsDecoded[0]['decoded_events'])
}
function paginatedFetch(contractAddress, pageNumber = 0, previousResponse = []) {
    return (0, api_1.getTransactionsFromContract)(contractAddress, 50, pageNumber).then((newResponse) => {
        const response = [...previousResponse, ...newResponse]; // Combine the two arrays
        if (newResponse.length !== 0) {
            pageNumber++;
            return paginatedFetch(contractAddress, pageNumber, response);
        }
        return response;
    });
}
async function getAllTransactionsFromContract(contractAddress) {
    const txs = await paginatedFetch(ALETHEIA_CONTRACT_ADDRESS);
    return txs;
}
async function getAllCurrentRegisteredIdentities() {
    const txs = await getAllTransactionsFromContract(ALETHEIA_CONTRACT_ADDRESS);
    const decodedTxs = await decodeEventData(txs);
    const membersAdded = decodedTxs
        .filter((tx) => {
        return tx['decoded_events']['name'] == 'MemberAdded';
    })
        .map((tx) => {
        return tx['decoded_events']['args']['identityCommitment'].toString();
    });
    // const membersRemoved = decodedTxs.filter((tx: any) => {
    //     return tx['decoded_events']['name'] == 'MemberRemoved'
    // })
    return membersAdded;
}
exports.getAllCurrentRegisteredIdentities = getAllCurrentRegisteredIdentities;
