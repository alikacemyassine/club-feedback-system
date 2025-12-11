const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.json');

// Admin credentials from environment variables (set these in production!)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-now';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Basic authentication middleware for admin routes
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).send('Authentication required');
    }
    
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = credentials[0];
    const password = credentials[1];
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).send('Invalid credentials');
    }
}

// Ensure submissions file exists
async function ensureSubmissionsFile() {
    try {
        await fs.access(SUBMISSIONS_FILE);
    } catch {
        await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
    }
}

// Read submissions
async function readSubmissions() {
    try {
        const data = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading submissions:', error);
        return [];
    }
}

// Write submissions
async function writeSubmissions(submissions) {
    try {
        await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
    } catch (error) {
        console.error('Error writing submissions:', error);
        throw error;
    }
}

// API Endpoint: Submit feedback
app.post('/api/submit-feedback', async (req, res) => {
    try {
        const submissions = await readSubmissions();
        
        const newSubmission = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            ...req.body
        };
        
        submissions.push(newSubmission);
        await writeSubmissions(submissions);
        
        console.log(`New feedback submission received from: ${req.body.fullName || 'Unknown'}`);
        
        res.json({
            success: true,
            message: 'Feedback submitted successfully',
            id: newSubmission.id
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback'
        });
    }
});

// API Endpoint: Get all submissions (for admin) - PROTECTED
app.get('/api/submissions', requireAuth, async (req, res) => {
    try {
        const submissions = await readSubmissions();
        res.json({
            success: true,
            count: submissions.length,
            submissions: submissions
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions'
        });
    }
});

// API Endpoint: Delete a submission - PROTECTED
app.delete('/api/submissions/:id', requireAuth, async (req, res) => {
    try {
        const submissions = await readSubmissions();
        const filtered = submissions.filter(s => s.id !== req.params.id);
        
        if (filtered.length === submissions.length) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }
        
        await writeSubmissions(filtered);
        res.json({
            success: true,
            message: 'Submission deleted'
        });
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting submission'
        });
    }
});

// Serve the feedback form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'interactive_feedback_form.html'));
});

// Serve admin page - PROTECTED
app.get('/admin', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Initialize server
async function startServer() {
    await ensureSubmissionsFile();
    
    // Security warning
    if (ADMIN_PASSWORD === 'change-me-now') {
        console.warn('⚠️  WARNING: Using default admin password!');
        console.warn('⚠️  Set ADMIN_PASSWORD environment variable before deploying!');
    }
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📝 Feedback form: http://localhost:${PORT}/`);
        console.log(`👨‍💼 Admin panel: http://localhost:${PORT}/admin`);
        console.log(`🔒 Admin credentials: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD === 'change-me-now' ? '⚠️ DEFAULT - CHANGE THIS!' : '***'}`);
    });
}

startServer().catch(console.error);

