pragma solidity ^0.5.0;

import "./IBank.sol";
import "../CloneFactory.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract BankFactory is Ownable, CloneFactory {
    using SafeMath for uint256;

    struct BankTag {
        address bankAddress;
        uint256 bankVersion;
    }

    /*Variables*/
    BankTag[] private _banks;
    address private _masterBankAddress;
    uint256 private _currentBankVersion;

    event BankCreated(address bankAddress, uint256 bankVersion);


    constructor(address bankAddress) public {
        _masterBankAddress = bankAddress;
    }

    function setMasterBankAddress(address newMasterBankAddress) internal {
        _masterBankAddress = newMasterBankAddress;
        _currentBankVersion = _currentBankVersion.add(1);
    }

    function createBank(
        string memory name,
        uint256 interestRate,
        uint256 originationFee,
        uint256 collateralizationRatio,
        uint256 liquidationPenalty,
        uint256 period,
        address payable oracleAddress) public returns (address) {

        address clone = createClone(_masterBankAddress);
        IBank(clone).init(msg.sender, name, interestRate, originationFee, collateralizationRatio, liquidationPenalty, period, oracleAddress);

        BankTag memory newBankTag = BankTag(clone, _currentBankVersion);
        _banks.push(newBankTag);
        emit BankCreated(clone, _currentBankVersion);
        return clone;
    }

    function getMasterBankAddress() public view returns (address){
        return _masterBankAddress;
    }

    function getCurrentBankVersion() public view returns (uint256){
        return _currentBankVersion;
    }

    function getBankAddressAtIndex(uint256 index) public view returns (address bankAddress, uint256 bankVersion){
        BankTag storage bankTag = _banks[index];
        return (bankTag.bankAddress, bankTag.bankVersion);
    }

    function debugSetMasterAddress(address masterAddress) public onlyOwner {
        setMasterBankAddress(masterAddress);
    }
}
