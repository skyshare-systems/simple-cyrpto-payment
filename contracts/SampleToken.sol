// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleToken is Ownable, ERC20("SampleToken", "ST") {
   uint256 constant MAX_SUPPLY = 1_000_000 ether;

   constructor(uint256 _initialSupply) {
      _mint(msg.sender, _initialSupply);
   }

   function mintToken(uint256 _quantity) external onlyOwner {
      _mint(msg.sender, _quantity);
   }
}