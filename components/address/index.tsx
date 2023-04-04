import { utils } from 'ethers';

import { getEscrowsByAddress } from '../../lib/utils';
import Heading from './heading';
import EscrowsList from '../lib/escrows-list';
import EmptyState from '../lib/empty-state';

const Address = async ({ address }: { address: string }) => {
  const isAddress = utils.isAddress(address);
  const escrows = isAddress ? await getEscrowsByAddress(address) : [];
  return (
    <div className="m-4">
      <Heading address={address} isAddress={isAddress} />
      {escrows.length > 0 ? <EscrowsList escrows={escrows} /> : <EmptyState />}
    </div>
  );
};

export default Address;
