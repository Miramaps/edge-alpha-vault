# Discord Server Setup Guide

This document outlines the complete Discord server configuration for the EDGE platform - a token-gated alpha/trader community platform where users subscribe to exclusive channels using EDGE tokens, granting them access to private Discord rooms where top prediction market traders share insights.

## Platform Overview

The EDGE platform allows:
- **Traders** to create subscription-based channels automatically through the website
- **Users** to subscribe with EDGE tokens to access exclusive Discord channels
- **Automatic channel creation** when traders are approved
- **Dynamic role assignment** based on active token subscriptions
- **Multiple channel types** for different purposes (trader channels, community channels, support, etc.)

---

## Server Structure

### Channel Categories

#### 1. **Public Channels** (Everyone can view)
- `#welcome` - Server introduction, verification instructions, onboarding
- `#rules` - Server rules and guidelines
- `#announcements` - Platform updates, new features, important notices
- `#faq` - Frequently asked questions
- `#status` - System status, maintenance notices
- `#general` - General community discussion
- `#introductions` - New member introductions

#### 2. **Support Channels** (Public view, restricted posting)
- `#support` - Public support channel (users can view, support team responds)
- `#feedback` - Feature requests and feedback
- `#bug-reports` - Bug reporting channel
- **Ticket System** - Private threads created via `/ticket` command

#### 3. **Trader Channels** (Token-gated, auto-created)
- **Category: "Alpha Channels"**
  - Auto-created channels for each approved trader
  - Format: `#trader-name-alpha` (e.g., `#dom-pnl-alpha`, `#sports-edge-alpha`)
  - Access: Requires active EDGE token subscription to that trader's channel
  - Permissions: Read-only for subscribers, full access for trader owner
  - Created automatically when trader application is approved via webhook

#### 4. **Market Category Channels** (Optional, token-gated or public)
- **Category: "Market Discussions"**
  - `#sports-alpha` - Sports prediction market discussions
  - `#politics-alpha` - Political market discussions
  - `#crypto-alpha` - Cryptocurrency market discussions
  - `#macro-alpha` - Macro economic discussions
  - `#finance-alpha` - Finance and stocks discussions
  - `#tech-alpha` - Technology and AI discussions
  - `#elections-alpha` - Election market discussions
  - Can be public or require general subscription

#### 5. **Community Channels** (Public or role-based)
- `#trading-strategies` - General trading strategy discussions
- `#market-analysis` - Community market analysis
- `#success-stories` - User success stories and wins
- `#off-topic` - General off-topic discussions

#### 6. **System Channels** (Restricted access)
- `#bot-logs` - Bot activity logs (Admin/Mod only)
- `#audit-logs` - Server audit logs (Admin only)
- `#trader-applications` - New trader application notifications (Admin/Mod only)
- `#verification-logs` - Wallet verification logs (Admin/Mod only)

#### 7. **Voice Channels** (Optional)
- `Alpha Voice` - Voice channel for alpha discussions
- `Trader Office Hours` - Scheduled voice sessions with traders
- `Community Voice` - General community voice chat

---

## Roles and Permissions

### Core Roles

1. **@Admin**
   - Full server management
   - Channel/role creation/deletion
   - Bot configuration
   - Access to all system channels
   - **Requires 2FA**

2. **@Moderator**
   - User management (kick, ban, timeout)
   - Message moderation
   - Access to moderation channels
   - Cannot manage roles/channels
   - **Requires 2FA**

3. **@Support**
   - Access to support channels
   - Can create/manage support tickets
   - Cannot moderate users

4. **@Trader**
   - Assigned to approved traders
   - Full access to their own channel
   - Can manage their channel (pins, slowmode, etc.)
   - Access to trader-only channels

5. **@Verified Subscriber**
   - Assigned when user has active EDGE token subscription
   - Access to subscribed trader channels
   - Access to general alpha channels
   - Auto-assigned/removed based on subscription status

6. **@Verified Trader**
   - Assigned to traders who completed verification
   - Verification process: Trader sends tokens (e.g., 0.1 SOL) from their Polymarket trading wallet to platform verification address
   - Platform automatically detects the transaction and verifies the trader
   - Shows verification badge on leaderboard
   - Access to verified trader channels

