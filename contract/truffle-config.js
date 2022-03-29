const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider');
const seed = '62c8b0443c82d2550c0fd274a8c5db03848083f574c7cd49ce539f736c6a2f8e';
const infura_rinkeby_key = 'wss://rinkeby.infura.io/ws/v3/cf64abaa2f3f48be82d085581d175fd7';


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(seed, infura_rinkeby_key),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200000000000000,
      skipDryRun: true
    }
  },

  solc: {
    version : "0.5.16",
  }
};
