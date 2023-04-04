'use client';
import { PlusIcon } from '@heroicons/react/20/solid';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';

import useContext from './context/hook';

const EmptyState = () => {
  const { openCreateEscrowModal } = useContext();
  return (
    <div className="text-center">
      <BuildingLibraryIcon className="mx-auto mt-4 h-12 w-12 text-gray-400" aria-hidden="true" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        It looks like there&apos;s no Escrow yet.
      </h3>
      <p className="mt-1 text-sm text-gray-500">How about creating one?</p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={openCreateEscrowModal}
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Create Escrow
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
