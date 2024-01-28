import "hardhat-circom";

import { HardhatUserConfig } from "hardhat/config";

import * as dotenv from "dotenv";
dotenv.config();

const INFURA_KEY = process.env.INFURA_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [INFURA_KEY],
    },
    ethereum: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [INFURA_KEY],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.6.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  circom: {
    inputBasePath: "./circuits/",
    outputBasePath: "./circuits/output/",
    ptau: "powersOfTau28_hez_final_15.ptau",
    circuits: [
      { name: "division", circuit: "division.circom", input: "division.json" }
    ],
  },
};

export default config;
