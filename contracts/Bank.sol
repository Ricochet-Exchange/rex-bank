pragma solidity ^0.5.0;

import "./BankStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
//import "usingtellor/contracts/UsingTellor.sol";

/**
* @title Bank
* This contract allows the Bank owner to deposit reserves(debt token), earn interest and
* origination fees and users can come collateralize and borrow against their collateral.
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
    address collateralToken,
    uint256 collateralTokenTellorRequestId,
    uint256 collateralTokenPriceGranularity,
    uint256 collateralTokenPrice,
    address debtToken,
    uint256 debtTokenTellorRequestId,
    uint256 debtTokenPriceGranularity,
    uint256 debtTokenPrice,
    address payable oracleContract ) public UsingTellor(oracleContract) {
    _interestRate = interestRate;
    _originationFee = originationFee;
    _collateralizationRatio = collateralizationRatio;
    _liquidationPenalty = liquidationPenalty;
    _collateralToken = collateralToken;
    _debtToken = debtToken;
    _oracleContract = oracleContract;
    _debtTokenPrice = debtTokenPrice;
    _debtTokenPriceGranularity = debtTokenPriceGranularity;
    _debtTokenTellorRequestId = debtTokenTellorRequestId;
    _collateralTokenPrice = collateralTokenPrice;
    _collateralTokenPriceGranularity = collateralTokenPriceGranularity;
    _collateralTokenTellorRequestId = collateralTokenTellorRequestId;
  }

  /*Functions*/
  /**
  * @dev This function allows the Bank owner to deposit the reserve (debt tokens)
  * @param amount is the amount to deposit
  */
  function reserveDeposit(uint256 amount) external onlyOwner {
    require(IERC20(_debtToken).transferFrom(msg.sender, address(this), amount));
    _debtReserveBalance += amount;
    emit ReserveDeposit(amount);
  }

  /**
  * @dev This function allows the Bank owner to withdraw the reserve (debt tokens)
  * @param amount is the amount to withdraw
  */
  //for reserveWithdraw or reserveWithdrawCollateral, should it not update the price and make sure it's collateralized?
  function reserveWithdraw(uint256 amount) external onlyOwner {
    require(_debtReserveBalance >= amount, "NOT ENOUGH DEBT TOKENS IN RESERVE");
    require(IERC20(_debtToken).transfer(msg.sender, amount));
    _debtReserveBalance -= amount;
    emit ReserveWithdraw(_debtToken, amount);
  }

  /**
  * @dev This function allows the user to withdraw their collateral 
  * @param amount is the amount to withdraw
  */
  //should the _collateralReserveBalance be adjusted to remove the origination fee and interest???
  function reserveWithdrawCollateral(uint256 amount) external onlyOwner {
    require(_collateralReserveBalance >= amount, "NOT ENOUGH COLLATERAL IN RESERVE");
    require(IERC20(_collateralToken).transfer(msg.sender, amount));
    _collateralReserveBalance -= amount;
    emit ReserveWithdraw(_collateralToken, amount);
  }

  /**
  * @dev Use this function to get and update the price for the collateral and debt token
  * using the Tellor Oracle.
  */
  function updatePrice() external{
    bool ifRetrieve;
    uint256 _timestampRetrieved;
    (ifRetrieve, _debtTokenPrice, _timestampRetrieved) = getDataBefore(_debtTokenTellorRequestId,now - 1 hours);
    (ifRetrieve, _collateralTokenPrice, _timestampRetrieved) = getDataBefore(_collateralTokenTellorRequestId,now - 1 hours);
  }

  /**
  * @dev The Bank owner can use this function to liquidate debt and take the collateral
  * @param vaultOwner is the user the bank owner wants to liquidate
  */
  //should you make it so anyone can liquidate? I think this makes sense, since anyone could run the fx but
  //only the vaultowner gets the $$
  function liquidate(address vaultOwner) external onlyOwner {
    // Require undercollateralization
    require(getVaultCollateralizationRatio(vaultOwner) < _collateralizationRatio * 100, "VAULT NOT UNDERCOLLATERALIZED");
    // TODO: Confirm this is calculated correctly
    uint256 debtOwned = vaults[vaultOwner].debtAmount + (vaults[vaultOwner].debtAmount * 100 * _liquidationPenalty / 100 / 100);
    uint256 collateralToLiquidate = debtOwned * _debtTokenPrice / _collateralTokenPrice;
    _collateralReserveBalance +=  collateralToLiquidate;
    vaults[vaultOwner].collateralAmount -= collateralToLiquidate;
    vaults[vaultOwner].debtAmount = 0;
  }


  /**
  * @dev Use this function to allow users to deposit collateral to the vault
  * @param amount is the collateral amount
  */
  function vaultDeposit(uint256 amount) external {
    //why does it have to be zero? can you not add???
    require(vaults[msg.sender].collateralAmount == 0, "ALREADY DEPOSITED COLLATERAL");
    require(IERC20(_collateralToken).transferFrom(msg.sender, address(this), amount));
    vaults[msg.sender].collateralAmount += amount;
    emit VaultDeposit(msg.sender, amount);

  }

  /**
  * @dev Use this function to allow users to borrow against their collateral
  * @param amount to borrow
  */
  function vaultBorrow(uint256 amount) external {
    require(vaults[msg.sender].debtAmount == 0, "ALREADY BORROWING");//can you not borrow more?
    require(vaults[msg.sender].collateralAmount != 0, "NO COLLATERAL");//isn't this require reduntant considering the maxBorrow/_debtReserveBalance statements?
    uint256 maxBorrow = vaults[msg.sender].collateralAmount * _collateralTokenPrice / _debtTokenPrice / _collateralizationRatio * 100;
    maxBorrow *= _debtTokenPriceGranularity;
    maxBorrow /= _collateralTokenPriceGranularity;
    require(amount < maxBorrow, "NOT ENOUGH COLLATERAL");
    require(amount <= _debtReserveBalance, "NOT ENOUGH RESERVES");
    vaults[msg.sender].debtAmount += amount + ((amount * _originationFee) / 100);
    vaults[msg.sender].createdAt = block.timestamp;//Probably no re-entrancy risk but in general the transfer should happen at the end
    _debtReserveBalance -= amount;
    require(IERC20(_debtToken).transfer(msg.sender, amount));
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
    require(IERC20(_debtToken).transferFrom(msg.sender, address(this), amount));
    vaults[msg.sender].debtAmount -= amount;
    _debtReserveBalance += amount;
    uint256 periodsElapsed = (block.timestamp / _period) - (vaults[msg.sender].createdAt / _period);
    vaults[msg.sender].createdAt += periodsElapsed * _period;
    emit VaultRepay(msg.sender, amount);
  }

  /**
  * @dev Allows users to withdraw their collateral from the vault
  */
  function vaultWithdraw() external {
    require(vaults[msg.sender].debtAmount == 0, "DEBT OWED"); //should you not be able to just withdraw part?  
    require(IERC20(_collateralToken).transfer(msg.sender, vaults[msg.sender].collateralAmount));
    vaults[msg.sender].collateralAmount = 0;
    emit VaultWithdraw(msg.sender);
  }

}
