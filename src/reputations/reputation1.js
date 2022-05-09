"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReputationHolders = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const api_1 = require("../api");
// Reputation 1
// Criteria: All pub addresses who currently own the ZKU Supporter NFT
// Covalent API gives reliant results after 10 mins on Harmony
async function getReputationHolders() {
    const contractAddress = process.env.NFT_1_CONTRACT_ADDRESS;
    const existingTokenIds = await (0, api_1.getTokenIDsFromContract)(contractAddress);
    const tokensMetaInfo = [];
    for (const t of existingTokenIds) {
        const tokenMetaInfo = await (0, api_1.getInfoForTokenID)(contractAddress, t.token_id);
        tokensMetaInfo.push(tokenMetaInfo);
    }
    const reputationHolders = tokensMetaInfo.map((elm) => {
        return elm.nft_data[0].owner_address;
    });
    return Array.from(new Set(reputationHolders));
}
exports.getReputationHolders = getReputationHolders;
