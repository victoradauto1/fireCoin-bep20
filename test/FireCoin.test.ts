import {
  loadFixture,
  time
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("FireCoin tests", function () {

  async function deployFixture() {
   
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const FireCoin = await hre.ethers.getContractFactory("FireCoin");
    const fireCoin = await FireCoin.deploy();

    return { fireCoin, owner, otherAccount };
  }

    it("Should have correct name", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);

      const name = await fireCoin.name();
      expect(name).to.equal("FireCoinPro2")
    });

    it("Should have correct symbol", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);

      const symbol = await fireCoin.symbol();
      expect(symbol).to.equal("FRCP2")
    });
    it("Should have correct decimals", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);

      const decimals = await fireCoin.decimals();
      expect(decimals).to.equal(18);
    });

    it("Should have correct amout supply", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);

      expect(await fireCoin.totalSupply()).to.equal(10000000n * 10n** 18n);
    });

    it("Should get balance", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);
      const balance = await fireCoin.balanceOf(owner.address);
      expect(balance).to.equal(await fireCoin.totalSupply());
    });

    it("Should tranfer", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);
      const balanceOwnerBefore = await fireCoin.balanceOf(owner.address);
      const balanceOtherBefore = await fireCoin.balanceOf(otherAccount.address);
      await fireCoin.transfer(otherAccount.address, 1n)
      const balanceOwnerAfter = await fireCoin.balanceOf(owner.address);
      const balanceOtherAfter = await fireCoin.balanceOf(otherAccount.address);
      expect(balanceOwnerBefore).to.equal(10000000n * 10n** 18n);
      expect(balanceOtherBefore).to.equal(0);
      expect(balanceOwnerAfter).to.equal((10000000n * 10n** 18n) - 1n);
      expect(balanceOtherAfter).to.equal(1n);
    });
  
    it("Should NOT tranfer", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);
      
      const instance = fireCoin.connect(otherAccount);
      await expect(instance.transfer(owner, 1n)).to.be.revertedWithCustomError(fireCoin, "ERC20InsufficientBalance");
    });

    it("Should approve", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);
      await fireCoin.approve(otherAccount.address, 1n);
      const allowance = await fireCoin.allowance(owner.address,otherAccount.address)
      expect(allowance).to.equal(1n);
    });

    it("Should tranfer from", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);
      await fireCoin.approve(otherAccount.address, 10n)
      const instance = fireCoin.connect(otherAccount);
      const balanceOwnerBefore = await fireCoin.balanceOf(owner.address);
      const balanceOtherBefore = await fireCoin.balanceOf(otherAccount.address);
      await instance.transferFrom(owner.address, otherAccount.address, 5n)
      const balanceOwnerAfter = await fireCoin.balanceOf(owner.address);
      const balanceOtherAfter = await fireCoin.balanceOf(otherAccount.address);

      const value = await fireCoin.allowance(owner, otherAccount);

      expect(balanceOwnerBefore).to.equal(10000000n * 10n** 18n);
      expect(balanceOtherBefore).to.equal(0);
      expect(balanceOwnerAfter).to.equal((10000000n * 10n** 18n) - 5n);
      expect(balanceOtherAfter).to.equal(5n);
      expect(value).to.equal(5n);
    });

    it("Should NOT tranfer from (Insufficent Balance)", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);
    
      const instance = fireCoin.connect(otherAccount);
      await instance.approve(owner.address, 1n)
  
      await expect(fireCoin.transferFrom(otherAccount.address, otherAccount.address, 50n)).to.be.revertedWithCustomError(fireCoin, "ERC20InsufficientAllowance");

    });

    it("Should NOT tranfer from (Insufficent allowance)", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);
      const instance = fireCoin.connect(otherAccount);
  
      await expect(instance.transferFrom(owner.address, otherAccount.address, 50n)).to.be.revertedWithCustomError(fireCoin, "ERC20InsufficientAllowance");
    });

    it("Should mint once", async function () {
      const { fireCoin, owner } = await loadFixture(deployFixture);
      
      const mintAmount = 1000n;
      await fireCoin.setMintingAmount(mintAmount);
      
      const balanceBefore = await fireCoin.balanceOf(owner.address);
      await fireCoin.mint(owner.address);
      const balanceAfter = await fireCoin.balanceOf(owner.address);
      
      expect(balanceAfter).to.equal(balanceBefore + mintAmount);
  });
  
  it("Should mint twice (differents accounts)", async function () {
      const { fireCoin, owner } = await loadFixture(deployFixture);
      
      const mintAmount = 1000n;
      await fireCoin.setMintingAmount(mintAmount);
      
      const balanceBefore = await fireCoin.balanceOf(owner.address);
      await fireCoin.mint(owner.address);
      const balanceAfter = await fireCoin.balanceOf(owner.address);
      
      expect(balanceAfter).to.equal(balanceBefore + mintAmount);
  });

    it("Should NOT mint amount", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);
     
      const mintAmount = 1000n;

      const instance = fireCoin.connect(otherAccount);

      await expect(instance.setMintingAmount(mintAmount)).to.be.revertedWith("Your do not have permission.")
    });

    it("Should NOT mint", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);

      await expect(fireCoin.mint(owner.address)).to.be.revertedWith("Minting is not enabled.")
    });

    it("Should NOT mint twince", async function () {
      const { fireCoin, owner, otherAccount } = await loadFixture(deployFixture);

      await fireCoin.setMintingAmount(1000n);

      await fireCoin.mint(owner.address);

      await expect(fireCoin.mint(owner.address)).to.be.revertedWith("You cannot mint twice in a row.")
    });
});
