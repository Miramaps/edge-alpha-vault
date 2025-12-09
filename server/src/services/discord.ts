import { Client, GatewayIntentBits, Guild, Role, TextChannel, GuildMember } from 'discord.js';
import { query } from '../database/connection';
import { encrypt, decrypt, hashWalletAddress } from '../utils/encryption';
import { queryWithRetry, validateSubscriptionData } from '../utils/solana';
import { logger } from '../utils/logger';

let client: Client | null = null;
let guild: Guild | null = null;

/**
 * Initialize Discord bot client
 */
export async function initializeDiscordBot(): Promise<Client> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    throw new Error('DISCORD_BOT_TOKEN environment variable is required');
  }
  
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
    ],
  });
  
  await client.login(token);
  
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) {
    throw new Error('DISCORD_GUILD_ID environment variable is required');
  }
  
  guild = await client.guilds.fetch(guildId);
  logger.info('Discord bot initialized and connected');
  
  return client;
}

/**
 * Creates Discord channel and role for approved trader application
 */
export async function createTraderChannel(
  channelName: string,
  traderWallet: string,
  channelId: string
): Promise<{ roleId: string; channelId: string }> {
  if (!guild) {
    throw new Error('Discord guild not initialized');
  }
  
  try {
    // Create role
    const role = await guild.roles.create({
      name: `${channelName} Alpha`,
      mentionable: false,
      reason: `Auto-created for trader channel: ${channelName}`,
    });
    
    // Create channel
    const channel = await guild.channels.create({
      name: channelName.toLowerCase().replace(/\s+/g, '-'),
      type: 0, // Text channel
      permissionOverwrites: [
        {
          id: guild.id, // @everyone
          deny: ['ViewChannel'],
        },
        {
          id: role.id, // Trader role
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
        },
      ],
      reason: `Auto-created for trader: ${channelName}`,
    }) as TextChannel;
    
    // Store in database
    await query(
      `INSERT INTO channels (channel_id, trader_wallet, discord_role_id, discord_channel_id, channel_name)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (channel_id) DO UPDATE
       SET discord_role_id = $3, discord_channel_id = $4, updated_at = NOW()`,
      [channelId, traderWallet, role.id, channel.id, channelName]
    );
    
    logger.info(`Created Discord channel and role for ${channelName}`, {
      roleId: role.id,
      channelId: channel.id,
    });
    
    return { roleId: role.id, channelId: channel.id };
  } catch (error) {
    logger.error('Error creating Discord channel/role:', error);
    throw error;
  }
}

/**
 * Assigns Discord role to user based on active subscription
 */
export async function assignRole(discordUserId: string, roleId: string): Promise<boolean> {
  if (!guild) {
    throw new Error('Discord guild not initialized');
  }
  
  try {
    const member = await guild.members.fetch(discordUserId);
    if (!member.roles.cache.has(roleId)) {
      await member.roles.add(roleId);
      logger.info(`Assigned role ${roleId} to user ${discordUserId}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`Error assigning role ${roleId} to user ${discordUserId}:`, error);
    return false;
  }
}

/**
 * Removes Discord role from user
 */
export async function removeRole(discordUserId: string, roleId: string): Promise<boolean> {
  if (!guild) {
    throw new Error('Discord guild not initialized');
  }
  
  try {
    const member = await guild.members.fetch(discordUserId);
    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);
      logger.info(`Removed role ${roleId} from user ${discordUserId}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`Error removing role ${roleId} from user ${discordUserId}:`, error);
    return false;
  }
}

/**
 * Syncs roles for all verified wallets based on subscription status
 */
export async function syncAllRoles(): Promise<void> {
  try {
    // Get all verified wallets
    const verified = await query(
      'SELECT discord_user_id, wallet_address_encrypted FROM wallet_verifications'
    );
    
    // Get all channels with their role mappings
    const channels = await query(
      'SELECT channel_id, discord_role_id FROM channels'
    );
    
    const channelMap = new Map(
      channels.rows.map((row) => [row.channel_id, row.discord_role_id])
    );
    
    for (const verification of verified.rows) {
      // Decrypt wallet address
      const walletAddress = decrypt(verification.wallet_address_encrypted);
      
      // Query subscriptions with retry
      const subscriptions = await queryWithRetry(async () => {
        const { getWalletSubscriptions } = await import('../utils/solana');
        return getWalletSubscriptions(walletAddress);
      });
      
      if (!subscriptions) {
        logger.warn(`Failed to query subscriptions for wallet ${walletAddress}`);
        continue;
      }
      
      // Get active channel IDs
      const activeChannels = subscriptions
        .filter((s) => s.status === 'active')
        .map((s) => s.channelId);
      
      // Assign roles for active subscriptions
      for (const channelId of activeChannels) {
        const roleId = channelMap.get(channelId);
        if (roleId) {
          // Validate before assigning
          const validation = await validateSubscriptionData(walletAddress, channelId);
          if (validation.valid) {
            await assignRole(verification.discord_user_id, roleId);
          }
        }
      }
      
      // Remove roles for inactive subscriptions
      for (const [channelId, roleId] of channelMap.entries()) {
        if (!activeChannels.includes(channelId)) {
          await removeRole(verification.discord_user_id, roleId);
        }
      }
    }
    
    logger.info('Role sync completed');
  } catch (error) {
    logger.error('Error syncing roles:', error);
  }
}

export function getClient(): Client | null {
  return client;
}

export function getGuild(): Guild | null {
  return guild;
}

