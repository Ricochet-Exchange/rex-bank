pragma solidity ^0.5.0;

import "./BankStorage.sol";
//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "usingtellor/contracts/UsingTellor.sol";

/**
* @title Bank
* This contract allows the owner to deposit reserves(debt token), earn interest and
* origination fees from users that borrow against their collateral.
* The oracle for Bank is Tellor.
*/
interface IBank {

  /*Functions*/
  /**
  * @dev Returns the owner of the bank
  */
  function owner() external view returns (address);

  /**
  * @dev This function sets the fundamental parameters for the bank
  *      and assigns the first admin
  */
  function init(
    address creator,
    string calldata bankName,
    uint256 interestRate,
    uint256 originationFee,
    uint256 collateralizationRatio,
    uint256 liquidationPenalty,
    uint256 period,
    address payable oracleContract) external;

  /**
  * @dev This function sets the collateral token properties, only callable one time
  */
  function setCollateral(
    address collateralToken,
    uint256 collateralTokenTellorRequestId,
    uint256 collateralTokenPriceGranularity,
    uint256 collateralTokenPrice) external;

  /**
  * @dev This function sets the debt token properties, only callable one time
  */
  function setDebt(
    address debtToken,
    uint256 debtTokenTellorRequestId,
    uint256 debtTokenPriceGranularity,
    uint256 debtTokenPrice) external;

  /**
  * @dev This function allows the Bank owner to deposit the reserve (debt tokens)
  * @param amount is the amount to deposit
  */
  function reserveDeposit(uint256 amount) external;

  /**
  * @dev This function allows the Bank owner to withdraw the reserve (debt tokens)
  * @param amount is the amount to withdraw
  */
  function reserveWithdraw(uint256 amount) external;

  /**
  * @dev This function allows the user to withdraw their collateral
  * @param amount is the amount to withdraw
  */
  function reserveWithdrawCollateral(uint256 amount) external;

  /**
  * @dev Use this function to get and update the price for the collateral token
  * using the Tellor Oracle.
  */
  function updateCollateralPrice() external;

  /**
  * @dev Use this function to get and update the price for the debt token
  * using the Tellor Oracle.
  */
  function updateDebtPrice() external;

  /**
  * @dev Anyone can use this function to liquidate a vault's debt,
  * the bank admins gets the collateral liquidated
  * @param vaultOwner is the user the bank admins wants to liquidate
  */
  function liquidate(address vaultOwner) external;


  /**
  * @dev Use this function to allow users to deposit collateral to the vault
  * @param amount is the collateral amount
  */
  function vaultDeposit(uint256 amount) external;
  /**
  * @dev Use this function to allow users to borrow against their collateral
  * @param amount to borrow
  */
  function vaultBorrow(uint256 amount) external;

  /**
  * @dev This function allows users to pay the interest and origination fee to the
  *  vault before being able to withdraw
  * @param amount owed
  */
  function vaultRepay(uint256 amount) external;
  /**
  * @dev Allows users to withdraw their collateral from the vault
  */
  function vaultWithdraw(uint256 amount) external;

}
