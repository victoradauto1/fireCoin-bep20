import dotenv from 'dotenv';
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "local",
  networks:{
    local:{
      url:"http://127.0.0.1:8545/",
      chainId: 31337,
      accounts:{
        mnemonic:"test test test test test test test test test test test junk"
      }
    },
    sepolia:{
      url: process.env.INFURA_URL,
      chainId: 11155111,
      accounts:{
        mnemonic: process.env.SECRET
      }
    },
    bsctest:{
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts:{
        mnemonic: process.env.SECRET
      }
    }
  },
  etherscan:{
    apiKey: process.env.API_KEY
  }
};

export default config;
