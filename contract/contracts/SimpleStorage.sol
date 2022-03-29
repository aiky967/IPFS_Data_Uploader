// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

contract SimpleStorage {
  string ipfsHash;

  function sendHash(string memory x) public {
    ipfsHash = x;
  }

  function getHash() public view returns (string memory x) {
    return ipfsHash;
  }
}