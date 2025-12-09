## Web3 Program Requirements (Solana)

Practical list of on-chain programs, accounts, and flows the EDGE platform needs to operate reliably.

### Core On-Chain Pieces
- **Access NFT program (Token-2022/Metaplex)**  
  - Access tokens for channels; mint/burn; optional transfer restrictions/cooldowns.  
  - Config: supply cap, mint price, allowlist, mint windows, metadata URI, creator shares/royalties.  
  - Controls: pause minting/transfers; update metadata/royalties; withdraw proceeds.

- **Prediction market program**  
  - Create markets (source, outcomes, start/end, liquidity params).  
  - Trade via AMM or orderbook; handle collateral deposits/withdrawals; collect fees; enforce slippage bounds.  
  - Resolve outcomes via designated oracle; support disputes/appeals; finalize and unlock claims.  
  - Payout instruction to settle winning positions; emit logs for create/liquidity/trade/resolve/payout.

- **Oracle / resolution module**  
  - Resolver submits outcome; dispute window with bonded challenges; slash bad actors; reward correct challengers.  
  - Finalization step closes disputes and enables claims.

- **Treasury / fee splitter**  
  - Receive protocol + channel fees from trades/mints.  
  - Configurable splits; periodic withdrawals; emit distribution logs.

- **Indexing / stats**  
  - Off-chain indexer consuming program logs to surface volume, PnL, win rate, holders/supply.  
  - Optional signed snapshots or Merkle roots for client verification.

### Access, Roles, Upgrades
- Roles: admin, market creator, resolver/oracle, fee collector, channel owner.  
  - Require signer/PDA checks; keep authorities in multisig.  
- Pausable: independent switches for minting, trading, resolution.  
- Upgrades: program upgrade authority behind multisig + timelock/guard.

### Tokens and Payments
- Collateral: SPL stablecoin for trading/settlement.  
- Access mints: accept SPL stablecoin (optionally SOL); per-channel pricing.  
- Royalties: Metaplex creator shares on secondary sales; marketplaces must honor.  
- Escrow: optional escrow for disputed markets until finalization.

### Security
- PDA auth on all state; strict signer checks; avoid arbitrary CPI.  
- Slippage bounds on trades/liquidity; price sanity checks if AMM.  
- Oracle integrity: dispute bond sizing, resolution timeouts, liveness rules.  
- Limits: per-wallet mint caps, transfer cooldowns if desired.  
- Audits/monitoring: external audits; alerts on abnormal volume/resolution patterns.

### Frontend / Client Integration
- Publish program IDs + IDLs for access NFT, market, oracle, treasury.  
- Expose event/log streams for MarketCreated, LiquidityAdded/Removed, Trade, Resolved, PayoutClaimed, AccessMinted/Burned/Transferred.  
  - Indexer API should surface aggregates (volume24h, price change, win rate, PnL, supply/holders).

### Operational Flows to Validate
- Channel launch: set supply, price, URI, royalty, gating config; enable mint.  
- Trading: approve collateral, trade outcomes, adjust positions; fees route to treasury.  
- Resolution: oracle submit → dispute window → finalize → claims.  
- Access: mint/burn/transfer access NFTs; client gates content by ownership.  
- Withdrawals: authorized roles withdraw protocol/channel fees and royalties.

### Deployment Checklist
- Configure environment accounts: collateral mint, access mint/program, market/oracle program IDs, treasury PDAs.  
- Set roles and transfer upgrade authority to multisig/timelock.  
- Seed indexer; publish program IDs/IDLs.  
- Run full-path tests: create → trade → resolve → dispute (happy/unhappy) → finalize → claim → withdraw.  
- Verify access gating via NFT ownership in the client/auth layer.

