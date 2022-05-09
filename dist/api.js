"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfoForTokenID = exports.getTokenIDsFromContract = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const axios_1 = __importDefault(require("axios"));
//api.covalenthq.com/v1/1666700000/tokens/0xca93f983864bc015f9792a7b4d4898959471d97d/
// nft_token_ids/?quote-currency=USD&format=JSON&key=ckey_ed08ad42f3b44eb6a23f78cb3c5
//  \ -H "Accept: application/json
const chainID = process.env.CHAIN_ID;
const apiKey = process.env.COVALENT_API_KEY;
function getTokenIDsFromContract(contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = new URLSearchParams();
            params.append('quote-currency', 'USD');
            params.append('format', 'JSON');
            params.append('key', apiKey);
            const response = yield axios_1.default.get(`https://api.covalenthq.com/v1/${chainID}/tokens/${contractAddress}/nft_token_ids/`, { params });
            return response.data.data.items;
        }
        catch (error) {
            // console.log(error)
            throw error;
        }
    });
}
exports.getTokenIDsFromContract = getTokenIDsFromContract;
function getInfoForTokenID(contractAddress, tokenID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = new URLSearchParams();
            params.append('quote-currency', 'USD');
            params.append('format', 'JSON');
            params.append('key', apiKey);
            const response = yield axios_1.default.get(`https://api.covalenthq.com/v1/${chainID}/tokens/${contractAddress}/nft_metadata/${tokenID}`, { params });
            return response.data.data.items;
        }
        catch (error) {
            // console.log(error)
            throw error;
        }
    });
}
exports.getInfoForTokenID = getInfoForTokenID;