7. **@Member**
   - Default role for all users
   - Access to public channels only

### Permission Structure

**Public Channels:**
- @everyone: View, Send Messages, Read History

**Support Channels:**
- @everyone: View, Read History
- @Support: Send Messages, Manage Messages

**Trader Channels (Auto-created):**
- @everyone: No access
- @Trader (channel owner): Full access
- @Verified Subscriber (with active subscription): View, Send Messages, Read History

**System Channels:**
- @Admin: Full access
- @Moderator: View, Send Messages (for bot-logs)
- @everyone: No access

---

## Bot Integrations

### 1. **EDGE Discord Bot** (Primary Bot)
**Purpose:** Handles trader channel creation, subscription verification, and role management

**Key Features:**
- **Automatic Channel Creation:**
  - Receives webhook when trader application is approved
  - Creates Discord channel and role automatically
  - Maps on-chain channel ID to Discord channel/role
  - Stores mapping in database

- **Wallet Verification:**
  - `/verify` command or verification button
  - User signs message with Solana wallet
  - Bot verifies signature on-chain
  - Stores encrypted wallet → Discord user mapping

- **Dynamic Role Assignment:**
  - Periodically checks on-chain subscription status
  - Queries wallet for active EDGE token subscriptions
  - Automatically assigns/removes roles based on subscription status
  - Real-time updates when subscriptions are created/renewed/cancelled

- **Subscription Monitoring:**
  - Checks every 2 minutes (configurable)
  - Validates subscription data before role assignment
  - Handles RPC failures gracefully with retry logic

**Required Permissions:**
- Manage Roles
- Manage Channels
- View Channels
- Send Messages
- Read Message History
- Use External Emojis

**Commands:**
- `/verify` - Verify wallet ownership
- `/subscriptions` - View your active subscriptions
- `/channel-info [channel-name]` - Get channel subscription info

### 2. **Moderation Bot**
**Purpose:** Server safety and spam protection

**Features:**
- Anti-spam protection
- Raid protection
- Link filtering
- Auto-moderation rules
- Warning/kick/ban system

### 3. **Ticket Bot**
**Purpose:** Support ticket management

**Features:**
- `/ticket` command creates private support thread
- Auto-assigns support role
- Logs tickets to `#bot-logs`
- Ticket closure and archival

### 4. **Announcement Bot** (Optional)
**Purpose:** On-chain event notifications

**Features:**
- Market creation notifications
- Trade execution alerts
- Resolution updates
- Platform updates via webhooks

---

## Channel Creation Workflow

### Trader Channel Auto-Creation

1. **Trader Applies:**
   - Trader submits application on website (`/become-trader`)
   - Provides: channel name, max members, subscription price, wallet address

2. **Application Approval:**
   - Admin reviews and approves application
   - Platform sends webhook to Discord bot with trader details

3. **Bot Creates Channel:**
   - Bot receives webhook at `/webhooks/application-approved`
   - Bot creates Discord role: `@[ChannelName] Alpha`
   - Bot creates Discord channel: `#channel-name-alpha`
   - Sets permissions (only role can access)
   - Stores mapping in database

4. **Channel Goes Live:**
   - Channel appears in "Alpha Channels" category
   - Trader gets @Trader role and channel-specific role
   - Users can subscribe via website

5. **User Subscription:**
   - User subscribes with EDGE tokens on website
   - Bot detects subscription event
   - Bot assigns Discord role to verified wallet
   - User gains channel access

### Manual Channel Creation (Other Types)

For non-trader channels (community, support, etc.):
- Created manually by Admins
- Use appropriate category
- Set permissions based on channel type
- Document in server settings

---

## Verification and Gating Flow

### Wallet Verification Process (For Users/Subscribers)

1. **User Initiates:**
   - Clicks verification button in `#welcome` or uses `/verify` command
   - Bot generates unique verification message

2. **User Signs:**
   - User signs message with Solana wallet (Phantom, Solflare, etc.)
   - Signature sent back to bot

