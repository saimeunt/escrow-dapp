import { providers } from 'ethers';
import { hardhat, goerli } from 'wagmi/chains';

export const developmentProvider = new providers.JsonRpcProvider(hardhat.rpcUrls.default.http[0], {
  name: hardhat.name,
  chainId: hardhat.id,
});

export const productionProvider = new providers.AlchemyProvider(
  goerli.network,
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
);
