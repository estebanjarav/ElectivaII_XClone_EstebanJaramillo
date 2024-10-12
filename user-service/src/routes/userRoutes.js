const axios = require('axios');
const express = require('express');
const User = require('../models/user');
const router = express.Router();

const AUTH_SERVICE_URL = 'http://localhost:3001/api/v1/auth'; 

router.get('/:username', async (req, res) => {
  try {
    console.log(`Consultando usuario en el Auth Service: ${req.params.username}`);
    const { data: authUser } = await axios.get(`${AUTH_SERVICE_URL}/${req.params.username}`);
    
    console.log('Usuario del Auth Service:', authUser);

    if (!authUser) {
      return res.status(404).json({ message: 'User not found in Auth Service' });
    }

    let user = await User.findOne({ username: req.params.username }).populate('followers following');
    
    if (!user) {
      console.log('El usuario no existe en el servicio de usuarios, creando...');
      user = new User({
        username: authUser.username,
        fullName: authUser.fullName,
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Error al consultar el usuario:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:username/follows/:targetUsername', async (req, res) => {
  try {
    const { username, targetUsername } = req.params;

    const currentUser = await User.findOne({ username });
    const targetUser = await User.findOne({ username: targetUsername });

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    res.json({ following: isFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:username/follow', async (req, res) => {
  try {
    const { username } = req.params; 
    const { currentUsername } = req.body; 

    const currentUser = await User.findOne({ username: currentUsername });
    const userToFollow = await User.findOne({ username });

    if (!currentUser || !userToFollow) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: `You are now following ${userToFollow.username}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

