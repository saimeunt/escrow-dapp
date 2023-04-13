import { getLatestEscrows } from '../../lib/utils';
import Heading from './heading';
import EscrowsList from '../lib/escrows-list';
import EmptyState from '../lib/empty-state';

const Index = async () => {
  const latestEscrows = await getLatestEscrows();
  const escrows = latestEscrows.filter(({ id }) => id.toString() != '0');
  return (
    <main className="m-4">
      <Heading />
      {escrows.length > 0 ? <EscrowsList escrows={escrows} /> : <EmptyState />}
    </main>
  );
};

export default Index;
