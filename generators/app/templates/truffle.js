const PrivateKeyConnector = require('connect-privkey-to-provider')

/**
 * truffle network variables
 * for deploying contract to klaytn network.
 */
const NETWORK_ID = '1000'
const GASLIMIT = '20000000'

/**
 * We extracted `URL`, `PRIVATE_KEY` as const variable to set value easily.
 * Set your private key and klaytn node's URL in here.
 */
const URL = `http://aspen.klaytn.com`
const PRIVATE_KEY = '0x2c4078447e583b57f0666f0db32e14020aef12b02b2607409bfe35962d8f1aad'

module.exports = {
  networks: {
    klaytn: {
      provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },
  },

  // @TODO: 엘리엇 컴파일러 버젼 설명을 써주세요
  compilers: {
    solc: {
      version: '0.4.24',
    },
  },
}
