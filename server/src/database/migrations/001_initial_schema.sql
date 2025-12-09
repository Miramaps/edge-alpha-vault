-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Channels table: Maps on-chain channels to Discord channels/roles
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id VARCHAR(255) UNIQUE NOT NULL, -- On-chain channel ID
  trader_wallet VARCHAR(44) NOT NULL, -- Solana wallet address
  discord_role_id VARCHAR(20) UNIQUE NOT NULL, -- Discord role ID
  discord_channel_id VARCHAR(20) UNIQUE NOT NULL, -- Discord channel ID
  channel_name VARCHAR(255) NOT NULL,
  subscription_price DECIMAL(18, 8) NOT NULL, -- Price in EDGE tokens
  max_members INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet verifications: Stores encrypted wallet -> Discord user mappings
CREATE TABLE wallet_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discord_user_id VARCHAR(20) UNIQUE NOT NULL,
  wallet_address_encrypted BYTEA NOT NULL, -- Encrypted wallet address
  wallet_address_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for lookups
  signature_proof TEXT NOT NULL, -- Original signature for verification
  verification_message TEXT NOT NULL, -- Message that was signed
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_checked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_wallet_hash ON wallet_verifications(wallet_address_hash);
CREATE INDEX idx_discord_user ON wallet_verifications(discord_user_id);

-- Subscriptions: Tracks subscription status (synced from on-chain)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address_hash VARCHAR(64) NOT NULL, -- Hash of wallet (for privacy)
  channel_id VARCHAR(255) NOT NULL, -- On-chain channel ID
  subscription_status VARCHAR(20) NOT NULL, -- active, expired, cancelled
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (channel_id) REFERENCES channels(channel_id)
);

CREATE INDEX idx_wallet_status ON subscriptions(wallet_address_hash, subscription_status);
CREATE INDEX idx_channel ON subscriptions(channel_id);

-- Application approvals: Log of approved trader applications
CREATE TABLE application_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trader_wallet VARCHAR(44) NOT NULL,
  channel_name VARCHAR(255) NOT NULL,
  max_members INTEGER NOT NULL,
  subscription_price DECIMAL(18, 8) NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE, -- When bot created Discord channel
  status VARCHAR(20) DEFAULT 'pending', -- pending, processed, failed
  error_message TEXT
);

-- Rate limiting: Track verification attempts
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier VARCHAR(255) NOT NULL, -- IP or Discord user ID
  endpoint VARCHAR(255) NOT NULL,
  attempts INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_identifier_endpoint ON rate_limits(identifier, endpoint);
CREATE INDEX idx_window_start ON rate_limits(window_start);

-- Audit log: Track all important actions
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action VARCHAR(100) NOT NULL, -- verify_wallet, assign_role, remove_role, create_channel
  discord_user_id VARCHAR(20),
  wallet_address_hash VARCHAR(64),
  channel_id VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_action ON audit_log(action);
CREATE INDEX idx_created_at ON audit_log(created_at);

