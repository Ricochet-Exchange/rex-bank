// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Bank.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract BankFactory is Ownable {
    /*Variables*/
    struct BankTag {
        address bankAddress;
    }

    address public bankAddress;
    BankTag[] private _banks;

    event BankCreated(address newBankAddress, address owner);

    constructor(address _bankAddress) {
        bankAddress = _bankAddress;
        console.log("BankFactory constructor called with bankAddress: ");
        console.log(bankAddress);
    }

    function createBank(
        string memory name,
        uint256 interestRate,
        uint256 originationFee,
        uint256 collateralizationRatio,
        uint256 liquidationPenalty,
        uint256 period,
        address payable oracleAddress
    ) public returns (address) {
        console.log("Inside BankFactory.createBank. Parameters: ");
        console.log(interestRate);
        console.log(originationFee);
        console.log(period);
        console.log(oracleAddress);
        address clone = Clones.clone(bankAddress);
        Bank(clone).init(
            msg.sender,
            name,
            interestRate,
            originationFee,
            collateralizationRatio,
            liquidationPenalty,
            period,
            owner(),
            oracleAddress
        );
        BankTag memory newBankTag = BankTag(clone);
        _banks.push(newBankTag);
        emit BankCreated(clone, msg.sender);
        return clone;
    }

    function getNumberOfBanks() public view returns (uint256) {
        return _banks.length;
    }

    function getBankAddressAtIndex(uint256 index)
        public
        view
        returns (address)
    {
        BankTag storage bank = _banks[index];
        return bank.bankAddress;
    }
}
