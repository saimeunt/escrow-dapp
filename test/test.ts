import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Event, BigNumber } from 'ethers';
import { pick } from 'lodash';
import { Escrows } from '../typechain-types';

const rawEscrowToEscrow = (rawEscrow: Escrows.EscrowStructOutput) =>
  pick(rawEscrow, 'id', 'depositor', 'arbiter', 'beneficiary', 'balance', 'isApproved');

describe('Escrows', () => {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const factory = await ethers.getContractFactory('Escrows');
    const contract = await factory.deploy();
    await contract.deployed();
    const [signer1, signer2, signer3] = await ethers.getSigners();
    return { contract, signer1, signer2, signer3 };
  }
  async function createEscrow() {
    const { contract, signer1, signer2, signer3 } = await deployContractAndSetVariables();
    const tx = await contract.connect(signer2).createEscrow(signer1.address, signer3.address, {
      value: ethers.utils.parseEther('0.1'),
    });
    const receipt = await tx.wait();
    const [event] = receipt.events as Event[];
    const escrowId = BigNumber.from(event.data);
    return { contract, signer1, signer2, signer3, escrowId };
  }
  async function createEscrows() {
    const { contract, signer1, signer2, signer3 } = await deployContractAndSetVariables();
    const tx1 = await contract.createEscrow(signer2.address, signer3.address, {
      value: ethers.utils.parseEther('0.1'),
    });
    const receipt1 = await tx1.wait();
    const [event1] = receipt1.events as Event[];
    const escrowId1 = BigNumber.from(event1.data);
    const tx2 = await contract.connect(signer2).createEscrow(signer1.address, signer3.address, {
      value: ethers.utils.parseEther('0.2'),
    });
    const receipt2 = await tx2.wait();
    const [event2] = receipt2.events as Event[];
    const escrowId2 = BigNumber.from(event2.data);
    const tx3 = await contract.connect(signer3).createEscrow(signer2.address, signer1.address, {
      value: ethers.utils.parseEther('0.3'),
    });
    const receipt3 = await tx3.wait();
    const [event3] = receipt3.events as Event[];
    const escrowId3 = BigNumber.from(event3.data);
    return { contract, signer1, signer2, signer3, escrowId1, escrowId2, escrowId3 };
  }
  describe('createEscrow', () => {
    it('should revert if depositor is the same as arbiter', async () => {
      const { contract, signer1, signer3 } = await loadFixture(deployContractAndSetVariables);
      await expect(
        contract.createEscrow(signer1.address, signer3.address, {
          value: ethers.utils.parseEther('0.1'),
        }),
      ).to.be.revertedWithCustomError(contract, 'InvalidEscrowParams');
    });
    it('should revert if depositor is the same as beneficiary', async () => {
      const { contract, signer1, signer2 } = await loadFixture(deployContractAndSetVariables);
      await expect(
        contract.createEscrow(signer2.address, signer1.address, {
          value: ethers.utils.parseEther('0.1'),
        }),
      ).to.be.revertedWithCustomError(contract, 'InvalidEscrowParams');
    });
    it('should revert if arbiter is the same as beneficiary', async () => {
      const { contract, signer2 } = await loadFixture(deployContractAndSetVariables);
      await expect(
        contract.createEscrow(signer2.address, signer2.address, {
          value: ethers.utils.parseEther('0.1'),
        }),
      ).to.be.revertedWithCustomError(contract, 'InvalidEscrowParams');
    });
    it('should revert if balance is too low', async () => {
      const { contract, signer2, signer3 } = await loadFixture(deployContractAndSetVariables);
      await expect(
        contract.createEscrow(signer2.address, signer3.address, {
          value: ethers.utils.parseEther('0'),
        }),
      ).to.be.revertedWithCustomError(contract, 'InvalidEscrowParams');
    });
    it('should create an escrow', async () => {
      const { contract, signer1, signer2, signer3 } = await loadFixture(
        deployContractAndSetVariables,
      );
      const tx = await contract.createEscrow(signer2.address, signer3.address, {
        value: ethers.utils.parseEther('0.1'),
      });
      const receipt = await tx.wait();
      const [event] = receipt.events as Event[];
      const id = BigNumber.from(event.data);
      const rawEscrow = await contract.escrows(id);
      const escrow = rawEscrowToEscrow(rawEscrow);
      expect(escrow).to.deep.equal({
        id,
        depositor: signer1.address,
        arbiter: signer2.address,
        beneficiary: signer3.address,
        balance: ethers.utils.parseEther('0.1'),
        isApproved: false,
      });
    });
    it('should transfer depositor balance to escrow', async () => {
      const { contract, signer1, signer2, signer3 } = await loadFixture(
        deployContractAndSetVariables,
      );
      const signer1BalanceBeforeTx = await contract.provider.getBalance(signer1.address);
      const tx = await contract.createEscrow(signer2.address, signer3.address, {
        value: ethers.utils.parseEther('0.1'),
      });
      const receipt = await tx.wait();
      const fees = receipt.gasUsed.mul(receipt.effectiveGasPrice);
      const signer1BalanceAfterTx = await contract.provider.getBalance(signer1.address);
      expect(signer1BalanceAfterTx).to.equal(
        signer1BalanceBeforeTx.sub(fees).sub(ethers.utils.parseEther('0.1')),
      );
    });
    it('should emit EscrowCreated', async () => {
      const { contract, signer1, signer2, signer3 } = await loadFixture(
        deployContractAndSetVariables,
      );
      const tx = await contract.createEscrow(signer2.address, signer3.address, {
        value: ethers.utils.parseEther('0.1'),
      });
      const receipt = await tx.wait();
      const [event] = receipt.events as Event[];
      const id = BigNumber.from(event.data);
      expect(tx)
        .to.emit(contract, 'EscrowCreated')
        .withArgs(signer1.address, signer2.address, signer3.address, id);
    });
  });
  describe('approveEscrow', () => {
    it('should revert when given an invalid escrow id', async () => {
      const { contract, escrowId } = await createEscrow();
      await expect(contract.approveEscrow(0))
        .to.be.revertedWithCustomError(contract, 'InvalidEscrow')
        .withArgs(0);
      await expect(contract.approveEscrow(escrowId.add(1)))
        .to.be.revertedWithCustomError(contract, 'InvalidEscrow')
        .withArgs(escrowId.add(1));
    });
    it('should revert if sender is not arbiter', async () => {
      const { contract, signer2, escrowId } = await createEscrow();
      await expect(contract.connect(signer2).approveEscrow(escrowId))
        .to.be.revertedWithCustomError(contract, 'NotArbiter')
        .withArgs(escrowId);
    });
    it('should revert if already approved', async () => {
      const { contract, escrowId } = await createEscrow();
      const tx = await contract.approveEscrow(escrowId);
      await tx.wait();
      await expect(contract.approveEscrow(escrowId))
        .to.be.revertedWithCustomError(contract, 'AlreadyApproved')
        .withArgs(escrowId);
    });
    it('should transfer escrow balance to beneficiary', async () => {
      const { contract, signer3, escrowId } = await createEscrow();
      const signer3BalanceBeforeTx = await contract.provider.getBalance(signer3.address);
      const tx = await contract.approveEscrow(escrowId);
      await tx.wait();
      const signer3BalanceAfterTx = await contract.provider.getBalance(signer3.address);
      expect(signer3BalanceAfterTx).to.equal(
        signer3BalanceBeforeTx.add(ethers.utils.parseEther('0.1')),
      );
    });
    it('should approve a given escrow', async () => {
      const { contract, escrowId } = await createEscrow();
      const tx = await contract.approveEscrow(escrowId);
      await tx.wait();
      const { isApproved } = await contract.escrows(escrowId);
      expect(isApproved).to.be.true;
    });
    it('should emit EscrowApproved', async () => {
      const { contract, escrowId } = await createEscrow();
      const approveEscrowTx = await contract.approveEscrow(escrowId);
      expect(approveEscrowTx).to.emit(contract, 'EscrowApproved').withArgs(escrowId);
    });
  });
  describe('getLatestEscrows', async () => {
    it('should return the last 6 escrows created', async () => {
      const { contract, signer1, signer2, signer3, escrowId1, escrowId2, escrowId3 } =
        await createEscrows();
      const rawEscrows = await contract.getLatestEscrows();
      const escrows = rawEscrows.map(rawEscrowToEscrow);
      expect(escrows.length).to.equal(6);
      expect(escrows[0]).to.deep.equal({
        id: escrowId3,
        depositor: signer3.address,
        arbiter: signer2.address,
        beneficiary: signer1.address,
        balance: ethers.utils.parseEther('0.3'),
        isApproved: false,
      });
      expect(escrows[1]).to.deep.equal({
        id: escrowId2,
        depositor: signer2.address,
        arbiter: signer1.address,
        beneficiary: signer3.address,
        balance: ethers.utils.parseEther('0.2'),
        isApproved: false,
      });
      expect(escrows[2]).to.deep.equal({
        id: escrowId1,
        depositor: signer1.address,
        arbiter: signer2.address,
        beneficiary: signer3.address,
        balance: ethers.utils.parseEther('0.1'),
        isApproved: false,
      });
      const defaultEscrow = {
        id: 0,
        depositor: ethers.constants.AddressZero,
        arbiter: ethers.constants.AddressZero,
        beneficiary: ethers.constants.AddressZero,
        balance: ethers.utils.parseEther('0'),
        isApproved: false,
      };
      expect(escrows[3]).to.deep.equal(defaultEscrow);
      expect(escrows[4]).to.deep.equal(defaultEscrow);
      expect(escrows[5]).to.deep.equal(defaultEscrow);
    });
  });
  describe('getEscrowsByIds', () => {
    it('should return escrows by ids', async () => {
      const { contract, signer1, signer2, signer3, escrowId1, escrowId2, escrowId3 } =
        await createEscrows();
      const rawEscrows = await contract.getEscrowsByIds([escrowId1, escrowId2, escrowId3]);
      const escrows = rawEscrows.map(rawEscrowToEscrow);
      expect(escrows.length).to.equal(3);
      expect(escrows[0]).to.deep.equal({
        id: escrowId1,
        depositor: signer1.address,
        arbiter: signer2.address,
        beneficiary: signer3.address,
        balance: ethers.utils.parseEther('0.1'),
        isApproved: false,
      });
      expect(escrows[1]).to.deep.equal({
        id: escrowId2,
        depositor: signer2.address,
        arbiter: signer1.address,
        beneficiary: signer3.address,
        balance: ethers.utils.parseEther('0.2'),
        isApproved: false,
      });
      expect(escrows[2]).to.deep.equal({
        id: escrowId3,
        depositor: signer3.address,
        arbiter: signer2.address,
        beneficiary: signer1.address,
        balance: ethers.utils.parseEther('0.3'),
        isApproved: false,
      });
    });
  });
});
