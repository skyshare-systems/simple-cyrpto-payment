import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SampleToken", function () {
  async function deploySampleToken() {
    const initialSupply = ethers.utils.parseEther("100000");

    const [deployer, otherAccount] = await ethers.getSigners();

    const SampleToken = await ethers.getContractFactory("SampleToken");
    const sampleToken = await SampleToken.deploy(initialSupply);

    return { deployer, otherAccount, sampleToken };
  }

  describe("Deploy", function () {
    it("Should set the right amount of max supply upon deployment", async function () {
      const { sampleToken } = await loadFixture(deploySampleToken);

      let maxSupply = await sampleToken.MAX_SUPPLY();

      expect(ethers.utils.formatEther(maxSupply)).to.be.equal("1000000.0");
    });

    it("Should mint the right amount to deployer", async function () {
      const { deployer, sampleToken } = await loadFixture(deploySampleToken);

      let deployerBalance = await sampleToken.balanceOf(deployer.address);

      expect(ethers.utils.formatEther(deployerBalance)).to.be.equal("100000.0");
    });
  });

  describe("Mint", function () {
    it("Should mint the correct amount", async function () {
      const { deployer, sampleToken } = await loadFixture(deploySampleToken);
      const tokenAmount = ethers.utils.parseEther("10000");
      await sampleToken.connect(deployer).mintToken(tokenAmount);
      let userBalance = await sampleToken.balanceOf(deployer.address);

      expect(ethers.utils.formatEther(userBalance)).to.equal("110000.0");
    });

    it("Should not mint if user is not owner", async function () {
      const { otherAccount, sampleToken } = await loadFixture(
        deploySampleToken
      );
      const tokenAmount = ethers.utils.parseEther("10000");

      await expect(
        sampleToken.connect(otherAccount).mintToken(tokenAmount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
