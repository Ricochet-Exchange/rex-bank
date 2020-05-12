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
      return $.getJSON('USDToken.json', function(dt) {
        var DT = dt;
        App.contracts.DT = TruffleContract(DT);
        App.contracts.DT.setProvider(App.web3Provider);
        return $.getJSON('GLDToken.json', function(ct) {
          var CT = ct;
          App.contracts.CT = TruffleContract(CT);
          App.contracts.CT.setProvider(App.web3Provider);
          return App.renderBankUI();
        });
      });
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    // Bind Customer events to buttons
    $(document).on('click', '.btn-deposit', App.handleDeposit);
    $(document).on('click', '.btn-borrow', App.handleBorrow);
    $(document).on('click', '.btn-repay', App.handleRepay);
    $(document).on('click', '.btn-withdraw', App.handleWithdraw);
    $(document).on('click', '.btn-dt-approve', App.handleDTApprove);
    $(document).on('click', '.btn-ct-approve', App.handleCTApprove);
  },

  renderBankUI: async function(owners, account) {
    var bankInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var vaultPanel = $('#vaultPanel');
      var vaultActionsPanel = $('#vaultActionsPanel');
      var reservePanel = $('#reservePanel');
      $('.input-deposit').val('');
      $('.input-borrow').val('');
      $('.input-repay').val('');
      $('.input-withdraw').val('');

      App.contracts.Bank.deployed().then(function(instance) {
        bankInstance = instance;
        console.log("Starting");

        bankInstance.getDebtTokenPrice.call().then(function(debtTokenPrice){
          bankInstance.getDebtTokenPriceGranularity.call().then(function(debtTokenPriceGranularity){
            console.log("Reserve debtTokenPrice: " + debtTokenPrice.toString());
            reservePanel.find('.debtTokenPrice').text(debtTokenPrice/debtTokenPriceGranularity);
          });
        });
        bankInstance.getCollateralTokenPrice.call().then(function(collateralTokenPrice){
          bankInstance.getCollateralTokenPriceGranularity.call().then(function(collateralTokenPriceGranularity){
            console.log("Reserve collateralTokenPrice: " + collateralTokenPrice.toString());
            reservePanel.find('.collateralTokenPrice').text(collateralTokenPrice/collateralTokenPriceGranularity);
          });
        });
        bankInstance.getInterestRate.call().then(function(interestRate){
          console.log("Reserve interstRate: " + interestRate.toString());
          reservePanel.find('.interstRate').text(interestRate);
        });
        bankInstance.getOriginationFee.call().then(function(originationFee){
          console.log("Reserve originationFee: " + originationFee.toString());
          reservePanel.find('.originationFee').text(originationFee);
        });
        bankInstance.getCollateralizationRatio.call().then(function(collateralizationRatio){
          console.log("Reserve collateralizationRatio: " + collateralizationRatio.toString());
          reservePanel.find('.collateralizationRatio').text(collateralizationRatio);
        });
        bankInstance.getLiquidationPenalty.call().then(function(liquidationPenalty){
          console.log("Reserve liquidationPenalty: " + liquidationPenalty.toString());
          reservePanel.find('.liquidationPenalty').text(liquidationPenalty);
        });
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

      App.contracts.DT.deployed().then(function(instance) {
        instance.balanceOf(account).then(function(dtBalance){
          console.log("Debt Token Balance: " + (1.0*dtBalance)/1e18);
          vaultActionsPanel.find('.debtTokenBalance').text((1.0*dtBalance)/1e18);
        });
      }).catch(function(err) {
        console.log(err);
      });

      App.contracts.CT.deployed().then(function(instance) {
        instance.balanceOf(account).then(function(ctBalance){
          console.log("Collateral Token Balance: " + ctBalance.toString());
          vaultActionsPanel.find('.collateralTokenBalance').text(Math.round((1.0*ctBalance)/1e18, 4));
        });
      }).catch(function(err) {
        console.log(err);
      })

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
        return bankInstance.vaultDeposit(depositAmount*1e18, {from: account});
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
        console.log("Borrowing USDT:" + borrowAmount*1e18);
        return bankInstance.vaultBorrow(borrowAmount*1e18, {from: account});
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
        console.log("Repaying USDT:" + repayAmount*1e18);
        return bankInstance.vaultRepay(repayAmount*1e18, {from: account});
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

  handleDTApprove: function(event) {
    event.preventDefault();

    var approveAmt = parseFloat($('.input-dt-approve').val());
    console.log(approveAmt)
    var bankInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Bank.deployed().then(function(bank) {
        App.contracts.DT.deployed().then(function(instance) {
          return instance.approve(bank.address, approveAmt*1e18, {from: account});
        }).then(function(results) {
          App.renderBankUI();
          console.log(results);
        }).catch(function(err) {
          console.log(err.message);
        });
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleCTApprove: function(event) {
    event.preventDefault();

    var approveAmt = parseFloat($('.input-ct-approve').val());
    console.log(approveAmt)
    var bankInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Bank.deployed().then(function(bank) {
        App.contracts.CT.deployed().then(function(ct) {
          console.log(bank.address)
          console.log(approveAmt*1e18)
          console.log(account)
          return ct.approve(bank.address, approveAmt*1e18, {from: account});
        }).then(function(results) {
          App.renderBankUI();
          console.log(results);
        }).catch(function(err) {
          console.log(err.message);
        });
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
