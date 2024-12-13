// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationWallet is Ownable {
    event DonationReceived(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);

    receive() external payable {
        emit DonationReceived(msg.sender, msg.value);
    }

    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Not enough balance");
        to.transfer(amount);
        emit Withdrawal(to, amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
