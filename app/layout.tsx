import { ReactNode } from 'react';
import 'tailwindcss/tailwind.css';

import Providers from '../components/lib/providers';
import Header from '../components/header';
import Footer from '../components/footer';

const title = 'Escrow';
const description = 'Escrow - dApp';
const scheme = `http${process.env.NODE_ENV !== 'production' ? '' : 's'}`;
const metadataBase = `${scheme}://${process.env.VERCEL_URL}`;

export const metadata = {
  metadataBase: new URL(metadataBase),
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://escrow-dapp-sepolia.vercel.app/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body className="overflow-x-hidden bg-slate-50">
      <Providers>
        <Header />
        {children}
        <Footer />
      </Providers>
    </body>
  </html>
);

export const dynamic = 'force-dynamic';

export default RootLayout;
