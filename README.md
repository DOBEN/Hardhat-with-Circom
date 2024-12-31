# Example Hardhat + Circom Project

This project experiments with hardhat and circom circuits.
The project uses the `hardhat-circom` plugin. This combines the multiple steps of the circom and snarkJS workflows into your hardhat workflow. 

## Prerequisites
- `Hardhat` installed:
    https://hardhat.org/hardhat-runner/docs/getting-started#installation
- `Circom` and `snarkjs` installed:
    https://docs.circom.io/getting-started/installation/

- Powers of tau files: The `Groth16` (zkSNARK) algorithm relies on a trusted setup ceremony. To speed up development, get the `powersOfTau28_hez_final_15.ptau` file at https://www.dropbox.com/sh/mn47gnepqu88mzl/AACaJkBU7mmCq8uU8ml0-0fma?dl=0 and input it into the `circuits` folder. In addition, the `circom:dev` command in the `package.json` file is executed with the `--deterministic` option to avoid unnecessary file changes during development. In production, you have to generate your own `powersOfTau` file and execute both phases of the [powers of tau ceremony](https://docs.circom.io/getting-started/proving-circuits/#powers-of-tau). In addition, use the `circom:prod` command in the `package.json` file in production.

Use at least node version v18.16.0.

## Setup:

- Clone the repo
- Run `yarn` to install dependencies (We will use `yarn` throughout the ReadMe but feel free to use your package manager of choice.)

## Basic Workflow:

- Add a new circuit file (`circuitName.circom`) and a new witness file (`circuitName.json`) to the `circuits` folder. The witness file contains a valid assignment to the input signals (public and private input signals) of the circuit.

- Compile your circuit in the root of the repo with one of the commands:
```shell
yarn circom:dev
yarn circom:prod
```

These commands generate several output files in the `./circuits/output/`, `./contracts`, and `./artifacts/circom/` directories. The `--debug` option in the command `yarn circom:dev` will generate additional files compared to the `yarn circom:prod` command which can be useful for debugging. We will explore some of the additional files, and hence assume from now on that you have compiled the circuit with the `--debug` option. 

The four most important files generated are:
- `circuitName.proof.json` (in `./artifacts/circom/`): It is your zk proof of knowing the `witness`. The file can be shared publicly.
- `circuitName.public.json` (in `./artifacts/circom/`): It contains the **public** signals. The file is usually a subset of the input signals from your witness file + output/intermediate signals. The file can be shared publicly.
- `circuitName.vkey.json` (in `./artifacts/circom/` or in `./circuits/output/`): It is your verification key to check if proofs are valid. 
- `CircuitNameVerifier.sol` (in `./contracts/`): It is a contract that includes the above verification key and can be used to do the zk proof verification on chain.

To read your rank one constraint system (R1CS), you can run the command:
```
yarn snarkjs r1cs print ./artifacts/circom/CircuitName.r1cs
```

e.g.
```
yarn snarkjs r1cs print ./artifacts/circom/division.r1cs
```

## Proof verification locally

```
yarn snarkjs groth16 verify ./artifacts/circom/CircuitName.vkey.json ./artifacts/circom/CircuitName.public.json ./artifacts/circom/CircuitName.proof.json
```

e.g.
```
yarn snarkjs groth16 verify ./artifacts/circom/division.vkey.json ./artifacts/circom/division.public.json ./artifacts/circom/division.proof.json
```

It will return:
```
[INFO]  snarkJS: OK!
```

If you tamper around with the `CircuitName.public.json` file and run the above command again, it will return:

```
[ERROR] snarkJS: Invalid proof
```

## Proof verification on-chain

- Rename the `.env.exmaple` file to `.env` and input your keys.
- Update the `./scripts/deploy.ts` script in line 5 to use your `CircuitName`.
- Deploy the generated smart contract `CircuitNameVerifier.sol` with the commands:

```
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

To generate the calldata parameters for calling the `verifyProof` entrypoint in the above deployed contract run the command:

```
yarn snarkjs zkey export soliditycalldata ./artifacts/circom/CircuitName.public.json ./artifacts/circom/CircuitName.proof.json
```

e.g.
```
yarn snarkjs zkey export soliditycalldata ./artifacts/circom/division.public.json ./artifacts/circom/division.proof.json
```

An example output:

```
["0x09176e6cfb4f32bc758f87d4e1fbad09a8dba06cc40dd9cf6235b6e6d61f352f", "0x01df03d165e68709c1c1beb061bf027cad4e729254785b9f19b9e7a40ed12f2a"],[["0x2da502a1313088430c58f1993a42e0d1f6870ba29942ac507d48dd1020ac29b3", "0x08df82f1bb1b87a48317766535d2966e1c3e87c4ecaaa65be02c6d07002f63dc"],["0x06da9012e589ecbef4f5174cde2ff21c69f6b85d919990e19cf8826036ab9b63", "0x26ffa061cf50dd2cacaea807e713e7c9f85c97b22e509301cb55e8f4375c737e"]],["0x2f9ea1eda28c89d011b411a2aa7193d3fb15c31d5279d53db56853e5e1abccb2", "0x27d001099cc118bec6b7803cba09b24527318585c965fdaf3910da91ae8bfc46"],["0x0000000000000000000000000000000000000000000000000000000000000003","0x0000000000000000000000000000000000000000000000000000000000000007"]
```

The `DivisionVerifier.sol` is deployed at `0x698D433DE8181717F95e38fe4672F508730aDEb5` on Sepolia and can be tested with the above input parameters.

## Note

All output, smart contract, and artifact files related to the `division` circuit are committed to this repo by excluding them from the `.gitignore` file. This gives one reference example of how correct compilation and contracts should look like.

## Cheat Sheet Circom Commands

```shell
npx hardhat circom --help
npx hardhat circom --circuit division
npx hardhat circom --verbose
npx hardhat circom --deterministic --debug --verbose
```

## Cheat Sheet Hardhat Commands

```shell
npx hardhat help
npx hardhat test
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.ts
npx hardhat run scripts/deploy.ts --network sepolia
```
