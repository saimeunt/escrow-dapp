import { providers } from 'ethers';
import { hardhat, sepolia } from 'wagmi/chains';

export const developmentProvider = new providers.JsonRpcProvider(hardhat.rpcUrls.default.http[0], {
  name: hardhat.name,
  chainId: hardhat.id,
});

export const productionProvider = new providers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL, {
  name: sepolia.name,
  chainId: sepolia.id,
});

/* export const productionProvider = new providers.AlchemyProvider(
  sepolia.network,
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
); */
