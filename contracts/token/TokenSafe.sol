pragma solidity ^0.5.0;

import "@openzeppelin/contracts/drafts/TokenVesting.sol";
//import "./ITokenSafe.sol";

contract TokenSafe is TokenVesting {
    constructor(address beneficiary, uint256 start) TokenVesting(beneficiary, start, 0, 43200000, false) public {
        renounceOwnership();
    }
}
