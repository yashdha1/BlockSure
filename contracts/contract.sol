// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Insurance {
    address public admin;
    uint256 public policyPrice = 1 ether;

    struct Policy {
        uint256 amount;
        bool claimed;
    }

    mapping(address => Policy) public policies;

    event PolicyBought(address indexed user, uint256 amount);
    event ClaimProcessed(address indexed user, uint256 amount);

    constructor() {
        admin = msg.sender; // Admin is Index 0
    }

    function buyPolicy() external payable {
        require(msg.value >= policyPrice, "Insufficient ETH sent");
        policies[msg.sender] = Policy(msg.value, false);
        emit PolicyBought(msg.sender, msg.value);
    }

    function autoClaim() external {
        Policy storage policy = policies[msg.sender];
        require(policy.amount > 0, "No active policy");
        require(!policy.claimed, "Already claimed");

        policy.claimed = true;
        payable(msg.sender).transfer(policy.amount);

        emit ClaimProcessed(msg.sender, policy.amount);
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
