const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const logEvent = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd,HH:mm:ss')}`;
    const logItem = `${dateTime},${uuid()},${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}
const logger = (req,res, next) => {
    logEvent(`${req.method},${req.headers.origin},${req.url}`, 'logs.csv');
    console.log(`${req.method} ${req.path}`);
    next();
};


module.exports = { logger, logEvent }