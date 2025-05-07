const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    // console.log('credentials - req.headers', req.headers);
    // console.log('credentials - origin', origin);
    // console.log('credentials - allowedOrigins', allowedOrigins);
    // console.log('credentials - Allow Origin?', allowedOrigins.includes(origin));
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials;