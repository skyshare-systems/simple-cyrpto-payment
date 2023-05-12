// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentContract is Ownable {
   /**
    * Global Var
    */

   uint256 public requiredPayment = 1_000 ether;
   uint256 public requiredPaymentNative = 1 ether;

   /**
    * Modifiers
    */

   modifier validPayment(uint256 _amount) {
      require(_amount >= requiredPayment, "Not enough payment");
      _;
   }

   modifier validPaymentNative {
      require(msg.value >= requiredPaymentNative, "Not enough payment");
      _;
   }

   /**
    * Pay functions
    */

   function pay(address _token, uint256 _amount) external validPayment(_amount){
      IERC20 token = IERC20(_token);
      token.transferFrom(msg.sender, address(this), _amount);
   }

   function payNative() external payable validPaymentNative {
      payable(address(this)).transfer(msg.value);
   }

   /**
    * Withdraw functions
    */

   function withdraw(address _token) external onlyOwner {
      IERC20 token = IERC20(_token);
      token.transfer(msg.sender, token.balanceOf(address(this)));
   }

   function withdrawNative() external onlyOwner {
      payable(msg.sender).transfer(address(this).balance);
   }

   /**
    * Receive
    */

   receive() external payable{}
}