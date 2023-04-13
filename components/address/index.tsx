import { utils } from 'ethers';
import { notFound } from 'next/navigation';

import { getEscrowsByAddress } from '../../lib/utils';
import Heading from './heading';
import EscrowsList from '../lib/escrows-list';
import EmptyState from '../lib/empty-state';

const Address = async ({ address }: { address: string }) => {
  const isAddress = utils.isAddress(address);
  if (!isAddress) {
    notFound();
  }
  const escrows = await getEscrowsByAddress(address);
  return (
    <main className="m-4">
      <Heading address={address} />
      {escrows.length > 0 ? <EscrowsList escrows={escrows} /> : <EmptyState />}
    </main>
  );
};

export default Address;
