const app = require('express');
const router = app.Router();
const path = require('path');


router.get('^/$|login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

module.exports = router;