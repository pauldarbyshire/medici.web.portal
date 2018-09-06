/**
* @file truffle.js
* @author Paul Darbyshire <paul@lancorscientific.com>
* @copyright Lancor Scientific Ltd. (c) 2018.
* @version 1.0.1
*/

require('babel-register');
require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, 'https://ropsten.infura.io/${process.env.INFURA_API_KEY}');
      },
      gas: 4712388, // $ truffle migrate --network ropsten
      network_id: 3
    },
  }
}
