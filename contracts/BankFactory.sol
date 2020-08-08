pragma solidity ^0.5.0;

import "./Bank.sol";
import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


contract BankFactory is Ownable, CloneFactory {

  /*Variables*/
  address [] banks;
  address public bankAddress;

  event BankCreated(address newBankAddress);

  constructor(address _bankAddress) public {
    bankAddress = _bankAddress;
  }

  function createBank(
    string memory name,
    uint256 interestRate,
    uint256 originationFee,
    uint256 collateralizationRatio,
    uint256 liquidationPenalty,
    uint256 period,
    address payable oracleAddress) public returns(address) {

    address clone = createClone(bankAddress);
    Bank(clone).init(msg.sender, name, interestRate, originationFee, collateralizationRatio, liquidationPenalty, period, oracleAddress);
    banks.push(clone);
    emit BankCreated(clone);
  }

  function getBankAddresses() public view returns(address [] memory){
    return banks;
  }

}
