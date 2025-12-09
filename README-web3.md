## Web3 Program Requirements (Solana)

Practical list of on-chain programs, accounts, and flows the EDGE platform needs to operate reliably with token-gated subscriptions.

### Core On-Chain Pieces
- **Token subscription program**  
  - EDGE token-based subscription system for channel access.  
  - Per-channel subscription pricing in EDGE tokens; recurring or one-time payment models.  
  - Subscription state: active/inactive, expiration timestamps, renewal logic.  
  - Access verification: check EDGE token balance or subscription status for Discord gating.  
  - Controls: channel owners set subscription price; platform admin can pause/modify pricing; withdraw subscription revenue.

- **EDGE token (SPL Token)**  
  - Native platform token used for subscriptions and payments.  
  - Standard SPL token implementation with transfer, burn, and mint capabilities.  
  - Token distribution: initial supply, vesting schedules, rewards/airdrops if applicable.  
  - Treasury management: protocol fees, channel revenue splits.

- **Prediction market program**  
  - Create markets (source, outcomes, start/end, liquidity params).  
  - Trade via AMM or orderbook; handle collateral deposits/withdrawals; collect fees; enforce slippage bounds.  
  - Resolve outcomes via designated oracle; support disputes/appeals; finalize and unlock claims.  
  - Payout instruction to settle winning positions; emit logs for create/liquidity/trade/resolve/payout.

- **Oracle / resolution module**  
  - Resolver submits outcome; dispute window with bonded challenges; slash bad actors; reward correct challengers.  
  - Finalization step closes disputes and enables claims.

- **Treasury / fee splitter**  
  - Receive protocol + channel fees from trades and subscriptions.  
  - Configurable splits between platform and channel owners; periodic withdrawals; emit distribution logs.  
  - Handle EDGE token distributions and revenue sharing.

- **Indexing / stats**  
  - Off-chain indexer consuming program logs to surface volume, PnL, win rate, active subscribers, subscription revenue.  
  - Track subscription metrics: active subscriptions per channel, renewal rates, churn, revenue per channel.  
  - Optional signed snapshots or Merkle roots for client verification.

### Access, Roles, Upgrades
- Roles: admin, market creator, resolver/oracle, fee collector, channel owner.  
  - Require signer/PDA checks; keep authorities in multisig.  
- Pausable: independent switches for subscriptions, trading, resolution.  
- Upgrades: program upgrade authority behind multisig + timelock/guard.

### Tokens and Payments
- **EDGE token**: Primary platform token for subscriptions and payments.  
- **Subscription payments**: Users pay EDGE tokens to subscribe to channels; payments go to channel owner + protocol fee.  
- **Per-channel pricing**: Each channel sets subscription price in EDGE tokens; dynamic pricing support.  
- **Collateral**: SPL stablecoin for prediction market trading/settlement.  
- **Escrow**: optional escrow for disputed markets until finalization.

### Security
- PDA auth on all state; strict signer checks; avoid arbitrary CPI.  
- Slippage bounds on trades/liquidity; price sanity checks if AMM.  
- Oracle integrity: dispute bond sizing, resolution timeouts, liveness rules.  
- Subscription limits: max members per channel (e.g., 1000), prevent oversubscription.  
- Access verification: secure checks for active subscription status before granting Discord access.  
- Audits/monitoring: external audits; alerts on abnormal volume/resolution patterns, subscription fraud.

### Discord Bot Integration & Wallet Verification
- **Custom Discord bot** required for automated channel/role management and wallet-based access control.  
  - **Application processing**: Bot receives approved trader applications from platform; extracts channel name, max members, subscription price, trader wallet address, Discord user ID.  
  - **Channel creation**: Bot automatically creates Discord channel and associated role for each approved trader; sets permissions, category, channel description from application data.  
  - **Token-role association**: Bot maintains mapping between trader wallet addresses (or channel subscription tokens) and Discord roles; updates mapping when new channels are created.  

