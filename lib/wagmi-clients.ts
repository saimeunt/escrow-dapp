import { createClient, configureChains } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { w3mConnectors } from '@web3modal/ethereum';

import { developmentProvider } from './ethers-providers';

export const developmentChains = [hardhat];
export const productionChains = [sepolia];

const connectors = w3mConnectors({
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  version: 2,
  chains: process.env.NODE_ENV !== 'production' ? developmentChains : productionChains,
});

export const developmentWagmiClient = () =>
  createClient({
    autoConnect: true,
    connectors,
    provider: developmentProvider,
  });

export const productionWagmiClient = () => {
  const { provider } = configureChains(productionChains, [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  ]);
  return createClient({
    autoConnect: true,
    connectors,
    provider,
  });
};
