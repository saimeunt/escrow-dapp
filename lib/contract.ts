import { Escrows__factory as EscrowsContract } from '../typechain-types';
import { developmentProvider, productionProvider } from './ethers-providers';

const contract = EscrowsContract.connect(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  process.env.NODE_ENV !== 'production' ? developmentProvider : productionProvider,
);

export default contract;
