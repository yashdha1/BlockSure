// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Insurance {
    address public admin;
    mapping(address => uint256) public userBalances;
    mapping(address => bool) public approvedClaims;

    event PolicyPurchased(address indexed user, uint256 amount);
    event InsuranceClaimed(address indexed user, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor() {
        admin = msg.sender;
    }
 
    function buyPolicy() external payable {
        require(msg.value > 0, "Investment must be greater than 0");
        userBalances[msg.sender] += msg.value;
        emit PolicyPurchased(msg.sender, msg.value);
    }
 
    function approveClaim(address user) external onlyAdmin {
        approvedClaims[user] = true;
    } 
    function claimInsurance() external {
        require(approvedClaims[msg.sender], "Claim not approved");
        require(userBalances[msg.sender] > 0, "No funds available");

        uint256 amount = userBalances[msg.sender];
        userBalances[msg.sender] = 0;
        approvedClaims[msg.sender] = false; 

        payable(msg.sender).transfer(amount);
        emit InsuranceClaimed(msg.sender, amount);
    } 
    receive() external payable {}
}