3. **Bot Verifies:**
   - Bot verifies signature on-chain
   - Stores encrypted wallet → Discord user mapping
   - Assigns @Verified Subscriber role if user has active subscriptions

4. **Ongoing Monitoring:**
   - Bot periodically checks subscription status (every 2 minutes)
   - Updates roles automatically
   - Removes access when subscription expires/cancelled

### Trader Verification Process (For Traders)

**Note:** This is different from user wallet verification. Traders verify by sending tokens from their Polymarket trading wallet.

1. **Trader Applies:**
   - Trader submits application on website
   - Provides Polymarket trading wallet address

2. **Trader Verifies:**
   - Trader sends verification amount (e.g., 0.1 SOL) from their Polymarket wallet to platform verification address
   - Transaction is sent directly from wallet (no bot interaction needed)

3. **Platform Detects:**
   - System automatically monitors transactions to verification address
   - Detects when correct amount is sent from trader's wallet
   - Verifies transaction on-chain

4. **Verification Complete:**
   - Trader is marked as verified
   - @Verified Trader role assigned (if applicable)
   - Verification badge appears on leaderboard
   - Status stored permanently

### Subscription-Based Access

**How it works:**
- User subscribes to trader channel with EDGE tokens (on website)
- Bot queries on-chain subscription status
- Bot assigns channel-specific role
- User gains access to that trader's Discord channel
- Access revoked automatically when subscription ends (1 month for X amount of tokens)

**Role Assignment Logic:**
- Check wallet for active subscriptions
- For each active subscription:
  - Find corresponding Discord role
  - Assign role to Discord user
- For expired/cancelled subscriptions:
  - Remove corresponding role

---

## Channel Types Summary

### Type 1: Trader Channels (Auto-created)
- **Purpose:** Exclusive trader alpha channels
- **Access:** Token-gated (EDGE subscription required)
- **Creation:** Automatic via webhook
- **Format:** `#trader-name-alpha`
- **Category:** "Alpha Channels"

### Type 2: Market Category Channels
- **Purpose:** Category-specific discussions
- **Access:** Public or token-gated (configurable)
- **Creation:** Manual by Admin
- **Examples:** `#sports-alpha`, `#politics-alpha`, `#crypto-alpha`
- **Category:** "Market Discussions"

### Type 3: Community Channels
- **Purpose:** General community engagement
- **Access:** Public or role-based
- **Creation:** Manual by Admin
- **Examples:** `#trading-strategies`, `#market-analysis`, `#success-stories`
- **Category:** "Community"

### Type 4: Support Channels
- **Purpose:** User support and assistance
- **Access:** Public view, restricted posting
- **Creation:** Manual by Admin
- **Examples:** `#support`, `#feedback`, `#bug-reports`
- **Category:** "Support"

### Type 5: System Channels
- **Purpose:** Bot logs and system monitoring
- **Access:** Admin/Moderator only
- **Creation:** Manual by Admin
- **Examples:** `#bot-logs`, `#audit-logs`, `#verification-logs`
- **Category:** "System" (hidden from regular users)

---

## Trader Verification Process

### How Traders Get Verified

Traders verify their identity by sending tokens from their **Polymarket trading wallet** to a platform verification address. This proves they own the wallet they trade with on Polymarket.

**Verification Steps:**
1. Trader applies to become a trader on the platform
2. Trader connects their Polymarket trading wallet
3. Trader sends verification amount (e.g., 0.1 SOL) from their Polymarket wallet to platform verification address
4. Platform automatically detects the transaction on-chain
5. System verifies the transaction and assigns @Verified Trader role
6. Verification badge appears on leaderboard

**Important:**
- Traders must use the **same wallet** they trade with on Polymarket
- Verification is automatic - no manual approval needed
- Transaction is monitored and verified on-chain
- Verification status is permanent (unless wallet changes)

---

## Webhook Configuration

### Application Approval Webhook

**Endpoint:** `POST /webhooks/application-approved`

**Headers:**
- `X-Webhook-Signature`: HMAC-SHA256 signature (for webhook authentication)

**Payload:**
```json
{
  "traderWallet": "wallet_address",
  "channelName": "Channel Name",
  "maxMembers": 1000,
  "subscriptionPrice": 10.5,
  "channelId": "on_chain_channel_id"
}
```

