const mongoose = require('mongoose');
const TweetSchema = new mongoose.Schema({
  content: { type: String, required: true, maxlength: 280 },
  author: { type: String, required: true },  // Se almacena el username
}, { timestamps: true });

module.exports = mongoose.model('Tweet', TweetSchema);
