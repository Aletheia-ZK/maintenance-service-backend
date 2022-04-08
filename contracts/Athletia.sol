// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/access/Ownable.sol';

contract Athletia is Ownable {
    // store merkle tree roots for different types of reputations
    mapping(string => bytes32) public roots;

    function getRoot(string calldata name) public view returns (bytes32) {
        return roots[name];
    }

    function setRoot(string calldata name, bytes32 value) public onlyOwner {
        roots[name] = value;
    }
}