**Bot Response:**
- Creates Discord channel and role
- Returns: `{ "roleId": "...", "discordChannelId": "..." }`

---

## Safety and Compliance

### Server Settings
- **Verification Level:** Medium or High (requires verified email)
- **2FA Requirement:** Required for Admin and Moderator roles
- **Explicit Content Filter:** Enabled
- **Server Boost Level:** Configure based on needs

### Rate Limiting
- Slowmode on high-traffic channels (30s-1min)
- Rate limit verification attempts (100 per 15 minutes per user)
- Anti-spam protection on public channels

### Security
- Rotate bot tokens regularly
- Use secure webhook endpoints (HTTPS, signature validation)
- Encrypt sensitive data (wallet addresses)
- Restrict bot permissions to minimum required
- Enable audit logging

---

## Onboarding Flow

### New User Journey

1. **Join Server:**
   - User joins Discord server
   - Sees `#welcome` channel with instructions

2. **Read Rules:**
   - User reads `#rules` channel
   - Reacts to accept rules (optional)

3. **Verify Wallet:**
   - User clicks verification button or uses `/verify`
   - Connects wallet and signs message
   - Bot verifies and stores mapping

4. **Subscribe to Channels:**
   - User browses channels on website
   - Subscribes with EDGE tokens
   - Bot automatically assigns Discord roles
   - User gains channel access

5. **Access Channels:**
   - User can now access subscribed trader channels
   - Participate in discussions
   - Receive alpha signals

---

## Monitoring and Logging

### Bot Logs (`#bot-logs`)
- Channel creation events
- Role assignment/removal
- Verification attempts (success/failure)
- Subscription status changes
- Webhook processing errors

### Audit Logs (`#audit-logs`)
- Admin actions (role/channel management)
- Moderator actions (kicks, bans, timeouts)
- Permission changes
- Server setting modifications

### Verification Logs (`#verification-logs`)
- Wallet verification events
- Subscription verification
- Role sync status
- Transaction verification

---

## Backup and Recovery

### Documentation
- Document all channel purposes and permissions
- List all roles and their permissions
- Record bot configurations
- Maintain webhook endpoint documentation

### Server Backup
- Export server settings regularly
- Backup role and channel structure
- Document custom emojis and stickers
- Save bot token securely (use environment variables)

### Admin Redundancy
- Maintain at least 2 server owners
- Multiple admins with 2FA enabled
- Document recovery procedures

---

## Optional Enhancements

### Reaction Roles
- Market category roles (opt-in notifications)
- Update preferences (product updates, new features)
- Community roles (contributor, beta tester)

### Automation
- Welcome DM with platform tips
- Auto-assign roles based on verification
- Scheduled announcements
- Birthday/anniversary roles

### Integrations
- Webhook feeds for on-chain events
- Price alerts for EDGE token
- Market resolution notifications
- Trader performance updates

---

## Troubleshooting

### Common Issues

**Channel not created after approval:**
- Check webhook endpoint is accessible
- Verify API key and signature
- Check bot has "Manage Channels" permission
- Review bot logs for errors

**Roles not assigning:**
- Verify wallet is connected and verified
- Check subscription status on-chain
- Ensure bot has "Manage Roles" permission
- Check role hierarchy (bot role must be above assigned roles)

**Verification failing:**
- Check RPC endpoint is accessible
- Verify signature format
- Check rate limiting
- Review verification logs

---

## Deployment Checklist

- [ ] Create Discord server
- [ ] Set up channel categories and structure
- [ ] Create all roles with proper permissions
- [ ] Configure bot permissions
- [ ] Set up webhook endpoints
- [ ] Configure environment variables
- [ ] Test channel creation workflow
- [ ] Test wallet verification
- [ ] Test role assignment
- [ ] Set up monitoring and logging
- [ ] Configure security settings
- [ ] Document server structure
- [ ] Train moderators
- [ ] Launch onboarding flow

---

## Support

For issues or questions:
- Check `#faq` channel
- Open support ticket via `/ticket`
- Contact @Support role
- Review bot logs in `#bot-logs`
