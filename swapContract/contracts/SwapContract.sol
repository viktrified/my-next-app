// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapContract {
    address public owner;
    address public tokenKWAG;
    address public tokenBLT;

    struct Swapper {
        bool hasSwaped;
        uint numberOfSwaps;
    }

    mapping(address => Swapper) swappers;

    error InsufficientKWAG(address caller, uint amount);
    error InsufficientBLT(address caller, uint amount);

    constructor(address _tokenKWAG, address _tokenBLT) {
        tokenKWAG = _tokenKWAG;
        tokenBLT = _tokenBLT;
        owner = msg.sender;
    }

    function KWAGToBLT(uint _amountKWAG) external {
        if (IERC20(tokenKWAG).balanceOf(msg.sender) < _amountKWAG)
            revert InsufficientKWAG(msg.sender, _amountKWAG);

        IERC20(tokenKWAG).transferFrom(msg.sender, address(this), _amountKWAG);
        uint logic = _amountKWAG * 3;

        if (IERC20(tokenBLT).balanceOf(address(this)) < logic)
            revert InsufficientBLT(address(this), logic);

        IERC20(tokenBLT).transfer(msg.sender, logic);

        swappers[msg.sender].hasSwaped = true;
        swappers[msg.sender].numberOfSwaps++;
    }

    function BLTToKWAG(uint _amountBLT) external {
        if (IERC20(tokenBLT).balanceOf(msg.sender) < _amountBLT)
            revert InsufficientBLT(msg.sender, _amountBLT);

        IERC20(tokenBLT).transferFrom(msg.sender, address(this), _amountBLT);
        uint logic = _amountBLT * 2;

        if (IERC20(tokenKWAG).balanceOf(address(this)) < logic)
            revert InsufficientKWAG(address(this), logic);

        IERC20(tokenKWAG).transfer(msg.sender, logic);

        swappers[msg.sender].hasSwaped = true;
        swappers[msg.sender].numberOfSwaps++;
    }

    function swap(uint _amount, uint _token) public {}

    function getSwapper(
        address _swapper
    ) external view returns (Swapper memory) {
        return swappers[_swapper];
    }
}
