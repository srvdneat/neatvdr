const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Rate limiting for security
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.'
});

// Database simulation (in production, use real database)
const accessLog = [];
const activeSessions = new Map();
const timeLimitedLinks = new Map();

// User credentials (in production, use hashed passwords)
const users = {
    'admin': { password: 'srvdneat2025', role: 'admin' },
    'investor': { password: 'investor2025', role: 'investor' },
    'partner': { password: 'partner2025', role: 'partner' }
};

// Generate secure tokens
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Create time-limited access link
function createTimeLimitedLink(username, expiresIn = 24 * 60 * 60 * 1000) { // 24 hours default
    const token = generateToken();
    const expiresAt = Date.now() + expiresIn;
    
    timeLimitedLinks.set(token, {
        username,
        expiresAt,
        createdAt: Date.now()
    });
    
    return {
        token,
        expiresAt,
        url: `http://localhost:${PORT}/access/${token}`
    };
}

// Log access attempts
function logAccess(username, action, ip, userAgent) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        username,
        action,
        ip,
        userAgent,
        sessionId: activeSessions.get(username)?.sessionId
    };
    
    accessLog.push(logEntry);
    
    // Save to file for persistence
    fs.appendFileSync('access_log.json', JSON.stringify(logEntry) + '\n');
    
    console.log('Access Logged:', logEntry);
}

// Authentication endpoint
app.post('/api/auth', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    const ip = req.ip;
    const userAgent = req.get('User-Agent');
    
    if (users[username] && users[username].password === password) {
        const sessionId = generateToken();
        const session = {
            sessionId,
            username,
            role: users[username].role,
            createdAt: Date.now(),
            lastActivity: Date.now()
        };
        
        activeSessions.set(username, session);
        logAccess(username, 'login_success', ip, userAgent);
        
        res.json({
            success: true,
            sessionId,
            role: users[username].role,
            message: 'Authentication successful'
        });
    } else {
        logAccess(username, 'login_failed', ip, userAgent);
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// Validate session
app.get('/api/validate-session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const username = req.query.username;
    
    const session = activeSessions.get(username);
    
    if (session && session.sessionId === sessionId) {
        session.lastActivity = Date.now();
        logAccess(username, 'session_validated', req.ip, req.get('User-Agent'));
        
        res.json({
            valid: true,
            role: session.role,
            lastActivity: session.lastActivity
        });
    } else {
        res.json({ valid: false });
    }
});

// Create time-limited link
app.post('/api/create-link', (req, res) => {
    const { username, expiresIn } = req.body;
    
    if (!users[username]) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const link = createTimeLimitedLink(username, expiresIn);
    logAccess(username, 'link_created', req.ip, req.get('User-Agent'));
    
    res.json({
        success: true,
        link: link.url,
        expiresAt: link.expiresAt
    });
});

// Access via time-limited link
app.get('/access/:token', (req, res) => {
    const { token } = req.params;
    const linkData = timeLimitedLinks.get(token);
    
    if (!linkData) {
        return res.status(404).send('Link not found or expired');
    }
    
    if (Date.now() > linkData.expiresAt) {
        timeLimitedLinks.delete(token);
        logAccess(linkData.username, 'link_expired', req.ip, req.get('User-Agent'));
        return res.status(410).send('Link has expired');
    }
    
    logAccess(linkData.username, 'link_accessed', req.ip, req.get('User-Agent'));
    
    // Serve the protected document
    res.sendFile(path.join(__dirname, 'protected_business_plan.html'));
});

// PDF Generation endpoint
app.post('/api/generate-pdf', async (req, res) => {
    const { username, sessionId } = req.body;
    
    // Validate session if provided
    if (sessionId && username) {
        const session = activeSessions.get(username);
        if (!session || session.sessionId !== sessionId) {
            return res.status(401).json({ error: 'Invalid session' });
        }
    }
    
    console.log('PDF generation requested for:', username);
    
    try {
        // Create a comprehensive PDF content with business plan
        const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R 4 0 R 5 0 R]
/Count 3
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 6 0 R
>>
endobj

4 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 7 0 R
>>
endobj

5 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 8 0 R
>>
endobj

6 0 obj
<<
/Length 800
>>
stream
BT
/F1 16 Tf
72 720 Td
(SrvdNeat Business Plan) Tj
0 -25 Td
/F1 12 Tf
(AI Orchestration Platform for SMEs) Tj
0 -40 Td
/F1 10 Tf
(Generated for: ${username}) Tj
0 -15 Td
(Date: ${new Date().toLocaleDateString()}) Tj
0 -15 Td
(Confidential and Proprietary) Tj
0 -40 Td
/F1 14 Tf
(Executive Summary) Tj
0 -20 Td
/F1 10 Tf
(SrvdNeat is an innovative AI orchestration platform designed specifically for Small and Medium Enterprises (SMEs). Our platform streamlines AI implementation, reduces costs, and democratizes access to advanced AI capabilities.) Tj
0 -20 Td
(Key Features:) Tj
0 -15 Td
(• No-code AI workflow creation) Tj
0 -15 Td
(• Pre-built AI templates) Tj
0 -15 Td
(• Multi-LLM orchestration) Tj
0 -15 Td
(• Real-time analytics dashboard) Tj
0 -15 Td
(• Enterprise-grade security) Tj
ET
endstream
endobj

7 0 obj
<<
/Length 600
>>
stream
BT
/F1 14 Tf
72 720 Td
(Market Analysis) Tj
0 -25 Td
/F1 10 Tf
(The global AI market is experiencing unprecedented growth, with SMEs representing a significant untapped opportunity. Our target market includes:) Tj
0 -20 Td
(• Small businesses (10-50 employees)) Tj
0 -15 Td
(• Medium enterprises (51-250 employees)) Tj
0 -15 Td
(• Growing companies seeking AI adoption) Tj
0 -15 Td
(• Organizations with limited technical expertise) Tj
0 -40 Td
/F1 14 Tf
(Business Model) Tj
0 -20 Td
/F1 10 Tf
(Our revenue model is built on a subscription-based SaaS platform with tiered pricing:) Tj
0 -20 Td
(• Starter: $99/month) Tj
0 -15 Td
(• Professional: $299/month) Tj
0 -15 Td
(• Enterprise: Custom pricing) Tj
ET
endstream
endobj

8 0 obj
<<
/Length 500
>>
stream
BT
/F1 14 Tf
72 720 Td
(Financial Projections) Tj
0 -25 Td
/F1 10 Tf
(Year 1: $500K revenue target) Tj
0 -20 Td
(Year 2: $2M revenue target) Tj
0 -20 Td
(Year 3: $5M revenue target) Tj
0 -40 Td
/F1 14 Tf
(Risk Assessment) Tj
0 -20 Td
/F1 10 Tf
(Key risks include market competition, technology evolution, and regulatory changes. We mitigate these through continuous innovation and strategic partnerships.) Tj
0 -40 Td
/F1 12 Tf
(--- End of Document ---) Tj
0 -20 Td
/F1 8 Tf
(This document is confidential and proprietary to SrvdNeat. Unauthorized distribution is prohibited.) Tj
ET
endstream
endobj

xref
0 9
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000172 00000 n 
0000000229 00000 n 
0000000286 00000 n 
0000000343 00000 n 
0000000400 00000 n 
trailer
<<
/Size 9
/Root 1 0 R
>>
startxref
1000
%%EOF
        `;
        
        logAccess(username, 'pdf_generated', req.ip, req.get('User-Agent'));
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="SrvdNeat_Business_Plan_${username}_${Date.now()}.pdf"`);
        res.send(Buffer.from(pdfContent));
        
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'PDF generation failed: ' + error.message });
    }
});

