pragma solidity ^0.5.0;

import "./BankStorage.sol";
import "./ITellor.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
* @title Bank
* This contract allows the owner to deposit reserves(debt token), earn interest and
* origination fees from users that borrow against their collateral.
* The oracle for Bank is Tellor.
*/
contract Bank is BankStorage {

  address private _owner;
  address private _bankFactoryOwner;

  /*Events*/
  event ReserveDeposit(uint256 amount);
  event ReserveWithdraw(address token, uint256 amount);
  event VaultDeposit(address owner, uint256 amount);
  event VaultBorrow(address borrower, uint256 amount);
  event VaultRepay(address borrower, uint256 amount);
  event VaultWithdraw(address borrower, uint256 amount);
  event PriceUpdate(address token, uint256 price);
  event Liquidation(address borrower, uint256 debtAmount);

  /*Constructor*/
  constructor(address payable oracleContract) public {
    reserve.oracleContract = oracleContract;
  }

  /*Modifiers*/
  modifier onlyOwner() {
    require(_owner == msg.sender, "IS NOT OWNER");
    _;
  }

  /*Functions*/
  /**
  * @dev Returns the owner of the bank
  */
  function owner() public view returns (address) {
    return _owner;
  }

  /**
  * @dev This function sets the fundamental parameters for the bank
  *      and assigns the first admin
  */
  function init(
    address creator,
    string memory bankName,
    uint256 interestRate,
    uint256 originationFee,
    uint256 collateralizationRatio,
    uint256 liquidationPenalty,
    uint256 period,
    address bankFactoryOwner,
    address payable oracleContract) public  {
    require(reserve.interestRate == 0); // Ensure not init'd already
    reserve.interestRate = interestRate;
    reserve.originationFee = originationFee;
    reserve.collateralizationRatio = collateralizationRatio;
    reserve.oracleContract = oracleContract;
    reserve.liquidationPenalty = liquidationPenalty;
    reserve.period = period;
    _owner = creator; // Make the creator the first admin
    _bankFactoryOwner = bankFactoryOwner;
    name = bankName;
  }

  /**
  * @dev This function sets the collateral token properties, only callable one time
  */
  function setCollateral(
    address collateralToken,
    uint256 collateralTokenTellorRequestId,
    uint256 collateralTokenPriceGranularity,
    uint256 collateralTokenPrice) public onlyOwner {

    require(collateral.tokenAddress == address(0)); // Ensure not init'd already
    collateral.tokenAddress = collateralToken;
    collateral.price = collateralTokenPrice;
    collateral.priceGranularity = collateralTokenPriceGranularity;
    collateral.tellorRequestId = collateralTokenTellorRequestId;
  }

  /**
  * @dev This function sets the debt token properties, only callable one time
  */
  function setDebt(
    address debtToken,
    uint256 debtTokenTellorRequestId,
    uint256 debtTokenPriceGranularity,
    uint256 debtTokenPrice) public onlyOwner {

    require(debt.tokenAddress == address(0)); // Ensure not init'd already
    debt.tokenAddress = debtToken;
    debt.price = debtTokenPrice;
    debt.priceGranularity = debtTokenPriceGranularity;
    debt.tellorRequestId = debtTokenTellorRequestId;
  }

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
  *      Withdraws incur a 0.5% fee paid to the bankFactoryOwner
  * @param amount is the amount to withdraw
  */
  function reserveWithdraw(uint256 amount) external onlyOwner {
    require(reserve.debtBalance >= amount, "NOT ENOUGH DEBT TOKENS IN RESERVE");
    uint256 feeAmount = amount / 200; // Bank Factory collects 0.5% fee
    require(IERC20(debt.tokenAddress).transfer(msg.sender, amount - feeAmount));
    require(IERC20(debt.tokenAddress).transfer(_bankFactoryOwner, feeAmount));
    reserve.debtBalance -= amount;
    emit ReserveWithdraw(debt.tokenAddress, amount);
  }

  /**
  * @dev This function allows the user to withdraw their collateral
         Withdraws incur a 0.5% fee paid to the bankFactoryOwner
  * @param amount is the amount to withdraw
  */
  function reserveWithdrawCollateral(uint256 amount) external onlyOwner {
    require(reserve.collateralBalance >= amount, "NOT ENOUGH COLLATERAL IN RESERVE");
    uint256 feeAmount = amount / 200; // Bank Factory collects 0.5% fee
    require(IERC20(collateral.tokenAddress).transfer(msg.sender, amount - feeAmount));
    require(IERC20(collateral.tokenAddress).transfer(_bankFactoryOwner, feeAmount));
    reserve.collateralBalance -= amount;
    emit ReserveWithdraw(collateral.tokenAddress, amount);
  }

  /**
  * @dev Use this function to get and update the price for the collateral token
  * using the Tellor Oracle.
  */
  function updateCollateralPrice() external onlyOwner {
    bool ifRetrieve;
    (ifRetrieve, collateral.price, collateral.lastUpdatedAt) = getCurrentValue(collateral.tellorRequestId); //,now - 1 hours);
    emit PriceUpdate(collateral.tokenAddress, collateral.price);
  }

  /**
  * @dev Use this function to get and update the price for the debt token
  * using the Tellor Oracle.
  */
  function updateDebtPrice() external onlyOwner {
    bool ifRetrieve;
    (ifRetrieve, debt.price, debt.lastUpdatedAt) = getCurrentValue(debt.tellorRequestId); //,now - 1 hours);
    emit PriceUpdate(debt.tokenAddress, debt.price);
  }

  /**
  * @dev Anyone can use this function to liquidate a vault's debt,
  * the bank admins gets the collateral liquidated, liquidated collateral
  * is charged a 10% fee which gets paid to the bankFactoryOwner
  * @param vaultOwner is the user the bank admins wants to liquidate
  */
  function liquidate(address vaultOwner) external onlyOwner {
    // Require undercollateralization
    require(getVaultCollateralizationRatio(vaultOwner) < reserve.collateralizationRatio * 100, "VAULT NOT UNDERCOLLATERALIZED");
    uint256 debtOwned = vaults[vaultOwner].debtAmount + (vaults[vaultOwner].debtAmount * 100 * reserve.liquidationPenalty / 100 / 100);
    uint256 collateralToLiquidate = debtOwned * debt.price / collateral.price;

    if(collateralToLiquidate > vaults[vaultOwner].collateralAmount) {
      collateralToLiquidate = vaults[vaultOwner].collateralAmount;
    }

    uint256 feeAmount = collateralToLiquidate / 10; // Bank Factory collects 10% fee
    require(IERC20(collateral.tokenAddress).transfer(_bankFactoryOwner, feeAmount));
    reserve.collateralBalance += collateralToLiquidate - feeAmount;
    vaults[vaultOwner].collateralAmount -= collateralToLiquidate;
    reserve.debtBalance += vaults[vaultOwner].debtAmount;
    vaults[vaultOwner].debtAmount = 0;
    emit Liquidation(vaultOwner, debtOwned);
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
    vaults[msg.sender].debtAmount += amount + ((amount * reserve.originationFee) / 10000);
    if (block.timestamp - vaults[msg.sender].createdAt > reserve.period) {
      // Only adjust if more than 1 interest rate period has past
      vaults[msg.sender].createdAt = block.timestamp;
    }
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
    require(amount <= vaults[msg.sender].debtAmount, "CANNOT REPAY MORE THAN OWED");
    require(IERC20(debt.tokenAddress).transferFrom(msg.sender, address(this), amount));
    vaults[msg.sender].debtAmount -= amount;
    reserve.debtBalance += amount;
    uint256 periodsElapsed = (block.timestamp / reserve.period) - (vaults[msg.sender].createdAt / reserve.period);
    vaults[msg.sender].createdAt += periodsElapsed * reserve.period;
    emit VaultRepay(msg.sender, amount);
  }

  /**
  * @dev Allows users to withdraw their collateral from the vault
  * @param amount withdrawn
  */
  function vaultWithdraw(uint256 amount) external {
    uint256 maxBorrowAfterWithdraw = (vaults[msg.sender].collateralAmount - amount) * collateral.price / debt.price / reserve.collateralizationRatio * 100;
    maxBorrowAfterWithdraw *= debt.priceGranularity;
    maxBorrowAfterWithdraw /= collateral.priceGranularity;
    require(vaults[msg.sender].debtAmount <= maxBorrowAfterWithdraw, "CANNOT UNDERCOLLATERALIZE VAULT");
    require(IERC20(collateral.tokenAddress).transfer(msg.sender, amount));
    vaults[msg.sender].collateralAmount -= amount;
    reserve.collateralBalance -= amount;
    emit VaultWithdraw(msg.sender, amount);
  }

  function getBankFactoryOwner() public view returns (address) {
    return _bankFactoryOwner;
  }

  function setBankFactoryOwner(address newOwner) external {
    require(_bankFactoryOwner == msg.sender, "IS NOT BANK FACTORY OWNER");
    _bankFactoryOwner = newOwner;
  }

  function getCurrentValue(
    uint256 _requestId
  )
      public
      view
      returns (
          bool ifRetrieve,
          uint256 value,
          uint256 _timestampRetrieved
      )
  {
      ITellor oracle = ITellor(reserve.oracleContract);
      uint256 _count = oracle.getNewValueCountbyRequestId(_requestId);
      uint256 _time =
          oracle.getTimestampbyRequestIDandIndex(_requestId, _count - 1);
      uint256 _value = oracle.retrieveData(_requestId, _time);
      if (_value > 0) return (true, _value, _time);
      return (false, 0, _time);
  }

}
