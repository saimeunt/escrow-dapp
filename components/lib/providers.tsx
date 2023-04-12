'use client';
import { ReactNode } from 'react';
import { WagmiConfig } from 'wagmi';

import ContextProvider from './context/provider';
import { developmentWagmiClient, productionWagmiClient } from '../../lib/wagmi-clients';
import CreateEscrowModal from './create-escrow-modal';
import Web3Modal from './web3modal';

const CustomWagmiConfig = ({ children }: { children: ReactNode }) =>
  process.env.NODE_ENV !== 'production' ? (
    <WagmiConfig client={developmentWagmiClient()}>{children}</WagmiConfig>
  ) : (
    <WagmiConfig client={productionWagmiClient()}>{children}</WagmiConfig>
  );

const Providers = ({ children }: { children: ReactNode }) => (
  <CustomWagmiConfig>
    <ContextProvider>
      {children}
      <CreateEscrowModal />
      <Web3Modal />
    </ContextProvider>
  </CustomWagmiConfig>
);

export default Providers;
