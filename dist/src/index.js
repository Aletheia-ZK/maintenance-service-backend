"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reputation1_1 = require("./reputations/reputation1");
const reputation2_1 = require("./reputations/reputation2");
const utils_1 = require("./utils");
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("redis");
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const REDIS_URL = process.env.REDIS_URL;
async function maintainReputation1(client) {
    console.log('Check for updates on reputation 1 merkle tree...');
    try {
        // get pub addresses of everybody who fulfills reputation 1
        const reputation1Holders = await (0, reputation1_1.getReputationHolders)();
        console.log('Number of reputation 1 users: ', reputation1Holders.length);
        // create merkle tree with poseidon hash function
        const tree = (0, utils_1.buildMerkleTree)(reputation1Holders);
        console.log('New root for reputation 1:', tree.root);
        // update root in smart contract
        // console.log('Update root in contract')
        console.log('New root: ', tree.root.toString());
        (0, utils_1.updateRoot)('reputation_1', tree.root.toString());
        // update values in redis
        // console.log('Update values in Redis')
        await client.set('attestation_1_leaves', JSON.stringify(tree.leaves));
        await client.set('attestation_1_root', tree.root);
    }
    catch (error) {
        console.log(error);
    }
}
async function maintainReputation2(client) {
    console.log('Check for updates on reputation 2 merkle tree...');
    try {
        // get pub addresses of everybody who fulfills reputation 1
        const reputation2Holders = await (0, reputation2_1.getReputationHolders)();
        console.log('Number of reputation 2 users: ', reputation2Holders.length);
        // create merkle tree with poseidon hash function
        const tree = (0, utils_1.buildMerkleTree)(reputation2Holders);
        // console.log('New root:', tree.root)
        // update root in smart contract
        // console.log('Update root in contract')
        console.log('New root for reputation 2: ', tree.root.toString());
        (0, utils_1.updateRoot)('reputation_2', tree.root.toString());
        // console.log('Tree leaves: ', JSON.stringify(tree.leaves))
        // update values in redis
        // console.log('Update values in Redis')
        await client.set('attestation_2_leaves', JSON.stringify(tree.leaves));
        await client.set('attestation_2_root', tree.root);
    }
    catch (error) {
        console.log(error);
    }
}
async function maintainIdentities(client) {
    const members = await (0, utils_1.getAllCurrentRegisteredIdentities)();
    const identityTree = (0, utils_1.buildMerkleTree)(members);
    console.log('Update identity tree: ');
    console.log(identityTree.root);
    await client.set('identity_leaves', JSON.stringify(identityTree.leaves));
    await client.set('identity_root', identityTree.root);
}
async function updateMaintainanceTimestamp(client) {
    const date = new Date();
    try {
        await client.set('latest_update', date.getUTCSeconds());
    }
    catch (error) {
        console.log(error);
    }
}
async function main() {
    const client = (0, redis_1.createClient)({ url: REDIS_URL });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    console.log('Redis client connected succesfully.');
    setInterval(() => {
        maintainReputation1(client);
        maintainReputation2(client);
        maintainIdentities(client);
        updateMaintainanceTimestamp(client);
    }, 30000);
}
main();
