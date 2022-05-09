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
// require('dotenv').config()
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const api_1 = require("./api");
// Reputation 1: ZKU Supporter NFT
// Calculate merkle tree
// Check if root changes: if yes, update root in smart contract
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const exampleContract = process.env.EXAMPLE_CONTRACT;
        try {
            const result1 = yield (0, api_1.getTokenIDsFromContract)(exampleContract);
            // console.log(result1)
            const tokens = result1.map((t) => __awaiter(this, void 0, void 0, function* () {
                return yield (0, api_1.getInfoForTokenID)(exampleContract, t.token_id);
            }));
            console.log(tokens);
        }
        catch (error) {
            console.log(error);
        }
    });
}
main();
