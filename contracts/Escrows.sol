// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import '@openzeppelin/contracts/utils/Counters.sol';

contract Escrows {
  using Counters for Counters.Counter;
  Counters.Counter private escrowIds;

  struct Escrow {
    uint id;
    address depositor;
    address arbiter;
    address beneficiary;
    uint balance;
    bool isApproved;
  }
  mapping(uint => Escrow) public escrows;

  error InvalidEscrowParams();
  event EscrowCreated(
    address indexed depositor,
    address indexed arbiter,
    address indexed beneficiary,
    uint id
  );

  function createEscrow(address arbiter, address beneficiary) external payable {
    if (
      msg.sender == arbiter ||
      msg.sender == beneficiary ||
      arbiter == beneficiary ||
      msg.value < 0.01 ether
    ) {
      revert InvalidEscrowParams();
    }
    escrowIds.increment();
    uint id = escrowIds.current();
    escrows[id] = Escrow({
      id: id,
      depositor: msg.sender,
      arbiter: arbiter,
      beneficiary: beneficiary,
      balance: msg.value,
      isApproved: false
    });
    emit EscrowCreated(msg.sender, arbiter, beneficiary, id);
  }

  error InvalidEscrow(uint id);
  error NotArbiter(uint id);
  error AlreadyApproved(uint id);
  error PaymentFailed(uint id);
  event EscrowApproved(uint id);

  function approveEscrow(uint id) external {
    if (id == 0 || id > escrowIds.current()) {
      revert InvalidEscrow(id);
    }
    Escrow storage escrow = escrows[id];
    if (msg.sender != escrow.arbiter) {
      revert NotArbiter(id);
    }
    if (escrow.isApproved) {
      revert AlreadyApproved(id);
    }
    (bool sent, ) = payable(escrow.beneficiary).call{value: escrow.balance}('');
    if (!sent) {
      revert PaymentFailed(id);
    }
    escrow.isApproved = true;
    emit EscrowApproved(id);
  }

  function getLatestEscrows() external view returns (Escrow[6] memory result) {
    uint escrowsId = escrowIds.current();
    for (uint i = 0; i < 6; i++) {
      if (escrowsId >= 1) {
        result[i] = escrows[escrowsId];
        escrowsId--;
      } else {
        result[i] = Escrow({
          id: 0,
          depositor: address(0),
          arbiter: address(0),
          beneficiary: address(0),
          balance: 0,
          isApproved: false
        });
      }
    }
  }

  function getEscrowsByIds(uint[] calldata ids) external view returns (Escrow[] memory result) {
    result = new Escrow[](ids.length);
    for (uint i = 0; i < ids.length; i++) {
      result[i] = escrows[ids[i]];
    }
  }
}
