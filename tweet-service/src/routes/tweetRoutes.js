const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Tweet = require('./models/Tweet');
const router = express.Router();
const AUTH_SERVICE_URL = 'http://localhost:3001/api/v1/auth';  
const USER_SERVICE_URL = 'http://localhost:3002/api/v1/users'; 

const authenticate = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    if (content.length > 280) {
      return res.status(400).json({ message: 'Tweet exceeds 280 characters' });
    }

    const tweet = new Tweet({
      content,
      author: req.user.username,
    });
    await tweet.save();

    res.status(201).json({ message: 'Tweet posted successfully', tweet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

