const axios = require('axios');
const express = require('express');
const User = require('../models/user');
const router = express.Router();

const AUTH_SERVICE_URL = 'http://localhost:3001/api/v1/auth';  // URL del microservicio de autenticación

// Get user by username
router.get('/:username', async (req, res) => {
  try {
    // Consultar el servicio de autenticación
    console.log(`Consultando usuario en el Auth Service: ${req.params.username}`);
    const { data: authUser } = await axios.get(`${AUTH_SERVICE_URL}/${req.params.username}`);
    
    // Imprimir respuesta del microservicio de autenticación
    console.log('Usuario del Auth Service:', authUser);

    if (!authUser) {
      return res.status(404).json({ message: 'User not found in Auth Service' });
    }

    // Buscar el usuario en el servicio de usuarios (para followers/following)
    let user = await User.findOne({ username: req.params.username }).populate('followers following');
    
    // Si el usuario no existe en la base de datos de usuarios, lo creamos
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
// Verificar si un usuario sigue a otro
router.get('/:username/follows/:targetUsername', async (req, res) => {
  try {
    const { username, targetUsername } = req.params;

    // Buscar ambos usuarios en la base de datos
    const currentUser = await User.findOne({ username });
    const targetUser = await User.findOne({ username: targetUsername });

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Verificar si currentUser sigue a targetUser
    const isFollowing = currentUser.following.includes(targetUser._id);

    res.json({ following: isFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seguir a otro usuario
router.post('/:username/follow', async (req, res) => {
  try {
    const { username } = req.params; // Usuario a seguir
    const { currentUsername } = req.body; // Usuario que realiza la acción de seguir

    // Buscar ambos usuarios por su username
    const currentUser = await User.findOne({ username: currentUsername });
    const userToFollow = await User.findOne({ username });

    if (!currentUser || !userToFollow) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Verificar si ya lo está siguiendo
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // Actualizar listas de seguidores y seguidos
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    // Guardar cambios en la base de datos
    await currentUser.save();
    await userToFollow.save();

    res.json({ message: `You are now following ${userToFollow.username}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

