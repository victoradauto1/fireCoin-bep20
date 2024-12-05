import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ProtoCoin tests", function () {

  async function deployFixture() {
   
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const ProtoCoin = await hre.ethers.getContractFactory("ProtoCoin");
    const protoCoin = await ProtoCoin.deploy();

    return { protoCoin, owner, otherAccount };
  }

    it("Should have correct name", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);

      const name = await protoCoin.name();
      expect(name).to.equal("ProtoCoin")
    });

    it("Should have correct symbol", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);

      const symbol = await protoCoin.symbol();
      expect(symbol).to.equal("PRC")
    });
    it("Should have correct decimals", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);

      const decimals = await protoCoin.decimals();
      expect(decimals).to.equal(18);
    });

    it("Should have correct amout supply", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);

      expect(await protoCoin.totalSupply()).to.equal(1000n * 10n** 18n);
    });

    it("Should get balance", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);
      const balance = await protoCoin.balanceOf(owner.address);
      expect(balance).to.equal(await protoCoin.totalSupply());
    });

    it("Should tranfer", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);
      const balanceOwnerBefore = await protoCoin.balanceOf(owner.address);
      const balanceOtherBefore = await protoCoin.balanceOf(otherAccount.address);
      await protoCoin.transfer(otherAccount.address, 1n)
      const balanceOwnerAfter = await protoCoin.balanceOf(owner.address);
      const balanceOtherAfter = await protoCoin.balanceOf(otherAccount.address);
      expect(balanceOwnerBefore).to.equal(1000n * 10n** 18n);
      expect(balanceOtherBefore).to.equal(0);
      expect(balanceOwnerAfter).to.equal((1000n * 10n** 18n) - 1n);
      expect(balanceOtherAfter).to.equal(1n);
    });
  
    it("Should NOT tranfer", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);
      
      const instance = protoCoin.connect(otherAccount);
      await expect(instance.transfer(owner, 1n)).to.be.revertedWith("Insufficent balance.");
    });

    it("Should approve", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);
      await protoCoin.approve(otherAccount.address, 1n);
      const allowance = await protoCoin.allowance(owner.address,otherAccount.address)
      expect(allowance).to.equal(1n);
    });

    it("Should tranfer from", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);
      await protoCoin.approve(otherAccount.address, 10n)
      const instance = protoCoin.connect(otherAccount);
      const balanceOwnerBefore = await protoCoin.balanceOf(owner.address);
      const balanceOtherBefore = await protoCoin.balanceOf(otherAccount.address);
      await instance.transferFrom(owner.address, otherAccount.address, 5n)
      const balanceOwnerAfter = await protoCoin.balanceOf(owner.address);
      const balanceOtherAfter = await protoCoin.balanceOf(otherAccount.address);

      const value = await protoCoin.allowance(owner, otherAccount);

      expect(balanceOwnerBefore).to.equal(1000n * 10n** 18n);
      expect(balanceOtherBefore).to.equal(0);
      expect(balanceOwnerAfter).to.equal((1000n * 10n** 18n) - 5n);
      expect(balanceOtherAfter).to.equal(5n);
      expect(value).to.equal(5n);
    });

    it("Should NOT tranfer from (Insufficent Balance)", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);
    
      const instance = protoCoin.connect(otherAccount);
  
      await expect(instance.transferFrom(otherAccount.address, otherAccount.address, 50n)).to.be.revertedWith("Insufficient balance.");
    });

    it("Should NOT tranfer from (Insufficent allowance)", async function () {
      const { protoCoin, owner, otherAccount } = await loadFixture(deployFixture);
      const instance = protoCoin.connect(otherAccount);
  
      await expect(instance.transferFrom(owner.address, otherAccount.address, 50n)).to.be.revertedWith("Insufficient allowance.");
    });
});
