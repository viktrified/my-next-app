// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import './lib/Events.sol';
import './lib/Errors.sol';

contract KWAG {
    string public name;
    string public symbol; 
    uint8 public decimals; 
    uint public totalSupply; 
    address public owner;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowances;

    constructor() {
        owner = msg.sender;
        name = "Kwagarelly Token";
        symbol = "KWAG";
        decimals = 18;
        totalSupply = 1000000 * 10**decimals;
        balances[owner] = totalSupply;
    }

   function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function transfer(address to, uint256 value) external returns (bool) {
        if (balances[msg.sender] < value) revert Errors.InsufficientBalance(balances[msg.sender], value);

        balances[msg.sender] -= value;
        balances[to] += value;
        emit Events.Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        if (balances[msg.sender] < value) revert Errors.InsufficientBalance(balances[msg.sender], value);

        allowances[msg.sender][spender] = value;
        emit Events.Approval(msg.sender, spender, value);
        return true;
    }

    function allowance(address _owner, address spender) external view returns (uint256) {
        return allowances[_owner][spender];
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        if (balances[from] < value) revert Errors.InsufficientBalance(balances[from], value);
        if (allowances[from][msg.sender] < value) revert Errors.InsufficientAllowance(balances[from], allowances[from][msg.sender], value);

        allowances[from][msg.sender] -= value;
        balances[from] -= value;
        balances[to] += value;

        emit Events.Transfer(from, to, value);
        return true;
    }
}
