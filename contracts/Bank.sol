pragma solidity ^0.5.0;

import "./BankStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

/**
* @title Bank
* This contract allows the owner to deposit reserves(debt token), earn interest and
* origination fees from users that borrow against their collateral.
* The oracle for Bank is Tellor.
*/
contract Bank is BankStorage, Ownable, UsingTellor {
  /*Events*/
  event ReserveDeposit(uint256 amount);
  event ReserveWithdraw(address token, uint256 amount);
  event VaultDeposit(address owner, uint256 amount);
  event VaultBorrow(address borrower, uint256 amount);
  event VaultRepay(address borrower, uint256 amount);
  event VaultWithdraw(address borrower);

  /*Constructor*/
  constructor(
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
    uint256 debtTokenPrice,
    address payable oracleContract ) public UsingTellor(oracleContract) {
    reserve.interestRate = interestRate;
    reserve.originationFee = originationFee;
    reserve.collateralizationRatio = collateralizationRatio;
    reserve.liquidationPenalty = liquidationPenalty;
    reserve.period = period;
    collateral.tokenAddress = collateralToken;
    debt.tokenAddress = debtToken;
    reserve.oracleContract = oracleContract;
    debt.price = debtTokenPrice;
    debt.priceGranularity = debtTokenPriceGranularity;
    debt.tellorRequestId = debtTokenTellorRequestId;
    collateral.price = collateralTokenPrice;
    collateral.priceGranularity = collateralTokenPriceGranularity;
    collateral.tellorRequestId = collateralTokenTellorRequestId;
  }

  /*Functions*/
  /**
  * @dev This function allows the Bank owner to deposit the reserve (debt tokens)
  * @param amount is the amount to deposit
  */
  function reserveDeposit(uint256 amount) external onlyOwner {
    require(IERC20(debt.tokenAddress).transferFrom(msg.sender, address(this), amount));
    reserve.debtBalance += amount;
    emit ReserveDeposit(amount);
  }

  /**
  * @dev This function allows the Bank owner to withdraw the reserve (debt tokens)
  * @param amount is the amount to withdraw
  */
  function reserveWithdraw(uint256 amount) external onlyOwner {
    require(reserve.debtBalance >= amount, "NOT ENOUGH DEBT TOKENS IN RESERVE");
    require(IERC20(debt.tokenAddress).transfer(msg.sender, amount));
    reserve.debtBalance -= amount;
    emit ReserveWithdraw(debt.tokenAddress, amount);
  }

  /**
  * @dev This function allows the user to withdraw their collateral
  * @param amount is the amount to withdraw
  */
  function reserveWithdrawCollateral(uint256 amount) external onlyOwner {
    require(reserve.collateralBalance >= amount, "NOT ENOUGH COLLATERAL IN RESERVE");
    require(IERC20(collateral.tokenAddress).transfer(msg.sender, amount));
    reserve.collateralBalance -= amount;
    emit ReserveWithdraw(collateral.tokenAddress, amount);
  }

  /**
  * @dev Use this function to get and update the price for the collateral token
  * using the Tellor Oracle.
  */
  function updateCollateralPrice() external {
    bool ifRetrieve;
    uint256 _timestampRetrieved;
    (ifRetrieve, collateral.price, _timestampRetrieved) = getCurrentValue(collateral.tellorRequestId); //,now - 1 hours);
  }
  /**
  * @dev Use this function to get and update the price for the debt token
  * using the Tellor Oracle.
  */
  function updateDebtPrice() external {
    bool ifRetrieve;
    uint256 _timestampRetrieved;
    (ifRetrieve, debt.price, _timestampRetrieved) = getCurrentValue(debt.tellorRequestId); //,now - 1 hours);
  }

  /**
  * @dev Anyone can use this function to liquidate a vault's debt, the bank owner gets the collateral liquidated
  * @param vaultOwner is the user the bank owner wants to liquidate
  */
  function liquidate(address vaultOwner) external {
    // Require undercollateralization
    require(getVaultCollateralizationRatio(vaultOwner) < reserve.collateralizationRatio * 100, "VAULT NOT UNDERCOLLATERALIZED");
    uint256 debtOwned = vaults[vaultOwner].debtAmount + (vaults[vaultOwner].debtAmount * 100 * reserve.liquidationPenalty / 100 / 100);
    uint256 collateralToLiquidate = debtOwned * debt.price / collateral.price;
    reserve.collateralBalance +=  collateralToLiquidate;
    vaults[vaultOwner].collateralAmount -= collateralToLiquidate;
    vaults[vaultOwner].debtAmount = 0;
  }


  /**
  * @dev Use this function to allow users to deposit collateral to the vault
  * @param amount is the collateral amount
  */
  function vaultDeposit(uint256 amount) external {
    require(IERC20(collateral.tokenAddress).transferFrom(msg.sender, address(this), amount));
    vaults[msg.sender].collateralAmount += amount;
    emit VaultDeposit(msg.sender, amount);
  }

  /**
  * @dev Use this function to allow users to borrow against their collateral
  * @param amount to borrow
  */
  function vaultBorrow(uint256 amount) external {
    if (vaults[msg.sender].debtAmount != 0) {
      vaults[msg.sender].debtAmount = getVaultRepayAmount();
    }
    uint256 maxBorrow = vaults[msg.sender].collateralAmount * collateral.price / debt.price / reserve.collateralizationRatio * 100;
    maxBorrow *= debt.priceGranularity;
    maxBorrow /= collateral.priceGranularity;
    maxBorrow -= vaults[msg.sender].debtAmount;
    require(amount < maxBorrow, "NOT ENOUGH COLLATERAL");
    require(amount <= reserve.debtBalance, "NOT ENOUGH RESERVES");
    vaults[msg.sender].debtAmount += amount + ((amount * reserve.originationFee) / 100);
    vaults[msg.sender].createdAt = block.timestamp;
    reserve.debtBalance -= amount;
    require(IERC20(debt.tokenAddress).transfer(msg.sender, amount));
    emit VaultBorrow(msg.sender, amount);
  }

  /**
  * @dev This function allows users to pay the interest and origination fee to the
  *  vault before being able to withdraw
  * @param amount owed
  */
  function vaultRepay(uint256 amount) external {
    vaults[msg.sender].debtAmount = getVaultRepayAmount();
    require(amount <= vaults[msg.sender].debtAmount, "CANNOT REPAY MORE THAN OWED");//I get that they should not pay more than they owe
    //but there is no harm if they do, then just allow them to  withdraw so long as debt< 0
    require(IERC20(debt.tokenAddress).transferFrom(msg.sender, address(this), amount));
    vaults[msg.sender].debtAmount -= amount;
    reserve.debtBalance += amount;
    uint256 periodsElapsed = (block.timestamp / reserve.period) - (vaults[msg.sender].createdAt / reserve.period);
    vaults[msg.sender].createdAt += periodsElapsed * reserve.period;
    emit VaultRepay(msg.sender, amount);
  }

  /**
  * @dev Allows users to withdraw their collateral from the vault
  */
  function vaultWithdraw(uint256 amount) external {
    uint256 maxBorrowAfterWithdraw = (vaults[msg.sender].collateralAmount - amount) * collateral.price / debt.price / reserve.collateralizationRatio * 100;
    maxBorrowAfterWithdraw *= debt.priceGranularity;
    maxBorrowAfterWithdraw /= collateral.priceGranularity;
    require(vaults[msg.sender].debtAmount <= maxBorrowAfterWithdraw, "CANNOT UNDERCOLLATERALIZE VAULT");
    require(IERC20(collateral.tokenAddress).transfer(msg.sender, amount));
    vaults[msg.sender].collateralAmount -= amount;
    reserve.collateralBalance -= amount;
    emit VaultWithdraw(msg.sender);
  }

  /**
  * @dev Allows the user to get the first value for the requestId after the specified timestamp
  * @param _requestId is the requestId to look up the value for
  * @param _timestamp after which to search for first verified value
  * @return bool true if it is able to retreive a value, the value, and the value's timestamp
  */
  function getDataBefore(uint256 _requestId, uint256 _timestamp)
      public
      view
      returns (bool _ifRetrieve, uint256 _value, uint256 _timestampRetrieved)
  {
      uint256 _count = _tellorm.getNewValueCountbyRequestId(_requestId);
      if (_count > 0) {
          for (uint256 i = 1; i <= _count; i++) {
              uint256 _time = _tellorm.getTimestampbyRequestIDandIndex(_requestId, i - 1);
              if (_time <= _timestamp && _tellorm.isInDispute(_requestId,_time) == false) {
                  _timestampRetrieved = _time;
              }
          }
          if (_timestampRetrieved > 0) {
              return (true, _tellorm.retrieveData(_requestId, _timestampRetrieved), _timestampRetrieved);
          }
      }
      return (false, 0, 0);
  }

}
