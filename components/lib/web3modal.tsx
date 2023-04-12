'use client';
import { EthereumClient } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { indigo } from 'tailwindcss/colors';

import {
  developmentChains,
  productionChains,
  developmentWagmiClient,
  productionWagmiClient,
} from '../../lib/wagmi-clients';

const CustomWeb3Modal = () => (
  <Web3Modal
    projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
    themeMode="light"
    themeVariables={{ '--w3m-accent-color': indigo[600], '--w3m-background-color': indigo[600] }}
    ethereumClient={
      new EthereumClient(
        process.env.NODE_ENV !== 'production' ? developmentWagmiClient() : productionWagmiClient(),
        process.env.NODE_ENV !== 'production' ? developmentChains : productionChains,
      )
    }
  />
);

export default CustomWeb3Modal;
