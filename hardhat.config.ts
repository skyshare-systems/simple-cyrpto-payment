import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";

const config: HardhatUserConfig = {
  solidity: "0.8.19",

  networks: {
    hardhat: {
      accounts: [
        {
          privateKey:
            "54d9780facb45f30970a5d915bbdf111cda2f894b47f1a433983a423466240f4",
          balance: "10000000000000000000000000",
        },
        {
          privateKey:
            "5fb4a8d847c023a35346cb39defc08d80c39bdb299c60674cab2006d62ea4a7d",
          balance: "10000000000000000000000000",
        },
      ],
    },
  },
};

export default config;
