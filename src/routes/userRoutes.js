const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/firebaseAuth');

//User authenticateToken middleware
router.use(authenticateToken);

//Routes
router.get('/:userId', userController.getUser);

router.put('/:userId', userController.updateUser);

router.delete('/:userId', userController.deleteUser);

router.get('/', userController.getUsers);

module.exports = router;