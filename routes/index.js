const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/chat', require('./chat'));

module.exports = router;