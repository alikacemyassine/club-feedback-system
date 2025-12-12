const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'club_feedback';
const COLLECTION_NAME = 'submissions';

let db;
let client;

// Admin credentials from environment variables
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

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('✅ Connected to MongoDB');
        
        // Create index on timestamp for faster queries
        await db.collection(COLLECTION_NAME).createIndex({ timestamp: -1 });
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.error('⚠️  Make sure MONGODB_URI environment variable is set!');
        throw error;
    }
}

// Read submissions from MongoDB
async function readSubmissions() {
    try {
        const submissions = await db.collection(COLLECTION_NAME)
            .find({})
            .sort({ timestamp: -1 })
            .toArray();
        return submissions;
    } catch (error) {
        console.error('Error reading submissions:', error);
        return [];
    }
}

// Write submission to MongoDB
async function writeSubmission(submission) {
    try {
        await db.collection(COLLECTION_NAME).insertOne(submission);
    } catch (error) {
        console.error('Error writing submission:', error);
        throw error;
    }
}

// Delete submission from MongoDB
async function deleteSubmission(id) {
    try {
        const result = await db.collection(COLLECTION_NAME).deleteOne({ id: id });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
    }
}

// API Endpoint: Submit feedback
app.post('/api/submit-feedback', async (req, res) => {
    try {
        const newSubmission = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            ...req.body
        };
        
        await writeSubmission(newSubmission);
        
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
        const deleted = await deleteSubmission(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }
        
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
    try {
        await connectToMongoDB();
        
        // Security warning
        if (ADMIN_PASSWORD === 'change-me-now') {
            console.warn('⚠️  WARNING: Using default admin password!');
            console.warn('⚠️  Set ADMIN_PASSWORD environment variable before deploying!');
        }
        
        if (MONGODB_URI === 'mongodb://localhost:27017') {
            console.warn('⚠️  WARNING: Using default MongoDB URI!');
            console.warn('⚠️  Set MONGODB_URI environment variable with your MongoDB Atlas connection string!');
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 Feedback form: http://localhost:${PORT}/`);
            console.log(`👨‍💼 Admin panel: http://localhost:${PORT}/admin`);
            console.log(`💾 Using MongoDB for persistent storage`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing MongoDB connection...');
    if (client) {
        await client.close();
    }
    process.exit(0);
});

startServer().catch(console.error);