// Access log endpoint (admin only)
app.get('/api/access-log', (req, res) => {
    const { username, sessionId } = req.query;
    
    const session = activeSessions.get(username);
    if (!session || session.sessionId !== sessionId || session.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    res.json({
        success: true,
        logs: accessLog,
        activeSessions: Array.from(activeSessions.entries()),
        timeLimitedLinks: Array.from(timeLimitedLinks.entries())
    });
});

// Cleanup expired sessions and links
setInterval(() => {
    const now = Date.now();
    
    // Cleanup expired sessions (2 hours)
    for (const [username, session] of activeSessions.entries()) {
        if (now - session.lastActivity > 2 * 60 * 60 * 1000) {
            activeSessions.delete(username);
            logAccess(username, 'session_expired_cleanup', 'system', 'system');
        }
    }
    
    // Cleanup expired links
    for (const [token, linkData] of timeLimitedLinks.entries()) {
        if (now > linkData.expiresAt) {
            timeLimitedLinks.delete(token);
            logAccess(linkData.username, 'link_expired_cleanup', 'system', 'system');
        }
    }
}, 5 * 60 * 1000); // Run every 5 minutes

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        activeSessions: activeSessions.size,
        timeLimitedLinks: timeLimitedLinks.size,
        accessLogEntries: accessLog.length
    });
});

app.listen(PORT, () => {
    console.log(`Protected Business Plan Server running on port ${PORT}`);
    console.log(`Access the protected document at: http://localhost:${PORT}/protected_business_plan.html`);
});

module.exports = app; 