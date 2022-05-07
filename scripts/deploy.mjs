// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat'

// https://github.com/joaopedrocyrino/Semaphore/blob/master/tasks/deploy-semaphore-voting.ts

// import '@zk-kit/incremental-merkle-tree.sol/contracts/IncrementalBinaryTree.sol'

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');
    const [deployer] = await hre.ethers.getSigners()

    console.log('Deploying contracts with the account:', deployer.address)

    console.log('Account balance:', (await deployer.getBalance()).toString())

    // import "@zk-kit/incremental-merkle-tree.sol/contracts/IncrementalBinaryTree.sol
    // const LibraryPoseidon = await hre.ethers.getContractFactory('PoseidonT3')
    // const libraryPoseidonDeployed = await LibraryPoseidon.deploy()
    // await libraryPoseidonDeployed.deployed()

    // const LibraryBT = await hre.ethers.getContractFactory(
    //     'IncrementalBinaryTree',
    //     {
    //         libraries: {
    //             PoseidonT3: libraryPoseidonDeployed.address,
    //         },
    //     }
    // )
    // const libraryBTDeployed = await LibraryBT.deploy()
    // await libraryBTDeployed.deployed()

    // // We get the contract to deploy
    // const Aletheia = await hre.ethers.getContractFactory('Aletheia', {
    //     libraries: {
    //         IncrementalBinaryTree: libraryBTDeployed.address,
    //     },
    // })
    const Aletheia = await hre.ethers.getContractFactory('Aletheia')
    const aletheia = await Aletheia.deploy()
    await aletheia.deployed()

    console.log('Aletheia deployed to:', aletheia.address)
    // console.log('Poseidon deployed to:', libraryPoseidonDeployed.address)
    // console.log('IncrementalMerkleTree deployed to:', libraryBTDeployed.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
