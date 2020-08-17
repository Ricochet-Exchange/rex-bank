pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


contract CommodoToken is ERC20, ERC20Detailed {

  constructor(address bankFactoryAddress) ERC20Detailed("Commodo", "CMD", 18) public {
      _mint(bankFactoryAddress, 500000 * 10^18);
  }

}
