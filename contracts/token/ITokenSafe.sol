pragma solidity ^0.5.0;
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

interface ITokenSafe {
    /**
     * @return the beneficiary of the tokens.
     */
    function beneficiary() external returns (address);
    /**
     * @return the start time of the token vesting.
     */
    function start() external returns (uint256);
    /**
     * @return the duration of the token vesting.
     */
    function duration() external returns (uint256);
    /**
     * @return the amount of the token released.
     */
    function released(address token) external returns (uint256);
    /**
     * @notice Transfers vested tokens to beneficiary.
     * @param token ERC20 token which is being vested
     */
    function release(IERC20 token) external;
}
