## Web3 Requirements (Solana)

This document lists the on-chain programs and components needed for the platform to function end to end on Solana (no project-specific branding).

### Core Programs
- **Access NFT (Token-2022 / Metaplex)**  
  - Mint/burn transfer-restricted NFTs representing channel access.  
  - Configurable max supply, mint price, allowlist, and owner-controlled minting windows.  
  - Role-based controls for pausing, metadata updates (URI), royalties (creator shares), and withdrawal of proceeds.  
  - Optional transfer hooks to enforce cooldowns or blocklisted addresses.

- **Prediction Market Program**  
  - Create markets with resolution source, outcomes, start/end time, and liquidity parameters.  
  - Supports trading (AMM curve or orderbook), collateral deposits/withdrawals, fee accrual, and slippage controls.  
  - Outcome resolution via designated oracle; supports disputes/appeals and resolution finalization.  
  - Payout/claim instruction to settle winning positions and release collateral for losers.  
  - Emits events (via logs) for market lifecycle: created, liquidity added/removed, trades, resolution, payouts.

- **Oracle / Resolution Module**  
  - Designated resolvers or external oracle feed to report outcomes.  
  - Dispute window with bonds/stakes; slash malicious resolvers and reward correct challengers.  
  - Finalization process that locks further disputes and unblocks payouts.

- **Treasury / Fee Splitter**  
  - Receives protocol fees from trading and mints.  
  - Configurable splits to stakeholders (e.g., protocol, channel owner, referrers).  
  - Supports periodic withdrawals and emits distribution events.

- **Leaderboard / Stats Indexing (Off-chain + Verifiable Data)**  
  - Indexer (e.g., custom service or Helium/Trident/Switchboard feeds) to derive volumes, PnL, win rates, and market stats from program logs.  
  - Optionally provide Merkle roots or signed snapshots for client-side verification of computed stats.

### Access Control and Permissions
- **Roles:** admin, market creator, resolver/oracle, fee collector, channel owner.  
- **Pausable/Safe Mode:** ability to pause minting/trading/resolution pathways independently.  
- **Upgradability:** governed upgrade (e.g., program upgrade authority held by multisig with timelock/guard).

### Token and Payment Considerations
- **Accepted Collateral:** SPL stablecoin for trading and settlement.  
- **Mint Payments:** accept SPL stablecoin (and optionally SOL) for access NFTs; enforce per-channel pricing.  
- **Royalties:** Metaplex creator shares/royalties on secondary sales; marketplace must honor them.  
- **Escrow:** optional escrow for disputed markets; release upon finalization.

### Security and Integrity
- **Reentrancy and PDA Auth:** enforce signer/owner checks and PDA seeds; avoid arbitrary CPI.  
- **Slippage / Price Bounds** on trades and liquidity adds/removes.  
- **Oracle Integrity:** dispute bonds sized to economic risk; resolution timeouts; clear liveness rules.  
- **Rate Limits / Guardrails:** per-wallet mint limits, transfer cooldowns for access NFTs if desired.  
- **Audit and Monitoring:** external audits, runtime alerts on anomalous volumes or resolutions.

### Frontend Integration Points
- **Program IDs and IDLs** exposed to the client for: access NFT mint/burn/transfer, market trade/resolve/claim, fee/treasury reads.  
- **Event Streams:** listen to program logs for MarketCreated, Trade, LiquidityAdded/Removed, Resolved, PayoutClaimed, AccessMinted/Burned/Transferred.  
- **Indexing API:** endpoint that surfaces aggregates for leaderboards (volume24h, price change, win rate, PnL) and channel stats (supply, holders).

### Operational Flows
- **Channel Launch:** create/register channel with supply, mint price, URI, royalty, and access gating config.  
- **Trading:** users approve collateral, trade outcomes, adjust positions; fees routed to treasury.  
- **Resolution:** oracle submits outcome → dispute window → finalize → users claim payouts.  
- **Access Management:** mint/burn/transfer access NFTs; client/back-end uses ownership to gate content.  
- **Withdrawals:** authorized roles withdraw accumulated protocol/channel fees and royalties.

### Optional Enhancements
- **Referral Program:** track referrer addresses on mint/trade; fee rebates or points via storage or off-chain attestation.  
- **Points / Loyalty:** on-chain or off-chain points with signed attestations and Merkle claims.  
- **Batching:** CPI/multicall patterns to bundle approve + trade/mint to reduce UX friction.  
- **Cross-Chain Support:** if multi-chain, include bridge or canonical registry for channels and markets with message verification.

### Deployment Checklist
- Configure environment-specific accounts (collateral mint, access NFT mint/program, market/oracle program IDs, treasury accounts).  
- Set initial roles and transfer upgrade authority to multisig/timelock.  
- Seed indexer; publish program IDs/IDLs to the frontend.  
- Run test markets end-to-end: create → trade → resolve → dispute (happy/unhappy paths) → finalize → claim → fee withdrawal.  
- Validate access gating using NFT ownership in the client/auth layer.

