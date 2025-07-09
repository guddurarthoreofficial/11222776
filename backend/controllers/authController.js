const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const User = require('../models/User');
const { generateAccessToken } = require('../services/tokenService');
const Logger = require('../middleware/logger');

// 📌 Registration Controller
exports.register = async (req, res) => {
  const { email, name, mobileNo, githubUsername, rollNo, accessCode } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // JWT (optional, depending on your flow)

  try {
    const exists = await User.findOne({ email, rollNo });

    if (exists) {
      Logger(token, "backend", "warn", "controller", `Attempt to re-register by ${email}`);
      return res.status(400).json({ message: 'You can register only once.' });
    }

    const clientID = uuidv4();
    const clientSecret = crypto.randomBytes(16).toString('hex');

    const newUser = new User({
      email, name, mobileNo, githubUsername, rollNo, accessCode,
      clientID, clientSecret
    });

    await newUser.save();

    Logger(token, "backend", "info", "controller", `New user registered: ${email}`);

    res.status(201).json({ email, name, rollNo, accessCode, clientID, clientSecret });
  } catch (err) {
    Logger(token, "backend", "error", "handler", `Registration failed: ${err.message}`);
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
};

// 📌 Authentication Controller
exports.authenticate = async (req, res) => {
  const { email, name, rollNo, accessCode, clientID, clientSecret } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const user = await User.findOne({ email, rollNo, accessCode, clientID, clientSecret });

    if (!user) {
      Logger(token, "backend", "warn", "auth", `Invalid login attempt for ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken({ email, rollNo, name });

    Logger(token, "backend", "info", "auth", `User authenticated successfully: ${email}`);

    res.status(200).json({
      token_type: 'Bearer',
      access_token: accessToken,
      accessCode,
      clientID,
      clientSecret,
      expires_in: Math.floor(Date.now() / 1000) + 3600
    });
  } catch (err) {
    Logger(token, "backend", "error", "handler", `Authentication failed: ${err.message}`);
    res.status(500).json({ message: 'Authentication failed.', error: err.message });
  }
};
