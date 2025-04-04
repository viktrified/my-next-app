import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SwapContract", function () {
  async function deployErc20Token() {
    const [owner, account1, account2] = await hre.ethers.getSigners();

    const BlockLabToken = await hre.ethers.getContractFactory("BlockLab");
    const BLTToken = await BlockLabToken.deploy();

    return { BLTToken, owner, account1, account2 };
  }

  async function deployKWAGToken() {
    const [owner, account1, account2, account3, account4] =
      await hre.ethers.getSigners();
    const KWAGTokenFactory = await hre.ethers.getContractFactory("KWAG");
    const deployedKWAGToken = await KWAGTokenFactory.deploy();

    return { deployedKWAGToken, owner, account1, account2, account3, account4 };
  }

  async function deploySwapContract() {
    const [owner, account1, account2, account3] = await hre.ethers.getSigners();

    const { BLTToken } = await deployErc20Token();
    const { deployedKWAGToken } = await deployKWAGToken();

    const SwapContractContract = await hre.ethers.getContractFactory(
      "SwapContract"
    );
    const SwapContract = await SwapContractContract.deploy(
      BLTToken,
      deployedKWAGToken
    );

    return {
      SwapContract,
      tokenA: BLTToken,
      tokenB: deployedKWAGToken,
      owner,
      account1,
      account2,
      account3,
    };
  }

  describe("Deployment of BLT token contract", function () {
    it("Should swap KWAG to BLT successfully", async function () {
      const { SwapContract, account1, tokenA, tokenB } = await loadFixture(
        deploySwapContract
      );

      await tokenA.transfer(account1, 10);
      await tokenB.transfer(SwapContract, 10);
      await tokenA.connect(account1).approve(SwapContract, 10);
      await SwapContract.connect(account1).KWAGToBLT(2);

      expect(await tokenA.balanceOf(SwapContract)).to.equal(2);
    });

    it("Should swap BLT to KWAG successfully", async function () {
      const { SwapContract, account1, tokenA, tokenB } = await loadFixture(
        deploySwapContract
      );

      await tokenB.transfer(account1, 10);
      await tokenA.transfer(SwapContract, 10);
      await tokenB.connect(account1).approve(SwapContract, 10);
      await SwapContract.connect(account1).BLTToKWAG(2);

      expect(await tokenB.balanceOf(SwapContract)).to.equal(2);
    });

    it("Should get a swapper successfully", async function () {
      const { SwapContract, account1, tokenA, tokenB } = await loadFixture(
        deploySwapContract
      );

      await tokenB.transfer(account1, 10);
      await tokenA.transfer(SwapContract, 10);
      await tokenB.connect(account1).approve(SwapContract, 10);
      await SwapContract.connect(account1).BLTToKWAG(2);

      const swapper = await SwapContract.getSwapper(account1.address);

      expect(swapper.hasSwaped).to.equal(true);
      expect(swapper.numberOfSwaps).to.equal(1);
    });
  });
});
