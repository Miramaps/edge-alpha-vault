# EDGE Discord Bot Server

Discord bot server for EDGE platform that handles wallet verification, role assignment, and channel management.

## Features

- ✅ Wallet verification via signed messages
- ✅ Automatic Discord channel/role creation from approved applications
- ✅ Dynamic role assignment based on EDGE token subscriptions
- ✅ Encrypted wallet storage
- ✅ Rate limiting
- ✅ Secure webhook endpoints
- ✅ On-chain data validation
- ✅ Graceful RPC error handling

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in all required values:

```bash
cp .env.example .env
```

**Required Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string (Railway)
- `DISCORD_BOT_TOKEN` - Discord bot token
- `DISCORD_GUILD_ID` - Discord server ID
- `SOLANA_RPC_URL` - Solana RPC endpoint
- `ENCRYPTION_KEY` - 32-byte encryption key (generate with: `openssl rand -hex 32`)
- `WEBHOOK_SECRET` - Secret for webhook signature validation
- `API_KEY` - API key for protected endpoints

### 3. Database Setup (Railway)

1. Create a new PostgreSQL database in Railway
2. Copy the connection string to `DATABASE_URL`
3. Run migrations:

```bash
npm run migrate:up
```

Or manually run the SQL in `src/database/migrations/001_initial_schema.sql`

### 4. Generate Encryption Key

```bash
# Generate a 32-byte key
openssl rand -hex 32
```

Add this to your `.env` as `ENCRYPTION_KEY`

### 5. Discord Bot Setup

1. Create a Discord application at https://discord.com/developers/applications
2. Create a bot and copy the token
3. Invite bot to your server with these permissions:
   - Manage Roles
   - Manage Channels
   - View Channels
   - Send Messages
4. Enable "Server Members Intent" in Discord Developer Portal

### 6. Run Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## API Endpoints

### POST `/verify`
Verify wallet ownership and assign roles based on subscriptions.

**Request:**
```json
{
  "walletAddress": "wallet_address_here",
  "signature": "signature_here",
  "message": "verification_message",
  "discordUserId": "discord_user_id"
}
```

### POST `/webhooks/application-approved`
Webhook for approved trader applications (requires API key).

**Headers:**
- `X-API-Key`: Your API key
- `X-Webhook-Signature`: HMAC-SHA256 signature of request body

**Request:**
```json
{
  "traderWallet": "wallet_address",
  "channelName": "Channel Name",
  "maxMembers": 1000,
  "subscriptionPrice": 10.5,
  "channelId": "on_chain_channel_id"
}
```

### GET `/health`
Health check endpoint.

## Security Features

- **Encrypted Storage**: Wallet addresses encrypted with AES-256-GCM
- **Rate Limiting**: Prevents abuse of verification endpoint
- **Webhook Signatures**: HMAC-SHA256 validation for webhooks
- **API Keys**: Protected endpoints require API key
- **Input Validation**: All inputs sanitized and validated
- **RPC Retry Logic**: Handles Solana RPC failures gracefully

## Database Schema

See `src/database/migrations/001_initial_schema.sql` for full schema.

Key tables:
- `channels` - Maps on-chain channels to Discord channels/roles
- `wallet_verifications` - Encrypted wallet → Discord user mappings
- `subscriptions` - Subscription status (synced from on-chain)
- `rate_limits` - Rate limiting tracking
- `audit_log` - Action logging

## Deployment (Railway)

1. Connect your GitHub repo to Railway
2. Set all environment variables in Railway dashboard
3. Railway will automatically deploy on push to main
4. Ensure PostgreSQL addon is provisioned
5. Run migrations after first deployment

## Monitoring

- Logs are written to `error.log` and `combined.log`
- Check Railway logs for real-time monitoring
- Audit log table tracks all important actions

## Troubleshooting

**Bot not connecting:**
- Check `DISCORD_BOT_TOKEN` is correct
- Verify bot has proper permissions in server
- Check "Server Members Intent" is enabled

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Check Railway PostgreSQL is running
- Ensure migrations have been run

**Role assignment not working:**
- Check RPC endpoint is accessible
- Verify subscription program ID is correct
- Check bot has "Manage Roles" permission
- Review logs for specific errors

