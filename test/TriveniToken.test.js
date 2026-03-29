const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("TriveniToken", function () {

  // ─── Fixtures ──────────────────────────────────────────────
  async function deployFixture() {
    const [owner, minter, user1, user2] = await ethers.getSigners();
    const TriveniToken = await ethers.getContractFactory("TriveniToken");
    const token = await TriveniToken.deploy(owner.address);

    // Authorize minter
    await token.setRewardMinter(minter.address, true);

    return { token, owner, minter, user1, user2 };
  }

  // ─── Deployment ────────────────────────────────────────────
  describe("Deployment", function () {
    it("should set correct name and symbol", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.name()).to.equal("Triveni");
      expect(await token.symbol()).to.equal("TRV");
    });

    it("should mint 10M initial supply to owner", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      const expected = ethers.parseEther("10000000");
      expect(await token.balanceOf(owner.address)).to.equal(expected);
    });

    it("should set 100M max cap", async function () {
      const { token } = await loadFixture(deployFixture);
      const expected = ethers.parseEther("100000000");
      expect(await token.cap()).to.equal(expected);
    });

    it("should configure default activity rewards", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.activityRewards("workout")).to.equal(ethers.parseEther("10"));
      expect(await token.activityRewards("meditation")).to.equal(ethers.parseEther("5"));
      expect(await token.activityRewards("ironman_training")).to.equal(ethers.parseEther("25"));
    });
  });

  // ─── Reward Minting ────────────────────────────────────────
  describe("Reward Minting", function () {
    it("should allow authorized minter to mint rewards", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      await token.connect(minter).mintReward(user1.address, "workout", 0);
      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("10"));
    });

    it("should reject unauthorized minters", async function () {
      const { token, user1, user2 } = await loadFixture(deployFixture);

      await expect(
        token.connect(user1).mintReward(user2.address, "workout", 0)
      ).to.be.revertedWith("TRV: caller is not a reward minter");
    });

    it("should reject unknown activity types", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      await expect(
        token.connect(minter).mintReward(user1.address, "dancing", 0)
      ).to.be.revertedWith("TRV: unknown activity type");
    });

    it("should apply streak multipliers correctly", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      // 7-day streak → 1.2x multiplier → 10 * 1.2 = 12 TRV
      await token.connect(minter).mintReward(user1.address, "workout", 7);
      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("12"));
    });

    it("should apply 30-day streak multiplier", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      // 30-day streak → 1.5x → 10 * 1.5 = 15 TRV
      await token.connect(minter).mintReward(user1.address, "workout", 30);
      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("15"));
    });

    it("should apply 365-day IRONMAN streak multiplier", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      // 365-day streak → 3.0x → 25 * 3.0 = 75 TRV for ironman_training
      await token.connect(minter).mintReward(user1.address, "ironman_training", 365);
      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("75"));
    });

    it("should enforce daily reward cap", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      // Daily cap is 1000 TRV. Mint 100 workouts (10 TRV each = 1000 TRV)
      for (let i = 0; i < 100; i++) {
        await token.connect(minter).mintReward(user1.address, "workout", 0);
      }

      // 101st should fail
      await expect(
        token.connect(minter).mintReward(user1.address, "workout", 0)
      ).to.be.revertedWith("TRV: daily reward cap reached");
    });

    it("should emit RewardMinted event", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      await expect(token.connect(minter).mintReward(user1.address, "swim", 7))
        .to.emit(token, "RewardMinted")
        .withArgs(user1.address, ethers.parseEther("18"), "swim", 7); // 15 * 1.2 = 18
    });

    it("should track user stats", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      await token.connect(minter).mintReward(user1.address, "workout", 30);
      const stats = await token.getUserStats(user1.address);

      expect(stats.totalEarned).to.equal(ethers.parseEther("15")); // 10 * 1.5x
      expect(stats.currentStreak).to.equal(30);
    });
  });

  // ─── Premium Purchase (Burn) ───────────────────────────────
  describe("Premium Feature Purchase", function () {
    it("should burn tokens for premium features", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      // Give user some tokens first
      await token.connect(minter).mintReward(user1.address, "workout", 0);
      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("10"));

      // Purchase premium feature for 5 TRV
      await token.connect(user1).purchasePremiumFeature(ethers.parseEther("5"), "advanced_analytics");
      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("5"));
    });

    it("should track burn stats", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      await token.connect(minter).mintReward(user1.address, "workout", 0);
      await token.connect(user1).purchasePremiumFeature(ethers.parseEther("3"), "coaching_session");

      const stats = await token.getUserStats(user1.address);
      expect(stats.totalBurned).to.equal(ethers.parseEther("3"));
    });

    it("should reject purchase with insufficient balance", async function () {
      const { token, user1 } = await loadFixture(deployFixture);

      await expect(
        token.connect(user1).purchasePremiumFeature(ethers.parseEther("100"), "premium_plan")
      ).to.be.revertedWith("TRV: insufficient balance");
    });

    it("should emit PremiumPurchaseBurned event", async function () {
      const { token, minter, user1 } = await loadFixture(deployFixture);

      await token.connect(minter).mintReward(user1.address, "workout", 0);

      await expect(
        token.connect(user1).purchasePremiumFeature(ethers.parseEther("5"), "pro_plan")
      )
        .to.emit(token, "PremiumPurchaseBurned")
        .withArgs(user1.address, ethers.parseEther("5"), "pro_plan");
    });
  });

  // ─── Admin Functions ───────────────────────────────────────
  describe("Admin Functions", function () {
    it("should allow owner to add new activity types", async function () {
      const { token, owner, minter, user1 } = await loadFixture(deployFixture);

      await token.connect(owner).setActivityReward("yoga", ethers.parseEther("7"));
      await token.connect(minter).mintReward(user1.address, "yoga", 0);

      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("7"));
    });

    it("should allow owner to update daily reward cap", async function () {
      const { token, owner } = await loadFixture(deployFixture);

      await token.connect(owner).setDailyRewardCap(ethers.parseEther("500"));
      expect(await token.dailyRewardCap()).to.equal(ethers.parseEther("500"));
    });

    it("should allow owner to pause and unpause", async function () {
      const { token, owner, minter, user1 } = await loadFixture(deployFixture);

      await token.connect(owner).pause();
      await expect(
        token.connect(minter).mintReward(user1.address, "workout", 0)
      ).to.be.reverted;

      await token.connect(owner).unpause();
      await token.connect(minter).mintReward(user1.address, "workout", 0);
      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("10"));
    });
  });

  // ─── View / Estimation ────────────────────────────────────
  describe("View Functions", function () {
    it("should estimate rewards correctly", async function () {
      const { token } = await loadFixture(deployFixture);

      // workout base = 10, 100-day streak = 2.0x → 20 TRV
      const estimate = await token.estimateReward("workout", 100);
      expect(estimate).to.equal(ethers.parseEther("20"));
    });

    it("should return 0 for unknown activity estimates", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.estimateReward("unknown", 0)).to.equal(0);
    });
  });

  // ─── ERC20 Standard Compliance ─────────────────────────────
  describe("ERC20 Compliance", function () {
    it("should support transfers between users", async function () {
      const { token, minter, user1, user2 } = await loadFixture(deployFixture);

      await token.connect(minter).mintReward(user1.address, "workout", 0);
      await token.connect(user1).transfer(user2.address, ethers.parseEther("5"));

      expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("5"));
      expect(await token.balanceOf(user2.address)).to.equal(ethers.parseEther("5"));
    });

    it("should support approve and transferFrom", async function () {
      const { token, minter, user1, user2 } = await loadFixture(deployFixture);

      await token.connect(minter).mintReward(user1.address, "workout", 0);
      await token.connect(user1).approve(user2.address, ethers.parseEther("10"));
      await token.connect(user2).transferFrom(user1.address, user2.address, ethers.parseEther("10"));

      expect(await token.balanceOf(user2.address)).to.equal(ethers.parseEther("10"));
    });
  });
});
