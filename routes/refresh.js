const express = require('express');
const router = express.Router();
const refreshController = require('../controllers/refreshToken');

router.get('/', refreshController.handleRefreshToken);

module.exports = router;