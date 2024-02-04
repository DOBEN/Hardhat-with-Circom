import "hardhat-circom";
import "@nomicfoundation/hardhat-ethers";

import { HardhatUserConfig } from "hardhat/config";

import * as dotenv from "dotenv";
dotenv.config();

const PRIVATE_ACCOUNT_KEY = process.env.PRIVATE_ACCOUNT_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

const config: HardhatUserConfig = {
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [PRIVATE_ACCOUNT_KEY],
    },
    ethereum: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [PRIVATE_ACCOUNT_KEY],
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
      { name: "division", circuit: "division.circom", input: "division.json" },
      { name: "multi", circuit: "multi.circom", input: "multi.json" },
      { name: "sumOfSquares", circuit: "sumOfSquares.circom", input: "sumOfSquares.json" },
      { name: "mul", circuit: "mul.circom", input: "mul.json" },
      { name: "isZero", circuit: "isZero.circom", input: "isZero.json" },
      { name: "average", circuit: "average.circom", input: "average.json" },
      { name: "over21", circuit: "over21.circom", input: "over21.json" }
    ],
  },
};

export default config;
