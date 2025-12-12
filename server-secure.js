const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection - NEVER hardcode credentials!
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required!');
    process.exit(1);
}

const DB_NAME = 'club_feedback';
const COLLECTION_NAME = 'submissions';

let db;
let client;

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-now';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS - Restrict to your domain only
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['https://club-feedback-system.onrender.com'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Body parser with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// Stricter rate limit for feedback submission
const feedbackLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Only 3 submissions per hour per IP
    message: 'Too many feedback submissions. Please try again later.',
});

// Input sanitization helper
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    // Remove HTML tags and escape special characters
    return validator.escape(validator.stripLow(input));
}

// Input validation schema
function validateSubmission(data) {
    const errors = [];
    
    // Required fields
    if (!data.fullName || typeof data.fullName !== 'string') {
        errors.push('Full name is required');
    } else if (data.fullName.length > 100) {
        errors.push('Full name too long');
    }
    
    if (!data.department || typeof data.department !== 'string') {
        errors.push('Department is required');
    } else if (data.department.length > 100) {
        errors.push('Department name too long');
    }
    
    if (!data.telegram || typeof data.telegram !== 'string') {
        errors.push('Telegram username is required');
    } else if (!validator.matches(data.telegram, /^@?[a-zA-Z0-9_]{5,32}$/)) {
        errors.push('Invalid Telegram username format');
    }
    
    // Optional fields - validate length if present
    if (data.ideas && data.ideas.length > 5000) {
        errors.push('Ideas field too long');
    }
    
    if (data.skills && data.skills.length > 5000) {
        errors.push('Skills field too long');
    }
    
    if (data.problemDetails && data.problemDetails.length > 5000) {
        errors.push('Problem details too long');
    }
    
    if (data.otherComments && data.otherComments.length > 5000) {
        errors.push('Comments too long');
    }
    
    return errors;
}

// Basic authentication middleware for admin routes
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = credentials[0];
        const password = credentials[1];
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            return next();
        } else {
            res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).json({ error: 'Authentication required' });
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

// Write submission to MongoDB - with sanitization
async function writeSubmission(submission) {
    try {
        // Only allow specific fields - prevent injection
        const sanitizedSubmission = {
            id: submission.id,
            timestamp: submission.timestamp,
            fullName: sanitizeInput(submission.fullName),
            department: sanitizeInput(submission.department),
            telegram: sanitizeInput(submission.telegram),
            integration: submission.integration || null,
            welcomed: submission.welcomed || null,
            whyWelcomed: submission.whyWelcomed ? sanitizeInput(submission.whyWelcomed) : null,
            ideas: submission.ideas ? sanitizeInput(submission.ideas) : null,
            skills: submission.skills ? sanitizeInput(submission.skills) : null,
            hasProblems: submission.hasProblems || null,
            problemDetails: submission.problemDetails ? sanitizeInput(submission.problemDetails) : null,
            memberIssue: submission.memberIssue || null,
            memberIssueDetails: submission.memberIssueDetails ? sanitizeInput(submission.memberIssueDetails) : null,
            leaderIssue: submission.leaderIssue || null,
            leaderIssueDetails: submission.leaderIssueDetails ? sanitizeInput(submission.leaderIssueDetails) : null,
            officeIssue: submission.officeIssue || null,
            officeIssueDetails: submission.officeIssueDetails ? sanitizeInput(submission.officeIssueDetails) : null,
            rating: submission.rating || null,
            otherComments: submission.otherComments ? sanitizeInput(submission.otherComments) : null,
        };
        
        await db.collection(COLLECTION_NAME).insertOne(sanitizedSubmission);
    } catch (error) {
        console.error('Error writing submission:', error);
        throw error;
    }
}

// Delete submission from MongoDB
async function deleteSubmission(id) {
    try {
        // Validate ID format to prevent injection
        if (!id || typeof id !== 'string' || id.length > 50) {
            return false;
        }
        const result = await db.collection(COLLECTION_NAME).deleteOne({ id: id });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
    }
}

// API Endpoint: Submit feedback - with validation and rate limiting
app.post('/api/submit-feedback', feedbackLimiter, async (req, res) => {
    try {
        // Validate input
        const validationErrors = validateSubmission(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        
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
        // Don't expose internal error details
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback. Please try again later.'
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
        
        // Security warnings
        if (ADMIN_PASSWORD === 'change-me-now') {
            console.warn('⚠️  WARNING: Using default admin password!');
            console.warn('⚠️  Set ADMIN_PASSWORD environment variable before deploying!');
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 Feedback form: http://localhost:${PORT}/`);
            console.log(`👨‍💼 Admin panel: http://localhost:${PORT}/admin`);
            console.log(`💾 Using MongoDB for persistent storage`);
            console.log(`🔒 Security features enabled`);
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

