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

  function setBankAddress(address _bankAddress) public onlyOwner {
    bankAddress = _bankAddress;
  }

  function createBank(
    uint256 interestRate,
    uint256 originationFee,
    uint256 collateralizationRatio,
    uint256 liquidationPenalty,
    uint256 period) public returns(address) {

    address clone = createClone(bankAddress);
    Bank(clone).init(msg.sender, interestRate, originationFee, collateralizationRatio, liquidationPenalty, period);
    banks.push(clone);
    emit BankCreated(clone);
  }

  function getBankAddresses() public view returns(address [] memory){
    return banks;
  }

}
