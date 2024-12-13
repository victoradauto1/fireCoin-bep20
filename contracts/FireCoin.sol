//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FireCoin is ERC20 {

    address private _owner;
    uint256 private _mintAmount = 0;
    uint64 private _mintDelay = 60 * 60 * 24; //1 day in seconds

    mapping(address => uint256) private _nextMint;

    constructor() ERC20("FireCoinPro2", "FRCP2") {
        _owner = msg.sender;
        _mint(msg.sender, 10000000*10**18);
    }

    function mint(address to)public restricted {
        require(_mintAmount > 0 , "Minting is not enabled.");
        require(block.timestamp > _nextMint[to], "You cannot mint twice in a row.");
        _mint(to, _mintAmount);
        _nextMint[to] = block.timestamp + _mintDelay;
    }

    function setMintingAmount(uint newAmount) public restricted{
        _mintAmount = newAmount;
    }

    function setMintDelay(uint64 newDelayInSeconds) public restricted(){
        _mintDelay = newDelayInSeconds;
    }

    modifier restricted(){
        require(_owner == msg.sender, "Your do not have permission.");
        _;
    }
}