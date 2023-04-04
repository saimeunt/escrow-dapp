import { uniq } from 'lodash';

import contract from './contract';

export const truncateAddress = (address: string) =>
  `${address.substring(0, 8)}…${address.substring(address.length - 8)}`;

export const getLatestEscrows = () => contract.getLatestEscrows();

export const getEscrowsByAddress = async (address: string) => {
  const depositorFilters = contract.filters.EscrowCreated(address);
  const arbiterFilters = contract.filters.EscrowCreated(null, address);
  const beneficiaryFilters = contract.filters.EscrowCreated(null, null, address);
  const [depositorLogs, arbiterLogs, beneficiaryLogs] = await Promise.all([
    contract.provider.getLogs({ ...depositorFilters, fromBlock: 0 }),
    contract.provider.getLogs({ ...arbiterFilters, fromBlock: 0 }),
    contract.provider.getLogs({ ...beneficiaryFilters, fromBlock: 0 }),
  ]);
  const logs = [...depositorLogs, ...arbiterLogs, ...beneficiaryLogs];
  const ids = uniq(logs.map(({ data }) => data));
  return contract.getEscrowsByIds(ids);
};
