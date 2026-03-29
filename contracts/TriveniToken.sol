// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║                    TRIVENI TOKEN (TRV)                   ║
 * ║          Wellness Rewards for Body, Spirit & Nutrition    ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * The native utility token for the TRIVENI wellness ecosystem.
 *
 * Token Utility:
 *   - Earn TRV for completing workouts, meditation, nutrition goals
 *   - Streak bonuses for sustained consistency
 *   - Spend TRV on premium features, coaching, and challenges
 *   - Burn mechanism on premium purchases (deflationary pressure)
 *
 * Tokenomics:
 *   - Max Supply:       100,000,000 TRV (100M)
 *   - Initial Mint:      10,000,000 TRV (10M) → Founder/Treasury
 *   - Reward Pool:       60,000,000 TRV (60M) → Minted over time via rewards
 *   - Dev/Marketing:     20,000,000 TRV (20M) → Vested over 2 years
 *   - Community/Airdrops: 10,000,000 TRV (10M)
 *
 * Deployed on: Polygon (MATIC)
 */
contract TriveniToken is ERC20, ERC20Burnable, ERC20Capped, Ownable, Pausable {

    // ─── Roles ───────────────────────────────────────────────
    /// @notice Addresses authorized to mint reward tokens (backend relayers)
    mapping(address => bool) public rewardMinters;

    // ─── Reward Configuration ────────────────────────────────
    /// @notice Base reward amounts per activity type (in wei, 18 decimals)
    mapping(string => uint256) public activityRewards;

    /// @notice Streak multiplier thresholds: streak days → multiplier basis points (10000 = 1x)
    /// e.g., 7 days → 12000 (1.2x), 30 days → 15000 (1.5x), 100 days → 20000 (2x)
    uint256[] public streakThresholds;
    uint256[] public streakMultipliers;

    // ─── User Tracking ───────────────────────────────────────
    struct UserStats {
        uint256 totalEarned;
        uint256 totalBurned;
        uint256 currentStreak;
        uint256 lastActivityTimestamp;
    }
    mapping(address => UserStats) public userStats;

    // ─── Daily Reward Cap (anti-abuse) ───────────────────────
    uint256 public dailyRewardCap = 1000 * 10 ** 18; // 1000 TRV per user per day
    mapping(address => mapping(uint256 => uint256)) public dailyRewardsUsed; // user → day → amount

    // ─── Events ──────────────────────────────────────────────
    event RewardMinted(address indexed user, uint256 amount, string activityType, uint256 streakDays);
    event PremiumPurchaseBurned(address indexed user, uint256 amount, string featureId);
    event RewardMinterUpdated(address indexed minter, bool authorized);
    event ActivityRewardUpdated(string activityType, uint256 rewardAmount);
    event StreakUpdated(address indexed user, uint256 newStreak);

    // ─── Modifiers ───────────────────────────────────────────
    modifier onlyRewardMinter() {
        require(rewardMinters[msg.sender], "TRV: caller is not a reward minter");
        _;
    }

    // ─── Constructor ─────────────────────────────────────────
    constructor(address initialOwner)
        ERC20("Triveni", "TRV")
        ERC20Capped(100_000_000 * 10 ** 18) // 100M max supply
        Ownable(initialOwner)
    {
        // Mint initial treasury allocation to owner
        _mint(initialOwner, 10_000_000 * 10 ** 18); // 10M initial

        // Set default activity rewards
        activityRewards["workout"]    = 10 * 10 ** 18;  // 10 TRV per workout
        activityRewards["meditation"] = 5  * 10 ** 18;  //  5 TRV per meditation session
        activityRewards["nutrition"]  = 8  * 10 ** 18;  //  8 TRV per nutrition goal met
        activityRewards["swim"]       = 15 * 10 ** 18;  // 15 TRV per swim session
        activityRewards["run"]        = 12 * 10 ** 18;  // 12 TRV per run
        activityRewards["cycle"]      = 12 * 10 ** 18;  // 12 TRV per cycle session
        activityRewards["ironman_training"] = 25 * 10 ** 18; // 25 TRV for IRONMAN sessions

        // Set streak multiplier tiers
        streakThresholds.push(7);    streakMultipliers.push(12000); // 7-day  → 1.2x
        streakThresholds.push(30);   streakMultipliers.push(15000); // 30-day → 1.5x
        streakThresholds.push(100);  streakMultipliers.push(20000); // 100-day → 2.0x
        streakThresholds.push(365);  streakMultipliers.push(30000); // 365-day → 3.0x
    }

    // ─── Core: Reward Minting ────────────────────────────────

    /**
     * @notice Mint reward tokens to a user for completing an activity
     * @param user         The user's wallet address
     * @param activityType Activity identifier (e.g., "workout", "meditation")
     * @param streakDays   Current streak count for this user
     */
    function mintReward(
        address user,
        string calldata activityType,
        uint256 streakDays
    ) external onlyRewardMinter whenNotPaused {
        uint256 baseReward = activityRewards[activityType];
        require(baseReward > 0, "TRV: unknown activity type");

        // Apply streak multiplier
        uint256 multiplier = _getStreakMultiplier(streakDays);
        uint256 finalReward = (baseReward * multiplier) / 10000;

        // Enforce daily cap
        uint256 today = block.timestamp / 1 days;
        require(
            dailyRewardsUsed[user][today] + finalReward <= dailyRewardCap,
            "TRV: daily reward cap reached"
        );
        dailyRewardsUsed[user][today] += finalReward;

        // Ensure we don't exceed max supply
        require(totalSupply() + finalReward <= cap(), "TRV: would exceed max supply");

        // Mint and track
        _mint(user, finalReward);

        // Update user stats
        userStats[user].totalEarned += finalReward;
        userStats[user].currentStreak = streakDays;
        userStats[user].lastActivityTimestamp = block.timestamp;

        emit RewardMinted(user, finalReward, activityType, streakDays);
        emit StreakUpdated(user, streakDays);
    }

    // ─── Core: Premium Feature Purchase (Burn) ───────────────

    /**
     * @notice User burns tokens to unlock a premium feature
     * @param amount    Tokens to burn (in wei)
     * @param featureId Identifier for the premium feature being purchased
     */
    function purchasePremiumFeature(
        uint256 amount,
        string calldata featureId
    ) external whenNotPaused {
        require(balanceOf(msg.sender) >= amount, "TRV: insufficient balance");

        _burn(msg.sender, amount);
        userStats[msg.sender].totalBurned += amount;

        emit PremiumPurchaseBurned(msg.sender, amount, featureId);
    }

    // ─── Admin Functions ─────────────────────────────────────

    function setRewardMinter(address minter, bool authorized) external onlyOwner {
        rewardMinters[minter] = authorized;
        emit RewardMinterUpdated(minter, authorized);
    }

    function setActivityReward(string calldata activityType, uint256 rewardAmount) external onlyOwner {
        activityRewards[activityType] = rewardAmount;
        emit ActivityRewardUpdated(activityType, rewardAmount);
    }

    function setDailyRewardCap(uint256 newCap) external onlyOwner {
        dailyRewardCap = newCap;
    }

    function setStreakTiers(
        uint256[] calldata _thresholds,
        uint256[] calldata _multipliers
    ) external onlyOwner {
        require(_thresholds.length == _multipliers.length, "TRV: array length mismatch");
        delete streakThresholds;
        delete streakMultipliers;
        for (uint256 i = 0; i < _thresholds.length; i++) {
            streakThresholds.push(_thresholds[i]);
            streakMultipliers.push(_multipliers[i]);
        }
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // ─── View Functions ──────────────────────────────────────

    function getStreakMultiplier(uint256 streakDays) external view returns (uint256) {
        return _getStreakMultiplier(streakDays);
    }

    function getUserStats(address user) external view returns (UserStats memory) {
        return userStats[user];
    }

    function estimateReward(
        string calldata activityType,
        uint256 streakDays
    ) external view returns (uint256) {
        uint256 baseReward = activityRewards[activityType];
        if (baseReward == 0) return 0;
        uint256 multiplier = _getStreakMultiplier(streakDays);
        return (baseReward * multiplier) / 10000;
    }

    // ─── Internal ────────────────────────────────────────────

    function _getStreakMultiplier(uint256 streakDays) internal view returns (uint256) {
        uint256 multiplier = 10000; // 1x default
        for (uint256 i = 0; i < streakThresholds.length; i++) {
            if (streakDays >= streakThresholds[i]) {
                multiplier = streakMultipliers[i];
            } else {
                break;
            }
        }
        return multiplier;
    }

    // ─── Required Overrides ──────────────────────────────────

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value);
    }
}
