import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const config = {
  solidity: {
    version: '0.8.18',
  },
  networks: {
    goerli: { url: process.env.ALCHEMY_RPC_URL, accounts: [process.env.ACCOUNT_PRIVATE_KEY] },
  },
} satisfies HardhatUserConfig;

export default config;
