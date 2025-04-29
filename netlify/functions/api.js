// Netlify serverless function to handle API requests
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { Pool } = require('pg');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcryptjs');

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Session setup
app.use(session({
  store: new PgSession({
    pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'auttobi-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production'
  }
}));

// API Routes
// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    
    const user = result.rows[0];
    
    // Create session
    req.session.userId = user.id;
    
    res.status(201).json({
      id: user.id,
      username: user.username
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Get user
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create session
    req.session.userId = user.id;
    
    // Log login
    await pool.query(
      'INSERT INTO login_history (user_id, ip_address) VALUES ($1, $2)',
      [user.id, req.ip]
    );
    
    res.json({
      id: user.id,
      username: user.username
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/api/auth/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const result = await pool.query(
      'SELECT id, username FROM users WHERE id = $1',
      [req.session.userId]
    );
    
    if (result.rows.length === 0) {
      req.session.destroy();
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Markets API
app.get('/api/market', async (req, res) => {
  try {
    res.json([
      {
        id: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
        current_price: 62415.78,
        market_cap: 1223567890123,
        market_cap_rank: 1,
        price_change_percentage_24h: 2.35,
        circulating_supply: 19568431,
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
      },
      {
        id: "ethereum",
        symbol: "ETH",
        name: "Ethereum",
        current_price: 3050.42,
        market_cap: 367890123456,
        market_cap_rank: 2,
        price_change_percentage_24h: 1.87,
        circulating_supply: 120250891,
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
      },
      {
        id: "binancecoin",
        symbol: "BNB",
        name: "BNB",
        current_price: 605.32,
        market_cap: 93245678901,
        market_cap_rank: 3,
        price_change_percentage_24h: 0.95,
        circulating_supply: 153856150,
        image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
      }
    ]);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// FAQ API
app.get('/api/faq', (_req, res) => {
  try {
    res.json([
      {
        id: 1,
        category: "account",
        question: "How do I verify my account?",
        answer: "To verify your account, go to your profile settings and navigate to the KYC verification section. Upload the required documents (government-issued ID, proof of address, and a selfie). Our team will review your submission within 1-2 business days."
      },
      {
        id: 2,
        category: "account",
        question: "What is KYC verification and why is it required?",
        answer: "KYC (Know Your Customer) verification is a standard process in the financial industry to verify the identity of users. It helps prevent fraud, money laundering, and ensures compliance with regulations. We require KYC verification to protect our platform and users."
      },
      {
        id: 3,
        category: "wallet",
        question: "How do I deposit cryptocurrency to my wallet?",
        answer: "To deposit cryptocurrency, go to your wallet page and click 'Deposit'. Select the cryptocurrency you wish to deposit and use the provided wallet address or QR code to send funds from your external wallet."
      },
      {
        id: 4,
        category: "wallet",
        question: "What are the withdrawal fees?",
        answer: "Withdrawal fees vary by cryptocurrency and network conditions. When making a withdrawal, the current fee will be displayed before you confirm the transaction. We aim to keep fees as low as possible while ensuring timely processing."
      },
      {
        id: 5,
        category: "security",
        question: "How can I enable two-factor authentication (2FA)?",
        answer: "To enable 2FA, go to your security settings, select 'Two-Factor Authentication', and follow the prompts to set up with an authenticator app like Google Authenticator or Authy. This adds an extra layer of security to your account."
      },
      {
        id: 6,
        category: "security",
        question: "What should I do if I suspect unauthorized access to my account?",
        answer: "If you suspect unauthorized access, immediately change your password, enable 2FA if not already active, and contact our support team. We recommend reviewing your recent activity and ensuring your email account is also secure."
      },
      {
        id: 7,
        category: "trading",
        question: "What trading pairs are available on the platform?",
        answer: "We offer a wide range of trading pairs including BTC/USD, ETH/USD, BNB/USD, and many other major cryptocurrencies paired with USD, EUR, and BTC. Visit our market page to see all available trading pairs."
      },
      {
        id: 8,
        category: "support",
        question: "How can I contact customer support?",
        answer: "You can contact our customer support team through the help center on our platform, by email at support@auttobi.com, or through the live chat feature available during business hours. We aim to respond to all inquiries within 24 hours."
      }
    ]);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/support/categories', (_req, res) => {
  try {
    res.json([
      {
        id: "account",
        name: "Account Issues",
        description: "Questions about account setup, verification, and management"
      },
      {
        id: "wallet",
        name: "Wallet & Transactions",
        description: "Help with deposits, withdrawals, and transaction issues"
      },
      {
        id: "security",
        name: "Security",
        description: "Account security, 2FA, and protecting your assets"
      },
      {
        id: "trading",
        name: "Trading",
        description: "Questions about trading features and functionality"
      },
      {
        id: "technical",
        name: "Technical Issues",
        description: "Help with platform technical problems"
      }
    ]);
  } catch (error) {
    console.error('Error fetching support categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Export the serverless function
module.exports.handler = serverless(app);