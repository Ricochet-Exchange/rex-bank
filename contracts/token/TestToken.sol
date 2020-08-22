pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract TestToken is ERC20, ERC20Detailed {
    using SafeMath for uint256;

    constructor(string memory name, string memory symbol) ERC20Detailed(name, symbol, 18) public {
        _mint(msg.sender, 10000000000000000000000);
    }
}
