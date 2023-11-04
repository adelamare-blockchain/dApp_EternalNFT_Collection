require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    artifacts: '../client/artifacts',
  },
  defaultNetwork: 'hardhat',
  networks: {
    goerli: {
      url: 'https://ethereum-goerli.publicnode.com',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    goerli2: {
      url: 'https://rpc.notadegen.com/eth/goerli',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    goerli3: {
      url: 'https://rpc.ankr.com/eth_goerli',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    // localhost: {
    //   url: 'http://127.0.0.1:8545',
    //   chainId: 31337,
    // },
    hardhat: {
      chainId: 1337,
    },
  },
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
