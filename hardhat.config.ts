import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  solidity: {
    version: '0.8.19',
  },
  networks: {
    sepolia: {
      url: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
} satisfies HardhatUserConfig;

export default config;
