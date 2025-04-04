import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("KWAG Token", function () {
  async function deployKWAGToken() {
    const [owner, account1, account2, account3, account4] =
      await hre.ethers.getSigners();
    const KWAGTokenFactory = await hre.ethers.getContractFactory("KWAG");
    const deployedKWAGToken = await KWAGTokenFactory.deploy();

    return { deployedKWAGToken, owner, account1, account2, account3, account4 };
  }

  describe("Deployment", function () {
    it("Should test that deployer is owner", async function () {
      const { deployedKWAGToken, owner } = await loadFixture(deployKWAGToken);

      expect(await deployedKWAGToken.owner()).to.be.eq(owner.address);
    });

    it("Should test that minted token is totalSupply", async function () {
      const { deployedKWAGToken, owner } = await loadFixture(deployKWAGToken);

      const ownerBalance = await deployedKWAGToken.balanceOf(owner.address);
      const mintedToken = hre.ethers.parseUnits("1000000", 18);

      expect(ownerBalance).to.be.eq(mintedToken);
    });

    it("Should test that name, symbol and decimals are valid", async function () {
      const { deployedKWAGToken, owner } = await loadFixture(deployKWAGToken);

      expect(await deployedKWAGToken.name()).to.eq("Kwagarelly Token");
      expect(await deployedKWAGToken.symbol()).to.eq("KWAG");
      expect(await deployedKWAGToken.decimals()).to.eq(18);
    });
  });

  describe("User Balance", function () {
    it("Should test that users balance are stored", async function () {
      const { deployedKWAGToken, owner, account1, account2 } =
        await loadFixture(deployKWAGToken);

      const ownerBalance = await deployedKWAGToken.balanceOf(owner.address);
      const account1Balance = await deployedKWAGToken.balanceOf(
        account1.address
      );
      const account2Balance = await deployedKWAGToken.balanceOf(
        account2.address
      );

      expect(ownerBalance).to.be.eq(hre.ethers.parseUnits("1000000", 18));
      expect(account1Balance).to.be.eq(0);
      expect(account2Balance).to.be.eq(0);
    });
  });

  describe("Tranfer", function () {
    it("Should transfer token successfully", async function () {
      const { deployedKWAGToken, owner, account1 } = await loadFixture(
        deployKWAGToken
      );

      const amount500 = hre.ethers.parseUnits("5000", 18);
      const initialOwnerBalance = await deployedKWAGToken.balanceOf(
        owner.address
      );
      await deployedKWAGToken.transfer(account1.address, amount500);
      const finalOwnerBalance = await deployedKWAGToken.balanceOf(
        owner.address
      );
      const account1Balance = await deployedKWAGToken.balanceOf(
        account1.address
      );

      expect(finalOwnerBalance).to.eq(initialOwnerBalance - amount500);
      expect(account1Balance).to.eq(amount500);
    });

    it("Should fail if user has insufficient balance", async function () {
      const { deployedKWAGToken, account1, account2 } = await loadFixture(
        deployKWAGToken
      );

      const amount500 = hre.ethers.parseUnits("5000", 18);

      await expect(
        deployedKWAGToken
          .connect(account1)
          .transfer(account2.address, amount500)
      )
        .to.be.revertedWithCustomError(deployedKWAGToken, "InsufficientBalance")
        .withArgs(0, amount500);
      expect(await deployedKWAGToken.balanceOf(account1.address)).to.eq(0);
      expect(await deployedKWAGToken.balanceOf(account2.address)).to.eq(0);
    });
  });

  describe("Approve", function () {
    it("Should allow an account to approve another", async function () {
      const { deployedKWAGToken, owner, account1 } = await loadFixture(
        deployKWAGToken
      );

      const amount500 = hre.ethers.parseUnits("5000", 18);

      await deployedKWAGToken.approve(account1.address, amount500);

      const allowance = await deployedKWAGToken.allowance(
        owner.address,
        account1.address
      );

      expect(allowance).to.equal(amount500);
    });

    it("Should fail approval if sender has insufficient balance", async function () {
      const { deployedKWAGToken, owner, account1, account2 } =
        await loadFixture(deployKWAGToken);

      const account1Balance = await deployedKWAGToken.balanceOf(
        account1.address
      );
      const amount500 = hre.ethers.parseUnits("5000", 18);

      await expect(
        deployedKWAGToken.connect(account1).approve(account2.address, amount500)
      )
        .to.be.revertedWithCustomError(deployedKWAGToken, "InsufficientBalance")
        .withArgs(0, amount500);
      expect(await deployedKWAGToken.balanceOf(account1.address)).to.eq(0);
    });
  });

  describe("TransferFrom", function () {
    it("Should allow an account with allowance to call transferFrom", async function () {
      const { deployedKWAGToken, owner, account1, account2 } =
        await loadFixture(deployKWAGToken);

      const amount500 = hre.ethers.parseUnits("5000", 18);

      await deployedKWAGToken.approve(account1.address, amount500);
      await deployedKWAGToken
        .connect(account1)
        .transferFrom(owner.address, account2.address, amount500);

      expect(await deployedKWAGToken.balanceOf(account2.address)).to.be.eq(
        amount500
      );
    });

    it("Should fail if sender has insufficient balance", async function () {
      const { deployedKWAGToken, owner, account1, account2 } =
        await loadFixture(deployKWAGToken);

      const amount500 = hre.ethers.parseUnits("500", 18);

      await expect(
        deployedKWAGToken.connect(account1).approve(account2.address, amount500)
      )
        .to.be.revertedWithCustomError(deployedKWAGToken, "InsufficientBalance")
        .withArgs(0, amount500);
    });

    it("Should fail approval if sender", async function () {
      const { deployedKWAGToken, owner, account1, account2, account3 } =
        await loadFixture(deployKWAGToken);

      const amount500 = hre.ethers.parseUnits("500", 18);

      await expect(
        deployedKWAGToken
          .connect(account1)
          .transferFrom(owner, account2, amount500)
      )
        .to.be.revertedWithCustomError(
          deployedKWAGToken,
          "InsufficientAllowance"
        )
        .withArgs(
          deployedKWAGToken.balanceOf(owner),
          deployedKWAGToken.allowance(owner, account1),
          amount500
        );
    });
  });
});
