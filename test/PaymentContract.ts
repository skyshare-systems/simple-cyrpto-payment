import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Payment Contract", function () {
  async function deployContract() {
    const [deployer, otherAccount] = await ethers.getSigners();
    const initialSupply = ethers.utils.parseEther("100000");

    const SampleToken = await ethers.getContractFactory("SampleToken");
    const sampleToken = await SampleToken.deploy(initialSupply);

    const PaymentContract = await ethers.getContractFactory("PaymentContract");
    const paymentContract = await PaymentContract.deploy();

    return { deployer, otherAccount, sampleToken, paymentContract };
  }

  describe("Deployment", async () => {
    it("Should set required payment to 1000", async function () {
      const { paymentContract } = await loadFixture(deployContract);

      let requiredPayment = await paymentContract.requiredPayment();
      expect(ethers.utils.formatEther(requiredPayment)).to.be.equal("1000.0");
    });

    it("Should set required native payment to 1", async function () {
      const { paymentContract } = await loadFixture(deployContract);

      let requiredPayment = await paymentContract.requiredPaymentNative();
      expect(ethers.utils.formatEther(requiredPayment)).to.be.equal("1.0");
    });
  });

  describe("Payment", async () => {
    it("Should not accept payment lower than required payment", async function () {
      const { sampleToken, paymentContract } = await loadFixture(
        deployContract
      );

      await sampleToken.approve(
        paymentContract.address,
        ethers.constants.MaxUint256
      );
      await expect(
        paymentContract.pay(sampleToken.address, ethers.utils.parseEther("100"))
      ).to.be.revertedWith("Not enough payment");
    });

    it("Should accept payment equal or greater than required payment", async function () {
      const { sampleToken, paymentContract } = await loadFixture(
        deployContract
      );

      await sampleToken.approve(
        paymentContract.address,
        ethers.constants.MaxUint256
      );
      expect(
        await paymentContract.pay(
          sampleToken.address,
          ethers.utils.parseEther("1001")
        )
      );
    });

    it("Should not accept payment lower than required native payment", async function () {
      const { paymentContract } = await loadFixture(deployContract);

      await expect(
        paymentContract.payNative({
          value: ethers.utils.parseEther(".9"),
        })
      ).to.be.revertedWith("Not enough payment");
    });

    it("Should accept payment equal or greater than required native payment", async function () {
      const { paymentContract } = await loadFixture(deployContract);

      expect(
        await paymentContract.payNative({
          value: ethers.utils.parseEther("2"),
        })
      );
    });
  });

  describe("Withdraw", () => {
    it("Should not be callable by other than that owner", async () => {
      const { otherAccount, sampleToken, paymentContract } = await loadFixture(
        deployContract
      );

      await expect(
        paymentContract.connect(otherAccount).withdraw(sampleToken.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to withdraw balance", async () => {
      const { sampleToken, paymentContract } = await loadFixture(
        deployContract
      );

      await sampleToken.approve(
        paymentContract.address,
        ethers.constants.MaxUint256
      );
      await paymentContract.pay(
        sampleToken.address,
        ethers.utils.parseEther("1001")
      );

      expect(await paymentContract.withdraw(sampleToken.address));
    });
  });
});
