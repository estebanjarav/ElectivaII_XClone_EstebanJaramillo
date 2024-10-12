const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tweetRoutes = require('./routes/tweetRoutes');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(bodyParser.json());

app.use('/api/v1/tweets', tweetRoutes);

mongoose.connect('mongodb://localhost:27017/tweet-service', {
})
  .then(() => console.log('Connected to MongoDB for Tweet Service'))
  .catch((err) => console.error(err));

app.listen(PORT, () => console.log(`Tweet Service running on port ${PORT}`));
