import { ethers, network } from 'hardhat';

async function main() {
  const factory = await ethers.getContractFactory('Escrows');
  const contract = await factory.deploy();
  await contract.deployed();
  if (network.name === 'localhost') {
    const [signer1, signer2, signer3] = await ethers.getSigners();
    await Promise.all([
      contract.createEscrow(signer2.address, signer3.address, {
        value: ethers.utils.parseEther('0.1'),
      }),
      contract
        .connect(signer2)
        .createEscrow(signer1.address, signer3.address, { value: ethers.utils.parseEther('0.2') }),
      contract
        .connect(signer3)
        .createEscrow(signer2.address, signer1.address, { value: ethers.utils.parseEther('0.3') }),
    ]);
  }
  console.log(`Escrows successfully deployed to ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
