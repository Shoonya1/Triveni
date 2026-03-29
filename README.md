# 🔱 TRIVENI Token (TRV)

**Wellness rewards for Body, Spirit & Nutrition — deployed on Polygon**

---

## Overview

TRIVENI Token (TRV) is the native utility token for the TRIVENI wellness ecosystem. Users earn TRV by completing workouts, meditation sessions, nutrition goals, and maintaining consistency streaks. Tokens can be spent on premium features within the app.

## Tokenomics

| Allocation        | Amount      | Percentage | Details                           |
|-------------------|-------------|------------|-----------------------------------|
| Initial Treasury  | 10,000,000  | 10%        | Minted at deployment to owner     |
| Reward Pool       | 60,000,000  | 60%        | Minted over time via user rewards |
| Dev & Marketing   | 20,000,000  | 20%        | Vested over 2 years               |
| Community/Airdrops| 10,000,000  | 10%        | Community growth initiatives      |
| **Max Supply**    |**100,000,000**| **100%** | Hard cap, can never be exceeded   |

## Activity Rewards

| Activity          | Base Reward | With 7-day Streak | 30-day | 100-day | 365-day |
|-------------------|-------------|-------------------|--------|---------|---------|
| Workout           | 10 TRV      | 12 TRV            | 15 TRV | 20 TRV  | 30 TRV  |
| Meditation        | 5 TRV       | 6 TRV             | 7.5 TRV| 10 TRV  | 15 TRV  |
| Nutrition Goal    | 8 TRV       | 9.6 TRV           | 12 TRV | 16 TRV  | 24 TRV  |
| Swim Session      | 15 TRV      | 18 TRV            | 22.5 TRV| 30 TRV | 45 TRV  |
| Run               | 12 TRV      | 14.4 TRV          | 18 TRV | 24 TRV  | 36 TRV  |
| Cycle             | 12 TRV      | 14.4 TRV          | 18 TRV | 24 TRV  | 36 TRV  |
| IRONMAN Training  | 25 TRV      | 30 TRV            | 37.5 TRV| 50 TRV | 75 TRV  |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your private key and API keys

# 3. Compile contracts
npm run compile

# 4. Run tests
npm test

# 5. Deploy to testnet
npm run deploy:testnet

# 6. Deploy to mainnet (when ready)
npm run deploy:mainnet
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TRIVENI Flutter App                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Body     │  │  Spirit  │  │  Nutrition            │  │
│  │  Module   │  │  Module  │  │  Module               │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────────────────┘  │
│       └──────────────┼─────────────┘                     │
│                      ▼                                   │
│            ┌─────────────────┐                           │
│            │  Backend API     │                           │
│            │  (Node.js)       │                           │
│            └────────┬────────┘                           │
└─────────────────────┼───────────────────────────────────┘
                      ▼
         ┌────────────────────────┐
         │  Reward Minter Relayer  │  (authorized backend wallet)
         └────────────┬───────────┘
                      ▼
    ┌─────────────────────────────────────┐
    │        Polygon Network               │
    │  ┌───────────────────────────────┐  │
    │  │     TriveniToken Contract      │  │
    │  │  ┌─────────┐ ┌────────────┐   │  │
    │  │  │ mintReward│ │ burnForPrem│   │  │
    │  │  └─────────┘ └────────────┘   │  │
    │  └───────────────────────────────┘  │
    └─────────────────────────────────────┘
```

## Security Features

- **Capped Supply**: Hard cap of 100M tokens, enforced on-chain
- **Daily Reward Cap**: 1000 TRV per user per day (configurable)
- **Role-Based Minting**: Only authorized minter addresses can create rewards
- **Pausable**: Owner can pause all token operations in emergencies
- **Burn Mechanism**: Premium purchases permanently destroy tokens

## Contract Verification

After deployment, verify on PolygonScan:

```bash
npx hardhat verify --network polygon <CONTRACT_ADDRESS> "<OWNER_ADDRESS>"
```

## Integration with TRIVENI App

```javascript
// Example: Reward a user for completing a workout (backend)
const ethers = require("ethers");

const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
const signer = new ethers.Wallet(process.env.MINTER_PRIVATE_KEY, provider);
const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);

// Reward user for a workout with a 30-day streak
await token.mintReward(userWalletAddress, "workout", 30);
// User receives 15 TRV (10 base × 1.5x streak multiplier)
```

## License

MIT
