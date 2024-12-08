import { ethers } from "hardhat";

async function main() {
  const firecoin = ethers.deployContract("FireCoin");

  (await firecoin).waitForDeployment();

  console.log(`Contract deployed at ${(await firecoin).target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
