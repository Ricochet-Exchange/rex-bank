pragma solidity ^0.5.0;pragma solidity ^0.5.0;

import "./Bank.sol";
import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract IBank {
  function getInterestRate() public view returns (uint256);
  function getOriginationFee() public view returns (uint256);
  function getCollateralizationRatio() public view returns (uint256);
  function getLiquidationPenalty() public view returns (uint256);
  function getDebtTokenAddress() public view returns (address);
  function getDebtTokenPrice() public view returns (uint256);
  function getDebtTokenPriceGranularity() public view returns (uint256);
  function getCollateralTokenAddress() public view returns (address);
  function getCollateralTokenPrice() public view returns (uint256);
  function getCollateralTokenPriceGranularity() public view returns (uint256);
  function getReserveBalance() public view returns (uint256);
  function getReserveCollateralBalance() public view returns (uint256);
}

contract BankFactory is Ownable, CloneFactory {

  /*Variables*/
  address [] banks;
  address public libraryAddress;

  event BankCreated(address newBankAddress);

  constructor(address _libraryAddress) public {
    libraryAddress = _libraryAddress;
  }

  function setLibraryAddress(address _libraryAddress) public onlyOwner {
    libraryAddress = _libraryAddress;
  }

  function createBank(
    uint256 interestRate,
    uint256 originationFee,
    uint256 collateralizationRatio,
    uint256 liquidationPenalty,
    uint256 period,
    address collateralToken,
    uint256 collateralTokenTellorRequestId,
    uint256 collateralTokenPriceGranularity,
    uint256 collateralTokenPrice,
    address debtToken,
    uint256 debtTokenTellorRequestId,
    uint256 debtTokenPriceGranularity,
    uint256 debtTokenPrice) public onlyOwner returns(address) {

    address clone = createClone(libraryAddress);
    Bank(clone).init(interestRate, originationFee, collateralizationRatio, liquidationPenalty, period,
                     collateralToken, collateralTokenPriceGranularity, collateralTokenPrice,
                     debtToken, debtTokenPriceGranularity, debtTokenPrice);
    banks.push(clone);
    BankCreated(clone);
    return clone;
  }

  function getBankAddresses() public view returns(address  [] memory){
    return banks;
  }

}
