// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const fireCoinModule = buildModule("FireCoinModule", (m) => {

  const firecoin = m.contract("FireCoin");

  return { firecoin };
});

export default fireCoinModule;
