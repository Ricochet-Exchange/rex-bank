pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


contract CommodoToken is ERC20, ERC20Detailed {

  constructor(address bankFactoryAddress) ERC20Detailed("Commodo", "CMD", 18) public {
      _mint(bankFactoryAddress, 500000 * 10^18);
  }

}


contract CommodoGovernance is Ownable {

  address bankFactoryAddress;
  address bankContractAddress;
  int feeRate;

  struct Distribution {
    int teamShare
    int lenderShare
    int borrowerShare
    int marketMakerShare
  }

  Distribution dist;

  struct Proposal {
    int yes
    int no
    bool isActive
    address proposer
  }

  mapping(int => Proposal) Proposals


  constructor(address bankFactoryAddress) ERC20Detailed("Commodo", "CMD", 18) public {
      _mint(bankFactoryAddress, 500000 * 10^18);
  }


  /*Modifiers*/
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




Voting Functions
⁃ All votes are pass/fail, (n) is the proposalType, used for voting, tallying

vote
⁃ proposalType (1,2,3, or 4)
⁃ amount
⁃ isFor

tallyVotes
⁃ proposalType (1,2,3, or 4)
}
