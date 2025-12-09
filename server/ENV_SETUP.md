# Environment Variables Setup

## Quick Start

1. Copy the example file:
```bash
cp .env.example .env
```

2. Generate security keys:
```bash
npm run generate-keys
```

3. Copy the generated keys to your `.env` file

4. Fill in the remaining variables:

### Database (Railway PostgreSQL)
```env
DATABASE_URL=postgresql://user:password@host:port/database
```
Get this from your Railway PostgreSQL service.

### Discord Bot
1. Go to https://discord.com/developers/applications
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the token
5. Enable "Server Members Intent" under "Privileged Gateway Intents"
6. Invite bot to your server with these permissions:
   - Manage Roles
   - Manage Channels
   - View Channels
   - Send Messages

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
DISCORD_CLIENT_ID=your_client_id_here
```

### Solana RPC
```env
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# Or for devnet:
SOLANA_RPC_URL_DEVNET=https://api.devnet.solana.com
```

### Program IDs
```env
SUBSCRIPTION_PROGRAM_ID=your_subscription_program_id
EDGE_TOKEN_MINT=your_edge_token_mint_address
```

### Security Keys
Run `npm run generate-keys` to generate:
- `ENCRYPTION_KEY` - 32-byte key for encrypting wallet addresses
- `WEBHOOK_SECRET` - Secret for webhook signature validation
- `API_KEY` - API key for protected endpoints

## Railway Deployment

When deploying to Railway:

1. Add all environment variables in Railway dashboard
2. Railway will automatically use `DATABASE_URL` from PostgreSQL service
3. Make sure to set `NODE_ENV=production`
4. Set `PORT` (Railway usually sets this automatically)

## Security Notes

- Never commit `.env` file to git
- Use different keys for development and production
- Rotate keys periodically
- Keep encryption key secure - if lost, encrypted data cannot be decrypted

