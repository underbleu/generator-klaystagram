const CaverProvider = require("truffle-caver-provider");

const URL = 'https://api.baobab.klaytn.net:8651'
const PRIVATE_KEY = '0x3de0c90ce7e440f19eff6439390c29389f611725422b79c95f9f48c856b58277'
const NETWORK_ID = '1001'

module.exports = {
  networks: {
    baobab: {
      provider: () => new CaverProvider(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: '8500000',
      gasPrice: null,       // Klaytn default gas price is fixed (25000000000)
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.4.24",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {           // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: "byzantium"
      }
    }
  }
}
