import { ethers } from "hardhat";

async function main() {

  const verifier = await ethers.deployContract("contracts/DivisionVerifier.sol:Verifier");

  await verifier.waitForDeployment();

  console.log(
    `DivisionVerifier deployed to ${verifier.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
