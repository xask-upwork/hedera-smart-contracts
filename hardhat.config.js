const path = require('node:path');

const dotEnvPath = path.resolve(__dirname, './.env');
require('dotenv').config({
  path: dotEnvPath,
});

// populates hre.ethers, hre.waffle, enables typechain, etc
require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-chai-matchers');

// import './tasks/deploy';
// import './tasks/interact';

/*
https://docs.hedera.com/hedera/tutorials/more-tutorials/json-rpc-connections/hedera-json-rpc-relay
https://docs.hedera.com/hedera/tutorials/more-tutorials/json-rpc-connections/arkhia
*/
const rpcUrlHederatestnet = process.env.TESTNET_ENDPOINT;
if (!rpcUrlHederatestnet || !rpcUrlHederatestnet.startsWith('http')) {
  throw new Error(
    'Missing RPC URL in TESTNET_ENDPOINT env var',
  );
}

const hardhatConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hederatestnet",
  networks: {
 
    hederatestnet: {
      chainId: 296,
      url: rpcUrlHederatestnet,
      accounts: [process.env.TESTNET_OPERATOR_PRIVATE_KEY_ECDSA],
    },
  },
  mocha: {
    timeout: 6000000,
  },
};

task("deploy-contract", async () => {
  const deployContract = require("./scripts/deployContract_ethereum");
  return deployContract();
});

task("deploy-hedera", async () => {
  const deployContract = require("./scripts/deployContract_hedera");
  return deployContract();
});

module.exports = hardhatConfig;

/*
To verify that we're able to connect to Hedera Testnet successfully:

npx hardhat console --network hederatestnet

// latest block number
(await require('hardhat').network.provider.send('eth_getBlockByNumber', ['latest', false])).number

// the default EOA that will be used in deployment transactions
(await hre.ethers.getSigners())[0].address

.exit
*/