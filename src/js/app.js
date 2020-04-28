App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    }
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/7625ad47244948058c33275dd711525f');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },


  initContract: function() {
    $.getJSON('Bank.json', function(data) {
      var BankArtifact = data;
      App.contracts.Bank = TruffleContract(BankArtifact);
      App.contracts.Bank.setProvider(App.web3Provider);
      return App.renderBankUI();
    })

    return App.bindEvents();
  },


  bindEvents: function() {
    // Bind Customer events to buttons
    $(document).on('click', '.btn-deposit', App.handleDeposit);
    $(document).on('click', '.btn-borrow', App.handleBorrow);
    $(document).on('click', '.btn-repay', App.handleRepay);
    $(document).on('click', '.btn-withdraw', App.handleWithdraw);
  },


  renderBankUI: async function(owners, account) {
    var bankInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var vaultPanel = $('#vaultPanel');
      var reservePanel = $('#reservePanel');
      $('.input-deposit').val('');
      $('.input-borrow').val('');
      $('.input-repay').val('');
      $('.input-withdraw').val('');

      App.contracts.Bank.deployed().then(function(instance) {
        bankInstance = instance;
        console.log("Starting");
        bankInstance.getReserveBalance.call().then(function(reserveBalance){
          console.log("Reserve: " + reserveBalance.toString());
          reservePanel.find('.debtReserveBalance').text(reserveBalance/1e18);
        });
        bankInstance.getVaultCollateralAmount.call().then(function(collateral){
          console.log(collateral.toString());
          vaultPanel.find('.collateralAmount').text(collateral/1e18);
        });
        bankInstance.getVaultRepayAmount.call().then(function(debt){
          console.log(debt.toString());
          vaultPanel.find('.debtAmount').text(debt/1e18);
        });
        bankInstance.getVaultCollateralizationRatio.call().then(function(ratio){
          console.log(ratio);
          vaultPanel.find('.collateralizationRatio').text((ratio/100).toString() + '%');
        });
      }).catch(function(err) {
        console.log(err);
      });

    });
  },

  handleDeposit: function(event) {
    event.preventDefault();

    var depositAmount = parseFloat($('.input-deposit').val());
    console.log(depositAmount)
    var bankInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Bank.deployed().then(function(instance) {
        bankInstance = instance;
        return bankInstance.vaultDeposit(parseInt(depositAmount*1e18), {from: account});
      }).then(function(results) {
        App.renderBankUI();
        console.log(results);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleBorrow: function(event) {
    event.preventDefault();

    var borrowAmount = parseFloat($('.input-borrow').val());
    console.log(borrowAmount)
    var bankInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Bank.deployed().then(function(instance) {
        bankInstance = instance;
        return bankInstance.vaultBorrow(parseInt(borrowAmount*1e18), {from: account});
      }).then(function(results) {
        App.renderBankUI();
        console.log(results);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleRepay: function(event) {
    event.preventDefault();

    var repayAmount = parseFloat($('.input-repay').val());
    console.log(repayAmount)
    var bankInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Bank.deployed().then(function(instance) {
        bankInstance = instance;
        return bankInstance.vaultRepay(parseInt(repayAmount*1e18), {from: account});
      }).then(function(results) {
        App.renderBankUI();
        console.log(results);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleWithdraw: function(event) {
    event.preventDefault();

    var withdrawAmount = parseFloat($('.input-withdraw').val());
    console.log(withdrawAmount)
    var bankInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Bank.deployed().then(function(instance) {
        bankInstance = instance;
        return bankInstance.vaultWithdraw({from: account});
      }).then(function(results) {
        App.renderBankUI();
        console.log(results);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
