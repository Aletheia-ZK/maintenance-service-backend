/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

require("@nomiclabs/hardhat-ethers")

// Replace this private key with your Harmony account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
    solidity: '0.8.0',
    networks: {
        testnet: {
            url: `https://api.s0.b.hmny.io`,
            accounts: [`0x${PRIVATE_KEY}`],
        },
        mainnet: {
            url: `https://api.harmony.one`,
            accounts: [`0x${PRIVATE_KEY}`],
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            // accounts: [`0x${WALLET_PRIVATE_KEY}`],
          },
    },
}
