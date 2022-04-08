// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/access/Ownable.sol';

contract Athletia is Ownable {
    event RootChanged(string key, string value);

    // store merkle tree roots for different types of reputations
    mapping(string => string) public roots;

    function getRoot(string calldata name) public view returns (string memory) {
        return roots[name];
    }

    function setRoot(string calldata name, string calldata value)
        public
        onlyOwner
    {
        roots[name] = value;
        emit RootChanged(name, value);
    }
}
