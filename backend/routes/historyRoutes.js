const express = require('express');
const router = express.Router();
const { getTenantHistory } = require('../controllers/historyController');

router.get('/', getTenantHistory);

module.exports = router;
