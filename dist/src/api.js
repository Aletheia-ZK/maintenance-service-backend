"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsFromContract = exports.getInfoForTokenID = exports.getTokenIDsFromContract = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const axios_1 = __importDefault(require("axios"));
const chainID = process.env.CHAIN_ID;
const apiKey = process.env.COVALENT_API_KEY;
async function getTokenIDsFromContract(contractAddress) {
    try {
        const params = new URLSearchParams();
        params.append('quote-currency', 'USD');
        params.append('format', 'JSON');
        params.append('key', apiKey);
        const response = await axios_1.default.get(`https://api.covalenthq.com/v1/${chainID}/tokens/${contractAddress}/nft_token_ids/`, { params });
        return response.data.data.items;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}
exports.getTokenIDsFromContract = getTokenIDsFromContract;
async function getInfoForTokenID(contractAddress, tokenID) {
    try {
        const params = new URLSearchParams();
        params.append('quote-currency', 'USD');
        params.append('format', 'JSON');
        params.append('key', apiKey);
        const response = await axios_1.default.get(`https://api.covalenthq.com/v1/${chainID}/tokens/${contractAddress}/nft_metadata/${tokenID}/`, { params });
        return response.data.data.items[0];
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}
exports.getInfoForTokenID = getInfoForTokenID;
async function getTransactionsFromContract(contractAddress, pageSize, pageNumber) {
    try {
        const params = new URLSearchParams();
        params.append('quote-currency', 'USD');
        params.append('format', 'JSON');
        params.append('block-signed-at-asc', 'false');
        params.append('no-logs', 'false');
        params.append('page-size', pageSize.toString());
        params.append('page-number', pageNumber.toString());
        params.append('key', apiKey);
        const response = await axios_1.default.get(`https://api.covalenthq.com/v1/${chainID}/address/${contractAddress}/transactions_v2/`, { params });
        return response.data.data.items;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}
exports.getTransactionsFromContract = getTransactionsFromContract;
