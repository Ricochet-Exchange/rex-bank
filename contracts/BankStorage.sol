pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import '../node_modules/usingtellor/contracts/UsingTellor.sol';


contract BankStorage{

  // TODO: Refactor into struct
  address _collateralToken;
  uint256 _collateralTokenPrice;
  uint256 _collateralTokenPriceGranularity;
  uint256 _collateralTokenTellorRequestId;
  uint256 _collateralReserveBalance;

  address _debtToken;
  uint256 _debtTokenPrice;
  uint256 _debtTokenPriceGranularity;
  uint256 _debtTokenTellorRequestId;
  uint256 _debtReserveBalance;

  uint256 _interestRate;
  uint256 _originationFee;
  uint256 _collateralizationRatio;
  uint256 _liquidationPenalty;

  address _oracleContract;

  uint256 _period = 86400; // One day

  struct Vault {
    uint256 collateralAmount;
    uint256 debtAmount;
    uint256 createdAt;
  }

  mapping (address => Vault) public vaults;

  /////////////////////
  // SYSTEM PROPERTIES
  /////////////////////

  function getInterestRate() public view returns (uint256) {
    return _interestRate;
  }


  function getOriginationFee() public view returns (uint256) {
    return _originationFee;
  }

  function getCollateralizationRatio() public view returns (uint256) {
    return _collateralizationRatio;
  }

  function getLiquidationPenalty() public view returns (uint256) {
    return _liquidationPenalty;
  }

  function getDebtTokenPrice() public view returns (uint256) {
    return _debtTokenPrice;
  }

  function getDebtTokenPriceGranularity() public view returns (uint256) {
    return _debtTokenPriceGranularity;
  }

  function getCollateralTokenPrice() public view returns (uint256) {
    return _collateralTokenPrice;
  }

  function getCollateralTokenPriceGranularity() public view returns (uint256) {
    return _collateralTokenPriceGranularity;
  }


  /////////////////////
  // RESERVE MANAGEMENT
  /////////////////////

  function getReserveBalance() public view returns (uint256) {
    return _debtReserveBalance;
  }

  function getReserveCollateralBalance() public view returns (uint256) {
    return _collateralReserveBalance;
  }


  function getVaultCollateralAmount() public view returns (uint256) {
    return vaults[msg.sender].collateralAmount;
  }

  function getVaultDebtAmount() public view returns (uint256) {
    return vaults[msg.sender].debtAmount;
  }


  //I think there's a smarter way to do this than a loop...
  function getVaultRepayAmount() public view returns (uint256 principal) {
    principal = vaults[msg.sender].debtAmount;
    for (uint256 i = vaults[msg.sender].createdAt / _period; i < block.timestamp / _period; i++)
      principal += principal * _interestRate / 100 / 365;
  }

  function getVaultCollateralizationRatio(address vaultOwner) public view returns (uint256) {
    if(vaults[vaultOwner].debtAmount == 0 ){
      return 0;
    } else {
      return _percent(vaults[vaultOwner].collateralAmount * _collateralTokenPrice * 1000 / _collateralTokenPriceGranularity,
                      vaults[vaultOwner].debtAmount * _debtTokenPrice * 1000 / _debtTokenPriceGranularity,
                      4);
    }
  }

  function _percent(uint numerator, uint denominator, uint precision) private pure returns(uint256 _quotient) {
        _quotient =  ((numerator * 10 ** (precision+1) / denominator) + 5) / 10;
  }


}
