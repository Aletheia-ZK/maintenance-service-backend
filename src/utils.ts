import { ethers } from "ethers";
// @ts-ignore
import { buildPoseidon } from "circomlibjs";

const BigNumber = ethers.BigNumber

// export const poseidonHash = (data: Array<bigint>): bigint => {
//   return circomlibjs.poseidon(data);
// };

// export const poseidonHash = (items: any[]) =>  BigNumber.from(poseidon(items).toString())
// export const poseidonHash2 = (a: any, b: any) => poseidonHash([a, b])


let poseidonHasher: any;
export async function initializePoseidon() {
  if (!poseidonHasher) {
    poseidonHasher = await buildPoseidon();
  }
}
export const poseidon = (arr: string[]) =>
  poseidonHasher.F.toString(poseidonHasher(arr));

// export const poseidonK = (ar: (number | bigint | string)[]) => {
//   let cur: (number | bigint | string)[] = [];
//   for (const elt of ar) {
//     cur.push(elt);
//     if (cur.length === 16) {
//       cur = [poseidon(cur)];
//     }
//   }
//   if (cur.length === 1) return cur[0];
//   while (cur.length < 16) cur.push(0);
//   return poseidon(cur);
// };




// const FIELD_SIZE = BigNumber.from(
//   '21888242871839275222246405745257275088548364400416034343698204186575808495617',
// )

// /** Generate random number of specified byte length */
// const randomBN = (nbytes = 31) => BigNumber.from(crypto.randomBytes(nbytes))

// function getExtDataHash({
//   recipient,
//   extAmount,
//   relayer,
//   fee,
//   encryptedOutput1,
//   encryptedOutput2,
//   isL1Withdrawal,
//   l1Fee,
// }) {
//   const abi = new ethers.utils.AbiCoder()

//   const encodedData = abi.encode(
//     [
//       'tuple(address recipient,int256 extAmount,address relayer,uint256 fee,bytes encryptedOutput1,bytes encryptedOutput2,bool isL1Withdrawal,uint256 l1Fee)',
//     ],
//     [
//       {
//         recipient: toFixedHex(recipient, 20),
//         extAmount: toFixedHex(extAmount),
//         relayer: toFixedHex(relayer, 20),
//         fee: toFixedHex(fee),
//         encryptedOutput1: encryptedOutput1,
//         encryptedOutput2: encryptedOutput2,
//         isL1Withdrawal: isL1Withdrawal,
//         l1Fee: l1Fee,
//       },
//     ],
//   )
//   const hash = ethers.utils.keccak256(encodedData)
//   return BigNumber.from(hash).mod(FIELD_SIZE)
// }

// /** BigNumber to hex string of specified length */
// function toFixedHex(number, length = 32) {
//   let result =
//     '0x' +
//     (number instanceof Buffer
//       ? number.toString('hex')
//       : BigNumber.from(number).toHexString().replace('0x', '')
//     ).padStart(length * 2, '0')
//   if (result.indexOf('-') > -1) {
//     result = '-' + result.replace('-', '')
//   }
//   return result
// }

// /** Convert value into buffer of specified byte length */
// const toBuffer = (value, length) =>
//   Buffer.from(
//     BigNumber.from(value)
//       .toHexString()
//       .slice(2)
//       .padStart(length * 2, '0'),
//     'hex',
//   )

// function shuffle(array) {
//   let currentIndex = array.length
//   let randomIndex

//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex)
//     currentIndex--

//     // And swap it with the current element.
//     ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
//   }

//   return array
// }

// async function getSignerFromAddress(address) {
//   await network.provider.request({
//     method: 'hardhat_impersonateAccount',
//     params: [address],
//   })

//   return await ethers.provider.getSigner(address)
// }

// module.exports = {
//   FIELD_SIZE,
//   randomBN,
//   toFixedHex,
//   toBuffer,
//   poseidonHash,
//   poseidonHash2,
//   getExtDataHash,
//   shuffle,
//   getSignerFromAddress,
// }