/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

// Replace this private key with your Harmony account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY

module.exports = {
    solidity: '0.8.0',
    networks: {
        testnet: {
            url: `https://api.s0.b.hmny.io`,
            accounts: [`0x${WALLET_PRIVATE_KEY}`],
        },
        mainnet: {
            url: `https://api.harmony.one`,
            accounts: [`0x${WALLET_PRIVATE_KEY}`],
        },
    },
}
