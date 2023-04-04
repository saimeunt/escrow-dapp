'use client';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { usePathname, useRouter } from 'next/navigation';
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { constants, utils } from 'ethers';
import classNames from 'classnames';

import useContext from './context/hook';
import EscrowsArtifact from '../../artifacts/contracts/Escrows.sol/Escrows.json';

const CreateEscrowModal = () => {
  const {
    state: { createEscrowModalOpen },
    closeCreateEscrowModal,
  } = useContext();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { address } = useAccount();
  const pathname = usePathname();
  const router = useRouter();
  const initialValues = {
    arbiter: '',
    beneficiary: '',
    balance: utils.parseEther('0.01'),
  };
  const [arbiter, setArbiter] = useState(initialValues.arbiter);
  const [beneficiary, setBeneficiary] = useState(initialValues.beneficiary);
  const [balance, setBalance] = useState(initialValues.balance);
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: EscrowsArtifact.abi,
    functionName: 'createEscrow',
    overrides: { value: balance },
    args: [arbiter, beneficiary],
    enabled:
      utils.isAddress(arbiter) &&
      utils.isAddress(beneficiary) &&
      balance.gte(utils.parseEther('0.01')),
  });
  const { data, write: createEscrow } = useContractWrite(config);
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      closeCreateEscrowModal();
      setArbiter(initialValues.arbiter);
      setBeneficiary(initialValues.beneficiary);
      setBalance(initialValues.balance);
      if (pathname === `/address/${address}`) {
        router.refresh();
      } else {
        router.push(`/address/${address}`);
      }
    },
  });
  return (
    <Transition.Root show={createEscrowModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={closeCreateEscrowModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="my-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Create a new Escrow
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        This will create a new Escrow with your address as Depositor.
                      </p>
                    </div>
                  </div>
                </div>
                <form
                  id="create-escrow-form"
                  className="space-y-6"
                  onSubmit={(event) => {
                    event.preventDefault();
                    createEscrow?.();
                  }}
                >
                  <div>
                    <label
                      htmlFor="arbiter"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Arbiter
                    </label>
                    <div className="mt-2">
                      <input
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                        maxLength={42}
                        placeholder={constants.AddressZero}
                        value={arbiter}
                        onChange={(event) => setArbiter(event.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="beneficiary"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Beneficiary
                    </label>
                    <div className="mt-2">
                      <input
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                        maxLength={42}
                        placeholder={constants.AddressZero}
                        value={beneficiary}
                        onChange={(event) => setBeneficiary(event.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="balance"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Balance
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="number"
                        min={0.01}
                        step={0.01}
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                        placeholder="0.0 ETH"
                        value={balance ? utils.formatEther(balance).toString() : ''}
                        onChange={(event) => setBalance(utils.parseEther(event.target.value))}
                        aria-describedby="balance-currency"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8">
                        <span className="text-gray-500 sm:text-sm" id="balance-currency">
                          ETH
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    form="create-escrow-form"
                    disabled={isLoading}
                    className={classNames(
                      {
                        'bg-indigo-300': isLoading,
                        'bg-indigo-600': !isLoading,
                      },
                      'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2',
                    )}
                  >
                    Creat{isLoading ? 'ing…' : 'e'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={closeCreateEscrowModal}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateEscrowModal;
