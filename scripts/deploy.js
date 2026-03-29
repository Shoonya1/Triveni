const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║           TRIVENI TOKEN (TRV) DEPLOYMENT         ║");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log(`║  Network:  ${hre.network.name.padEnd(38)}║`);
  console.log(`║  Deployer: ${deployer.address.substring(0, 36)}...  ║`);
  console.log("╚══════════════════════════════════════════════════╝");

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`\n💰 Deployer balance: ${hre.ethers.formatEther(balance)} MATIC\n`);

  // Deploy TriveniToken
  console.log("🚀 Deploying TriveniToken...");
  const TriveniToken = await hre.ethers.getContractFactory("TriveniToken");
  const token = await TriveniToken.deploy(deployer.address);
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log(`✅ TriveniToken deployed to: ${tokenAddress}`);

  // Log initial state
  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  const cap = await token.cap();
  const ownerBalance = await token.balanceOf(deployer.address);

  console.log("\n📊 Token Details:");
  console.log(`   Name:           ${name}`);
  console.log(`   Symbol:         ${symbol}`);
  console.log(`   Total Supply:   ${hre.ethers.formatEther(totalSupply)} TRV`);
  console.log(`   Max Supply:     ${hre.ethers.formatEther(cap)} TRV`);
  console.log(`   Owner Balance:  ${hre.ethers.formatEther(ownerBalance)} TRV`);

  // Log reward configuration
  console.log("\n🏋️ Activity Rewards:");
  const activities = ["workout", "meditation", "nutrition", "swim", "run", "cycle", "ironman_training"];
  for (const activity of activities) {
    const reward = await token.activityRewards(activity);
    console.log(`   ${activity.padEnd(18)} ${hre.ethers.formatEther(reward)} TRV`);
  }

  // Log streak multipliers
  console.log("\n🔥 Streak Multipliers:");
  const streakLabels = ["7-day", "30-day", "100-day", "365-day"];
  for (let i = 0; i < 4; i++) {
    const threshold = await token.streakThresholds(i);
    const multiplier = await token.streakMultipliers(i);
    console.log(`   ${streakLabels[i].padEnd(10)} streak → ${Number(multiplier) / 10000}x multiplier`);
  }

  console.log("\n─────────────────────────────────────────────────");
  console.log("📋 NEXT STEPS:");
  console.log("   1. Set up a reward minter (backend relayer):");
  console.log(`      await token.setRewardMinter("<RELAYER_ADDRESS>", true)`);
  console.log("   2. Add token to MetaMask:");
  console.log(`      Contract: ${tokenAddress}`);
  console.log("      Symbol: TRV | Decimals: 18");
  console.log("   3. Verify on PolygonScan:");
  console.log(`      npx hardhat verify --network polygon ${tokenAddress} "${deployer.address}"`);
  console.log("─────────────────────────────────────────────────\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
