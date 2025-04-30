const { logEvent } = require('./logServerEvents');

const errorHandler = (err, req, res, next) => {
    logEvent(`${req.method},${req.headers.origin},${req.url}`, 'errorLogs.csv');
    console.error(err.stack);
    res.status(500).send(err.message);
}

module.exports = errorHandler;