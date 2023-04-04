import Link from 'next/link';
import { utils } from 'ethers';
import { orderBy } from 'lodash';

import { truncateAddress } from '../../../lib/utils';
import { Escrows } from '../../../typechain-types';
import StatusCell from './status-cell';

const EscrowsList = ({ escrows }: { escrows: Escrows.EscrowStructOutput[] }) => (
  <div className="mt-8 flow-root">
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Depositor
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Arbiter
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Beneficiary
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Balance
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orderBy(escrows, ({ id }) => id.toBigInt(), 'desc').map((escrow) => (
                <tr key={escrow.id.toString()}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    {escrow.id.toString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <Link
                      href={`/address/${escrow.depositor}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {truncateAddress(escrow.depositor)}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <Link
                      href={`/address/${escrow.arbiter}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {truncateAddress(escrow.arbiter)}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <Link
                      href={`/address/${escrow.beneficiary}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {truncateAddress(escrow.beneficiary)}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {utils.formatEther(escrow.balance)} ETH
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <StatusCell
                      id={escrow.id.toString()}
                      arbiter={escrow.arbiter}
                      isApproved={escrow.isApproved}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default EscrowsList;
