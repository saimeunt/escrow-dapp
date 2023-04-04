'use client';
import { useRouter } from 'next/navigation';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useIsClient } from 'usehooks-ts';
import classNames from 'classnames';

import EscrowsArtifact from '../../../artifacts/contracts/Escrows.sol/Escrows.json';

const ApproveButton = ({ id, arbiter }: { id: string; arbiter: string }) => {
  const { address } = useAccount();
  const router = useRouter();
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: EscrowsArtifact.abi,
    functionName: 'approveEscrow',
    args: [id],
    enabled: address === arbiter,
  });
  const { data, write: approveEscrow } = useContractWrite(config);
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => router.refresh(),
  });
  return (
    <button
      type="button"
      disabled={isLoading}
      className={classNames(
        { 'bg-indigo-300': isLoading, 'bg-indigo-600': !isLoading },
        'flex items-center rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
      )}
      onClick={() => approveEscrow?.()}
    >
      <CheckCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
      Approv{isLoading ? 'ing…' : 'e'}
    </button>
  );
};

const StatusCell = ({
  id,
  arbiter,
  isApproved,
}: {
  id: string;
  arbiter: string;
  isApproved: boolean;
}) => {
  const { address } = useAccount();
  const isClient = useIsClient();
  return isApproved ? (
    <div className="flex items-center">
      <CheckCircleIcon className="mr-1 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true" />
      Approved
    </div>
  ) : isClient && address === arbiter ? (
    <ApproveButton id={id} arbiter={arbiter} />
  ) : (
    <div className="flex items-center">
      <XCircleIcon className="mr-1 h-5 w-5 flex-shrink-0 text-red-400" aria-hidden="true" />
      Not approved
    </div>
  );
};

export default StatusCell;
