import { Router } from 'express';
import { db } from '../firebaseAdmin';

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

        return res.json({ success: true, id, status: statusValue });
    } catch (err) {
        console.error('admin update-status error:', err);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;
