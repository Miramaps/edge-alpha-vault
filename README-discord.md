## Discord Server Requirements for the Platform

What we’re building: a gated alpha/trader community where access is controlled by on-chain ownership (access NFTs) and trading signals/updates are delivered in Discord. The server must let verified holders reach trader channels, surface market updates, and stay safe/moderated.

### Roles and Permissions
- Core roles: `Admin`, `Moderator`, `Support`, `Trader` (content creator), `Verified Holder` (access NFT owners), `Member`.
- Lock sensitive channels to `Admin/Moderator`; gate paid/alpha channels to `Verified Holder` + `Trader`.
- Enable 2FA for `Admin/Moderator`; disallow dangerous perms (webhooks, manage roles/channels) for non-admins.

### Channels (suggested)
- Public info: `#welcome`, `#rules`, `#announcements`, `#faq`, `#status`.
- Support: `#support`, ticket system (`/new` to open private threads), `#feedback`.
- Trading/alpha: gated `#alpha-feed`, `#alpha-chat`, `#trade-logs` (read-only from bot), per-trader rooms (e.g., `#trader-dom`, `#trader-sports`).
- System: `#bot-log` (restricted), `#audit-log` (restricted).
- Voice (optional): `Alpha Voice`, office hours.

### Bot Integrations
- Holder verification bot: link wallet to Discord, verify access NFT, assign `Verified Holder` role; periodic re-check; remove role if NFT sold.
- Announce bot: send on-chain events (new market, trade, resolution) to read-only channels.
- Ticket bot: creates private support threads; logs to `#bot-log`.
- Moderation bot: anti-spam, raid protection, link filters.

### Gating and Auth Flow
- Verification command/button in `#welcome` or `#verify`: user connects wallet → signed message → server assigns `Verified Holder` role.
- Re-verify on join and periodically (e.g., hourly) to catch NFT transfers.
- On role loss, auto-remove access to gated channels; optional DM notice.

### Webhooks / Feeds
- Market/alpha updates: webhook to `#alpha-feed` with summaries and links.
- Transactions: optional low-noise trade log feed.
- Status: deploy/incident notices to `#status`.

### Safety and Compliance
- Enable server verification level (at least medium); require verified email.
- Rate limit message creation in public channels; slowmode on high-traffic rooms.
- Back up server settings; restrict integrations; rotate bot tokens regularly.

### Onboarding
- Clear `#welcome` with steps: read rules → verify wallet → pick notifications (optional reaction roles) → access channels.
- `#rules` pinned; concise FAQ; link to support/ticket.

### Notifications
- Use `@everyone` only for critical outages; otherwise role-based pings (`@Verified Holder`, `@Trader`).
- Schedule announcements for releases or market events.

### Logging and Monitoring
- Keep `#audit-log` for admin/mod actions.
- `#bot-log` for verification attempts, role changes, webhook errors.

### Backups and Recovery
- Document server settings, roles, channel structure, bot configs.
- Maintain admin multisig (at least two owners) for redundancy.

### Optional Enhancements
- Reaction-role panel for opt-in notifications (markets, product updates).
- Vanity shortlinks to verification page; QR code in `#welcome`.
- DM drip for new verified holders with platform tips and key links.