- **Wallet verification system**  
  - Users verify wallet ownership by signing a transaction with their Solana wallet (e.g., sign message/transaction proving Discord account owns the wallet).  
  - Bot verifies signature on-chain; associates Discord user ID with verified wallet address.  
  - Verification is one-time per Discord account; bot stores verified wallet → Discord user mapping.  

- **Dynamic role assignment**  
  - Bot periodically queries on-chain subscription status for verified wallets.  
  - Checks wallet contents: active EDGE token subscriptions, subscription expiration, channel associations.  
  - Automatically assigns/removes Discord roles based on current subscription status.  
  - Real-time updates: bot listens to subscription events (created, renewed, cancelled, expired) and updates roles immediately.  
  - Role revocation: when subscription expires or is cancelled, bot automatically removes role and revokes channel access.  

- **Technical requirements**  
  - Bot must have Discord server admin permissions to create channels/roles.  
  - Bot needs RPC access to Solana network for on-chain queries.  
  - Secure storage for wallet → Discord user mappings (encrypted database).  
  - Rate limiting for on-chain queries to avoid RPC throttling.  
  - Error handling for failed verifications, network issues, role assignment failures.

### Frontend / Client Integration
- Publish program IDs + IDLs for subscription program, EDGE token, market, oracle, treasury.  
- Expose event/log streams for SubscriptionCreated, SubscriptionRenewed, SubscriptionCancelled, SubscriptionExpired, Trade, Resolved, PayoutClaimed.  
  - Indexer API should surface aggregates (volume24h, price change, win rate, PnL, active subscribers, subscription revenue).  
- **Discord bot API**: Endpoints for wallet verification, subscription status checks, role assignment triggers.

### Operational Flows to Validate
- **Trader application & channel setup**: Trader submits application → platform approves → Discord bot receives approval → bot creates Discord channel + role → bot associates trader wallet with role → channel goes live.  
- **Channel launch**: Channel owner sets max members (up to 1000), subscription price in EDGE tokens, metadata; enable subscriptions.  
- **Wallet verification**: User connects wallet in Discord → bot generates verification message → user signs message with wallet → bot verifies signature on-chain → bot stores wallet → Discord user mapping.  
- **Subscription flow**: User approves EDGE token spend → subscribe to channel → receive access → Discord bot detects subscription event → bot queries wallet subscription status → bot assigns Discord role → user gains channel access.  
- **Trading**: Approve collateral, trade outcomes, adjust positions; fees route to treasury.  
- **Resolution**: Oracle submit → dispute window → finalize → claims.  
- **Access verification**: Discord bot periodically queries subscription status on-chain for all verified wallets; grant/revoke access based on active subscription.  
- **Subscription cancellation**: User cancels subscription → on-chain subscription cancelled → Discord bot detects cancellation event → bot removes Discord role → user loses channel access immediately.  
- **Subscription expiration**: Subscription expires → Discord bot detects expiration → bot removes Discord role → user loses channel access.  
- **Subscription management**: Channel owners can modify pricing (grandfather existing subscribers or require renewal).  
- **Withdrawals**: Channel owners and protocol withdraw subscription revenue and trading fees.

### Deployment Checklist
- Configure environment accounts: EDGE token mint, subscription program, market/oracle program IDs, treasury PDAs.  
- Set roles and transfer upgrade authority to multisig/timelock.  
- Seed indexer; publish program IDs/IDLs.  
- **Discord bot setup**: Deploy bot with server admin permissions; configure RPC endpoints; set up secure database for wallet → Discord mappings; test channel/role creation; verify signature verification works.  
- Run full-path tests: trader application → bot creates channel → set subscription price → user verifies wallet → user subscribes → bot assigns role → verify Discord access → cancel subscription → bot removes role → verify access revoked → trading → resolve → dispute (happy/unhappy) → finalize → claim → withdraw.  
- Verify access gating via subscription status in Discord bot (real-time role assignment/removal).  
- Test subscription limits: ensure max members cap (1000) is enforced.  
- Test bot resilience: network failures, RPC rate limits, Discord API errors, signature verification edge cases.
