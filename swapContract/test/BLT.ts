import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("BlockLabToken", function () {
  async function deployErc20Token() {
    const [owner, account1, account2] = await hre.ethers.getSigners();
    console.log(hre);

    const BlockLabToken = await hre.ethers.getContractFactory("BlockLab");
    const BLTToken = await BlockLabToken.deploy();

    return { BLTToken, owner, account1, account2 };
  }

  describe("Deployment of BLT token contract", function () {
    it("Should deploy the token contract successfully", async function () {
      const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);

      const ownerBalance = await BLTToken.balanceOf(owner);

      const mintedToken = hre.ethers.parseUnits("100000", 18);

      expect(await ownerBalance).to.equal(mintedToken);
    });

    it("Should test for token holding of another account", async function () {
      const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);

      const ownerBalance = await BLTToken.balanceOf(account1);

      const mintedToken = hre.ethers.parseUnits("100000", 18);

      expect(await ownerBalance).to.equal(0);
    });

    it("Should test for token holding of another account in the case of inequality", async function () {
      const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);

      const ownerBalance = await BLTToken.balanceOf(account1);

      const mintedToken = hre.ethers.parseUnits("100000", 18);

      expect(await ownerBalance).to.not.equal(mintedToken);
    });

    it("Should test for token transfer and recieved token balance", async function () {
      const { BLTToken, owner, account1, account2 } = await loadFixture(
        deployErc20Token
      );

      const sendAmount = hre.ethers.parseUnits("10", 18);
      const senderBalance = hre.ethers.parseUnits("100000", 18);

      await BLTToken.transfer(account1, sendAmount);

      const ownerBalance = await BLTToken.balanceOf(owner);

      const account1Balance = await BLTToken.balanceOf(account1);

      await BLTToken.connect(account1).transfer;

      expect(await ownerBalance).to.equal(senderBalance - sendAmount);
      expect(await account1Balance).to.equal(sendAmount);
    });

    it("Should test for token approve and allowance token balance", async function () {
      const { BLTToken, owner, account1, account2 } = await loadFixture(
        deployErc20Token
      );

      const approveAmount = hre.ethers.parseUnits("20", 18);
      const sendAmount = hre.ethers.parseUnits("15", 18);

      await BLTToken.approve(account1, approveAmount);

      await BLTToken.connect(account1).transferFrom(
        owner,
        account2,
        sendAmount
      );

      const account2Balance = BLTToken.balanceOf(account2);

      const allowanceAfterTransfer = await BLTToken.allowance(owner, account1);

      // console.log(allowanceAfterTransfer);

      expect(await account2Balance).to.eq(sendAmount);
    });

    it("Should test for totalsupply of BLT tokens", async function () {
      const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);

      const mintedToken = hre.ethers.parseUnits("100000", 18);

      expect(await BLTToken.totalSupply()).to.equal(mintedToken);
    });

    it("Should test for name of BLT tokens", async function () {
      const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);

      const nameOfToken = await BLTToken.name();

      // console.log(nameOfToken);
      expect(await nameOfToken).to.equal("BlockLab Token");
    });

    it("Should test for symbol of BLT tokens", async function () {
      const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);

      const symbolOfToken = await BLTToken.symbol();

      // console.log("The symbol of token", symbolOfToken);
      expect(await symbolOfToken).to.equal("BLT");
    });

    it("Should test for decimal of token contract", async function () {
      const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);

      const decimalOfToken = await BLTToken.decimals();

      // console.log("The decimal of token", decimalOfToken);
      expect(await decimalOfToken).to.equal(18);
    });

    it("should help my life", async function () {
      const { BLTToken, owner, account1 } = await loadFixture(deployErc20Token);
      // console.log("BLTToken", BLTToken)
    });
  });
});
