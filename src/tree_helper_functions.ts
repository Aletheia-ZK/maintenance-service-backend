import MerkleTree from 'fixed-merkle-tree'
// import {poseidon} from './utils'
//@ts-ignore
// const poseidon = require("circomlibjs").poseidon;
import {poseidon} from 'circomlibjs'
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const MERKLE_TREE_HEIGHT = parseInt(process.env.MERKLE_TREE_HEIGHT!)

export function buildMerkleTree(addresses: string []) {
  const leaves = addresses
	const tree = new MerkleTree(MERKLE_TREE_HEIGHT,leaves, {hashFunction: poseidon})
  return tree
}