App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load spaces.
    $.getJSON('../spaces.json', function(data) {
      var spacesRow = $('#spacesRow');
      var spaceTemplate = $('#spaceTemplate');

      for (i = 0; i < data.length; i ++) {
        spaceTemplate.find('.panel-title').text(data[i].name);
        spaceTemplate.find('img').attr('src', data[i].picture);
        spaceTemplate.find('.space-address').text(data[i].address);
        spaceTemplate.find('.space-name').text(data[i].name);
        spaceTemplate.find('.space-dimensions').text(data[i].dimensions);
        spaceTemplate.find('.btn-purchase').attr('data-id', data[i].id);
        spaceTemplate.find('.input-approve').attr('data-id', data[i].id);
        spaceTemplate.find('.btn-approve').attr('data-id', data[i].id);

        spacesRow.append(spaceTemplate.html());
      }
    });

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
    $.getJSON('CryptoBunker.json', function(data) {
      var CryptoBunkerArtifact = data;
      App.contracts.CryptoBunker = TruffleContract(CryptoBunkerArtifact);
      App.contracts.CryptoBunker.setProvider(App.web3Provider);
      return App.markPurchased();
    })

    return App.bindEvents();
  },


  bindEvents: function() {
    $(document).on('click', '.btn-purchase', App.handlePurchase);
    $(document).on('click', '.btn-approve', App.handleApprovePurchase);
  },


  markPurchased: async function(owners, account) {
    var cbInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.CryptoBunker.deployed().then(function(instance) {
        cbInstance = instance;

        return cbInstance.getSpacesCount.call();
      }).then(async function(numSpaces) {
        for(i = 0; i < numSpaces; i++) {
          await new Promise(function(next) {
            cbInstance.getSpace.call(i).then(function(results) {
              // area,priceFinny,name,approvedPurchaser,owner
              console.log(results);
              if(results[3] === account) {
                $('.panel-space').eq(i).find('.btn-purchase').text('Purchase').attr('disabled', false);
              }
              if(results[4] === account) {
                $('.panel-space').eq(i).find('.btn-approve').show();
                $('.panel-space').eq(i).find('.input-approve').show();
                $('.panel-space').eq(i).find('.btn-purchase').hide();
                if(results[3] !== "0x0000000000000000000000000000000000000000") {
                  $('.panel-space').eq(i).find('.input-approve').val(results[3]);
                }
              }
              next();
            });
          });
        }
      }).catch(function(err) {
        console.log(err.message);
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
