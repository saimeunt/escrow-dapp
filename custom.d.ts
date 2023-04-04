import { ExternalProvider } from '@ethersproject/providers';

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      // system
      readonly NODE_ENV: 'development' | 'production';
      readonly VERCEL_ENV: 'development' | 'preview' | 'production';
      readonly VERCEL_URL: string;
      readonly VERCEL_GIT_COMMIT_REF: string;
      // private
      readonly ALCHEMY_RPC_URL: string;
      readonly ACCOUNT_PRIVATE_KEY: string;
      // public
      readonly NEXT_PUBLIC_CONTRACT_ADDRESS: `0x${string}`;
      readonly NEXT_PUBLIC_ALCHEMY_API_KEY: string;
      readonly NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string;
    }
  }
  interface Window {
    ethereum?: ExternalProvider;
  }
}
