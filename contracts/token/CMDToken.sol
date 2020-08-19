pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";


contract CMDToken is ERC20, ERC20Detailed {
    constructor(address tokenSafeAddress) ERC20Detailed("Commodo", "CMD", 18) public {
        _mint(tokenSafeAddress, 499000);
        _mint(msg.sender, 1000);
    }
}
