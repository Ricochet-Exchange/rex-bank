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

      App.contracts.Bank.deployed().then(function(instance) {
        bankInstance = instance;
        console.log("Starting");
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


  handlePurchase: function(event) {
    event.preventDefault();

    var spaceId = parseInt($(event.target).data('id'));

    var cbInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.CryptoBunker.deployed().then(function(instance) {
        cbInstance = instance;
        return cbInstance.getSpace(spaceId);
      }).then(function(results) {
        // area,priceFinney,name,approvedPurchaser,owner
        return cbInstance.purchase(spaceId, {
          from: account,
          value: web3.toWei(results[1], 'finney') // TODO: Replace with dynamic price
        });
      }).then(function(result) {
        return App.markPurchased();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },


  handleApprovePurchase: function(event) {
    event.preventDefault();

    var spaceId = parseInt($(event.target).data('id'));
    var to = $('.panel-space').eq(spaceId).find('.input-approve').val().toLowerCase();
    console.log("Pre approval data");
    console.log(spaceId);
    var cbInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.CryptoBunker.deployed().then(function(instance) {
        cbInstance = instance;
        console.log("Approving purchase for " + spaceId +" (From " + account + " to " + to + ")");
        return cbInstance.approveForPurchase(to, spaceId, {from: account});
      }).then(function(result) {
        console.log("Approved purchase for " + spaceId +" (From " + account + " to " + to + ")");
        return;
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
