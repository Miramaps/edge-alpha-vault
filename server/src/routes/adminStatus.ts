import { Router } from 'express';
import { db } from '../firebaseAdmin';
import { createTraderChannel } from '../services/discord';

const router = Router();

// POST /admin/update-status
// Body: { id: string, status: 'approved'|'rejected'|'pending' }
router.post('/update-status', async (req, res) => {
    try {
        const { id, status } = req.body as { id?: string; status?: string };
        if (!id || !status) return res.status(400).json({ success: false, error: 'Missing id or status' });

        const allowed = new Set(['approved', 'rejected', 'pending']);
        const s = String(status).toLowerCase();
        if (!allowed.has(s)) return res.status(400).json({ success: false, error: 'Invalid status' });

        const statusValue = s === 'approved' ? 'Approved' : s === 'rejected' ? 'Rejected' : 'Pending';

        const ref = db.ref(`joinEdgeApplications/${id}`);
        // Read existing application to include metadata in activity log
        const snap = await ref.once('value');
        const appData = snap.val() || {};

        await ref.update({ Status: statusValue });

        // Push an activity entry for recent activity feed
        try {
            const activityRef = db.ref('adminActivity').push();
            await activityRef.set({
                id: activityRef.key,
                appId: id,
                channelName: appData.channelName || appData.channel || '',
                status: statusValue,
                ts: new Date().toISOString(),
                actor: req.headers['x-admin'] || 'admin',
            });
        } catch (actErr) {
            console.error('Failed to write admin activity:', actErr);
        }

        // If approved, create a full channel profile under `channels/<slug>`
        if (statusValue === 'Approved') {
            try {
                const makeSlug = (name: string) =>
                    name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '')
                        .slice(0, 80);

                const channelName = String(appData.channelName || appData.channel || id);
                const slug = makeSlug(channelName) || id;

                const channelRef = db.ref(`channels/${slug}`);
                const channelSnap = await channelRef.once('value');
                const existing = channelSnap.val();

                const totalAllowed = Number(appData.maxMembers) || 0;

                const channelPayload: any = {
                    id: slug,
                    channelName: channelName,
                    twitterHandle: appData.twitterHandle || '',
                    discordHandle: appData.discordHandle || '',
                    polymarketWallet: appData.polymarketWallet || '',
                    profileImageUrl: appData.profileImageUrl || appData.profileImage || '',
                    createdAt: new Date().toISOString(),
                    Status: 'OPEN',
                    currentMemberCount: existing?.currentMemberCount ?? 0,
                    totalAllowedCount: totalAllowed,
                    // placeholder metrics — can be filled later by analytics jobs
                    price: existing?.price ?? 0,
                    volume24hr: existing?.volume24hr ?? 0,
                    winRate: existing?.winRate ?? 0,
                    avgRoi: existing?.avgRoi ?? 0,
                    return30d: existing?.return30d ?? 0,
                    volatility: existing?.volatility ?? 'unknown',
                    riskAppetite: existing?.riskAppetite ?? 'medium',
                    maxDrawdown: existing?.maxDrawdown ?? 0,
                    consistency: existing?.consistency ?? 0,
                    timeHorizon: existing?.timeHorizon ?? 'short',
                    strategy: existing?.strategy ?? appData.strategy ?? '',
                };

                // Write or merge the channel profile (do not clobber dynamic counts if present)
                await channelRef.update(channelPayload);

                // Try to create corresponding Discord channel & role (if bot is available)
                try {
                    const discordResult = await createTraderChannel(channelName, String(appData.polymarketWallet || ''), slug);
                    // Save discord IDs back to the channel record for reference
                    await channelRef.update({
                        discordRoleId: discordResult.roleId,
                        discordChannelId: discordResult.channelId,
                    });
                } catch (discordErr) {
                    const discordMsg = discordErr instanceof Error ? discordErr.message : String(discordErr);
                    console.warn('Discord channel creation skipped or failed:', discordMsg);
                }
            } catch (chanErr) {
                console.error('Failed to create/update channel profile:', chanErr);
            }
        }

        return res.json({ success: true, id, status: statusValue });
    } catch (err) {
        console.error('admin update-status error:', err);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;
