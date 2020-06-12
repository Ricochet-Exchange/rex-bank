pragma solidity ^0.5.0;

import "./BankStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "usingtellor/contracts/UsingTellor.sol";


contract Bank is BankStorage, Ownable, UsingTellor {

  event ReserveDeposit(uint256 amount);
  event ReserveWithdraw(address token, uint256 amount);
  event VaultDeposit(address owner, uint256 amount);
  event VaultBorrow(address borrower, uint256 amount);
  event VaultRepay(address borrower, uint256 amount);
  event VaultWithdraw(address borrower);

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
    address oracleContract ) public UsingTellor(oracleContract) {
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

  function reserveDeposit(uint256 amount) external onlyOwner {
    require(IERC20(_debtToken).transferFrom(msg.sender, address(this), amount));
    _debtReserveBalance += amount;
    emit ReserveDeposit(amount);
  }

  //for reserveWithdraw or reserveWithdrawCollateral, should it not update the price and make sure it's collateralized?
  function reserveWithdraw(uint256 amount) external onlyOwner {
    require(_debtReserveBalance >= amount, "NOT ENOUGH DEBT TOKENS IN RESERVE");
    require(IERC20(_debtToken).transfer(msg.sender, amount));
    _debtReserveBalance -= amount;
    emit ReserveWithdraw(_debtToken, amount);
  }

  function reserveWithdrawCollateral(uint256 amount) external onlyOwner {
    require(_collateralReserveBalance >= amount, "NOT ENOUGH COLLATERAL IN RESERVE");
    require(IERC20(_collateralToken).transfer(msg.sender, amount));
    _collateralReserveBalance -= amount;
    emit ReserveWithdraw(_collateralToken, amount);
  }

  function updatePrice() external{
    bool ifRetrieve;
    uint256 _timestampRetrieved;
    (ifRetrieve, _debtTokenPrice, _timestampRetrieved) = getDataBefore(_debtTokenTellorRequestId,now - 1 hours);
    (ifRetrieve, _collateralTokenPrice, _timestampRetrieved) = getDataBefore(_collateralTokenTellorRequestId,now - 1 hours);
  }


  //should you make it so anyone can liquidate? 
  function liquidate(address vaultOwner) external onlyOwner {
    // Require undercollateralization
    require(_getVaultCollateralizationRatio(vaultOwner) < _collateralizationRatio * 100, "VAULT NOT UNDERCOLLATERALIZED");
    // TODO: Confirm this is calculated correctly
    uint256 debtOwned = vaults[vaultOwner].debtAmount + (vaults[vaultOwner].debtAmount * 100 * _liquidationPenalty / 100 / 100);
    uint256 collateralToLiquidate = debtOwned * _debtTokenPrice / _collateralTokenPrice;
    _collateralReserveBalance +=  collateralToLiquidate;
    vaults[vaultOwner].collateralAmount -= collateralToLiquidate;
    vaults[vaultOwner].debtAmount = 0;
  }


  function vaultDeposit(uint256 amount) external {
    //why does it have to be zero? can you not add?
    require(vaults[msg.sender].collateralAmount == 0, "ALREADY DEPOSITED COLLATERAL");
    require(IERC20(_collateralToken).transferFrom(msg.sender, address(this), amount));
    vaults[msg.sender].collateralAmount += amount;
    emit VaultDeposit(msg.sender, amount);

  }

  function vaultBorrow(uint256 amount) external {
    require(vaults[msg.sender].debtAmount == 0, "ALREADY BORROWING");//can you not borrow more?
    require(vaults[msg.sender].collateralAmount != 0, "NO COLLATERAL");//isn't this require reduntant considering the maxBorrow/_debtReserveBalance statements?
    uint256 maxBorrow = vaults[msg.sender].collateralAmount * _collateralTokenPrice / _debtTokenPrice / _collateralizationRatio * 100;
    maxBorrow *= _debtTokenPriceGranularity;
    maxBorrow /= _collateralTokenPriceGranularity;
    require(amount < maxBorrow, "NOT ENOUGH COLLATERAL");
    require(amount <= _debtReserveBalance, "NOT ENOUGH RESERVES");
    vaults[msg.sender].debtAmount += amount + ((amount * _originationFee) / 100);
    _debtReserveBalance -= amount;
    require(IERC20(_debtToken).transfer(msg.sender, amount));
    vaults[msg.sender].createdAt = block.timestamp;
    emit VaultBorrow(msg.sender, amount);
  }

  function vaultRepay(uint256 amount) external {
    vaults[msg.sender].debtAmount = getVaultRepayAmount();
    require(amount <= vaults[msg.sender].debtAmount, "CANNOT REPAY MORE THAN OWED");
    require(IERC20(_debtToken).transferFrom(msg.sender, address(this), amount));
    vaults[msg.sender].debtAmount -= amount;
    _debtReserveBalance += amount;
    uint256 periodsElapsed = (block.timestamp / _period) - (vaults[msg.sender].createdAt / _period);
    vaults[msg.sender].createdAt += periodsElapsed * _period;
    emit VaultRepay(msg.sender, amount);
  }

  function vaultWithdraw() external {
    require(vaults[msg.sender].debtAmount == 0, "DEBT OWED"); //should you not be able to just withdraw part?  
    require(IERC20(_collateralToken).transfer(msg.sender, vaults[msg.sender].collateralAmount));
    vaults[msg.sender].collateralAmount = 0;
    emit VaultWithdraw(msg.sender);
  }

}
