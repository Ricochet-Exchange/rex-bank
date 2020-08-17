pragma solidity ^0.5.0;

import "./Bank.sol";
import "@optionality.io/clone-factory/contracts/CloneFactory.sol";


contract BankFactory is CommodoGovernance, CloneFactory {

  struct Distribution {
    int teamShare
    int lenderShare
    int marketMakerShare
  }

  struct Proposal {
    int yes
    int no
    bool isActive
    address proposer
    uint256 endAt
  }

  /*Variables*/
  address [] banks;
  address public bankAddress;
  address public governanceToken;
  int feeRate;
  Distribution dist;
  mapping(int => Proposal) Proposals

  event BankCreated(address newBankAddress);

  constructor(address _bankAddress, address _governanceToken) public {
    bankAddress = _bankAddress;
    governanceToken = _governanceToken;
  }

  /* Bank Admin Functions */
  function createBank(
    string memory name,
    uint256 interestRate,
    uint256 originationFee,
    uint256 collateralizationRatio,
    uint256 liquidationPenalty,
    uint256 period,
    address payable oracleAddress) public returns(address) {

    address clone = createClone(bankAddress);
    Bank(clone).init(msg.sender, name, interestRate, originationFee, collateralizationRatio, liquidationPenalty, period, oracleAddress);
    banks.push(clone);
    emit BankCreated(clone);
  }

  function getBankAddresses() public view returns(address [] memory){
    return banks;
  }

  /* Liquidity Incentive Functions */

  /* Governance Functions */
  modifier startsVote(int proposalType) {
    // require vote is inactive
    // set the vote proposer
    // make the vote active
    // transfer tokens for the vote fee to the bank owner
    _;
  }

  function proposeNewOwner(address newOwner) public {

  }

  function proposeNewBankAddress(address newBankAddress) public {

  }

  function proposeNewDistrbution(int teamShare, int lenderShare, int marketMakerShare) public {
    require(teamShare + lenderShare + marketMakerShare == 100);

  }

  function proposeNewFeeRate(int feeRate) public {
    require(feeRate >= 0);

  }

}
